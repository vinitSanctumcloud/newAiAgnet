'use client'

import { lazy, Suspense } from 'react'
import { MousePointer, Users, Zap, Bot, ChevronRight, ShoppingBag, Settings, LayoutTemplate, Plus, BarChart3, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { subscriptionDisplayMap } from '@/components/dashboard1/AgentStatusCard'

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

interface DashboardHeaderProps {
  userName: string
}

interface OnboardingStepProps {
  step: number
  title: string
  description: string
  buttonText: string
  href: string
  icon: React.ReactNode
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend: 'up' | 'down'
  change: string
  period: string
  currency?: boolean
  comingSoon?: boolean
}

interface TipCardProps {
  title: string
  description: string
  icon: string
  color: 'blue' | 'teal' | 'indigo'
}

function AgentStatusCard({ settings, subscription, tokenBalance, aiAgent }: AgentStatusCardProps) {
  return (
    <div className="lg:col-span-2">
      <Card className="border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-950 w-full">
        <CardHeader className="p-5">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-50">
                {settings.agentName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your AI agent is primed to drive your sales growth
              </CardDescription>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Maintain an active subscription and sufficient tokens
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-blue-100 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-teal-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Live Status
                </span>
              </div>
              <Badge
                variant="outline"
                className={`${
                  aiAgent.ai_agent_slug
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
                } px-3 py-1 text-sm rounded-full`}
              >
                {aiAgent.ai_agent_slug ? 'Active & Online' : 'Pending Activation'}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-md transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Subscription Status
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/pricing" className="text-sm font-medium text-gray-900 dark:text-gray-50 hover:text-indigo-600 dark:hover:text-indigo-400">
                  {subscriptionDisplayMap[subscription] || 'Inactive'}
                </Link>
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-md transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Token Balance
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {tokenBalance} Tokens Available
                </span>
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">
            Good {getTimeOfDay()},{' '}
            <motion.span
              className="text-blue-600 dark:text-blue-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {userName}
            </motion.span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
            Monitor and optimize your AI agent's performance today
          </p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition-colors duration-200"
        >
          <Link href="/pricing">Activate Beta</Link>
        </Button>
      </div>
    </div>
  )
}

function OnboardingCard() {
  return (
    <Card className="border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm bg-blue-50 dark:bg-blue-900/20 w-full">
      <CardHeader className="p-5">
        <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-200">
          Launch Your AI Agent
        </CardTitle>
        <CardDescription className="text-sm text-blue-800 dark:text-blue-300">
          Complete these steps to activate your monetization agent
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OnboardingStep
            step={1}
            title="Add Recommendations"
            description="Link your affiliate products for AI to promote"
            buttonText="Add Links"
            href="/agent"
            icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
          />
          <OnboardingStep
            step={2}
            title="Configure Agent"
            description="Tailor your AI's behavior and expertise"
            buttonText="Configure"
            href="/settings"
            icon={<Settings className="h-5 w-5 text-blue-600" />}
          />
          <OnboardingStep
            step={3}
            title="Share & Embed"
            description="Integrate or share your agent's unique link"
            buttonText="Get Code"
            href="/embed"
            icon={<LayoutTemplate className="h-5 w-5 text-blue-600" />}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function OnboardingStep({ step, title, description, buttonText, href, icon }: OnboardingStepProps) {
  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-950 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-4 w-full">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">Step {step}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-50">{title}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <Button
        asChild
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full transition-colors duration-200"
      >
        <Link href={href}>{buttonText}</Link>
      </Button>
    </div>
  )
}

function PerformanceTipsCard() {
  return (
    <Card className="border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm bg-white dark:bg-gray-950 w-full">
      <CardHeader className="p-5">
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">Optimization Tips</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Maximize your agent's impact with these strategies
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TipCard
            title="Refine Agent Persona"
            description="Define clear roles and objectives for better results"
            icon="✨"
            color="blue"
          />
          <TipCard
            title="Diversify Links"
            description="Add multiple products to increase opportunities"
            icon="🔗"
            color="teal"
          />
          <TipCard
            title="Boost Visibility"
            description="Promote your agent on social platforms"
            icon="📢"
            color="indigo"
          />
          <TipCard
            title="Pro Monetization"
            description="Unlock commissions with advanced AI features"
            icon="💰"
            color="blue"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionsCard() {
  return (
    <div className="space-y-4 lg:col-span-2">
      <Card className="border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-950 w-full">
        <CardHeader className="p-5">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">Quick Actions</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Jumpstart your progress</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3">
            <Link href="/agent" passHref>
              <Button variant="outline" className="w-full justify-between px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-50">Affiliate Links</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Add your products</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </Link>
            <Link href="/embed" passHref>
              <Button variant="outline" className="w-full justify-between px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-teal-50 dark:bg-teal-900/20">
                    <Bot className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-50">Share Agent</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Embed or share online</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </Link>
            <Link href="/analytics" passHref>
              <Button variant="outline" className="w-full justify-between px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-50">View Analytics</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Monitor performance</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
  change,
  period,
  currency = false,
  comingSoon = false,
}: StatCardProps) {
  const trendColors = {
    up: 'text-teal-600 dark:text-teal-400',
    down: 'text-red-600 dark:text-red-400',
  }

  return (
    <Card className="border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-950 relative">
      {comingSoon && (
        <div className="absolute -right-1 top-2">
          <div className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Coming Soon
          </div>
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className={`text-xl font-bold text-gray-900 dark:text-gray-50 mt-1 ${currency ? 'font-mono' : ''}`}>
              {value}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <span className={`text-xs font-medium ${trendColors[trend]}`}>
                {trend === 'up' ? '↑' : '↓'} {change}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">• {period}</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TipCard({ title, description, icon, color }: TipCardProps) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      text: 'text-teal-600 dark:text-teal-400',
      border: 'border-teal-200 dark:border-teal-800',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
  }

  return (
    <Card className={`border ${colorStyles[color].border} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-950`}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-3">
          <div className={`w-12 h-12 rounded-full ${colorStyles[color].bg} flex items-center justify-center`}>
            <span className={`text-xl ${colorStyles[color].text}`}>{icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  // Moved subscriptionDisplayMap inside the component
  const subscriptionDisplayMap: Record<string, string> = {
    active: 'Active',
    canceled: 'Canceled',
    incomplete: 'Incomplete',
    incomplete_expired: 'Inactive',
    past_due: 'Past Due',
    trialing: 'Trialing',
    unpaid: 'Unpaid',
  }

  const analytics = {
    total_chat_session: 1250,
    last_month_total_chat_session: 1000,
    this_month_total_chat_session: 1250,
    total_click: 3500,
    last_month_total_click_count: 3000,
    this_month_total_click_count: 3500,
  }
  const settings = {
    agentName: 'SalesBot',
    customUrl: 'https://example.com/salesbot',
  }
  const subscription = 'active'
  const tokenBalance = 500
  const aiAgent = {
    ai_agent_slug: 'salesbot-123',
  }
  const affiliateLinksCount = 0

  return (
    <DashboardLayout>
      <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <Suspense fallback={<div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>}>
          <DashboardHeader userName="John Doe" />
        </Suspense>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={<div className="text-center text-gray-500 dark:text-gray-400">Loading stats...</div>}>
            <StatCard
              title="Total Chats"
              value={analytics.total_chat_session.toLocaleString()}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              trend={analytics.this_month_total_chat_session >= analytics.last_month_total_chat_session ? 'up' : 'down'}
              change={`${Math.abs(((analytics.this_month_total_chat_session - analytics.last_month_total_chat_session) / analytics.last_month_total_chat_session) * 100).toFixed(2)}%`}
              period="Last 30 Days"
            />
            <StatCard
              title="Total Clicks"
              value={analytics.total_click.toLocaleString()}
              icon={<MousePointer className="h-6 w-6 text-teal-600" />}
              trend={analytics.this_month_total_click_count >= analytics.last_month_total_click_count ? 'up' : 'down'}
              change={`${Math.abs(((analytics.this_month_total_click_count - analytics.last_month_total_click_count) / analytics.last_month_total_click_count) * 100).toFixed(2)}%`}
              period="Last 30 Days"
            />
            <button className="w-full rounded-lg shadow-sm hover:shadow-md px-5 py-4 bg-white dark:bg-gray-950 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-shadow duration-200 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div className="flex flex-col items-start gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">Conversation Log</span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  PRO ONLY
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">🔒</span>
                <span className="text-blue-600 dark:text-blue-400 text-lg">→</span>
              </div>
            </button>
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Suspense fallback={<div className="text-center text-gray-500 dark:text-gray-400">Loading agent status...</div>}>
            <AgentStatusCard settings={settings} subscription={subscription} tokenBalance={tokenBalance} aiAgent={aiAgent} />
          </Suspense>
          <Suspense fallback={<div className="text-center text-gray-500 dark:text-gray-400">Loading actions...</div>}>
            <QuickActionsCard />
          </Suspense>
        </div>

        {affiliateLinksCount === 0 && (
          <Suspense fallback={<div className="text-center text-gray-500 dark:text-gray-400">Loading onboarding...</div>}>
            <OnboardingCard />
          </Suspense>
        )}

        <Suspense fallback={<div className="text-center text-gray-500 dark:text-gray-400">Loading tips...</div>}>
          <PerformanceTipsCard />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}