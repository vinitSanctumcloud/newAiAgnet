'use client';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Bot, Minimize2, MessageSquare, Star, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { IAIAgent } from '@/store/slice/agentSlice';
import { cn } from '@/lib/utils';

interface StepFourProps {
  agent: IAIAgent;
}

export default function StepFour({ agent }: StepFourProps) {
  const [userInput, setUserInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const conversationScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to handle logo file/URL
  useEffect(() => {
    let logoReader: FileReader | null = null;
    const setPreview = (file: string | File | null, setPreviewFn: (url: string | null) => void) => {
      if (!file) {
        setPreviewFn(null);
        return;
      }
      if (typeof file === 'string') {
        const domain = 'https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com';
        const isAbsoluteUrl = /^https?:\/\//i.test(file);
        const cleanedUrl = isAbsoluteUrl
          ? file
          : file.startsWith('/')
          ? `${domain}${file.replace(/([^:]\/)\/+/g, '$1')}`
          : `${domain}/${file.replace(/([^:]\/)\/+/g, '$1')}`;
        setPreviewFn(cleanedUrl);
      } else if (file instanceof File) {
        const reader = new FileReader();
        logoReader = reader;
        reader.onload = () => setPreviewFn(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    setPreview(agent.logoFile ?? null, setLogoUrl);
    return () => {
      if (logoReader) logoReader.abort();
    };
  }, [agent.logoFile]);

  // Derive dynamic colors from agent.colorTheme
  const primaryColor = agent.colorTheme || '#8B5CF6';
  const primaryColorDark = agent.colorTheme
    ? `#${Math.floor(parseInt(agent.colorTheme.slice(1), 16) * 0.7).toString(16).padStart(6, '0')}`
    : '#6D28D9';
  const primaryColorLight = agent.colorTheme ? `${agent.colorTheme}20` : '#8B5CF620';
  const primaryBorder = agent.colorTheme ? `${agent.colorTheme}30` : '#8B5CF630';
  const primaryColor300 = agent.colorTheme ? `${agent.colorTheme}80` : '#8B5CF680';

  // Get AI Agent name based on domain expertise
  const getAIAgentName = () => {
    if (agent.domainExpertise) {
      return `${agent.domainExpertise} Assistant`;
    }
    return `${agent.aiAgentName || 'AI Agent'} Assistant`;
  };

  const handleMicClick = () => {
    alert('Voice input functionality will be implemented in the future');
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // PromptCard component for displaying conversation starters
  const PromptCard = ({ text, onClick }: { text: string; onClick: () => void }) => (
    <div
      className="bg-white/80 backdrop-blur-sm p-2 rounded-xl border shadow-sm cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md group"
      style={{ borderColor: primaryBorder }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: primaryColorLight }}>
            <MessageSquare className="h-4 w-4" style={{ color: primaryColor }} />
          </div>
          <p className="text-sm font-medium text-gray-800">{text}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </div>
  );

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          <Button
            variant="outline"
            className="rounded-full w-24 h-24 p-0 bg-white border-2 flex items-center justify-center"
            style={{ borderColor: primaryBorder }}
            onClick={handleMinimize}
          >
            <Image
              src={logoUrl || '/default-logo.png'}
              alt="Agent Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-full"
            />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card
      className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-xl mx-auto h-[600px] sm:h-[650px]"
      style={{ border: `1px solid ${primaryBorder}` }}
    >
      <CardHeader
        className="p-4 text-white flex items-center justify-between relative z-10"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`,
          borderBottom: `1px solid ${primaryBorder}`,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
            <Image
              src={logoUrl || '/default-logo.png'}
              alt="Agent Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-cover"
            />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{getAIAgentName()}</CardTitle>
            <CardDescription className="text-xs text-white/80">{agent.aiAgentName || 'AI Agent Assistant'}</CardDescription>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 rounded-full hover:bg-white/20 text-white"
            onClick={handleMinimize}
            title="Minimize widget"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Initial welcome screen with prompts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={conversationScrollRef}>
          {/* Domain expertise section */}
          {agent.domainExpertise && (
            <div
              className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-2xl border shadow-sm"
              style={{ borderColor: primaryBorder }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4" style={{ color: primaryColor }} />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Specialized Knowledge</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                I specialize in {agent.domainExpertise.toLowerCase()} and can provide detailed information about related services, features, and opportunities.
              </p>
            </div>
          )}
          {/* Conversation starters */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" style={{ color: primaryColor }} />
              Quick questions to get started:
            </h3>
            <div className="grid gap-3">
              {agent.conversationStarters && agent.conversationStarters.length > 0 ? (
                agent.conversationStarters.slice(0, 4).map((starter: string, index: number) => (
                  <PromptCard
                    key={index}
                    text={starter}
                    onClick={() => setUserInput(starter)} // Sets input field instead of starting chat
                  />
                ))
              ) : (
                <>
                  <PromptCard
                    text="What services do you offer?"
                    onClick={() => setUserInput('What services do you offer?')}
                  />
                  <PromptCard
                    text="How do I get started?"
                    onClick={() => setUserInput('How do I get started?')}
                  />
                  <PromptCard
                    text="Tell me about support options"
                    onClick={() => setUserInput('Tell me about support options')}
                  />
                  <PromptCard
                    text="What are the key features?"
                    onClick={() => setUserInput('What are the key features?')}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {/* Fixed Input Area */}
        <div
          className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t shadow-lg z-10"
          style={{
            borderColor: primaryBorder,
          }}
        >
          <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl p-3 border border-gray-200/50 dark:border-gray-600/50 shadow-inner">
            <div className="flex items-center gap-2">
              {/* Message input */}
              <div className="flex-1 relative group">
                <Input
                  ref={inputRef}
                  className="w-full rounded-xl border-2 pr-12 pl-4 py-3 transition-all duration-200 placeholder-gray-400 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary group-hover:border-gray-300 shadow-sm"
                  style={{
                    borderColor: primaryBorder,
                    backgroundColor: 'white',
                  }}
                  value={userInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                  placeholder="Type your question here..."
                />
              </div>
              {/* Mic button */}
              <Button
                variant="ghost"
                size="sm"
                className="p-3 rounded-xl transition-all hover:bg-gray-200/50 dark:hover:bg-gray-600/50 hover:scale-105"
                style={{
                  color: primaryColor300,
                }}
                onClick={handleMicClick}
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}