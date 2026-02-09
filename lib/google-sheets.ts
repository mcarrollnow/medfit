import { google } from 'googleapis'

// Initialize Google Sheets API client with read/write access
function getGoogleSheetsClient() {
  // Option 1: Use full service account JSON
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    // Handle escaped newlines in the JSON string
    let jsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    
    // If the JSON contains literal \n in the private key, we need to handle it
    // First try parsing as-is
    let credentials
    try {
      credentials = JSON.parse(jsonStr)
    } catch {
      // If that fails, try replacing escaped newlines
      jsonStr = jsonStr.replace(/\\n/g, '\n')
      try {
        credentials = JSON.parse(jsonStr)
      } catch {
        // Last resort: try to fix common issues
        jsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
          .replace(/\n/g, '\\n') // Escape actual newlines
          .replace(/\\\\n/g, '\\n') // But don't double-escape
        credentials = JSON.parse(jsonStr)
      }
    }
    
    // Ensure private_key has proper newlines
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Full access
    })
    
    return google.sheets({ version: 'v4', auth })
  }
  
  // Option 2: Use individual env vars
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) {
    throw new Error('Google Sheets credentials not configured. Set either GOOGLE_SERVICE_ACCOUNT_JSON or both GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Full access
  })

  return google.sheets({ version: 'v4', auth })
}

export interface SheetRow {
  [key: string]: string | number | boolean | null
}

/**
 * Fetch all rows from a Google Sheet and return as array of objects
 */
export async function getSheetData(
  sheetId: string,
  sheetName: string = 'Sheet1',
  range: string = 'A:Z'
): Promise<SheetRow[]> {
  const sheets = getGoogleSheetsClient()

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!${range}`,
  })

  const rows = response.data.values
  if (!rows || rows.length < 2) {
    return []
  }

  // First row is headers
  const headers = rows[0] as string[]
  
  // Convert remaining rows to objects
  return rows.slice(1).map((row) => {
    const obj: SheetRow = {}
    headers.forEach((header, index) => {
      const value = row[index]
      if (value !== undefined && value !== '') {
        // Try to parse numbers and booleans
        if (value === 'TRUE' || value === 'true') {
          obj[header] = true
        } else if (value === 'FALSE' || value === 'false') {
          obj[header] = false
        } else if (!isNaN(Number(value)) && value !== '') {
          obj[header] = Number(value)
        } else {
          obj[header] = value
        }
      }
    })
    return obj
  })
}

/**
 * Get specific columns from a sheet
 */
export async function getSheetColumns(
  sheetId: string,
  sheetName: string,
  columns: string[]
): Promise<SheetRow[]> {
  const allData = await getSheetData(sheetId, sheetName)
  
  return allData.map((row) => {
    const filtered: SheetRow = {}
    columns.forEach((col) => {
      if (row[col] !== undefined) {
        filtered[col] = row[col]
      }
    })
    return filtered
  })
}

/**
 * Fetch raw rows from a Google Sheet as arrays (for sheets with missing headers)
 */
export async function getSheetDataRaw(
  sheetId: string,
  sheetName: string = 'Sheet1',
  range: string = 'A:Z'
): Promise<string[][]> {
  const sheets = getGoogleSheetsClient()

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!${range}`,
  })

  const rows = response.data.values
  if (!rows || rows.length < 2) {
    return []
  }

  // Return all rows except header, as raw arrays
  return rows.slice(1) as string[][]
}

/**
 * Append a new row to the sheet
 */
export async function appendSheetRow(
  sheetId: string,
  sheetName: string,
  values: (string | number | boolean | null)[]
): Promise<{ success: boolean; row?: number; error?: string }> {
  const sheets = getGoogleSheetsClient()

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [values.map(v => v === null ? '' : v)]
      }
    })

    // Extract the row number from the updated range
    const updatedRange = response.data.updates?.updatedRange || ''
    const match = updatedRange.match(/!A(\d+):/)
    const rowNumber = match ? parseInt(match[1]) : undefined

    return { success: true, row: rowNumber }
  } catch (error) {
    console.error('[GoogleSheets] Append error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Update a specific cell in the sheet
 */
export async function updateSheetCell(
  sheetId: string,
  sheetName: string,
  cell: string, // e.g., "A1", "G5"
  value: string | number | boolean | null
): Promise<{ success: boolean; error?: string }> {
  const sheets = getGoogleSheetsClient()

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!${cell}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[value === null ? '' : value]]
      }
    })

    return { success: true }
  } catch (error) {
    console.error('[GoogleSheets] Update cell error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Update a range of cells in the sheet
 */
export async function updateSheetRange(
  sheetId: string,
  sheetName: string,
  startCell: string, // e.g., "A1"
  values: (string | number | boolean | null)[][]
): Promise<{ success: boolean; error?: string }> {
  const sheets = getGoogleSheetsClient()

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!${startCell}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: values.map(row => row.map(v => v === null ? '' : v))
      }
    })

    return { success: true }
  } catch (error) {
    console.error('[GoogleSheets] Update range error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Update specific columns in a row
 */
export async function updateSheetRowColumns(
  sheetId: string,
  sheetName: string,
  rowNumber: number,
  columns: { column: string; value: string | number | boolean | null }[]
): Promise<{ success: boolean; error?: string }> {
  const sheets = getGoogleSheetsClient()

  try {
    // Batch update multiple cells
    const data = columns.map(({ column, value }) => ({
      range: `${sheetName}!${column}${rowNumber}`,
      values: [[value === null ? '' : value]]
    }))

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data
      }
    })

    return { success: true }
  } catch (error) {
    console.error('[GoogleSheets] Batch update error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Get the total row count of a sheet
 */
export async function getSheetRowCount(
  sheetId: string,
  sheetName: string
): Promise<number> {
  const sheets = getGoogleSheetsClient()

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:A`,
    })

    return response.data.values?.length || 0
  } catch {
    return 0
  }
}

/**
 * Get the last row number that has data in specific columns
 * Returns the row number of the last non-empty cell in any of the specified columns
 */
export async function getLastRowInColumns(
  sheetId: string,
  sheetName: string,
  columns: string[]
): Promise<number> {
  const sheets = getGoogleSheetsClient()

  try {
    let lastRow = 1 // Start at header row

    for (const column of columns) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetName}!${column}:${column}`,
      })

      const values = response.data.values || []
      
      // Find the last non-empty row in this column
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i] && values[i][0] && values[i][0].toString().trim() !== '') {
          const rowNum = i + 1 // 1-indexed
          if (rowNum > lastRow) {
            lastRow = rowNum
          }
          break
        }
      }
    }

    return lastRow
  } catch (error) {
    console.error('[GoogleSheets] Get last row error:', error)
    return 1
  }
}
