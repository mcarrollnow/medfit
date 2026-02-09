// Barcode Generator Utility
// Uses Vigenère cipher encryption with FREEDOM keyword

const ENCRYPTION_KEYWORD = 'FREEDOM';

/**
 * Vigenère cipher encryption function
 * Encrypts alphabetic characters and numbers using a keyword
 */
function vigenereEncrypt(plainText: string, keyword: string): string {
  if (!keyword) return '';
  keyword = keyword.toUpperCase();
  let result = '';
  let keywordIndex = 0;
  
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText[i];
    if (/[A-Za-z]/.test(char)) {
      const isUpper = char === char.toUpperCase();
      const base = isUpper ? 65 : 97;
      const keyChar = keyword[keywordIndex % keyword.length];
      const keyCode = keyChar.charCodeAt(0) - 65;
      const encChar = String.fromCharCode(((char.charCodeAt(0) - base + keyCode) % 26) + base);
      result += encChar;
      keywordIndex++;
    } else if (/[0-9]/.test(char)) {
      const keyChar = keyword[keywordIndex % keyword.length];
      const keyCode = keyChar.charCodeAt(0) - 65;
      const encNum = ((parseInt(char) + keyCode) % 10).toString();
      result += encNum;
      keywordIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Vigenère cipher decryption function
 * Decrypts alphabetic characters and numbers using a keyword
 */
function vigenereDecrypt(cipherText: string, keyword: string): string {
  if (!keyword) return '';
  keyword = keyword.toUpperCase();
  let result = '';
  let keywordIndex = 0;
  
  for (let i = 0; i < cipherText.length; i++) {
    const char = cipherText[i];
    if (/[A-Za-z]/.test(char)) {
      const isUpper = char === char.toUpperCase();
      const base = isUpper ? 65 : 97;
      const keyChar = keyword[keywordIndex % keyword.length];
      const keyCode = keyChar.charCodeAt(0) - 65;
      const decChar = String.fromCharCode(((char.charCodeAt(0) - base - keyCode + 26) % 26) + base);
      result += decChar;
      keywordIndex++;
    } else if (/[0-9]/.test(char)) {
      const keyChar = keyword[keywordIndex % keyword.length];
      const keyCode = keyChar.charCodeAt(0) - 65;
      const decNum = ((parseInt(char) - keyCode + 10) % 10).toString();
      result += decNum;
      keywordIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

export interface ProductInfo {
  name: string;
  volume: string;
  unit: 'mg' | 'mcg' | 'iu' | 'ml' | 'g' | string;
}

/**
 * Generate a barcode for a product using Vigenère cipher encryption
 * Format: ProductName + Volume + Unit (uppercase, no spaces)
 */
export function generateBarcode(productInfo: ProductInfo): string {
  // Format: ProductName + Volume + Unit (no spaces, uppercase)
  const plainText = `${productInfo.name}${productInfo.volume}${productInfo.unit}`
    .toUpperCase()
    .replace(/\s+/g, '');
  
  // Generate barcode using FREEDOM keyword
  const barcode = vigenereEncrypt(plainText, ENCRYPTION_KEYWORD);
  
  return barcode;
}

/**
 * Generate a barcode from a raw string input
 */
export function generateBarcodeFromString(input: string): string {
  const plainText = input.toUpperCase().replace(/\s+/g, '');
  return vigenereEncrypt(plainText, ENCRYPTION_KEYWORD);
}

/**
 * Decrypt a barcode back to the original product info
 */
export function decryptBarcode(barcode: string): string {
  return vigenereDecrypt(barcode, ENCRYPTION_KEYWORD);
}

/**
 * Validate that a barcode matches the expected encryption for a product
 */
export function validateBarcode(plainText: string, expectedBarcode: string): boolean {
  const generatedBarcode = vigenereEncrypt(
    plainText.toUpperCase().replace(/\s+/g, ''),
    ENCRYPTION_KEYWORD
  );
  return generatedBarcode === expectedBarcode;
}

/**
 * Generate a unique barcode for a variant
 * Combines base product name with variant info
 */
export function generateVariantBarcode(baseName: string, variant: string): string {
  const plainText = `${baseName}${variant}`.toUpperCase().replace(/\s+/g, '');
  return vigenereEncrypt(plainText, ENCRYPTION_KEYWORD);
}

// Test function to verify the encryption works correctly
export function testEncryption(): { success: boolean; details: string } {
  try {
    const testProduct: ProductInfo = {
      name: 'SEMAGLUTIDE',
      volume: '5',
      unit: 'mg'
    };
    
    const generated = generateBarcode(testProduct);
    const expected = 'XVQEJZGYZHI8AS';
    
    return {
      success: generated === expected,
      details: `Generated: ${generated}, Expected: ${expected}`
    };
  } catch (error) {
    return {
      success: false,
      details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

