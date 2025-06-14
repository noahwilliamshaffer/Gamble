'use client';

import { useState, useEffect } from 'react';
import { User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserData, getDepositHistory, User, DepositHistory } from '@/lib/userUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LogOut, User as UserIcon, Clock, Trophy } from 'lucide-react';
import WalletCard from './WalletCard';
import DepositHistoryTable from './DepositHistoryTable';

interface DashboardLayoutProps {
  firebaseUser: FirebaseUser;
  onLogout: () => void;
}

export default function DashboardLayout({ firebaseUser, onLogout }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [deposits, setDeposits] = useState<DepositHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get user data from Firestore
        const userData = await getUserData(firebaseUser.uid);
        if (userData) {
          setUser(userData);
          
          // Get deposit history
          const depositHistory = await getDepositHistory(firebaseUser.uid);
          setDeposits(depositHistory);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    if (firebaseUser) {
      loadUserData();
    }
  }, [firebaseUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const getTotalDeposits = () => {
    return deposits.reduce((total, deposit) => {
      if (deposit.status === 'confirmed') {
        // Convert to USD equivalent (mock conversion rates)
        const usdRate = deposit.currency === 'BTC' ? 45000 : 2500;
        return total + (deposit.amount * usdRate);
      }
      return total;
    }, 0);
  };

  const getLastLoginText = () => {
    if (!user?.lastLoginAt) return 'Recently';
    
    const lastLogin = user.lastLoginAt.toDate();
    const now = new Date();
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your casino dashboard...</p>
          <p className="text-gray-400 mt-2">Setting up your crypto wallet addresses</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Profile</h2>
          <p className="text-gray-400 mb-4">Unable to load your casino profile. Please try logging in again.</p>
          <Button onClick={handleLogout} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">🎰</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Crypto Casino
                </h1>
                <p className="text-xs text-gray-400">Premium Gaming Experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-white font-medium">
                  {user.displayName || user.email || user.phoneNumber}
                </p>
                <p className="text-xs text-gray-400">Last login: {getLastLoginText()}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Account Status</p>
                    <p className="text-2xl font-bold text-green-400">Active</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Deposits</p>
                    <p className="text-2xl font-bold text-white">
                      ${getTotalDeposits().toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-2xl font-bold text-white">
                      {user.createdAt.toDate().toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Wallet Card */}
          <div>
            <WalletCard 
              bitcoinAddress={user.bitcoinAddress}
              ethereumAddress={user.ethereumAddress}
            />
          </div>

          {/* Deposit History */}
          <div>
            <DepositHistoryTable deposits={deposits} />
          </div>
        </div>

        {/* User Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span>Account Information</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your account details and security information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">User ID</h4>
                  <p className="text-white font-mono text-sm bg-gray-800 px-3 py-2 rounded border border-gray-700">
                    {user.uid}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Login Method</h4>
                  <p className="text-white">
                    {user.email ? `Email: ${user.email}` : `Phone: ${user.phoneNumber}`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Account Created</h4>
                  <p className="text-white">
                    {user.createdAt.toDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Last Login</h4>
                  <p className="text-white">
                    {user.lastLoginAt.toDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
} 