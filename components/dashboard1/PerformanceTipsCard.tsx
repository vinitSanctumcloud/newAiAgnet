'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import TipCard from './TipCard'


export default function PerformanceTipsCard() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Performance Tips</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Boost your conversion rate with these expert recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TipCard
            title="Optimize Agent's Persona"
            description="Clearly define agent's role and specialization, and goals"
            icon="✨"
            color="purple"
          />
          <TipCard
            title="Use Multiple Links"
            description="More products = more opportunities"
            icon="🔗"
            color="emerald"
          />
          <TipCard
            title="Promote Your Chat"
            description="Share on social media for more traffic"
            icon="📢"
            color="orange"
          />
          <TipCard
            title="Scale with Pro Monetization"
            description="Earn commissions on related AI recommendations"
            icon="💰"
            color="orange"
          />
        </div>
      </CardContent>
    </Card>
  )
}