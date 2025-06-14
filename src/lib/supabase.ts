import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (Firebase Auth ID will be used as the user ID)
export interface User {
  id: string // Firebase Auth UID
  email?: string
  phone?: string
  created_at: string
  btc_address: string
  eth_address: string
}

export interface Deposit {
  id: string
  user_id: string
  currency: 'BTC' | 'ETH'
  amount: number
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
}

export interface Withdrawal {
  id: string
  user_id: string
  currency: 'BTC' | 'ETH'
  amount: number
  address: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
} 