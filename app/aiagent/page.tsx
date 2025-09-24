'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Database,
  Eye,
  Sparkles,
  Settings,
  Bot,
  ExternalLink,
  LayoutDashboardIcon,
  Key,
  Globe,
  Copy,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppDispatch, RootState } from '@/store';
import { createAgentStep1, updateAgentStep2, updateAgentStep3, fetchUserAgent } from '@/store/slice/agentSlice';
import StepOne from '@/components/agent/StepOne';
import StepTwo from '@/components/agent/StepTwo';
import StepThree from '@/components/agent/StepThree';
import StepFour from '@/components/agent/StepFour';
import { IAIAgent } from '@/store/slice/agentSlice';
import DashboardLayout from '@/components/DashboardLayout';

const steps = [
  {
    title: 'Basic Information',
    icon: <FileText className="h-5 w-5" />,
    description: 'Set up your AI agent\'s core details and branding.',
    component: (props: { agent: IAIAgent; onAgentChange: (agent: Partial<IAIAgent>) => void }) => (
      <StepOne agent={props.agent} onAgentChange={props.onAgentChange} />
    ),
    color: 'blue',
  },
  {
    title: 'Persona Configuration',
    icon: <User className="h-5 w-5" />,
    description: 'Define the personality and conversational behavior.',
    component: (props: { agent: IAIAgent; onAgentChange: (agent: Partial<IAIAgent>) => void }) => (
      <StepTwo agent={props.agent} onAgentChange={props.onAgentChange} />
    ),
    color: 'purple',
  },
  {
    title: 'Knowledge Base',
    icon: <Database className="h-5 w-5" />,
    description: 'Add FAQs and documents for the agent to reference.',
    component: (props: { agent: IAIAgent; onAgentChange: (agent: Partial<IAIAgent>) => void }) => (
      <StepThree agent={props.agent} onAgentChange={props.onAgentChange} />
    ),
    color: 'green',
  },
  {
    title: 'Review & Test',
    icon: <Eye className="h-5 w-5" />,
    description: 'Preview and test your AI agent\'s configuration.',
    component: (props: { agent: IAIAgent }) => <StepFour agent={props.agent} />,
    color: 'orange',
  },
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      activeBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      activeBg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      activeBg: 'bg-green-100 dark:bg-green-900/30',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
      activeBg: 'bg-orange-100 dark:bg-orange-900/30',
    },
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

// Default agent data
const defaultAgent: IAIAgent = {
  aiAgentName: '',
  agentDescription: '',
  domainExpertise: '',
  colorTheme: '#007bff',
  logoFile: null,
  bannerFile: null,
  greeting: '',
  tone: 'friendly',
  customRules: '',
  conversationStarters: [],
  languages: 'English',
  enableFreeText: true,
  enableBranchingLogic: true,
  conversationFlow: '',
  manualEntry: [],
  docFiles: [],
  csvFile: null,
  userId: ''
};

