import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')

    if (!year) {
      return NextResponse.json(
        { error: 'Year is required' },
        { status: 400 }
      )
    }

    // TODO: Generate tax information document for specified year
    // This is a placeholder implementation
    return NextResponse.json(
      { error: 'Tax document generation not yet implemented' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error downloading tax info:', error)
    return NextResponse.json(
      { error: 'Failed to download tax information' },
      { status: 500 }
    )
  }
}
