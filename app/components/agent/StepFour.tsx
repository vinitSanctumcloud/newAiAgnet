import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Mic, ArrowLeft, Bot, RefreshCw, Minimize2, Calendar, MapPin, BookOpen, GraduationCap, MessageSquare, User, Star, ChevronRight } from 'lucide-react';
import { AgentInfo, Persona } from '@/app/lib/type'; // Import AgentInfo and Persona

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
  suggestedReply?: string;
}

function StepFour({ persona, agentInfo }: { persona: Persona; agentInfo: AgentInfo }) {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive dynamic colors from agentInfo.colorTheme
  const primaryColor = agentInfo.colorTheme || '#8B5CF6';
  const primaryColorDark = agentInfo.colorTheme ? `#${Math.floor(parseInt(agentInfo.colorTheme.slice(1), 16) * 0.7).toString(16).padStart(6, '0')}` : '#6D28D9';
  const primaryColorLight = agentInfo.colorTheme ? `${agentInfo.colorTheme}20` : '#8B5CF620';
  const primaryBorder = agentInfo.colorTheme ? `${agentInfo.colorTheme}30` : '#8B5CF630';
  const primaryColor200 = agentInfo.colorTheme ? `${agentInfo.colorTheme}CC` : '#8B5CF6CC';
  const primaryColor300 = agentInfo.colorTheme ? `${agentInfo.colorTheme}80` : '#8B5CF680';

  // Get AI Agent name based on domain expertise
  const getAIAgentName = () => {
    if (agentInfo.domainExpertise) {
      return `${agentInfo.domainExpertise} Assistant`;
    }
    return `${agentInfo.aiAgentName || 'AI Agent'} Assistant`;
  };

  const findMatchingFAQ = (input: string) => {
    const lowerInput = input.toLowerCase();
    return agentInfo.manualEntry.find(faq => faq.question.toLowerCase().includes(lowerInput)) ||
           agentInfo.manualEntry.find(faq => faq.answer.toLowerCase().includes(lowerInput));
  };

  const handleStartChat = (option?: string) => {
    const starterText = option || userInput.trim();
    
    const initialMessages: Message[] = [{
      id: '1',
      text: persona.greeting || `Hi there! I'm ${getAIAgentName()}, here to help you learn more about our programs and services. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: persona.conversationStarters && persona.conversationStarters.length > 0 
        ? persona.conversationStarters.slice(0, 3) 
        : ['Programs offered', 'Service details', 'Support options']
    }];
    
    if (option) {
      initialMessages.push({
        id: '2',
        text: option,
        sender: 'user',
        timestamp: new Date()
      });
    }
    
    setMessages(initialMessages);
    setIsChatStarted(true);
    
    if (option) {
      setIsTyping(true);
      setTimeout(() => {
        const matchingFAQ = findMatchingFAQ(option);
        let botResponse = matchingFAQ 
          ? `${matchingFAQ.answer} (From FAQ: ${matchingFAQ.question})`
          : "Great question! I'd be happy to help with that. Our AI agent offers a wide range of services to match your needs and goals.";
        const botMessage: Message = {
          id: '3',
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
          suggestedReply: "Tell me more about the service options"
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatStarted, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (customInput?: string) => {
    const inputText = customInput || userInput.trim();
    if (!inputText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      const matchingFAQ = findMatchingFAQ(inputText);
      let botResponse = matchingFAQ 
        ? `${matchingFAQ.answer} (From FAQ: ${matchingFAQ.question})`
        : "Thanks for your question! Our AI agent is designed to provide comprehensive support and information tailored to your needs.";
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Explore services', 'Contact support', 'Request info']
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleBackButton = () => {
    setIsChatStarted(false);
    setMessages([]);
  };

  const handleStarterClick = (starter: string) => {
    handleStartChat(starter);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // InfoCard component for displaying agent info in welcome screen
  const InfoCard = ({ icon: Icon, title, value }: { icon: any, title: string, value: string }) => (
    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border shadow-sm flex items-start gap-3" style={{ borderColor: primaryBorder }}>
      <div className="p-2 rounded-lg" style={{ backgroundColor: primaryColorLight }}>
        <Icon className="h-4 w-4" style={{ color: primaryColor }} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-700">{title}</p>
        <p className="text-sm font-semibold" style={{ color: primaryColor }}>{value}</p>
      </div>
    </div>
  );

  // PromptCard component for displaying conversation starters
  const PromptCard = ({ text, onClick }: { text: string, onClick: () => void }) => (
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
            {agentInfo.logoFile ? (
              <img 
                src={typeof agentInfo.logoFile === 'string' ? agentInfo.logoFile : URL.createObjectURL(agentInfo.logoFile)} 
                alt="Agent Logo" 
                className="w-10 h-10 object-contain rounded-full"
              />
            ) : (
              <Bot className="h-8 w-8" style={{ color: primaryColor }} />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      {/* Main chat widget container */}
      <div 
        className="w-full max-w-md bg-white rounded-2xl flex flex-col overflow-hidden relative h-[600px]" 
        style={{ border: `1px solid ${primaryBorder}` }}
      >
        {/* Header with back button next to logo */}
        <div 
          className="p-4 text-white flex items-center justify-between relative"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`
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
              {agentInfo.logoFile ? (
                <img 
                  src={typeof agentInfo.logoFile === 'string' ? agentInfo.logoFile : URL.createObjectURL(agentInfo.logoFile)} 
                  alt="Agent Logo" 
                  className="w-10 h-10 object-cover"
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

          {/* Action buttons */}
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

        {!isChatStarted ? (
          // Initial welcome screen
          <div className="flex flex-col h-full">
            <div 
              ref={conversationScrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ 
                background: `linear-gradient(to bottom, ${primaryColorLight}, ${primaryColorLight.replace('20', '10')})`,
                minHeight: '0'
              }}
            >
              
            
              {/* Domain expertise section */}
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

              {/* Conversation starters */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" style={{ color: primaryColor }} />
                  Quick questions to get started:
                </h3>
                <div className="grid gap-3">
                  {persona.conversationStarters && persona.conversationStarters.length > 0 ? (
                    persona.conversationStarters.slice(0, 4).map((starter: string, index: React.Key | null | undefined) => (
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
                        onClick={() => handleStarterClick("What services do you offer?")} 
                      />
                      <PromptCard 
                        text="How do I get started?" 
                        onClick={() => handleStartChat("How do I get started?")} 
                      />
                      <PromptCard 
                        text="Tell me about support options" 
                        onClick={() => handleStartChat("Tell me about support options")} 
                      />
                      <PromptCard 
                        text="What are the key features?" 
                        onClick={() => handleStartChat("What are the key features?")} 
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Input area for initial free text entry */}
            <div className="p-4 bg-white/90 backdrop-blur-sm border-t shadow-lg" style={{ borderColor: primaryBorder }}>
              <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-200/50 shadow-inner">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative group">
                    <Input
                      ref={inputRef}
                      className="w-full rounded-xl border-2 pr-12 pl-4 py-3 transition-all duration-200 placeholder-gray-400 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary group-hover:border-gray-300 shadow-sm"
                      style={{
                        borderColor: primaryBorder,
                        backgroundColor: 'white'
                      }}
                      value={userInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                      placeholder="Type your question here..."
                      onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                    />
                  </div>
                  
                  <Button
                    className="relative rounded-xl w-10 h-10 p-0 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`,
                      boxShadow: `0 4px 12px ${primaryColor}20`
                    }}
                    onClick={() => handleStartChat()}
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
        ) : (
          // Active chat state
          <div className="flex flex-col h-full">
            {/* Chat messages area */}
            <div 
              ref={conversationScrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ 
                background: `linear-gradient(to bottom, ${primaryColorLight}, ${primaryColorLight.replace('20', '10')})`,
                minHeight: '0'
              }}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col">
                    {/* Message bubble */}
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

                    {/* Quick replies for bot messages */}
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
                              backgroundColor: 'white'
                            }}
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Suggested replies for user messages */}
                    {message.suggestedReply && message.sender === 'user' && (
                      <div className="flex justify-start mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3 py-1 text-xs rounded-full border transition-all hover:scale-105 shadow-sm"
                          style={{
                            color: primaryColor,
                            borderColor: primaryBorder,
                            backgroundColor: 'white'
                          }}
                          onClick={() => handleSuggestedReply(message.suggestedReply!)}
                        >
                          💡 {message.suggestedReply}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
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
                          style={{ 
                            backgroundColor: primaryColor, 
                            animationDelay: '0.2s' 
                          }} 
                        />
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce" 
                          style={{ 
                            backgroundColor: primaryColor, 
                            animationDelay: '0.4s' 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area without back button */}
            <div 
              className="p-4 bg-white/90 backdrop-blur-sm border-t shadow-lg"
              style={{ borderColor: primaryBorder }}
            >
              <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-200/50 shadow-inner">
                <div className="flex items-center gap-2">
                  {/* Message input */}
                  <div className="flex-1 relative group">
                    <Input
                      ref={inputRef}
                      className="w-full rounded-xl border-2 pr-12 pl-4 py-3 transition-all duration-200 placeholder-gray-400 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary group-hover:border-gray-300 shadow-sm"
                      style={{
                        borderColor: primaryBorder,
                        backgroundColor: 'white'
                      }}
                      value={userInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                  </div>

                  {/* Mic button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-3 rounded-xl transition-all hover:bg-gray-200/50 hover:scale-105"
                    style={{ 
                      color: primaryColor300,
                    }}
                    onClick={handleMicClick}
                    title="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>

                  {/* Send button */}
                  <Button
                    className="relative rounded-xl w-10 h-10 p-0 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${primaryColorDark})`,
                      boxShadow: `0 4px 12px ${primaryColor}20`
                    }}
                    onClick={() => handleSend()}
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
        )}
      </div>
    </div>
  );
}

export default StepFour;