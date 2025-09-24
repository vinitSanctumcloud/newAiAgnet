'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface OnboardingStepProps {
  step: number
  title: string
  description: string
  buttonText: string
  href: string
  icon: React.ReactNode
}

export default function OnboardingStep({ step, title, description, buttonText, href, icon }: OnboardingStepProps) {
  return (
    <div className="flex flex-col items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-orange-200 dark:border-orange-700 group">
      <div className="flex items-center gap-3 w-full">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-orange-900 dark:text-orange-200">Step {step}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <Button
        asChild
        className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Link href={href}>{buttonText}</Link>
      </Button>
    </div>
  )
}