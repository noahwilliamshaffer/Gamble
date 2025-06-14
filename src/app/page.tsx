'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser)
      setIsLoading(false)
      
      if (currentUser) {
        // User is signed in, redirect to dashboard
        router.push('/dashboard')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleGetStarted = () => {
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-black font-bold text-4xl">🎰</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
              Crypto Casino
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Premium Gaming Experience
            </p>
            <p className="text-gray-400">
              The most advanced cryptocurrency casino platform
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold">₿</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Bitcoin Support</h3>
              <p className="text-gray-400">
                Seamless Bitcoin deposits with instant address generation
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">Ξ</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ethereum Support</h3>
              <p className="text-gray-400">
                Native Ethereum integration with smart contract security
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Login</h3>
              <p className="text-gray-400">
                Google OAuth and phone verification for maximum security
              </p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none px-8 py-6 text-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              Get Started Now
            </Button>
            <p className="text-gray-500 mt-4 text-sm">
              Start your crypto casino journey in less than 60 seconds
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-16 pt-8 border-t border-gray-800"
          >
            <p className="text-gray-500 text-sm">
              Built with Next.js 14, Firebase, and Tailwind CSS
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
