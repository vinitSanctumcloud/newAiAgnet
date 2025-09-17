import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

interface Persona {
  greeting: string;
  tone: string;
  customRules: string;
  conversationStarters: string[];
  languages: string;
  enableFreeText: boolean;
  enableBranchingLogic: boolean;
  conversationFlow: string;
}

interface StepTwoProps {
  onPersonaChange: (persona: Persona) => void;
  persona: Persona;
}

function StepTwo({ onPersonaChange, persona: initialPersona }: StepTwoProps) {
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [errors, setErrors] = useState<Partial<Persona & { duplicateStarter: string }>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Persona, boolean>>>({});
  const [customStarterInput, setCustomStarterInput] = useState('');

  const MAX_STARTER_LENGTH = 50;

  const validate = <K extends keyof Persona>(field: K, value: Persona[K]) => {
    if (field === 'conversationStarters') {
      if (!Array.isArray(value) || value.length === 0) {
        return 'At least one conversation starter is required.';
      }
      if (value.some((starter: string) => starter.length > MAX_STARTER_LENGTH)) {
        return `Conversation starters must be ${MAX_STARTER_LENGTH} characters or less.`;
      }
    } else if (typeof value === 'string' && !value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    }
    return '';
  };

  const handleChange = <K extends keyof Persona>(field: K, value: Persona[K]) => {
    const newPersona = { ...persona, [field]: value };
    setPersona(newPersona);
    onPersonaChange(newPersona);

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
    }
  };

  const handleBlur = (field: keyof Persona) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, persona[field]) }));
  };

  const addCustomStarter = () => {
    const trimmedInput = customStarterInput.trim();
    if (
      trimmedInput &&
      trimmedInput.length <= MAX_STARTER_LENGTH &&
      persona.conversationStarters.length < 4
    ) {
      if (persona.conversationStarters.some((starter) => starter.toLowerCase() === trimmedInput.toLowerCase())) {
        setErrors((prev) => ({ ...prev, duplicateStarter: 'This conversation starter already exists.' }));
        return;
      }
      const newStarters = [...persona.conversationStarters, trimmedInput];
      handleChange('conversationStarters', newStarters);
      setCustomStarterInput('');
      setErrors((prev) => ({ ...prev, duplicateStarter: '' }));
    }
  };

  const handleStarterInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomStarter();
      handleBlur('conversationStarters');
    }
  };

  const removeStarter = (starter: string) => {
    const newStarters = persona.conversationStarters.filter((s) => s !== starter);
    handleChange('conversationStarters', newStarters);
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300 w-full" data-testid="step-two-container">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">Customize Agent Persona</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Define the greeting, tone, rules, starters, and languages for your AI agent. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="greeting" className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Greeting Message <span className="text-red-500">*</span>
            </Label>
            <Input
              id="greeting"
              className={`w-full ${errors.greeting ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
              value={persona.greeting}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('greeting', e.target.value)}
              onBlur={() => handleBlur('greeting')}
              placeholder="e.g., Welcome to Example University Admissions!"
              title="Set the initial greeting message for the agent."
              data-testid="greeting-input"
              required
            />
            {errors.greeting && <p className="text-red-500 text-sm">{errors.greeting}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone" className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Response Tone <span className="text-red-500">*</span>
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id="tone"
                  variant="outline"
                  className={`w-full p-3 text-left justify-between ${errors.tone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 h-10 rounded-md`}
                  data-testid="tone-select"
                >
                  {persona.tone ? persona.tone.charAt(0).toUpperCase() + persona.tone.slice(1) : 'Select tone'}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1 z-50" align="start">
                <DropdownMenuLabel className="text-sm font-medium text-gray-600 dark:text-gray-400 px-3 py-1.5">Select Response Tone</DropdownMenuLabel>
                <DropdownMenuSeparator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                {['formal', 'friendly', 'student-focused'].map((tone) => (
                  <DropdownMenuItem
                    key={tone}
                    className="text-gray-900 dark:text-gray-100 cursor-pointer px-3 py-1.5 rounded-sm hover:bg-blue-100 dark:hover:bg-blue-900 focus:bg-blue-100 dark:focus:bg-blue-900 transition-colors duration-200"
                    onSelect={() => {
                      handleChange('tone', tone);
                      handleBlur('tone');
                    }}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.tone && <p className="text-red-500 text-sm">{errors.tone}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="conversationStarters" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Conversation Starters <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="conversationStarters"
                  className={`w-full ${errors.conversationStarters || errors.duplicateStarter ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                  value={customStarterInput}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_STARTER_LENGTH) {
                      setCustomStarterInput(e.target.value);
                      setErrors((prev) => ({ ...prev, duplicateStarter: '' }));
                    }
                  }}
                  onKeyPress={handleStarterInputKeyPress}
                  onBlur={() => handleBlur('conversationStarters')}
                  placeholder={`Enter a starter (max ${MAX_STARTER_LENGTH} chars, ${4 - persona.conversationStarters.length} left)`}
                  disabled={persona.conversationStarters.length >= 4}
                  data-testid="conversation-starters-input"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addCustomStarter}
                  disabled={!customStarterInput.trim() || persona.conversationStarters.length >= 4 || customStarterInput.length > MAX_STARTER_LENGTH}
                  className="h-10"
                >
                  Add
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{customStarterInput.length}/{MAX_STARTER_LENGTH} characters</p>
              {errors.conversationStarters && <p className="text-red-500 text-sm">{errors.conversationStarters}</p>}
              {errors.duplicateStarter && <p className="text-red-500 text-sm">{errors.duplicateStarter}</p>}
              {persona.conversationStarters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {persona.conversationStarters.map((starter) => (
                    <div key={starter} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                      {starter}
                      <button type="button" onClick={() => removeStarter(starter)} className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{4 - persona.conversationStarters.length} starters remaining</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Supported Languages <span className="text-red-500">*</span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    id="languages"
                    variant="outline"
                    className={`w-full p-3 text-left justify-between ${errors.languages ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 h-10 rounded-md`}
                    data-testid="languages-select"
                  >
                    {persona.languages || 'Select language'}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1 z-50" align="start">
                  <DropdownMenuLabel className="text-sm font-medium text-gray-600 dark:text-gray-400 px-3 py-1.5">Select Supported Language</DropdownMenuLabel>
                  <DropdownMenuSeparator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  {['English', 'Urdu'].map((language) => (
                    <DropdownMenuItem
                      key={language}
                      className="text-gray-900 dark:text-gray-100 cursor-pointer px-3 py-1.5 rounded-sm hover:bg-blue-100 dark:hover:bg-blue-900 focus:bg-blue-100 dark:focus:bg-blue-900 transition-colors duration-200"
                      onSelect={() => {
                        handleChange('languages', language);
                        handleBlur('languages');
                      }}
                    >
                      {language}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="customRules" className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Custom Rules <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="customRules"
              className={`w-full ${errors.customRules ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
              value={persona.customRules}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('customRules', e.target.value)}
              onBlur={() => handleBlur('customRules')}
              rows={4}
              placeholder="e.g., Rule 1: For admissions, mention current deadline."
              title="Add custom rules like starting responses with deadline reminders."
              data-testid="custom-rules-textarea"
              required
            />
            {errors.customRules && <p className="text-red-500 text-sm">{errors.customRules}</p>}
          </div>

          <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Conversation Design</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableFreeText" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Allow Free-text Questions
                  </Label>
                  <Switch
                    id="enableFreeText"
                    checked={persona.enableFreeText}
                    onCheckedChange={(checked) => handleChange('enableFreeText', checked)}
                    data-testid="free-text-switch"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable students/parents to ask free-text questions beyond the conversation starters.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableBranchingLogic" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Enable Branching Dialogue Logic
                  </Label>
                  <Switch
                    id="enableBranchingLogic"
                    checked={persona.enableBranchingLogic}
                    onCheckedChange={(checked) => handleChange('enableBranchingLogic', checked)}
                    data-testid="branching-logic-switch"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow the agent to ask follow-up questions to refine answers based on user responses.
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="conversationFlow" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Conversation Flow Design <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="conversationFlow"
                  className={`w-full ${errors.conversationFlow ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                  value={persona.conversationFlow}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('conversationFlow', e.target.value)}
                  onBlur={() => handleBlur('conversationFlow')}
                  rows={4}
                  placeholder="e.g., If user asks about admissions -> show deadlines, requirements, process steps..."
                  title="Define the conversation flow logic for branching dialogues."
                  data-testid="conversation-flow-textarea"
                />
                {errors.conversationFlow && <p className="text-red-500 text-sm">{errors.conversationFlow}</p>}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define how conversations should branch based on user responses. This helps the agent navigate complex queries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default StepTwo;