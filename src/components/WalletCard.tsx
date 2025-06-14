'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Copy, Check, Zap } from 'lucide-react';

interface WalletCardProps {
  bitcoinAddress: string;
  ethereumAddress: string;
}

export default function WalletCard({ bitcoinAddress, ethereumAddress }: WalletCardProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (address: string, type: 'BTC' | 'ETH') => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast.success(`${type} address copied to clipboard!`);
      
      // Reset copy state after 3 seconds
      setTimeout(() => setCopiedAddress(null), 3000);
    } catch {
      toast.error('Failed to copy address');
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              💎
            </div>
            <span>Crypto Wallet</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your unique deposit addresses for Bitcoin and Ethereum
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Bitcoin Address */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                  ₿
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Bitcoin</h3>
                  <p className="text-xs text-gray-400">BTC Network</p>
                </div>
              </div>
              <Button
                onClick={() => copyToClipboard(bitcoinAddress, 'BTC')}
                variant="outline"
                size="sm"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-200"
              >
                {copiedAddress === bitcoinAddress ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="bg-black/30 rounded p-3 border border-gray-700">
              <p className="text-white font-mono text-sm break-all">
                {bitcoinAddress}
              </p>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>Minimum deposit: 0.0001 BTC</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Active</span>
              </span>
            </div>
          </motion.div>

          {/* Ethereum Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Ethereum</h3>
                  <p className="text-xs text-gray-400">ETH Network</p>
                </div>
              </div>
              <Button
                onClick={() => copyToClipboard(ethereumAddress, 'ETH')}
                variant="outline"
                size="sm"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-200"
              >
                {copiedAddress === ethereumAddress ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="bg-black/30 rounded p-3 border border-gray-700">
              <p className="text-white font-mono text-sm break-all">
                {ethereumAddress}
              </p>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>Minimum deposit: 0.01 ETH</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Active</span>
              </span>
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-black text-xs font-bold">!</span>
              </div>
              <div className="text-xs text-yellow-200">
                <p className="font-medium mb-1">Important Notice:</p>
                <ul className="space-y-1 text-yellow-200/80">
                  <li>• Only send the corresponding cryptocurrency to each address</li>
                  <li>• Deposits are credited after network confirmations</li>
                  <li>• These addresses are unique to your account</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 