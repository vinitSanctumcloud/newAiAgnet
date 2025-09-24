'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import ConversationMetrics from '@/components/conversation-analytics/ConversationMetrics';
import ConversationFilters from '@/components/conversation-analytics/ConversationFilters';
import ConversationHeatmap from '@/components/conversation-analytics/ConversationHeatmap';
import ABTestingWidget from '@/components/conversation-analytics/ABTestingWidget';
import SentimentAnalysis from '@/components/conversation-analytics/SentimentAnalysis';
import ConversationFlow from '@/components/conversation-analytics/ConversationFlow';
import GeographicDistribution from '@/components/conversation-analytics/GeographicDistribution';
import ConversationTable from '@/components/conversation-analytics/ConversationTable';
import DashboardLayout from '@/components/DashboardLayout';

const ConversationAnalyticsPage = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [filters, setFilters] = useState<any>(null);

  const handleRefresh = () => {
    // your refresh logic here
    setLastUpdated(new Date());
  };

  const handleConversationFiltersChange = (filters: any) => {
    setFilters(filters);
    // your filter logic here
  };

  return (
    <DashboardLayout>
      <div className=" py-6 px-4 sm:px-6 lg:px-8">
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

          {/* METRICS */}
          <div className="mb-6">
            <ConversationMetrics />
          </div>

          {/* FILTERS */}
          <div className="mb-6">
            <ConversationFilters onFiltersChange={handleConversationFiltersChange} />
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">
              <ConversationHeatmap />
              <ABTestingWidget />
            </div>
            <div className="space-y-6 lg:col-span-2">
              <SentimentAnalysis />
            </div>
          </div>

          {/* FLOW + GEO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ConversationFlow />
            <GeographicDistribution />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationAnalyticsPage;
