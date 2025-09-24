// src/components/conversation-analytics/SentimentAnalysis.tsx
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Minus, Circle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

// Define interfaces for data structures
interface Sentiment {
  count: number;
  percentage: number;
  change: string;
}

interface SentimentData {
  positive: Sentiment;
  neutral: Sentiment;
  negative: Sentiment;
}

interface TrendingTopic {
  topic: string;
  sentiment: string;
  mentions: number;
  trend: string;
}

const SentimentAnalysis: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  const sentimentData: SentimentData = {
    positive: { count: 8247, percentage: 64.2, change: '+5.3%' },
    neutral: { count: 3421, percentage: 26.6, change: '-2.1%' },
    negative: { count: 1179, percentage: 9.2, change: '-3.2%' },
  };

  const trendingTopics: TrendingTopic[] = [
    { topic: 'pricing', sentiment: 'negative', mentions: 342, trend: 'up' },
    { topic: 'features', sentiment: 'positive', mentions: 287, trend: 'up' },
    { topic: 'support', sentiment: 'positive', mentions: 234, trend: 'down' },
    { topic: 'integration', sentiment: 'neutral', mentions: 198, trend: 'up' },
    { topic: 'performance', sentiment: 'positive', mentions: 156, trend: 'stable' },
    { topic: 'billing', sentiment: 'negative', mentions: 134, trend: 'down' },
    { topic: 'documentation', sentiment: 'neutral', mentions: 98, trend: 'up' },
    { topic: 'mobile app', sentiment: 'positive', mentions: 87, trend: 'up' },
  ];

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500 bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800';
      case 'negative':
        return 'text-red-500 bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800';
      case 'neutral':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700';
    }
  };

  const getSentimentIcon = (sentiment: string): React.ComponentType<{ size: number; className?: string }> => {
    switch (sentiment) {
      case 'positive':
        return ThumbsUp;
      case 'negative':
        return ThumbsDown;
      case 'neutral':
        return Minus;
      default:
        return Circle;
    }
  };

  const getTrendIcon = (trend: string): React.ComponentType<{ size: number; className?: string }> => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      case 'stable':
        return Minus;
      default:
        return Circle;
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'up':
        return 'text-green-500 dark:text-green-400';
      case 'down':
        return 'text-red-500 dark:text-red-400';
      case 'stable':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sentiment Distribution */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Sentiment Analysis
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              User emotion distribution across conversations
            </p>
          </div>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as '24h' | '7d' | '30d')}
            className="px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Select timeframe"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>

        <div className="space-y-4">
          {Object.entries(sentimentData).map(([sentiment, data]) => {
            const SentimentIcon = getSentimentIcon(sentiment);
            return (
              <div key={sentiment} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSentimentColor(sentiment)}`}>
                      <SentimentIcon size={20} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white capitalize">
                        {sentiment}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {data.count.toLocaleString()} conversations
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {data.percentage.toFixed(1)}%
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        data.change.startsWith('+') ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      {data.change}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                      sentiment === 'positive' ? 'bg-green-500' : sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-500 dark:text-green-400">4.7</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">87%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500 dark:text-purple-400">+12%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Improvement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Trending Topics
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Most discussed topics and their sentiment
            </p>
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="Refresh trending topics"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {trendingTopics.map((topic, index) => {
    const TrendIcon = getTrendIcon(topic.trend);
    return (
      <div
        key={topic.topic}
        className="flex flex-col justify-between h-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Header: Rank, Topic, Sentiment */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white">
              {index + 1}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-white truncate">
                {topic.topic}
              </span>
              <span className={`mt-1 px-2 py-0.5 w-fit rounded-full text-xs font-medium ${getSentimentColor(topic.sentiment)}`}>
                {topic.sentiment}
              </span>
            </div>
          </div>
        </div>

        {/* Footer: Mentions + Trend Icon */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {topic.mentions.toLocaleString()} mentions
          </span>
          <TrendIcon size={18} className={getTrendColor(topic.trend)} />
        </div>
      </div>
    );
  })}
</div>



        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className="w-full py-2 text-sm font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            aria-label="View all trending topics"
          >
            View All Topics
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;