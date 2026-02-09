import { NextRequest, NextResponse } from 'next/server'
import { revolut } from '@/lib/revolut'

// GET /api/revolut/team-members - List all team members
export async function GET() {
  try {
    const members = await revolut.getTeamMembers()
    
    return NextResponse.json({
      team_members: members,
      total: members.length,
      active: members.filter(m => m.state === 'active').length,
    })
  } catch (error: any) {
    console.error('[Revolut Team Members] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

