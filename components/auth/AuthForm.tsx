'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';

interface Props {
  onSubmit: (credentials: { email: string; password: string; name?: string }) => Promise<void>;
  buttonText: string;
  error?: string | null; // Added error prop
}

export default function AuthForm({ onSubmit, buttonText, error: externalError }: Props) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes('/login') || pathname === '/';
  const isRegisterPage = pathname.includes('/register');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await onSubmit({ email, password, name: isRegisterPage ? name : undefined });
    } catch (err: any) {
      console.error('AuthForm error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic here if needed
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="">
      <motion.div
        className="max-w-5xl w-full"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Card className="overflow-hidden border-none shadow-2xl rounded-2xl">
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Illustration */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-white"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-white"></div>
              </div>
              <motion.div
                className="relative z-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h1 className="text-4xl font-bold mb-4">
                  {isLoginPage ? 'Welcome Back' : 'Join Our Platform'}
                </h1>
                <p className="text-lg opacity-90 mb-8 max-w-md">
                  {isLoginPage
                    ? 'Sign in to access your account and continue your journey with us'
                    : 'Create an account to unlock exclusive features and start your journey'}
                </p>
                <div className="flex justify-center mb-10">
                  <div className="w-64 h-64 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                </div>
              </motion.div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <CardHeader className="px-0 pt-0">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-center mb-2 text-gray-900">
                  {isLoginPage ? 'Sign In to Dashboard' : 'Create Your Account'}
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  {isLoginPage
                    ? 'Enter your credentials to access your account'
                    : 'Fill in your details to create a new account'}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 pb-0">
                <AnimatePresence>
                  {(error || externalError) && (
                    <motion.div
                      className="text-red-500 text-sm mb-6 text-center p-3 bg-red-50 rounded-lg border border-red-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {error || externalError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                  {isLoginPage && (
                    <>
                      <motion.div className="flex space-x-4" variants={itemVariants}>
                        <Button
                          type="button"
                          onClick={() => handleSocialLogin('Google')}
                          variant="outline"
                          className="flex-1 border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          Google
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleSocialLogin('Apple')}
                          variant="outline"
                          className="flex-1 border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path
                              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"
                            />
                          </svg>
                          Apple
                        </Button>
                      </motion.div>
                      <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                          <Separator />
                        </div>
                        <div className="relative flex justify-center text-sm uppercase">
                          <span className="bg-white px-3 text-gray-500 font-medium">Or continue with email</span>
                        </div>
                      </div>
                    </>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {isRegisterPage && (
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="pl-10 h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                            required
                          />
                        </div>
                      </motion.div>
                    )}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="pl-10 h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-12 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </motion.div>
                    {isLoginPage && (
                      <motion.div className="flex items-center space-x-2" variants={itemVariants}>
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="remember" className="text-sm font-normal text-gray-600">
                          Remember me
                        </Label>
                      </motion.div>
                    )}
                    {isRegisterPage && (
                      <motion.div className="flex items-start space-x-2" variants={itemVariants}>
                        <Checkbox
                          id="terms"
                          className="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <Label htmlFor="terms" className="text-sm font-normal text-gray-600">
                          I agree to the{' '}
                          <a href="#" className="text-blue-600 hover:underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </motion.div>
                    )}
                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            {buttonText === 'Login' ? 'Signing In...' : 'Creating Account...'}
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-5 w-5" />
                            {buttonText}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                  <motion.div className="text-center text-sm text-gray-600 pt-6" variants={itemVariants}>
                    {isLoginPage ? (
                      <p>
                        Don’t have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:underline font-medium">
                          Sign up
                        </a>
                      </p>
                    ) : (
                      <p>
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:underline font-medium">
                          Sign in
                        </a>
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              </CardContent>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}