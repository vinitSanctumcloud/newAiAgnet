'use client';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation'; // Import useParams to get URL parameters
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Mic, ArrowLeft, Bot, RefreshCw, Minimize2, MessageSquare, Star, ChevronRight } from 'lucide-react';
import { AgentInfo, Persona } from '@/lib/type';
import Link from 'next/link';

// Define stricter types for Message
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
  suggestedReply?: string;
}

 interface AgentInfo1 {
  _id?: string;
  aiAgentName: string;
  agentDescription: string;
  domainExpertise: string;
  colorTheme: string;
  logoFile: File | string | null;
  bannerFile: File | string | null;
  docFiles: string[] | File[] | undefined;
  manualEntry?: Array<{ question: string; answer: string; _id?: string }>;
  
}

const AIAgentPage: React.FC = () => {
  const { agentSlug } = useParams<{ agentSlug: string }>(); // Fetch agentSlug from URL path
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  console.log(agentSlug, "slug");
  const [persona, setPersona] = useState<Persona>({
    greeting: 'Hello! How can I assist you today?',
    conversationStarters: ['What services do you offer?', 'How do I get started?', 'Tell me about support options'],
    tone: 'Friendly',
    customRules: '',
    conversationFlow: '',
    languages: 'English',
    enableFreeText: true,
    enableBranchingLogic: true,
  });
  const [agentInfo, setAgentInfo] = useState<AgentInfo1>({
    aiAgentName: 'Default AI Agent',
    agentDescription: 'A versatile AI assistant',
    domainExpertise: 'General Assistance',
    colorTheme: '#007bff',
    manualEntry: [],
    logoFile: null,
    docFiles: [],
    bannerFile: null,
  });
  const [noAgentMessage, setNoAgentMessage] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sanitize URL to remove double slashes
  const sanitizeUrl = (url: string): string => url.replace(/([^:]\/)\/+/g, '$1');

  // Handle logo and banner previews
  useEffect(() => {
    let logoReader: FileReader | null = null;
    let bannerReader: FileReader | null = null;

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
          ? `${domain}${sanitizeUrl(file)}`
          : `${domain}/${sanitizeUrl(file)}`;
        setPreviewFn(cleanedUrl);
      } else if (file instanceof File) {
        const reader = new FileReader();
        if (file === agentInfo.logoFile) logoReader = reader;
        if (file === agentInfo.bannerFile) bannerReader = reader;
        reader.onload = () => setPreviewFn(reader.result as string);
        reader.readAsDataURL(file);
      }
    };

    setPreview(agentInfo.logoFile, setLogoPreview);
    setPreview(agentInfo.bannerFile, setBannerPreview);

    return () => {
      if (logoReader) logoReader.abort();
      if (bannerReader) bannerReader.abort();
    };
  }, [agentInfo.logoFile, agentInfo.bannerFile]);

  // Fetch agent data directly using the provided API
  useEffect(() => {
    if (!agentSlug) {
      setNoAgentMessage('No agent slug provided in the URL.');
      setLoading(false);
      return;
    }

    const fetchAgentData = async () => {
      setLoading(true);
      console.log(agentSlug, "slug");
      try {
        const response = await fetch(`https://qkkso80gw8ss0kscc8c4skkg.prod.sanctumcloud.com/api/auth/ai-agents/${agentSlug}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        console.log(result, "dataa");
        const agentData = result.data;

        if (!agentData) {
          throw new Error('Agent not found');
        }

        setAgentInfo({
          aiAgentName: agentData?.aiAgentName || 'Default AI Agent',
          agentDescription: agentData?.agentDescription || 'A versatile AI assistant',
          domainExpertise: agentData?.domainExpertise || 'General Assistance',
          colorTheme: agentData?.colorTheme || '#007bff',
          manualEntry: Array.isArray(agentData?.manualEntry)
            ? agentData.manualEntry.map((entry: any) => ({
                ...entry,
                _id: entry._id ? entry._id.toString() : undefined,
              }))
            : [],
          logoFile: agentData?.logoFile || null,
          docFiles: Array.isArray(agentData?.docFiles) && agentData?.docFiles?.length > 0
            ? typeof agentData?.docFiles[0] === 'string'
              ? agentData?.docFiles as string[]
              : agentData?.docFiles as File[]
            : [],
          bannerFile: agentData?.bannerFile || null,
        });

        setPersona({
          greeting: agentData?.greeting || 'Hello! How can I assist you today?',
          conversationStarters: Array.isArray(agentData?.conversationStarters) && agentData?.conversationStarters?.length > 0
            ? agentData?.conversationStarters
            : ['What services do you offer?', 'How do I get started?', 'Tell me about support options'],
          tone: agentData?.tone || 'Friendly',
          customRules: agentData?.customRules || '',
          conversationFlow: agentData?.conversationFlow || '',
          languages: agentData?.languages || 'English',
          enableFreeText: agentData?.enableFreeText ?? true,
          enableBranchingLogic: agentData?.enableBranchingLogic ?? true,
        });

        setNoAgentMessage(null);
      } catch (error: any) {
        console.error('Failed to fetch AI agent data:', error);
        setNoAgentMessage(
          error.message.includes('404') || error.message.includes('not found')
            ? 'It looks like you haven’t created an AI agent yet. Create one now to get started!'
            : `Failed to load agent data: ${error.message}. Please try again later.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [agentSlug]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages: Message[] = JSON.parse(savedMessages).map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
        setIsChatStarted(parsedMessages.length > 0);
      } catch (err) {
        console.error('Error parsing chat messages from localStorage:', err);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      } else {
        localStorage.removeItem('chatMessages');
      }
    } catch (err) {
      console.error('Error saving chat messages to localStorage:', err);
    }
  }, [messages]);

  // Derive dynamic colors from agentInfo.colorTheme
  const primaryColor = agentInfo.colorTheme || '#8B5CF6';
  const primaryColorDark = agentInfo.colorTheme
    ? `#${Math.floor(parseInt(agentInfo.colorTheme.slice(1), 16) * 0.7).toString(16).padStart(6, '0')}`
    : '#6D28D9';
  const primaryColorLight = agentInfo.colorTheme ? `${agentInfo.colorTheme}20` : '#8B5CF620';
  const primaryBorder = agentInfo.colorTheme ? `${agentInfo.colorTheme}30` : '#8B5CF630';
  const primaryColor300 = agentInfo.colorTheme ? `${agentInfo.colorTheme}80` : '#8B5CF680';

  // Get AI Agent name based on domain expertise
  const getAIAgentName = (): string => {
    if (agentInfo.domainExpertise) {
      return `${agentInfo.domainExpertise} Assistant`;
    }
    return `${agentInfo.aiAgentName || 'AI Agent'} Assistant`;
  };

  const handleStartChat = async (option?: string) => {
    const inputText = option || userInput.trim();
    if (!inputText) return;

    const initialMessages: Message[] = [
      {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        timestamp: new Date(),
      },
    ];

    setMessages(initialMessages);
    setIsChatStarted(true);
    setUserInput('');

    setIsTyping(true);
    try {
      const apiResponse = await fetch(
        'https://n8n-c4wwksg84c84c84coo4gws4o.prod.sanctumcloud.com/webhook/bcaed4f1-9898-4675-ab5c-de410c16d7bf',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputText }),
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const botResponse = data.response || data.message || data.text || "Sorry, I couldn't process your request.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        suggestedReply: "Tell me more about the service options",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error calling chat API:', err);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatStarted, isTyping]);

  const handleSend = async (customInput?: string) => {
    const inputText = customInput || userInput.trim();
    if (!inputText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      const apiResponse = await fetch(
        'https://n8n-c4wwksg84c84c84coo4gws4o.prod.sanctumcloud.com/webhook/bcaed4f1-9898-4675-ab5c-de410c16d7bf',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputText }),
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const botResponse = data.response || data.message || data.text || "Sorry, I couldn't process your request.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Explore services', 'Contact support', 'Request info'],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error calling chat API:', err);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const handleSuggestedReply = (reply: string) => {
    handleSend(reply);
  };

  const handleMicClick = () => {
    alert('Voice input functionality will be implemented in the future');
  };

  const handleRefresh = () => {
    setMessages([]);
    setUserInput('');
    setIsTyping(false);
    setIsChatStarted(false);
    localStorage.removeItem('chatMessages');
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleBackButton = () => {
    setIsChatStarted(false);
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const handleStarterClick = (starter: string) => {
    handleStartChat(starter);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-t-primary border-gray-200 rounded-full animate-spin" style={{ borderTopColor: primaryColor }} />
          <p className="mt-2 text-gray-700">Loading agent data...</p>
        </div>
      </div>
    );
  }

  if (noAgentMessage) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-gray-700 mb-4">{noAgentMessage}</p>
          <Link href="/aiagent">
            <Button
              className="rounded-xl transition-all hover:scale-105 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`,
              }}
            >
              Create Agent
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          className="rounded-full w-24 h-24 p-0 bg-white border-2 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          style={{ borderColor: primaryBorder }}
          onClick={handleMinimize}
        >
          {logoPreview ? (
            <Image
              src={logoPreview}
              alt="Agent Logo"
              width={40}
              height={40}
              className="object-contain rounded-full"
            />
          ) : (
            <Bot className="h-8 w-8" style={{ color: primaryColor }} />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-white rounded-2xl flex flex-col overflow-hidden relative h-[600px] shadow-xl"
        style={{ border: `1px solid ${primaryBorder}` }}
      >
        {/* Fixed Header */}
        <div
          className="p-4 text-white flex items-center justify-between relative z-10"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`,
            position: 'sticky',
            top: 0,
            borderBottom: `1px solid ${primaryBorder}`,
          }}
        >
          <div className="flex items-center gap-2">
            {isChatStarted && (
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full hover:bg-white/20 text-white"
                onClick={handleBackButton}
                title="Back to menu"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  width={40}
                  height={40}
                  className="object-contain"
                  unoptimized={logoPreview.startsWith('data:')}
                />
              ) : (
                <Bot className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{getAIAgentName()}</h2>
              <p className="text-xs text-white/80">{agentInfo.aiAgentName || 'AI Agent Assistant'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-full hover:bg-white/20 text-white"
              onClick={handleRefresh}
              title="Refresh chat"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
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
        </div>

        {/* Scrollable Content */}
        {!isChatStarted ? (
          <div
            ref={conversationScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              background: `linear-gradient(to bottom, ${primaryColorLight}, ${primaryColorLight.replace('20', '10')})`,
            }}
          >
            {agentInfo.domainExpertise && (
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border shadow-sm" style={{ borderColor: primaryBorder }}>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4" style={{ color: primaryColor }} />
                  <h3 className="text-sm font-semibold text-gray-800">Specialized Knowledge</h3>
                </div>
                <p className="text-xs text-gray-600">
                  I specialize in {agentInfo.domainExpertise.toLowerCase()} and can provide detailed information about related services, features, and opportunities.
                </p>
              </div>
            )}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" style={{ color: primaryColor }} />
                Quick questions to get started:
              </h3>
              <div className="grid gap-3">
                {persona.conversationStarters && persona.conversationStarters.length > 0 ? (
                  persona.conversationStarters.slice(0, 4).map((starter: string, index: number) => (
                    <PromptCard
                      key={index}
                      text={starter}
                      onClick={() => handleStarterClick(starter)}
                    />
                  ))
                ) : (
                  <>
                    <PromptCard
                      text="What services do you offer?"
                      onClick={() => handleStarterClick('What services do you offer?')}
                    />
                    <PromptCard
                      text="How do I get started?"
                      onClick={() => handleStarterClick('How do I get started?')}
                    />
                    <PromptCard
                      text="Tell me about support options"
                      onClick={() => handleStarterClick('Tell me about support options')}
                    />
                    <PromptCard
                      text="What are the key features?"
                      onClick={() => handleStarterClick('What are the key features?')}
                    />
                  </>
                )}
              </div>
            </div>
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div
            ref={conversationScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              background: `linear-gradient(to bottom, ${primaryColorLight}, ${primaryColorLight.replace('20', '10')})`,
            }}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl shadow-md ${
                        message.sender === 'user'
                          ? 'rounded-br-md'
                          : 'rounded-bl-md border backdrop-blur-sm'
                      }`}
                      style={{
                        backgroundColor: message.sender === 'user' ? primaryColor : 'white',
                        borderColor: message.sender === 'user' ? 'transparent' : primaryBorder,
                      }}
                    >
                      <p className={`break-words text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-700'}`}>
                        {message.text.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < message.text.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                      <span
                        className={`text-xs mt-1 block text-right ${
                          message.sender === 'user' ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                  {message.quickReplies && message.sender === 'bot' && (
                    <div className="flex justify-start mt-2 gap-2 flex-wrap">
                      {message.quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="px-3 py-1 text-xs rounded-full transition-all hover:scale-105 shadow-sm"
                          style={{
                            borderColor: primaryColor300,
                            color: primaryColor,
                            backgroundColor: 'white',
                          }}
                          onClick={() => handleQuickReply(reply)}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                  {message.suggestedReply && message.sender === 'user' && (
                    <div className="flex justify-start mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-3 py-1 text-xs rounded-full border transition-all hover:scale-105 shadow-sm"
                        style={{
                          color: primaryColor,
                          borderColor: primaryBorder,
                          backgroundColor: 'white',
                        }}
                        onClick={() => handleSuggestedReply(message.suggestedReply!)}
                      >
                        💡 {message.suggestedReply}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="p-3 rounded-2xl rounded-bl-md border shadow-sm backdrop-blur-sm"
                    style={{
                      backgroundColor: 'white',
                      borderColor: primaryBorder,
                    }}
                  >
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: primaryColor, animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: primaryColor, animationDelay: '0.4s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Fixed Input Field */}
        <div
          className="p-4 bg-white/90 backdrop-blur-sm border-t shadow-lg z-10"
          style={{
            borderColor: primaryBorder,
            position: 'sticky',
            bottom: 0,
          }}
        >
          <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-200/50 shadow-inner">
            <div className="flex items-center gap-2">
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
                  placeholder={isChatStarted ? 'Type your message...' : 'Type your question here...'}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userInput.trim()) {
                      isChatStarted ? handleSend() : handleStartChat(userInput);
                    }
                  }}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-3 rounded-xl transition-all hover:bg-gray-200/50 hover:scale-105"
                style={{ color: primaryColor300 }}
                onClick={handleMicClick}
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                className="relative rounded-xl w-10 h-10 p-0 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`,
                  boxShadow: `0 4px 12px ${primaryColor}20`,
                }}
                onClick={() => (isChatStarted ? handleSend() : handleStartChat(userInput))}
                disabled={!userInput.trim()}
              >
                <Send
                  className={`h-5 w-5 transition-transform duration-200 ${userInput.trim() ? 'rotate-0' : 'rotate-0 opacity-50'}`}
                  style={{ color: 'white' }}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentPage;