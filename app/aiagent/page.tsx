'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../components/DashboardLayout';
import StepOne from '../../components/agent/StepOne';
import StepTwo from '../../components/agent/StepTwo';
import StepThree from '../../components/agent/StepThree';
import StepFour from '../../components/agent/StepFour';
import { CheckCircle, ChevronLeft, ChevronRight, FileText, User, Database, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { AppDispatch, RootState } from '@/store';
import { createAgentStep1, updateAgentStep2, updateAgentStep3, fetchUserAgent } from '@/store/slice/agentSlice';
import type { AgentInfo, Persona } from '@/lib/type';

interface CustomStepperProps {
  steps: { title: string; icon: React.ReactNode; description: string; component: React.ReactNode }[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onBack: () => void;
  onFinalStepCompleted: () => void;
  isSubmitting: boolean;
}

function CustomStepper({
  steps,
  currentStep,
  onStepChange,
  onNext,
  onBack,
  onFinalStepCompleted,
  isSubmitting,
}: CustomStepperProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleStepClick = (index: number) => {
    if (index <= currentStep) {
      onStepChange(index);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full px-6 py-4">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Create AI Agent</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm py-1.5 px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              )}
              <Button
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    onNext();
                  } else {
                    onFinalStepCompleted();
                  }
                }}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-4 transition-all duration-200 hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    <span>Processing...</span>
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Complete</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{Math.round(progress)}% Complete</span>
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 w-full">
        <div className="w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Setup Steps</h2>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200',
                        index === currentStep
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm'
                          : index < currentStep
                          ? 'text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
                        index <= currentStep && 'cursor-pointer hover:translate-x-1'
                      )}
                      onClick={() => handleStepClick(index)}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-6 h-6 rounded-full text-xs transition-all',
                          index < currentStep
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm'
                            : index === currentStep
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        )}
                      >
                        {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-3/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={cn(
                      'p-2 rounded-lg transition-colors duration-300',
                      currentStep === 0
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : currentStep === 1
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        : currentStep === 2
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    )}
                  >
                    {steps[currentStep].icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {steps[currentStep].description}
                    </p>
                  </div>
                </div>
                {steps[currentStep].component}
                <div className="flex justify-between mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={currentStep === 0 || isSubmitting}
                    className="flex items-center gap-1.5 transition-all duration-200 hover:-translate-x-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => {
                      if (currentStep < steps.length - 1) {
                        onNext();
                      } else {
                        onFinalStepCompleted();
                      }
                    }}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                        Processing...
                      </>
                    ) : currentStep === steps.length - 1 ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Complete Setup
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiAgentInner() {
  const dispatch = useDispatch<AppDispatch>();
  const { agents, loading } = useSelector((state: RootState) => state.agent);
  const [persona, setPersona] = useState<Persona>({
    greeting: '',
    tone: '',
    customRules: '',
    conversationStarters: [],
    languages: '',
    enableFreeText: true,
    enableBranchingLogic: true,
    conversationFlow: '',
  });
  const [agentInfo, setAgentInfo] = useState<AgentInfo>({
    userId: '',
    aiAgentName: '',
    agentDescription: '',
    domainExpertise: '',
    colorTheme: '#007bff',
    docFiles: [],
    manualEntry: [],
    logoFile: null,
    bannerFile: null,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const sampleAgentData: AgentInfo = {
    userId: 'user_12345',
    aiAgentName: 'Customer Support Assistant',
    agentDescription: 'An AI assistant that helps customers with common questions and issues.',
    domainExpertise: 'Customer Service, Product Support, Troubleshooting',
    colorTheme: '#3b82f6',
    docFiles: [],
    manualEntry: [
      { question: 'How do I reset my password?', answer: 'You can reset your password by visiting the account settings page.' },
      { question: 'Where can I find my order history?', answer: 'Your order history is available in the "My Orders" section of your account.' },
    ],
    logoFile: null,
    bannerFile: null,
  };

  const samplePersonaData: Persona = {
    greeting: 'Hello! How can I assist you today?',
    tone: 'Friendly and professional',
    customRules: 'Always be polite and helpful. Never share sensitive user information.',
    conversationStarters: [
      'How can I help with your account?',
      'Do you need help with an order?',
      'Are you experiencing technical issues?',
    ],
    languages: 'English, Spanish',
    enableFreeText: true,
    enableBranchingLogic: true,
    conversationFlow: 'Start with a greeting, then identify the user\'s need, and provide helpful responses.',
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAgentData = async () => {
      if (hasFetched || agents.length > 0 || loading) {
        if (isMounted) setIsSubmitting(false);
        return;
      }

      try {
        setIsSubmitting(true);
        const result = await dispatch(fetchUserAgent()).unwrap();
        if (result?._id && isMounted) {
          setAgentId(result._id.toString());
          setAgentInfo({
            userId: result.userId,
            aiAgentName: result.aiAgentName,
            agentDescription: result.agentDescription ?? '',
            domainExpertise: result.domainExpertise ?? '',
            colorTheme: result.colorTheme ?? '#007bff',
            logoFile: result.logoFile ?? null,
            bannerFile: result.bannerFile ?? null,
            docFiles: result.docFiles ?? [],
            manualEntry: result.manualEntry
              ? result.manualEntry.map((entry: any) => ({
                  ...entry,
                  _id: entry._id ? entry._id.toString() : undefined,
                }))
              : sampleAgentData.manualEntry,
          });
          setPersona({
            greeting: result.greeting ?? '',
            tone: result.tone ?? '',
            customRules: result.customRules ?? '',
            conversationStarters: Array.isArray(result.conversationStarters)
              ? result.conversationStarters
              : result.conversationStarters
              ? [result.conversationStarters]
              : samplePersonaData.conversationStarters,
            languages: result.languages ?? '',
            enableFreeText: Boolean(result.enableFreeText),
            enableBranchingLogic: Boolean(result.enableBranchingLogic),
            conversationFlow: result.conversationFlow ?? '',
          });
          setCurrentStep(0);
          toast.success('Agent data loaded successfully', { id: 'load-success' });
        }
      } catch (error: any) {
        if (isMounted) {
          console.error('Error fetching agent data:', error);
          toast.error('Failed to fetch agent data. Using demo data instead.', { id: 'fetch-error' });
          setAgentInfo({ ...sampleAgentData, userId: 'defaultUser' });
          setPersona(samplePersonaData);
        }
      } finally {
        if (isMounted) {
          setIsSubmitting(false);
          setHasFetched(true);
        }
      }
    };

    fetchAgentData();
    return () => {
      isMounted = false;
    };
  }, [dispatch, hasFetched]);

  const validateStep1 = () => {
    const errors: { [key: string]: string } = {};
    if (!agentInfo.aiAgentName) errors.aiAgentName = 'Agent name is required';
    if (!agentInfo.agentDescription) errors.agentDescription = 'Agent description is required';
    if (!agentInfo.domainExpertise) errors.domainExpertise = 'Domain expertise is required';
    if (!agentInfo.colorTheme || !/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(agentInfo.colorTheme))
      errors.colorTheme = 'Valid hex color code is required';
    if (!agentInfo.logoFile) errors.logoFile = 'Please upload a valid logo file';
    return errors;
  };

  const validateStep2 = () => {
    const errors: { [key: string]: string } = {};
    if (!persona.greeting) errors.greeting = 'Greeting is required';
    if (!persona.tone) errors.tone = 'Tone is required';
    if (!persona.customRules) errors.customRules = 'Custom rules are required';
    if (!persona.languages) errors.languages = 'Languages are required';
    if (!persona.conversationStarters.length) errors.conversationStarters = 'At least one conversation starter is required';
    if (!persona.conversationFlow) errors.conversationFlow = 'Conversation flow is required';
    return errors;
  };

  const validateStep3 = () => {
    const errors: { [key: string]: string } = {};
    if (!agentInfo.manualEntry?.length && !agentInfo.docFiles?.length)
      errors.knowledgeBase = 'Please provide at least one FAQ or file';
    return errors;
  };

  const handleNext = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (currentStep === 0) {
        const errors = validateStep1();
        if (Object.keys(errors).length > 0) {
          Object.values(errors).forEach((error) => toast.error(error, { id: 'step1-error' }));
          return;
        }
        const payload = {
          aiAgentName: agentInfo.aiAgentName,
          agentDescription: agentInfo.agentDescription,
          domainExpertise: agentInfo.domainExpertise,
          colorTheme: agentInfo.colorTheme,
          logoFile: agentInfo.logoFile instanceof File ? agentInfo.logoFile : null,
          bannerFile: agentInfo.bannerFile instanceof File ? agentInfo.bannerFile : null,
          userId: agentInfo.userId || 'defaultUser',
        };
        const result = await dispatch(createAgentStep1(payload)).unwrap();
        if (result._id) {
          setAgentId(result._id.toString());
          toast.success('Basic information saved!', { id: 'step1-success' });
        } else {
          throw new Error('Agent creation failed: No agent ID returned');
        }
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep === 1) {
        const errors = validateStep2();
        if (Object.keys(errors).length > 0) {
          Object.values(errors).forEach((error) => toast.error(error, { id: 'step2-error' }));
          return;
        }
        if (!agentId) {
          toast.error('Agent ID is missing. Please complete Step 1 first.', { id: 'step2-error' });
          return;
        }
        await dispatch(updateAgentStep2({ id: agentId, data: persona })).unwrap();
        toast.success('Persona configuration saved!', { id: 'step2-success' });
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep === 2) {
        const errors = validateStep3();
        if (Object.keys(errors).length > 0) {
          Object.values(errors).forEach((error) => toast.error(error, { id: 'step3-error' }));
          return;
        }
        if (!agentId) {
          toast.error('Agent ID is missing. Please complete Step 1 first.', { id: 'step3-error' });
          return;
        }
        await dispatch(
          updateAgentStep3({
            id: agentId,
            data: {
              docFiles: Array.isArray(agentInfo.docFiles)
                ? agentInfo.docFiles.filter((f): f is File => f instanceof File)
                : [],
              manualEntry: agentInfo.manualEntry,
            },
          })
        ).unwrap();
        toast.success('Knowledge base updated!', { id: 'step3-success' });
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error: any) {
      console.error(`Error in step ${currentStep + 1}:`, error);
      toast.error(`Failed to save data: ${error.message || 'An unexpected error occurred.'}`, {
        id: `step${currentStep + 1}-error`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [agentInfo, persona, currentStep, isSubmitting, agentId, dispatch]);

  const handleBack = useCallback(() => {
    if (isSubmitting) return;
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, [isSubmitting]);

  const handleFinalStep = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('AI Agent setup completed successfully!', {
        id: 'final-success',
        duration: 5000,
        action: {
          label: 'View Agent',
          onClick: () => (window.location.href = '/agents'),
        },
      });
    } catch (error: any) {
      console.error('Error completing agent setup:', error);
      toast.error(`Failed to complete setup: ${error.message || 'An unexpected error occurred.'}`, {
        id: 'complete-error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const handleStepChange = useCallback(
    (step: number) => {
      if (step <= currentStep) {
        setCurrentStep(step);
      }
    },
    [currentStep]
  );

  const steps = [
    {
      title: 'Basic Information',
      icon: <FileText className="h-5 w-5" />,
      description: 'Provide basic information about your AI agent',
      component: (
        <StepOne
          onAgentChange={(agent: AgentInfo) => setAgentInfo(agent)}
          agentInfo={agentInfo}
        />
      ),
    },
    {
      title: 'Persona',
      icon: <User className="h-5 w-5" />,
      description: 'Define the personality and behavior of your agent',
      component: <StepTwo onPersonaChange={setPersona} persona={persona} agentId={agentId ?? undefined} />,
    },
    {
      title: 'Knowledge Base',
      icon: <Database className="h-5 w-5" />,
      description: 'Add knowledge sources for your agent to reference',
      component: (
        <StepThree
          agentInfo={{ ...agentInfo, _id: agentId ?? '' }}
          onAgentChange={(updatedAgentInfo) =>
            setAgentInfo((prev) => {
              const merged = { ...prev, ...updatedAgentInfo };
              // If all docFiles are strings, keep as string[]; if all are Files, keep as File[]; otherwise, default to []
              let docFiles: string[] | File[] | undefined = [];
              if (Array.isArray(merged.docFiles)) {
                if (merged.docFiles.every((f) => typeof f === 'string')) {
                  docFiles = merged.docFiles as string[];
                } else if (merged.docFiles.every((f) => f instanceof File)) {
                  docFiles = merged.docFiles as File[];
                } else {
                  docFiles = [];
                }
              }
              return {
                ...merged,
                docFiles,
              };
            })
          }
        />
      ),
    },
    {
      title: 'Review & Complete',
      icon: <Eye className="h-5 w-5" />,
      description: 'Review all settings before completing the setup',
      component: <StepFour persona={persona} agentInfo={agentInfo} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-center w-full">
        <div className="w-full flex flex-col overflow-auto">
          <Toaster richColors position="top-right" />
          <CustomStepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onNext={handleNext}
            onBack={handleBack}
            onFinalStepCompleted={handleFinalStep}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AiAgentPage() {
  return <AiAgentInner />;
}