// Function to generate a slug from the agent name
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function AiAgentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { agent, loading, error } = useSelector((state: RootState) => state.agent);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxCompleted, setMaxCompleted] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localAgent, setLocalAgent] = useState<IAIAgent>({ ...defaultAgent });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initial load: Fetch or use existing agent and set currentStep only once
  useEffect(() => {
    if (agent) {
      setLocalAgent(agent);
      setCurrentStep(0);
      setMaxCompleted(3);
    } else {
      dispatch(fetchUserAgent()).then((result) => {
        if (fetchUserAgent.fulfilled.match(result) && result.payload) {
          setLocalAgent(result.payload);
          setCurrentStep(0);
          setMaxCompleted(3);
        } else {
          setLocalAgent({ ...defaultAgent });
          setCurrentStep(0);
          setMaxCompleted(-1);
        }
      });
    }
  }, [dispatch]);

  // Fetch latest agent data on step change (for next/prev navigation and hard refresh consistency)
  useEffect(() => {
    dispatch(fetchUserAgent()).then((result) => {
      if (fetchUserAgent.fulfilled.match(result) && result.payload) {
        setLocalAgent(result.payload);
      }
    });
  }, [currentStep, dispatch]);

  // Handle errors from Redux
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAgentChange = useCallback((updates: Partial<IAIAgent>) => {
    setLocalAgent((prev) => ({ ...prev, ...updates }));
  }, []);

  const validateStep = useCallback((step: number): string[] => {
    const errors: string[] = [];

    switch (step) {
      case 0:
        if (!localAgent.aiAgentName?.trim()) errors.push('Agent name is required');
        if (!localAgent.agentDescription?.trim()) errors.push('Agent description is required');
        if (!localAgent.domainExpertise?.trim()) errors.push('Domain expertise is required');
        if (!localAgent.colorTheme || !/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(localAgent.colorTheme))
          errors.push('Valid color theme is required');
        break;

      case 1:
        if (!localAgent.greeting?.trim()) errors.push('Greeting message is required');
        if (!localAgent.tone?.trim()) errors.push('Tone selection is required');
        if (!localAgent.customRules?.trim()) errors.push('Custom rules are required');
        if (!localAgent.languages?.trim()) errors.push('Language selection is required');
        if (!localAgent.conversationStarters?.length) errors.push('At least one conversation starter is required');
        break;

      case 2:
        const hasManualEntries = localAgent.manualEntry && localAgent.manualEntry.length > 0;
        const hasDocFiles = localAgent.docFiles && localAgent.docFiles.length > 0;
        const hasCsvFile = localAgent.csvFile !== null;

        if (!hasManualEntries && !hasDocFiles && !hasCsvFile) {
          errors.push('Please add at least one FAQ entry, document, or CSV file');
        }
        break;

      default:
        break;
    }

    return errors;
  }, [localAgent]);

  const handleNext = useCallback(async () => {
    if (isSubmitting) return;

    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsSubmitting(true);
    try {
      let result;

      switch (currentStep) {
        case 0:
          result = await dispatch(createAgentStep1({
            aiAgentName: localAgent.aiAgentName ?? '',
            agentDescription: localAgent.agentDescription ?? '',
            domainExpertise: localAgent.domainExpertise ?? '',
            colorTheme: localAgent.colorTheme ?? '#007bff',
            logoFile: (localAgent.logoFile && typeof localAgent.logoFile !== 'string') ? localAgent.logoFile : null,
            bannerFile: (localAgent.bannerFile && typeof localAgent.bannerFile !== 'string') ? localAgent.bannerFile : null,
            userId: ''
          })).unwrap();
          break;

        case 1:
          if (!localAgent._id) throw new Error('Agent ID is required');
          result = await dispatch(updateAgentStep2({
            id: localAgent._id,
            data: {
              greeting: localAgent.greeting,
              tone: localAgent.tone,
              customRules: localAgent.customRules,
              conversationStarters: localAgent.conversationStarters,
              languages: localAgent.languages,
              enableFreeText: localAgent.enableFreeText,
              enableBranchingLogic: localAgent.enableBranchingLogic,
              conversationFlow: localAgent.conversationFlow,
            }
          })).unwrap();
          break;

        case 2:
          if (!localAgent._id) throw new Error('Agent ID is required');
          result = await dispatch(updateAgentStep3({
            id: localAgent._id,
            data: {
              manualEntry: localAgent.manualEntry,
              docFiles: localAgent.docFiles?.filter((file): file is File => file instanceof File),
              csvFile: (localAgent.csvFile && typeof localAgent.csvFile !== 'string') ? localAgent.csvFile : null,
            }
          })).unwrap();
          break;

        default:
          break;
      }

      if (result) {
        setLocalAgent(result);
        toast.success(`Step ${currentStep + 1} saved successfully`);

        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setMaxCompleted(currentStep);
        }
      }

    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err.message || `Failed to save step ${currentStep + 1}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, localAgent, dispatch, isSubmitting, validateStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleFinalStep = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Assuming a final API call to complete the setup
      // For this example, we'll just show the dialog
      setIsDialogOpen(true);

    } catch (err: any) {
      toast.error(err.message || 'Failed to complete setup');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const handleStepChange = useCallback((step: number) => {
    // Only allow navigation to completed steps or the next logical step
    const currentCompletedStep = maxCompleted;
    if (step <= currentCompletedStep + 1) {
      setCurrentStep(step);
    } else {
      toast.error('Please complete the previous steps first');
    }
  }, [maxCompleted]);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    // Redirect to dashboard after closing the dialog
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  }, []);

  const currentStepConfig = steps[currentStep];
  const colorClasses = getColorClasses(currentStepConfig.color);
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  // Generate agent slug and URL
  const agentSlug = localAgent.aiAgentSlug ? generateSlug(localAgent?.aiAgentSlug) : 'your-agent';
  const hostWithPort = window.location.host; // returns "localhost:5000"
  const agentUrl = `http://${hostWithPort}/agent/${agentSlug}`;


  return (
    <DashboardLayout>
      <Toaster richColors position="top-right" />
      <div className="p-4">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="px-4 py-6 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create AI Agent
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Build your intelligent assistant step by step
                  </p>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={currentStep < steps.length - 1 ? handleNext : handleFinalStep}
                  disabled={isSubmitting || loading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting || loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                      {loading ? 'Loading...' : 'Saving...'}
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Complete Setup
                    </>
                  ) : (
                    <>
                      Save & Continue
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {Math.round(progressValue)}% Complete
                </span>
              </div>
              <Progress value={progressValue} className="h-2 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Steps Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 shadow-sm border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-600" />
                    Setup Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {steps.map((step, index) => {
                    const stepColor = getColorClasses(step.color);
                    const isActive = index === currentStep;
                    const isCompleted = index <= maxCompleted;
                    const isAccessible = index <= (maxCompleted + 1);

                    return (
                      <button
                        key={index}
                        onClick={() => isAccessible && handleStepChange(index)}
                        disabled={!isAccessible}
                        className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${isActive
                            ? `${stepColor.bg} ${stepColor.border} border-2 shadow-sm`
                            : isCompleted
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:shadow-sm'
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isActive
                                ? `${stepColor.activeBg} ${stepColor.text}`
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              React.cloneElement(step.icon, { className: "h-4 w-4" })
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold truncate ${isActive ? stepColor.text :
                                  isCompleted ? 'text-emerald-700 dark:text-emerald-400' :
                                    'text-gray-600 dark:text-gray-400'
                                }`}>
                                {step.title}
                              </span>
                              {isCompleted && (
                                <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                  Done
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Card className="shadow-sm border-gray-200 dark:border-gray-700 min-h-[600px]">
                <CardHeader className={`pb-4 border-b ${colorClasses.border} ${colorClasses.bg}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${colorClasses.activeBg}`}>
                      {React.cloneElement(currentStepConfig.icon, { className: "h-6 w-6" })}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        {currentStepConfig.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {currentStepConfig.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${colorClasses.text} border-current`}
                    >
                      Step {currentStep + 1}/{steps.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {React.createElement(currentStepConfig.component as any, {
                    agent: localAgent,
                    onAgentChange: handleAgentChange
                  })}
                </CardContent>
              </Card>

              {/* Navigation Footer */}
              <div className="flex justify-between items-center mt-6">
                <div>
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous Step
                    </Button>
                  )}
                </div>

                <Button
                  onClick={currentStep < steps.length - 1 ? handleNext : handleFinalStep}
                  disabled={isSubmitting || loading}
                  size="lg"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting || loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                      {loading ? 'Loading...' : 'Saving...'}
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Complete Setup
                    </>
                  ) : (
                    <>
                      Save & Continue
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                AI Agent Setup Complete
              </DialogTitle>
              <DialogDescription asChild>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Your AI agent "<span className="font-medium text-foreground">{
                      localAgent.aiAgentName || 'Your Agent'
                    }</span>" is now ready to use!
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-indigo-500" />
                      <span className="font-medium">Access URL:</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <span className="font-mono text-sm truncate flex-1">
                        {(() => {
                          try {
                            const url = new URL(agentUrl);
                            return (
                              <>
                                <span className="text-indigo-600 font-semibold">{url.hostname}</span>
                                <span className="text-gray-600">{url.pathname}</span>
                              </>
                            );
                          } catch {
                            return agentUrl;
                          }
                        })()}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2 shrink-0"
                        onClick={() => navigator.clipboard.writeText(agentUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Key className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">Agent Slug:</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <code className="font-mono text-sm text-amber-800 font-medium">
                        {agentSlug}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2 shrink-0 border-amber-300 bg-amber-100 hover:bg-amber-200"
                        onClick={() => navigator.clipboard.writeText(agentSlug)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <div className="text-xs text-blue-700">
                        <strong>Pro Tip:</strong> Share the URL with your team or embed the agent on your website using the slug.
                      </div>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(agentUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Agent
              </Button>
              <Button
                onClick={handleDialogClose}
                className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
              >
                <LayoutDashboardIcon className="h-4 w-4" />
                Go to Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}