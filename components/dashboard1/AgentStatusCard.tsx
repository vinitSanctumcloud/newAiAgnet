'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const subscriptionDisplayMap: Record<string, string> = {
  active: 'Active',
  canceled: 'Canceled',
  incomplete: 'Incomplete',
  incomplete_expired: 'Incomplete Expired',
  past_due: 'Past Due',
  trialing: 'Trialing',
  unpaid: 'Unpaid',
}

interface Settings {
  customUrl?: string
  agentName: string
}

interface AiAgent {
  ai_agent_slug: string
}

interface AgentStatusCardProps {
  settings: Settings
  subscription: string
  tokenBalance: number
  aiAgent: AiAgent
}

export default function AgentStatusCard({ settings, subscription, tokenBalance, aiAgent }: AgentStatusCardProps) {
  return (
    <div className="lg:col-span-2 group relative">
      <div className="absolute -inset-2 bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-800/30 dark:to-amber-800/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10"></div>
      <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 bg-white dark:bg-gray-800 backdrop-blur-md w-full">
        <CardHeader className="p-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg shadow-inner">
              <Bot className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {settings.agentName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Your personalized AI agent is ready to boost your sales
              </CardDescription>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Ensure you have an active subscription with a token balance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="absolute -inset-1 rounded-full bg-green-500/30 animate-ping opacity-75"></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Live Status
                </span>
              </div>
              <Badge
                variant="outline"
                className={`${aiAgent.ai_agent_slug
                    ? 'bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700'
                    : 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700'
                  } text-sm px-4 py-1 rounded-md`}
              >
                {aiAgent.ai_agent_slug ? 'Active & Online' : 'Pending Activation'}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Subscription Status
                </span>
              </div>
              <div className="flex items-center">
                <Link href="/pricing" className="underline hover:text-blue-500">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-2">
                    {subscriptionDisplayMap[subscription] || 'Inactive'}
                  </span>
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Token Balance
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-2">
                  {tokenBalance} Tokens Available
                </span>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}