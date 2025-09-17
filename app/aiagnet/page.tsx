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
    userId: '', // Added to match AgentInfo interface
    aiAgentName: '',
    agentDescription: '',
    domainExpertise: '',
    colorTheme: '#007bff',
    docFiles: [],
    manualEntry: [],
    logoFile: null,
    bannerFile: null,
    csvFile: null,
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
              userId: agent.userId || session.user.id, // Ensure userId is set
              aiAgentName: agent.aiAgentName || '',
              agentDescription: agent.agentDescription || '',
              domainExpertise: agent.domainExpertise || '',
              colorTheme: agent.colorTheme || '#007bff',
              docFiles: agent.docFiles || [],
              manualEntry: agent.manualEntry || [],
              logoFile: agent.logoFile || null,
              bannerFile: agent.bannerFile || null,
              csvFile: agent.csvFile || null,
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
            // No agent found, initialize with default values and userId
            setAgentInfo((prev) => ({
              ...prev,
              userId: session.user.id, // Set userId even if no agent exists
            }));
            // Optionally, you can reset persona and currentStep to defaults
            setPersona({
              greeting: '',
              tone: '',
              customRules: '',
              conversationStarters: [],
              languages: '',
              enableFreeText: true,
              enableBranchingLogic: true,
              conversationFlow: '',
            });
            setCurrentStep(0);
            // Optionally, show a toast to inform the user
            toast.info('No existing agent found. Start creating your new AI agent!', { id: 'no-agent-info' });
          }
        } catch (error) {
          console.error('Error fetching agent data:', error);
          toast.error('Failed to fetch agent data. Please try again.', { id: 'fetch-error' });
          // Ensure userId is set even on error
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
      let response;
      const formData = new FormData();
      formData.append('userId', session.user.id);

      if (currentStep === 0) {
        // Step 1 submission
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
        response = await fetch('/api/agent-step1', { method: 'POST', body: formData });
      } else if (currentStep === 2) {
        // Step 2 submission
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
        response = await fetch('/api/agent-step2', { method: 'POST', body: formData });
      } else if (currentStep === 3) {
        // Step 3 submission
        if (!agentInfo.manualEntry.length && !agentInfo.csvFile && !agentInfo.docFiles.length) {
          toast.error('Please provide at least one FAQ or file in Step 3.', { id: 'step3-error' });
          setIsSubmitting(false);
          return;
        }
        formData.append('manualEntry', JSON.stringify(agentInfo.manualEntry));
        if (agentInfo.csvFile instanceof File) {
          formData.append('csvFile', agentInfo.csvFile);
        } else if (typeof agentInfo.csvFile === 'string') {
          formData.append('csvFileUrl', agentInfo.csvFile);
        }
        if (Array.isArray(agentInfo.docFiles)) {
          agentInfo.docFiles.forEach((file, index) => {
            if (file instanceof File) {
              formData.append('docFiles', file);
            } else if (typeof file === 'string') {
              formData.append(`docFilesUrl[${index}]`, file);
            }
          });
        }
        response = await fetch('/api/agent-step3', { method: 'POST', body: formData });
      } else if (currentStep === 4) {
        // Step 4: Fetch data for review
        response = await fetch(`/api/getAgent?userId=${session.user.id}`);
      }

      if (!response) {
        throw new Error('No response from API');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      if (currentStep === 0) {
        toast.success('Step 1 completed! Moving to Step 2.', { id: 'step1-success' });
      }

      if (currentStep < 3) {
        setCurrentStep((prev) => Math.min(prev + 1, 3));
        // Refetch agent data for Steps 1-3
        const fetchResponse = await fetch(`/api/getAgent?userId=${session.user.id}`);
        const fetchResult = await fetchResponse.json();
        if (fetchResult.success && fetchResult.data) {
          const agent: Agent = fetchResult.data;
          setAgentInfo({
            userId: agent.userId || session.user.id, // Ensure userId is set
            aiAgentName: agent.aiAgentName || '',
            agentDescription: agent.agentDescription || '',
            domainExpertise: agent.domainExpertise || '',
            colorTheme: agent.colorTheme || '#007bff',
            docFiles: agent.docFiles || [],
            manualEntry: agent.manualEntry || [],
            logoFile: agent.logoFile || null,
            bannerFile: agent.bannerFile || null,
            csvFile: agent.csvFile || null,
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
        } else {
          // If no agent data is returned, maintain current state but ensure userId is set
          setAgentInfo((prev) => ({
            ...prev,
            userId: session.user.id,
          }));
        }
      } else {
        // Step 4: Update state with fetched data
        setAgentInfo({
          userId: data?.agent?.userId || session.user.id, // Ensure userId is set
          aiAgentName: data?.agent?.aiAgentName || '',
          agentDescription: data?.agent?.agentDescription || '',
          domainExpertise: data?.agent?.domainExpertise || '',
          colorTheme: data?.agent?.colorTheme || '#007bff',
          docFiles: data?.agent?.docFiles || [],
          manualEntry: data?.agent?.manualEntry || [],
          logoFile: data?.agent?.logoFile || null,
          bannerFile: data?.agent?.bannerFile || null,
          csvFile: data?.agent?.csvFile || null,
        });
        setPersona({
          greeting: data?.agent?.greeting || '',
          tone: data?.agent?.tone || '',
          customRules: data?.agent?.customRules || '',
          conversationStarters: data?.agent?.conversationStarters || [],
          languages: data?.agent?.languages || '',
          enableFreeText: data?.agent?.enableFreeText ?? true,
          enableBranchingLogic: data?.agent?.enableBranchingLogic ?? true,
          conversationFlow: data?.agent?.conversationFlow || '',
        });
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
      // Fetch the latest agent data from the server
      const response = await fetch(`/api/getAgent?userId=${session.user.id}`);
      const result = await response.json();
      if (result.success && result.data) {
        const agent: Agent = result.data;
        // Update local state with server data
        setAgentInfo({
          userId: agent.userId || session.user.id, // Ensure userId is set
          aiAgentName: agent.aiAgentName || '',
          agentDescription: agent.agentDescription || '',
          domainExpertise: agent.domainExpertise || '',
          colorTheme: agent.colorTheme || '#007bff',
          docFiles: agent.docFiles || [],
          manualEntry: agent.manualEntry || [],
          logoFile: agent.logoFile || null,
          bannerFile: agent.bannerFile || null,
          csvFile: agent.csvFile || null,
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
      } else {
        // No agent found, reset to defaults but keep userId
        setAgentInfo((prev) => ({
          ...prev,
          userId: session.user.id,
        }));
        setPersona({
          greeting: '',
          tone: '',
          customRules: '',
          conversationStarters: [],
          languages: '',
          enableFreeText: true,
          enableBranchingLogic: true,
          conversationFlow: '',
        });
      }
      // Move to the previous step
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