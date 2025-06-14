'use client';

import { useState } from 'react';
import { signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserRecord } from '@/lib/userUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AuthFormProps {
  onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create or update user record
      await createUserRecord(
        result.user.uid,
        result.user.email || undefined,
        undefined,
        result.user.displayName || undefined
      );
      
      toast.success('Successfully signed in with Google!');
      onSuccess();
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    try {
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowCodeInput(true);
      toast.success('Verification code sent to your phone!');
    } catch (error: unknown) {
      console.error('Phone sign-in error:', error);
      toast.error('Failed to send verification code. Please check your phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    if (!confirmationResult || !verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      
      // Create or update user record
      await createUserRecord(
        result.user.uid,
        undefined,
        result.user.phoneNumber || undefined
      );
      
      toast.success('Successfully signed in with phone number!');
      onSuccess();
    } catch (error: unknown) {
      console.error('Code verification error:', error);
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto bg-gray-900/90 border-gray-800 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                🎰 Casino Login
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Sign in to access your crypto casino account
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-none h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or continue with phone</span>
              </div>
            </motion.div>

            {/* Phone Number Sign In */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="space-y-4"
            >
              {!showCodeInput ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 h-12"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={handlePhoneSignIn}
                    disabled={isLoading || !phoneNumber}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
                  >
                    Send Verification Code
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-gray-300">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 h-12 text-center text-xl tracking-widest"
                      disabled={isLoading}
                      maxLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={handleCodeVerification}
                      disabled={isLoading || !verificationCode}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
                    >
                      Verify & Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        setShowCodeInput(false);
                        setVerificationCode('');
                        setConfirmationResult(null);
                      }}
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Back to Phone Number
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
} 