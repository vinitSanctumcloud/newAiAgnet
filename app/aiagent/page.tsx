'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';
import DashboardLayout from '../components/DashboardLayout';
import Stepper, { Step } from '@/components/Stepper';
import StepOne from '../components/agent/StepOne';
import StepTwo from '../components/agent/StepTwo';
import StepThree from '../components/agent/StepThree';
import StepFour from '../components/agent/StepFour';
import { AgentInfo, Agent, Persona } from '@/app/lib/type';

function AiAgentInner() {
  const { data: session, status } = useSession();
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

  // Fetch agent data when the component mounts and user is authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchAgentData = async () => {
        try {
          const response = await fetch(`/api/getAgent?userId=${session.user.id}`);
          const result = await response.json();
          if (result.success && result.data) {
            const agent: Agent = result.data;
            setAgentInfo({
              userId: agent.userId || session.user.id,
              aiAgentName: agent.aiAgentName || '',
              agentDescription: agent.agentDescription || '',
              domainExpertise: agent.domainExpertise || '',
              colorTheme: agent.colorTheme || '#007bff',
              docFiles: agent.docFiles || [],
              manualEntry: agent.manualEntry || [],
              logoFile: agent.logoFile || null,
              bannerFile: agent.bannerFile || null,
            });
            setPersona({
              greeting: agent.greeting || '',
              tone: agent.tone || '',
              customRules: agent.customRules || '',
              conversationStarters: agent.conversationStarters || [],
              languages: agent.languages || '',
              enableFreeText: agent.enableFreeText ?? true,
              enableBranchingLogic: agent.enableBranchingLogic ?? true,
              conversationFlow: agent.conversationFlow || '',
            });
            setCurrentStep(agent.currentStep || 0);
          } else {
            setAgentInfo((prev) => ({
              ...prev,
              userId: session.user.id,
            }));
            toast.info('No existing agent found. Start creating your new AI agent!', { id: 'no-agent-info' });
          }
        } catch (error) {
          console.error('Error fetching agent data:', error);
          toast.error('Failed to fetch agent data. Please try again.', { id: 'fetch-error' });
          setAgentInfo((prev) => ({
            ...prev,
            userId: session.user.id,
          }));
        }
      };
      fetchAgentData();
    }
  }, [status, session]);

  const handleAgentChange = (agent: AgentInfo) => {
    setAgentInfo(agent);
  };

  const handleNext = useCallback(async () => {
    if (isSubmitting || !session?.user?.id) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('userId', session.user.id);

      if (currentStep === 0) {
        // Validate Step 1 required fields
        if (!agentInfo.aiAgentName || !agentInfo.agentDescription || !agentInfo.domainExpertise || !agentInfo.logoFile) {
          toast.error('Please fill all required fields in Step 1.', { id: 'step1-error' });
          setIsSubmitting(false);
          return;
        }
        formData.append('aiAgentName', agentInfo.aiAgentName);
        formData.append('agentDescription', agentInfo.agentDescription);
        formData.append('domainExpertise', agentInfo.domainExpertise);
        formData.append('colorTheme', agentInfo.colorTheme);
        if (agentInfo.logoFile instanceof File) {
          formData.append('logoFile', agentInfo.logoFile);
        } else if (typeof agentInfo.logoFile === 'string') {
          formData.append('logoFileUrl', agentInfo.logoFile);
        }
        if (agentInfo.bannerFile instanceof File) {
          formData.append('bannerFile', agentInfo.bannerFile);
        } else if (typeof agentInfo.bannerFile === 'string') {
          formData.append('bannerFileUrl', agentInfo.bannerFile);
        }
        const response = await fetch('/api/agent-step1', { method: 'POST', body: formData });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to save Step 1 data');
        }
        toast.success('Step 1 completed! Moving to Step 2.', { id: 'step1-success' });
      } else if (currentStep === 2) {
        // Validate Step 2
        if (!persona.greeting || !persona.tone || !persona.customRules || !persona.languages || !persona.conversationStarters.length) {
          toast.error('Please fill all required fields in Step 2.', { id: 'step2-error' });
          setIsSubmitting(false);
          return;
        }
        formData.append('greeting', persona.greeting);
        formData.append('tone', persona.tone);
        formData.append('customRules', persona.customRules);
        formData.append('conversationStarters', JSON.stringify(persona.conversationStarters));
        formData.append('languages', persona.languages);
        formData.append('enableFreeText', persona.enableFreeText.toString());
        formData.append('enableBranchingLogic', persona.enableBranchingLogic.toString());
        formData.append('conversationFlow', persona.conversationFlow);
        const response = await fetch('/api/agent-step2', { method: 'POST', body: formData });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to save Step 2 data');
        }
      } else if (currentStep === 3) {
        // Validate Step 3
        if (!agentInfo.manualEntry.length && !agentInfo.docFiles.length) {
          toast.error('Please provide at least one FAQ or file in Step 3.', { id: 'step3-error' });
          setIsSubmitting(false);
          return;
        }
        formData.append('manualEntry', JSON.stringify(agentInfo.manualEntry));
        if (Array.isArray(agentInfo.docFiles)) {
          agentInfo.docFiles.forEach((file, index) => {
            if (file instanceof File) {
              formData.append('docFiles', file);
            } else if (typeof file === 'string') {
              formData.append(`docFilesUrl[${index}]`, file);
            }
          });
        }
        const response = await fetch('/api/agent-step3', { method: 'POST', body: formData });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to save Step 3 data');
        }
      } else if (currentStep === 4) {
        // Step 4: Fetch data for review
        const response = await fetch(`/api/getAgent?userId=${session.user.id}`);
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch agent data');
        }
        setAgentInfo({
          userId: data.agent?.userId || session.user.id,
          aiAgentName: data.agent?.aiAgentName || '',
          agentDescription: data.agent?.agentDescription || '',
          domainExpertise: data.agent?.domainExpertise || '',
          colorTheme: data.agent?.colorTheme || '#007bff',
          docFiles: data.agent?.docFiles || [],
          manualEntry: data.agent?.manualEntry || [],
          logoFile: data.agent?.logoFile || null,
          bannerFile: data.agent?.bannerFile || null,
        });
        setPersona({
          greeting: data.agent?.greeting || '',
          tone: data.agent?.tone || '',
          customRules: data.agent?.customRules || '',
          conversationStarters: data.agent?.conversationStarters || [],
          languages: data.agent?.languages || '',
          enableFreeText: data.agent?.enableFreeText ?? true,
          enableBranchingLogic: data.agent?.enableBranchingLogic ?? true,
          conversationFlow: data.agent?.conversationFlow || '',
        });
      }

      // Move to the next step (unless on the final step)
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error submitting step:', error);
      toast.error(`Failed to save Step ${currentStep + 1} data: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`, { id: 'step-error' });
    } finally {
      setIsSubmitting(false);
    }
  }, [agentInfo, persona, currentStep, isSubmitting, session]);

  const handleBack = useCallback(async () => {
    if (isSubmitting || !session?.user?.id) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/getAgent?userId=${session.user.id}`);
      const result = await response.json();
      if (result.success && result.data) {
        const agent: Agent = result.data;
        setAgentInfo({
          userId: agent.userId || session.user.id,
          aiAgentName: agent.aiAgentName || '',
          agentDescription: agent.agentDescription || '',
          domainExpertise: agent.domainExpertise || '',
          colorTheme: agent.colorTheme || '#007bff',
          docFiles: agent.docFiles || [],
          manualEntry: agent.manualEntry || [],
          logoFile: agent.logoFile || null,
          bannerFile: agent.bannerFile || null,
        });
        setPersona({
          greeting: agent.greeting || '',
          tone: agent.tone || '',
          customRules: agent.customRules || '',
          conversationStarters: agent.conversationStarters || [],
          languages: agent.languages || '',
          enableFreeText: agent.enableFreeText ?? true,
          enableBranchingLogic: agent.enableBranchingLogic ?? true,
          conversationFlow: agent.conversationFlow || '',
        });
      }
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Error fetching agent data on back:', error);
      toast.error(`Failed to load previous step data: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`, { id: 'back-error' });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, session]);

  const handleFinalStep = useCallback(() => {
    toast.success('Agent configuration review completed!', { id: 'final-success' });
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in to access the AI agent configuration.</div>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-center">
        <div className="w-full flex flex-col overflow-auto">
          <Toaster richColors position="top-right" />
          <Stepper
            initialStep={currentStep}
            onStepChange={(step) => setCurrentStep(step)}
            onFinalStepCompleted={handleFinalStep}
            backButtonText="Previous"
            nextButtonText={currentStep === 3 ? 'Complete' : 'Next'}
            onNext={handleNext}
            onBack={handleBack}
            className="flex-grow"
          >
            <Step>
              <StepOne onAgentChange={handleAgentChange} agentInfo={agentInfo} />
            </Step>
            <Step>
              <StepTwo onPersonaChange={setPersona} persona={persona} />
            </Step>
            <Step>
              <StepThree onAgentChange={handleAgentChange} agentInfo={agentInfo} />
            </Step>
            <Step>
              <StepFour persona={persona} agentInfo={agentInfo} />
            </Step>
          </Stepper>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AiAgentPage() {
  return <AiAgentInner />;
}