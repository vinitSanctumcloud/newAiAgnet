'use client';

import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for className concatenation

interface CustomStepperProps {
  steps: { title: string; component: ReactNode }[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onBack: () => void;
  onFinalStepCompleted: () => void;
}

function CustomStepper({
  steps,
  currentStep,
  onStepChange,
  onNext,
  onBack,
  onFinalStepCompleted,
}: CustomStepperProps) {
  const handleStepClick = (index: number) => {
    if (index <= currentStep) {
      onStepChange(index);
    }
  };

  const handleNextClick = () => {
    if (currentStep < steps.length - 1) {
      onNext();
    } else {
      onFinalStepCompleted();
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Stepper Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Step Indicators */}
            <div className="flex items-center justify-center w-full sm:w-auto gap-2 sm:gap-4 flex-wrap">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer transition-all duration-300',
                    index <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500',
                    index > currentStep && 'pointer-events-none'
                  )}
                  onClick={() => handleStepClick(index)}
                >
                  <div className="flex items-center gap-2">
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <Circle
                        className={cn(
                          'h-5 w-5 sm:h-6 sm:w-6',
                          index === currentStep && 'fill-blue-600 dark:fill-blue-400 text-white dark:text-gray-800'
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'text-sm sm:text-base font-medium',
                        index === currentStep ? 'font-semibold text-blue-600 dark:text-blue-400' : ''
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block h-px w-6 sm:w-8 bg-gray-300 dark:bg-gray-600 mx-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm sm:text-base py-2 px-3 sm:px-4"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
              )}
              <Button
                onClick={handleNextClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 px-3 sm:px-4"
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{steps[currentStep].component}</div>
      </div>
    </div>
  );
}

export default CustomStepper;