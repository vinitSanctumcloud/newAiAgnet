'use client'

import { Card, CardContent } from '@/components/ui/card'

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

export default function StatCard({
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
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 backdrop-blur-md overflow-hidden group relative">
      {comingSoon && (
        <div className="absolute -right-2 top-3 z-20">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-5 flex items-center justify-center shadow-sm transform transition-all duration-300 group-hover:translate-y-0.5">
            <div className="text-white text-xs font-bold uppercase px-2 rounded-md">
              Coming Soon
            </div>
          </div>
        </div>
      )}
      <CardContent className={`p-4 ${comingSoon ? 'opacity-90 group-hover:opacity-100' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className={`text-xl font-bold text-gray-900 dark:text-gray-100 mt-1 ${currency ? 'font-mono' : ''}`}>
              {value}
            </p>
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${trendColors[trend]}`}>
                {trend === 'up' ? '↑' : '↓'} {change}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">• {period}</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}