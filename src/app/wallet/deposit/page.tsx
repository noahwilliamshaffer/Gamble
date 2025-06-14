'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { supabase, type User } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import QRCode from 'react-qr-code'
import { getExplorerUrl } from '@/lib/addressUtils'

export default function DepositPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [showQR, setShowQR] = useState<{ currency: 'BTC' | 'ETH'; address: string } | null>(null)
  const router = useRouter()

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
        }
        setLoading(false)
      })
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
      setLoading(false)
    }
  }

  const copyToClipboard = async (address: string, currency: 'BTC' | 'ETH') => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      toast.success(`${currency} address copied!`)
      setTimeout(() => setCopiedAddress(null), 3000)
    } catch (error) {
      toast.error('Failed to copy address')
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
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Deposit Crypto
          </h1>
          <p className="text-gray-400 mt-2">
            Send Bitcoin or Ethereum to your unique deposit addresses
          </p>
        </motion.div>

        {/* Deposit Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bitcoin Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-900/50 border-orange-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">₿</span>
                  </div>
                  <div>
                    <span className="text-white">Bitcoin</span>
                    <p className="text-xs text-gray-400 font-normal">BTC Network</p>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Minimum deposit: 0.0001 BTC (~$5)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address Display */}
                <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Your Bitcoin Address:</p>
                  <p className="text-white font-mono text-sm break-all mb-3">
                    {user.btc_address}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => copyToClipboard(user.btc_address, 'BTC')}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                    >
                      {copiedAddress === user.btc_address ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      Copy
                    </Button>
                    <Button
                      onClick={() => setShowQR({ currency: 'BTC', address: user.btc_address })}
                      variant="outline"
                      size="sm"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => window.open(getExplorerUrl('BTC', user.btc_address), '_blank')}
                      variant="outline"
                      size="sm"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• Only send Bitcoin to this address</p>
                  <p>• Minimum confirmations: 3</p>
                  <p>• Network fee: ~0.00007 BTC</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ethereum Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">Ξ</span>
                  </div>
                  <div>
                    <span className="text-white">Ethereum</span>
                    <p className="text-xs text-gray-400 font-normal">ETH Network</p>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Minimum deposit: 0.002 ETH (~$5)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address Display */}
                <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Your Ethereum Address:</p>
                  <p className="text-white font-mono text-sm break-all mb-3">
                    {user.eth_address}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => copyToClipboard(user.eth_address, 'ETH')}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      {copiedAddress === user.eth_address ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      Copy
                    </Button>
                    <Button
                      onClick={() => setShowQR({ currency: 'ETH', address: user.eth_address })}
                      variant="outline"
                      size="sm"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => window.open(getExplorerUrl('ETH', user.eth_address), '_blank')}
                      variant="outline"
                      size="sm"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• Only send Ethereum to this address</p>
                  <p>• Minimum confirmations: 12</p>
                  <p>• Gas fee: varies by network</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-lg p-6 max-w-sm w-full border border-gray-700"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">
                  {showQR.currency} Address QR Code
                </h3>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCode value={showQR.address} size={200} />
                </div>
                <p className="text-xs text-gray-400 mb-4 break-all">
                  {showQR.address}
                </p>
                <Button
                  onClick={() => setShowQR(null)}
                  className="w-full"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Security Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs font-bold">!</span>
                </div>
                <div className="text-sm text-yellow-200">
                  <p className="font-medium mb-2">Important Security Notice:</p>
                  <ul className="space-y-1 text-yellow-200/80">
                    <li>• Only send the correct cryptocurrency to each address</li>
                    <li>• Double-check addresses before sending</li>
                    <li>• Deposits are irreversible once confirmed</li>
                    <li>• These addresses are unique to your account</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 