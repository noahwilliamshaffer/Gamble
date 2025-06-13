'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ConnectWallet } from '@/components/ConnectWallet'
import { Wallet, Shield, Zap } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const handleAuthenticated = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Crypto Wallet App
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect your Ethereum wallet, sign in securely, and manage your crypto deposits with ease.
          </p>
          
          <div className="flex justify-center">
            <ConnectWallet onAuthenticated={handleAuthenticated} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 text-center"
          >
            <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Wallet size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect Wallet</h3>
            <p className="text-gray-400">
              Connect your MetaMask or WalletConnect-compatible wallet to get started.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 text-center"
          >
            <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Authentication</h3>
            <p className="text-gray-400">
              Sign in securely using Sign-In With Ethereum (SIWE) for maximum security.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-lg p-6 text-center"
          >
            <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Deposits</h3>
            <p className="text-gray-400">
              Make crypto deposits and track your transaction history in a clean dashboard.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm">
            Built with Next.js 14, Web3Modal, SIWE, and Prisma
          </p>
        </motion.div>
      </div>
    </div>
  )
}
