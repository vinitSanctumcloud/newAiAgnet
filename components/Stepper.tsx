'use client'

import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
  agentUrl?: string;
  iframeSrc?: string;
  widgetSrc?: string;
  onNext?: () => Promise<void>;
  onBack?: () => Promise<void>;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  agentUrl = 'https://example.com/agent/123',
  iframeSrc = 'https://example.com/agent/123',
  widgetSrc = 'https://example.com/widget.js?id=123',
  onNext = async () => {},
  onBack = async () => {},
  ...rest
}: StepperProps) {
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const validInitialStep = Math.max(1, Math.min(initialStep, totalSteps));
  const [currentStep, setCurrentStep] = useState<number>(validInitialStep);
  const [direction, setDirection] = useState<number>(0);
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    const validStep = Math.max(1, Math.min(newStep, totalSteps + 1));
    setCurrentStep(validStep);
    if (validStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(validStep);
    }
  };

  const handleBack = async () => {
    if (currentStep > 1) {
      try {
        await onBack();
        setDirection(-1);
        updateStep(currentStep - 1);
      } catch (error) {
        console.error('Error in onBack handler:', error);
      }
    }
  };

  const handleNext = async () => {
    if (!isLastStep) {
      try {
        await onNext();
        setDirection(1);
        updateStep(currentStep + 1);
      } catch (error) {
        console.error('Error in onNext handler:', error);
      }
    }
  };

  const handleComplete = async () => {
    try {
      await onNext();
      setDirection(1);
      updateStep(totalSteps + 1);
    } catch (error) {
      console.error('Error in handleComplete:', error);
    }
  };

  return (
    <div
      className="flex h-[90vh] flex-1 flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg"
      {...rest}
    >
      <div
        className={`relative mx-auto w-full max-w-full h-[95vh] rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col shadow-md ${stepCircleContainerClassName}`}
      >
        <div className={`flex w-full items-center p-4 rounded-t-lg ${stepContainerClassName}`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          currentStep={currentStep}
          direction={direction}
          className={`flex-1 space-y-4 p-6 overflow-auto hide-scrollbar bg-white dark:bg-gray-800 ${contentClassName}`}
        >
          {isCompleted ? (
            <CompletionScreen 
              agentUrl={agentUrl}
              iframeSrc={iframeSrc}
              widgetSrc={widgetSrc}
            />
          ) : stepsArray[currentStep - 1]}
        </StepContentWrapper>

        <div className={`p-4 px-6 flex justify-end items-end dark:bg-gray-800 rounded-b-lg ${footerClassName}`}>
          <div className="flex gap-4">
            {currentStep !== 1 && (
              <button
                onClick={handleBack}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 ${
                  currentStep === 1 ? 'pointer-events-none opacity-50' : ''
                }`}
                aria-disabled={currentStep === 1}
                {...backButtonProps}
              >
                {backButtonText}
              </button>
            )}
            {!isCompleted && (
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                {...nextButtonProps}
              >
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const FireworksAnimation = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)` }}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [1, 0.7, 0],
            x: Math.cos((i / 30) * Math.PI * 2) * (60 + Math.random() * 60),
            y: Math.sin((i / 30) * Math.PI * 2) * (60 + Math.random() * 60),
          }}
          transition={{ 
            duration: 1.8,
            delay: Math.random() * 0.8,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

const LevelUpAnimation = () => {
  return (
    <motion.div
      className="relative inline-block"
      animate={{ 
        scale: [1, 1.3, 1],
        y: [0, -8, 0],
      }}
      transition={{ 
        duration: 0.6,
        repeat: 1,
        repeatType: "reverse"
      }}
    >
      {/* Your level up content here */}
    </motion.div>
  );
};

interface CompletionScreenProps {
  agentUrl: string;
  iframeSrc: string;
  widgetSrc: string;
}

function CompletionScreen({ agentUrl, iframeSrc, widgetSrc }: CompletionScreenProps) {
  const iframeCode = `<iframe src="${iframeSrc}" width="600" height="400" frameborder="0" allowfullscreen></iframe>`;
  const widgetCode = `<script src="${widgetSrc}"></script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Toast removed as requested
      console.log('Copied to clipboard!');
    }).catch(() => {
      console.error('Failed to copy');
    });
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center relative overflow-hidden rounded-lg p-6 shadow-none bg-white dark:bg-gray-900"
    >
      <h2 className="text-4xl font-extrabold mb-6 text-green-700 dark:text-green-300">
        Your Agent Created Successfully!
      </h2>
      <p className="text-xl mb-10 text-gray-600 dark:text-gray-400 font-medium">Ready to assist you with anything. Share it now!</p>

      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-600 hover:scale-[1.025] transition-transform duration-300">
        <h3 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">Share Your Agent</h3>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <TabsTrigger value="url" className="text-sm font-medium">Agent URL</TabsTrigger>
            <TabsTrigger value="iframe" className="text-sm font-medium">Iframe Code</TabsTrigger>
            <TabsTrigger value="widget" className="text-sm font-medium">Widget Code</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="space-y-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Direct Link to Your Agent</label>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-500">
              <input
                type="text"
                value={agentUrl}
                readOnly
                className="flex-1 p-3 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(agentUrl)}
                className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
              >
                Copy
              </button>
            </div>
          </TabsContent>
          <TabsContent value="iframe" className="space-y-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Embed as Iframe</label>
            <div className="flex flex-col gap-3 bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-500">
              <textarea
                value={iframeCode}
                readOnly
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(iframeCode)}
                className="self-end px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
              >
                Copy
              </button>
            </div>
          </TabsContent>
          <TabsContent value="widget" className="space-y-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Embed as Widget Script</label>
            <div className="flex flex-col gap-3 bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-500">
              <textarea
                value={widgetCode}
                readOnly
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(widgetCode)}
                className="self-end px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
              >
                Copy
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface StepContentWrapperProps {
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  currentStep,
  direction,
  children,
  className = '',
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number | 'auto'>('auto');

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'auto' }}
      animate={{ height: parentHeight }}
      transition={{ type: 'spring', duration: 0.4, stiffness: 120, damping: 20 }}
      className={`${className} hide-scrollbar`}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
          {children}
        </SlideTransition>
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number | 'auto') => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady('auto');
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, type: 'spring', stiffness: 120, damping: 20 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '-50%' : '50%',
    opacity: 0,
  }),
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return (
    <div className="p-4 text-gray-800 dark:text-gray-200 overflow-auto hide-scrollbar">
      {children}
    </div>
  );
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators = false }: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  const isClickable = !disableStepIndicators && step !== currentStep;

  const handleClick = () => {
    if (isClickable) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full font-semibold outline-none transition ${
        isClickable ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600' : 'cursor-default'
      }`}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: '#e5e7eb', color: '#6b7280' },
          active: { scale: 1.1, backgroundColor: '#3b82f6', color: '#ffffff' },
          complete: { scale: 1, backgroundColor: '#10b981', color: '#ffffff' },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
      >
        {status === 'complete' ? (
          <CheckIcon className="h-5 w-5 text-white" />
        ) : status === 'active' ? (
          <div className="h-4 w-4 rounded-full bg-white dark:bg-gray-900" />
        ) : (
          <span className="text-base">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: 'transparent' },
    complete: { width: '100%', backgroundColor: '#10b981' },
  };

  return (
    <div className="relative mx-3 h-1 flex-1 overflow-hidden rounded bg-gray-300 dark:bg-gray-600">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}