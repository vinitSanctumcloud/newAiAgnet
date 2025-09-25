'use client';

import { useState } from 'react';
import { RefreshCw, BarChart3, Map, Table, TestTube, Heart, Filter, GitBranch } from 'lucide-react';
import ConversationMetrics from '@/components/conversation-analytics/ConversationMetrics';
import ConversationFilters from '@/components/conversation-analytics/ConversationFilters';
import ConversationHeatmap from '@/components/conversation-analytics/ConversationHeatmap';
import ABTestingWidget from '@/components/conversation-analytics/ABTestingWidget';
import SentimentAnalysis from '@/components/conversation-analytics/SentimentAnalysis';
import ConversationFlow from '@/components/conversation-analytics/ConversationFlow';
import GeographicDistribution from '@/components/conversation-analytics/GeographicDistribution';
import ConversationTable from '@/components/conversation-analytics/ConversationTable';
import DashboardLayout from '@/components/DashboardLayout';

type TabType = 'overview' | 'flow' | 'geographic' | 'sentiment' | 'testing' | 'details';

const ConversationAnalyticsPage = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [filters, setFilters] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const handleConversationFiltersChange = (filters: any) => {
    setFilters(filters);
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'flow' as TabType, label: 'Conversation Flow', icon: GitBranch },
    { id: 'geographic' as TabType, label: 'Geographic', icon: Map },
    { id: 'sentiment' as TabType, label: 'Sentiment', icon: Heart },
    { id: 'testing' as TabType, label: 'A/B Testing', icon: TestTube },
    // { id: 'details' as TabType, label: 'Details', icon: Table },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <ConversationMetrics />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <ConversationHeatmap />
            
            </div>
            
          </div>
        );

      case 'flow':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-3">
                <ConversationFlow />
              </div>
            
            </div>
          </div>
        );

      case 'geographic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <GeographicDistribution />
              </div>
              {/* <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Top Regions</h3>
                  <div className="space-y-3">
                    {[
                      { region: 'North America', sessions: 3247, growth: 12.4 },
                      { region: 'Europe', sessions: 2876, growth: 8.7 },
                      { region: 'Asia Pacific', sessions: 1567, growth: 23.1 },
                      { region: 'South America', sessions: 892, growth: 15.6 },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.region}</span>
                        <div className="text-right">
                          <div className="font-semibold">{item.sessions.toLocaleString()}</div>
                          <div className={`text-xs ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.growth >= 0 ? '+' : ''}{item.growth}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        );

      case 'sentiment':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <SentimentAnalysis />
              </div>
              {/* <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Sentiment Trends</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Positive</span>
                        <span className="text-sm font-semibold">68%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Neutral</span>
                        <span className="text-sm font-semibold">24%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Negative</span>
                        <span className="text-sm font-semibold">8%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        );

      case 'testing':
        return (
          <div className="space-y-6">
            <ABTestingWidget />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Test Performance</h3>
                <div className="space-y-4">
                  {[
                    { test: 'New Welcome Flow', improvement: 15.2, status: 'Active' },
                    { test: 'Pricing Page Redesign', improvement: 8.7, status: 'Completed' },
                    { test: 'Chatbot Responses', improvement: 22.3, status: 'Active' },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.test}</div>
                        <div className={`text-xs ${item.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                          {item.status}
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${item.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.improvement >= 0 ? '+' : ''}{item.improvement}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Recent Experiments</h3>
                <div className="space-y-3">
                  {[
                    'Conversation timeout optimization',
                    'New response templates',
                    'User feedback collection',
                    'Multi-language support'
                  ].map((experiment, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{experiment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

     
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-screen-2xl mx-auto">
          {/* HEADER */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Conversation Analytics
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Deep insights into AI agent interaction quality and user engagement patterns
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>
                    Live data • Updated{' '}
                    {lastUpdated?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw size={16} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mb-6">
            <ConversationFilters onFiltersChange={handleConversationFiltersChange} />
          </div>

          {/* TABS */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="mb-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationAnalyticsPage;