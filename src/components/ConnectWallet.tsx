'use client'

import { useAccount, useSignMessage } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { SiweMessage } from 'siwe'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface ConnectWalletProps {
  onAuthenticated?: (address: string) => void
}

export function ConnectWallet({ onAuthenticated }: ConnectWalletProps) {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const { signMessageAsync } = useSignMessage()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleSignIn = async () => {
    if (!address) return

    setIsAuthenticating(true)
    try {
      // Get nonce from server
      const nonceResponse = await fetch('/api/auth/siwe')
      const { nonce } = await nonceResponse.json()

      // Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce,
      })

      const messageString = message.prepareMessage()

      // Sign message
      const signature = await signMessageAsync({
        message: messageString,
      })

      // Verify signature with server
      const verifyResponse = await fetch('/api/auth/siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageString,
          signature,
        }),
      })

      if (verifyResponse.ok) {
        onAuthenticated?.(address)
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (!isConnected) {
    return (
      <motion.button
        onClick={() => open()}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Connect Wallet
      </motion.button>
    )
  }

  return (
    <motion.button
      onClick={handleSignIn}
      disabled={isAuthenticating}
      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isAuthenticating ? 'Signing In...' : 'Sign In with Ethereum'}
    </motion.button>
  )
} 