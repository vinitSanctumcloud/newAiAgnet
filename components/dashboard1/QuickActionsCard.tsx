'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Bot, BarChart3, ChevronRight } from 'lucide-react'

export default function QuickActionsCard() {
  return (
    <div className="space-y-4 lg:col-span-2">
      <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 bg-white dark:bg-gray-800 backdrop-blur-md w-full">
        <CardHeader className="p-3">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Quick Actions</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Get started in seconds</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <Link href="/agent" passHref>
              <Button variant="outline" className="w-full justify-between px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                    <Plus className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Affiliate Links</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Connect your products</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </Link>
            <Link href="/embed" passHref>
              <Button variant="outline" className="w-full justify-between px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Share Agent & Grow</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Share on social. Embed on Website</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </Link>
            <Link href="/analytics" passHref>
              <Button variant="outline" className="w-full justify-between px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">View Analytics</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Track performance</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}