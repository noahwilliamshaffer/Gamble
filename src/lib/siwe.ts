import { SiweMessage } from 'siwe'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  nonce?: string
  address?: string
  chainId?: number
  isLoggedIn: boolean
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
}

export const sessionOptions = {
  password: process.env.NEXTAUTH_SECRET!,
  cookieName: 'siwe-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn
  }
  
  return session
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function verifySiweMessage(message: string, signature: string): Promise<boolean> {
  try {
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.verify({ signature })
    return Boolean(fields.success)
  } catch (error) {
    console.error('SIWE verification error:', error)
    return false
  }
} 