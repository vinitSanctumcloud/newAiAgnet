'use client'

import { Card, CardContent } from '@/components/ui/card'

interface TipCardProps {
  title: string
  description: string
  icon: string
  color: 'purple' | 'emerald' | 'orange'
}

export default function TipCard({ title, description, icon, color }: TipCardProps) {
  const colorStyles = {
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/50',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-700',
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-700',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/50',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-700',
    },
  }

  return (
    <Card className={`border ${colorStyles[color].border} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 backdrop-blur-md group relative overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className={`w-10 h-10 rounded-full ${colorStyles[color].bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
            <span className={`text-lg ${colorStyles[color].text}`}>{icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}