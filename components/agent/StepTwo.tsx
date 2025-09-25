'use client';
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, AlertCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { IAIAgent } from '@/store/slice/agentSlice';
import { cn } from '@/lib/utils';

interface StepTwoProps {
  agent: IAIAgent;
  onAgentChange: (agent: Partial<IAIAgent>) => void;
}

export default function StepTwo({ agent, onAgentChange }: StepTwoProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof IAIAgent, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof IAIAgent, boolean>>>({});
  const [starterInput, setStarterInput] = useState('');

  const validateField = (field: keyof IAIAgent, value: any): string | undefined => {
    if (['greeting', 'tone', 'customRules', 'languages', 'conversationFlow'].includes(field) && !value?.trim()) {
      return `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
    }
    if (field === 'conversationStarters' && (!Array.isArray(value) || value.length === 0)) {
      return 'At least one conversation starter is required';
    }
    return undefined;
  };

  const handleChange = (field: keyof IAIAgent, value: any) => {
    onAgentChange({ [field]: value });
    // Validate the field immediately to update errors
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleBlur = (field: keyof IAIAgent) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, agent[field]) }));
  };

  const addStarter = useCallback(() => {
    if (!starterInput.trim() || (agent.conversationStarters?.length ?? 0) >= 4) return;
    if (agent.conversationStarters?.includes(starterInput)) {
      setErrors((prev) => ({ ...prev, conversationStarters: 'Duplicate conversation starter' }));
      return;
    }
    const newStarters = [...(agent.conversationStarters || []), starterInput];
    handleChange('conversationStarters', newStarters);
    setStarterInput('');
    setErrors((prev) => ({ ...prev, conversationStarters: undefined }));
  }, [agent.conversationStarters, starterInput]);

  const removeStarter = (starter: string) => {
    const newStarters = agent.conversationStarters?.filter((s) => s !== starter) || [];
    handleChange('conversationStarters', newStarters);
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="greeting" className="text-sm font-medium">Greeting <span className="text-red-500">*</span></Label>
            <Input
              id="greeting"
              value={agent.greeting || ''}
              onChange={(e) => handleChange('greeting', e.target.value)}
              onBlur={() => handleBlur('greeting')}
              placeholder="e.g., Hello! How can I assist you today?"
              className={cn(
                "h-12 rounded-xl border-2 transition-all",
                errors.greeting ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-200 dark:border-gray-600'
              )}
            />
            {errors.greeting && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.greeting}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="tone" className="text-sm font-medium">Tone <span className="text-red-500">*</span></Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 rounded-xl justify-between text-left font-normal",
                    errors.tone ? 'border-red-500 ring-4 ring-red-500/20' : ''
                  )}
                >
                  {agent.tone || 'Select Tone'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-white dark:bg-gray-800 border rounded-xl p-1">
                {['formal', 'informal', 'friendly', 'professional'].map((tone) => (
                  <DropdownMenuItem
                    key={tone}
                    onSelect={() => {
                      handleChange('tone', tone); // Update agent state and validate
                    }}
                    className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.tone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.tone}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="conversationStarters" className="text-sm font-medium">Conversation Starters <span className="text-red-500">*</span></Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={starterInput}
                onChange={(e) => setStarterInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStarter()}
                placeholder="Add a starter (max 4)"
                disabled={(agent.conversationStarters?.length ?? 0) >= 4}
                className="h-12 rounded-xl border-2"
              />
              <Button onClick={addStarter} disabled={!starterInput.trim() || (agent.conversationStarters?.length ?? 0) >= 4} className="h-12 rounded-xl">
                Add
              </Button>
            </div>
            {errors.conversationStarters && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.conversationStarters}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {agent.conversationStarters?.map((starter, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {starter}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStarter(starter)}
                    className="ml-2 text-red-500 p-0 h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="languages" className="text-sm font-medium">Languages <span className="text-red-500">*</span></Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 rounded-xl justify-between text-left font-normal",
                    errors.languages ? 'border-red-500 ring-4 ring-red-500/20' : ''
                  )}
                >
                  {agent.languages || 'Select Language'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-white dark:bg-gray-800 border rounded-xl p-1">
                {['English', 'Spanish', 'French'].map((language) => (
                  <DropdownMenuItem
                    key={language}
                    onSelect={() => {
                      handleChange('languages', language); // Update agent state and validate
                    }}
                    className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                  >
                    {language}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.languages && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.languages}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="customRules" className="text-sm font-medium">Custom Rules <span className="text-red-500">*</span></Label>
            <Textarea
              id="customRules"
              value={agent.customRules || ''}
              onChange={(e) => handleChange('customRules', e.target.value)}
              onBlur={() => handleBlur('customRules')}
              placeholder="e.g., Always respond politely and concisely."
              rows={4}
              className={cn(
                "min-h-[120px] rounded-xl border-2 transition-all",
                errors.customRules ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-200 dark:border-gray-600'
              )}
            />
            {errors.customRules && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.customRules}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="conversationFlow" className="text-sm font-medium">Conversation Flow <span className="text-red-500">*</span></Label>
            <Textarea
              id="conversationFlow"
              value={agent.conversationFlow || ''}
              onChange={(e) => handleChange('conversationFlow', e.target.value)}
              onBlur={() => handleBlur('conversationFlow')}
              placeholder="e.g., Greet user, ask about needs, provide options."
              rows={4}
              className={cn(
                "min-h-[120px] rounded-xl border-2 transition-all",
                errors.conversationFlow ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-200 dark:border-gray-600'
              )}
            />
            {errors.conversationFlow && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.conversationFlow}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="enableFreeText"
                checked={agent.enableFreeText}
                onCheckedChange={(checked) => handleChange('enableFreeText', checked)}
              />
              <Label htmlFor="enableFreeText" className="text-sm">Enable Free Text Questions</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="enableBranchingLogic"
                checked={agent.enableBranchingLogic}
                onCheckedChange={(checked) => handleChange('enableBranchingLogic', checked)}
              />
              <Label htmlFor="enableBranchingLogic" className="text-sm">Enable Branching Logic</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}