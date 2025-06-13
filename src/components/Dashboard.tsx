'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { motion } from 'framer-motion'
import { Wallet, Plus, History } from 'lucide-react'
import { DepositModal } from './DepositModal'
import { Toast, useToast } from './Toast'

interface Deposit {
  id: string
  amount: number
  timestamp: string
}

export function Dashboard() {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    if (address) {
      fetchUserData()
    }
  }, [address])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setDeposits(data.deposits)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async (amount: number) => {
    try {
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error('Deposit failed')
      }

      // Refresh deposits
      await fetchUserData()
      showToast(`Successfully deposited ${amount} ETH!`, 'success')
    } catch (error) {
      showToast('Deposit failed. Please try again.', 'error')
      throw error
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your crypto wallet and deposits</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <Wallet className="mr-3 text-blue-500" size={24} />
              <h2 className="text-xl font-semibold">Wallet Info</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Address:</p>
              <p className="font-mono text-sm">{address ? formatAddress(address) : 'Not connected'}</p>
              <p className="text-gray-400 mt-4">ETH Balance:</p>
              <p className="text-2xl font-bold text-green-400">
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : '0.0000 ETH'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Plus className="mr-3 text-green-500" size={24} />
                <h2 className="text-xl font-semibold">Deposit</h2>
              </div>
            </div>
            <p className="text-gray-400 mb-4">Add funds to your platform balance</p>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Deposit ETH
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center mb-6">
            <History className="mr-3 text-purple-500" size={24} />
            <h2 className="text-xl font-semibold">Deposit History</h2>
          </div>

          {deposits.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No deposits yet</p>
              <p className="text-sm mt-2">Make your first deposit to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deposits.map((deposit, index) => (
                <motion.div
                  key={deposit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-green-400">+{deposit.amount} ETH</p>
                    <p className="text-sm text-gray-400">{formatDate(deposit.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Deposit</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDeposit}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
} 