'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardHeaderProps {
  userName: string
}

function getTimeOfDay(): string {
  return 'morning'
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in relative">
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="flex flex-col gap-1 text-gray-900 dark:text-gray-100">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-500 to-gray-900 dark:from-gray-400 dark:to-gray-100 bg-clip-text text-transparent capitalize">
                Good {getTimeOfDay()}
              </span>
              <motion.span
                className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                {userName}
              </motion.span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              Here's what's happening with your AI agent today. Let's make some sales!
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              asChild
              className="w-full sm:w-48 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link href="/pricing">Activate Beta</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-amber-200/30 dark:bg-amber-800/30 blur-xl animate-float-slow pointer-events-none"></div>
    </div>
  )
}