import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/siwe'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session.isLoggedIn || !session.address) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { amount } = await request.json()
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { address: session.address },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        amount: parseFloat(amount),
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        timestamp: deposit.timestamp,
      }
    })
  } catch (error) {
    console.error('Deposit error:', error)
    return NextResponse.json({ error: 'Deposit failed' }, { status: 500 })
  }
} 