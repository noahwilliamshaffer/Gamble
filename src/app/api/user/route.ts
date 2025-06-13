import { NextResponse } from 'next/server'
import { getSession } from '@/lib/siwe'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session.isLoggedIn || !session.address) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // Find user with deposits
    const user = await prisma.user.findUnique({
      where: { address: session.address },
      include: {
        deposits: {
          orderBy: { timestamp: 'desc' },
        },
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      address: user.address,
      deposits: user.deposits.map((deposit: any) => ({
        id: deposit.id,
        amount: deposit.amount,
        timestamp: deposit.timestamp,
      })),
    })
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
} 