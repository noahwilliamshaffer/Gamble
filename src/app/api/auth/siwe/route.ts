import { NextRequest, NextResponse } from 'next/server'
import { getSession, generateNonce, verifySiweMessage } from '@/lib/siwe'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  const nonce = generateNonce()
  
  session.nonce = nonce
  await session.save()
  
  return NextResponse.json({ nonce })
}

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json()
    
    if (!message || !signature) {
      return NextResponse.json({ error: 'Missing message or signature' }, { status: 400 })
    }
    
    const isValid = await verifySiweMessage(message, signature)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    // Extract address from message
    const addressMatch = message.match(/0x[a-fA-F0-9]{40}/)
    if (!addressMatch) {
      return NextResponse.json({ error: 'Invalid address in message' }, { status: 400 })
    }
    
    const address = addressMatch[0]
    
    // Create or find user
    const user = await prisma.user.upsert({
      where: { address },
      update: {},
      create: { address },
    })
    
    // Update session
    const session = await getSession()
    session.address = address
    session.isLoggedIn = true
    await session.save()
    
    return NextResponse.json({ success: true, address })
  } catch (error) {
    console.error('SIWE auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
} 