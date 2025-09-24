'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShoppingBag, Settings, LayoutTemplate } from 'lucide-react'
import OnboardingStep from './OnboardingStep'

export default function     () {
  return (
    <Card className="border border-orange-200 dark:border-orange-700 rounded-xl shadow-xl bg-orange-50 dark:bg-orange-900/50 w-full">
      <CardHeader className="p-3">
        <CardTitle className="text-2xl font-extrabold text-orange-900 dark:text-orange-200 tracking-tight">
          Let's Get You Started!
        </CardTitle>
        <CardDescription className="text-sm text-orange-800/90 dark:text-orange-300/90">
          Follow these simple steps to launch your AI monetization agent
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <OnboardingStep
            step={1}
            title="Add Your Recommendations"
            description="Connect your affiliate links and let AI handle the rest"
            buttonText="Add Links"
            href="/agent"
            icon={<ShoppingBag className="h-4 w-4 text-orange-600" />}
          />
          <OnboardingStep
            step={2}
            title="Customize Your Agent"
            description="Personalize your AI's behavior and knowledge base"
            buttonText="Customize"
            href="/settings"
            icon={<Settings className="h-4 w-4 text-orange-600" />}
          />
          <OnboardingStep
            step={3}
            title="Embed & Share"
            description="Add to your site or share your unique link"
            buttonText="Get Code"
            href="/embed"
            icon={<LayoutTemplate className="h-4 w-4 text-orange-600" />}
          />
        </div>
      </CardContent>
    </Card>
  )
}