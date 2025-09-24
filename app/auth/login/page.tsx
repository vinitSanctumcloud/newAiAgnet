// app/auth/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { login, selectAuthError, selectAuthLoading, selectIsAuthenticated } from '@/store/slice/authSlice';
import type { AppDispatch, RootState } from '@/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isLoading = useSelector((state: RootState) => selectAuthLoading(state));
  const error = useSelector((state: RootState) => selectAuthError(state));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login successful! Redirecting to dashboard...', {
        position: 'top-center',
        duration: 2000,
      });
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-center',
        duration: 4000,
        icon: '❌',
      });
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }
    
    dispatch(login({ email, password }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700"
        >
          <div className="p-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8">
              <motion.div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </motion.div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to SaaSPro</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to your account</p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Forgot password?
                  </a>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </motion.button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>

                  <div>
                    <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm.908 15.68c-3.136 0-5.68-2.544-5.68-5.68 0-3.136 2.544-5.68 5.68-5.68 1.53 0 2.865.576 3.9 1.523l-1.587 1.527c-.48-.458-1.217-.916-2.313-.916-1.782 0-3.233 1.45-3.233 3.233 0 1.782 1.45 3.233 3.233 3.233 1.523 0 2.393-.763 2.697-1.373h-2.697V9.487h4.526c.076.427.114.854.114 1.373 0 3.136-2.544 5.68-5.68 5.68z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Don't have an account?{' '}
                  <a href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Start a free trial
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8"
        >
          © {new Date().getFullYear()} SaaSPro. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  );
}