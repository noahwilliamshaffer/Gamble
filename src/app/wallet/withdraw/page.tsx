'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { supabase, type User, type Withdrawal } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, ArrowLeft, Send, History } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { isValidBitcoinAddress, isValidEthereumAddress } from '@/lib/addressUtils'

export default function WithdrawPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'ETH'>('BTC')
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  // Mock balances (in a real app, these would come from your database)
  const balances = {
    BTC: 0.00542,
    ETH: 0.125
  }

  const minWithdrawals = {
    BTC: 0.001,
    ETH: 0.01
  }

  const fees = {
    BTC: 0.0005,
    ETH: 0.005
  }

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          router.push('/login')
          setLoading(false)
          return
        }

        // Get user data from Supabase database using Firebase UID
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', firebaseUser.uid)
          .single()

        if (error) {
          console.error('Error fetching user:', error)
          router.push('/login')
        } else {
          setUser(userData)
          // Fetch withdrawals for this user
          fetchWithdrawals(firebaseUser.uid)
        }
        setLoading(false)
      })
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
      setLoading(false)
    }
  }

  const fetchWithdrawals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setWithdrawals(data || [])
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
    }
  }

  const validateWithdrawal = () => {
    const amountNum = parseFloat(amount)
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount')
      return false
    }

    if (amountNum < minWithdrawals[selectedCurrency]) {
      toast.error(`Minimum withdrawal is ${minWithdrawals[selectedCurrency]} ${selectedCurrency}`)
      return false
    }

    if (amountNum + fees[selectedCurrency] > balances[selectedCurrency]) {
      toast.error('Insufficient balance (including fees)')
      return false
    }

    if (!address) {
      toast.error('Please enter a withdrawal address')
      return false
    }

    if (selectedCurrency === 'BTC' && !isValidBitcoinAddress(address)) {
      toast.error('Invalid Bitcoin address format')
      return false
    }

    if (selectedCurrency === 'ETH' && !isValidEthereumAddress(address)) {
      toast.error('Invalid Ethereum address format')
      return false
    }

    return true
  }

  const handleWithdraw = async () => {
    if (!validateWithdrawal() || !user) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          currency: selectedCurrency,
          amount: parseFloat(amount),
          address: address,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Withdrawal request submitted successfully!')
      setAmount('')
      setAddress('')
      // Refetch withdrawals with current user ID
      if (user) {
        fetchWithdrawals(user.id)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to submit withdrawal request')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'processing': return 'text-blue-400'
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            Withdraw Crypto
          </h1>
          <p className="text-gray-400 mt-2">
            Send your crypto to external wallets
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-900/50 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5 text-red-400" />
                  <span>New Withdrawal</span>
                </CardTitle>
                <CardDescription>
                  Withdraw your crypto to an external wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency Selection */}
                <div className="space-y-2">
                  <Label>Select Currency</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setSelectedCurrency('BTC')}
                      variant={selectedCurrency === 'BTC' ? 'default' : 'outline'}
                      className={selectedCurrency === 'BTC' 
                        ? 'bg-orange-500 hover:bg-orange-600' 
                        : 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10'
                      }
                    >
                      ₿ Bitcoin
                    </Button>
                    <Button
                      onClick={() => setSelectedCurrency('ETH')}
                      variant={selectedCurrency === 'ETH' ? 'default' : 'outline'}
                      className={selectedCurrency === 'ETH' 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'border-blue-500/50 text-blue-400 hover:bg-blue-500/10'
                      }
                    >
                      Ξ Ethereum
                    </Button>
                  </div>
                </div>

                {/* Balance Display */}
                <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Available Balance:</span>
                    <span className="text-white font-mono">
                      {balances[selectedCurrency]} {selectedCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Network Fee:</span>
                    <span className="text-red-400 font-mono">
                      {fees[selectedCurrency]} {selectedCurrency}
                    </span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Withdrawal Amount</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.00000001"
                      placeholder={`Min: ${minWithdrawals[selectedCurrency]} ${selectedCurrency}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-black/20 border-gray-600 text-white pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      {selectedCurrency}
                    </span>
                  </div>
                  <Button
                    onClick={() => setAmount((balances[selectedCurrency] - fees[selectedCurrency]).toString())}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto"
                  >
                    Use Max Available
                  </Button>
                </div>

                {/* Address Input */}
                <div className="space-y-2">
                  <Label htmlFor="address">
                    {selectedCurrency} Withdrawal Address
                  </Label>
                  <Input
                    id="address"
                    placeholder={selectedCurrency === 'BTC' 
                      ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' 
                      : '0x742d35Cc6634C0532925a3b8D1AD7e29F8E9F1b7'
                    }
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-black/20 border-gray-600 text-white font-mono text-sm"
                  />
                </div>

                {/* Warning */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-200">
                      <p className="font-medium mb-1">Important:</p>
                      <ul className="space-y-1 text-red-200/80 text-xs">
                        <li>• Double-check the withdrawal address</li>
                        <li>• Withdrawals are irreversible</li>
                        <li>• Only send to {selectedCurrency} addresses</li>
                        <li>• Processing time: 10-30 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleWithdraw}
                  disabled={submitting || !amount || !address}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50"
                  size="lg"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {submitting ? 'Processing...' : 'Submit Withdrawal'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Withdrawals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-gray-400" />
                  <span>Recent Withdrawals</span>
                </CardTitle>
                <CardDescription>
                  Your latest withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No withdrawals yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {withdrawals.map((withdrawal) => (
                      <div
                        key={withdrawal.id}
                        className="bg-black/20 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              withdrawal.status === 'completed' ? 'bg-green-400' :
                              withdrawal.status === 'processing' ? 'bg-blue-400' :
                              withdrawal.status === 'failed' ? 'bg-red-400' :
                              'bg-yellow-400'
                            }`} />
                            <span className="font-mono text-white">
                              {withdrawal.amount} {withdrawal.currency}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                            {withdrawal.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono break-all mb-2">
                          To: {withdrawal.address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(withdrawal.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}