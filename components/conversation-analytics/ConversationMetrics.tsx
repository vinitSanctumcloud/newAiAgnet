// src/components/conversation-analytics/ConversationMetrics.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Clock,
  Star,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Eye,
  ThumbsUp,
  Calendar,
  Filter,
  Download,
  MoreVertical,
} from 'lucide-react';

interface Metric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  description: string;
  gauge: number;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo';
  trendData: number[];
  actualValue: number;
  targetValue: number;
  unit: string;
}

interface TimeRange {
  id: string;
  label: string;
  value: string;
}

const ConversationMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('week');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const timeRanges: TimeRange[] = [
    { id: 'today', label: 'Today', value: 'today' },
    { id: 'week', label: 'This Week', value: 'week' },
    { id: 'month', label: 'This Month', value: 'month' },
    { id: 'quarter', label: 'This Quarter', value: 'quarter' },
  ];

  const metricsData: Record<string, Metric[]> = {
    today: [
      {
        id: 'volume',
        title: 'Conversations Today',
        value: '1,248',
        change: '+12.5%',
        changeType: 'positive',
        icon: 'MessageSquare',
        description: 'vs yesterday',
        gauge: 85,
        color: 'blue',
        trendData: [45, 52, 48, 55, 58, 60, 62, 65, 70, 68, 72, 75],
        actualValue: 1248,
        targetValue: 1100,
        unit: 'conversations',
      },
      {
        id: 'duration',
        title: 'Avg Duration',
        value: '4m 32s',
        change: '+8.2%',
        changeType: 'positive',
        icon: 'Clock',
        description: 'vs yesterday',
        gauge: 72,
        color: 'green',
        trendData: [55, 53, 57, 59, 61, 63, 62, 64, 65, 66, 68, 70],
        actualValue: 272,
        targetValue: 250,
        unit: 'seconds',
      },
      {
        id: 'satisfaction',
        title: 'Satisfaction Rate',
        value: '94.7%',
        change: '+2.3%',
        changeType: 'positive',
        icon: 'Star',
        description: 'avg rating',
        gauge: 95,
        color: 'orange',
        trendData: [88, 89, 90, 91, 92, 93, 92, 93, 94, 94, 95, 95],
        actualValue: 94.7,
        targetValue: 92,
        unit: '%',
      },
      {
        id: 'quality',
        title: 'Quality Score',
        value: '92.4%',
        change: '-1.2%',
        changeType: 'negative',
        icon: 'CheckCircle2',
        description: 'quality metrics',
        gauge: 92,
        color: 'purple',
        trendData: [94, 93, 93, 92, 93, 92, 92, 92, 92, 92, 92, 92],
        actualValue: 92.4,
        targetValue: 93.5,
        unit: '%',
      },
      {
        id: 'resolution',
        title: 'First Response',
        value: '1.2s',
        change: '-0.3s',
        changeType: 'positive',
        icon: 'Zap',
        description: 'avg response time',
        gauge: 88,
        color: 'indigo',
        trendData: [2.1, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.3, 1.2, 1.2, 1.2],
        actualValue: 1.2,
        targetValue: 1.5,
        unit: 'seconds',
      },
      {
        id: 'engagement',
        title: 'Engagement Rate',
        value: '78.3%',
        change: '+5.7%',
        changeType: 'positive',
        icon: 'Users',
        description: 'user engagement',
        gauge: 78,
        color: 'green',
        trendData: [70, 71, 72, 73, 74, 75, 76, 76, 77, 77, 78, 78],
        actualValue: 78.3,
        targetValue: 75,
        unit: '%',
      },
    ],
    week: [
      {
        id: 'volume',
        title: 'Weekly Conversations',
        value: '8,642',
        change: '+18.2%',
        changeType: 'positive',
        icon: 'MessageSquare',
        description: 'vs last week',
        gauge: 78,
        color: 'blue',
        trendData: [65, 68, 70, 72, 74, 76, 78],
        actualValue: 8642,
        targetValue: 7500,
        unit: 'conversations',
      },
      {
        id: 'duration',
        title: 'Avg Duration',
        value: '4m 45s',
        change: '+12.5%',
        changeType: 'positive',
        icon: 'Clock',
        description: 'vs last week',
        gauge: 65,
        color: 'green',
        trendData: [55, 57, 59, 61, 62, 63, 65],
        actualValue: 285,
        targetValue: 240,
        unit: 'seconds',
      },
      {
        id: 'satisfaction',
        title: 'Satisfaction Rate',
        value: '95.2%',
        change: '+3.1%',
        changeType: 'positive',
        icon: 'Star',
        description: 'avg rating',
        gauge: 95,
        color: 'orange',
        trendData: [90, 91, 92, 93, 94, 94, 95],
        actualValue: 95.2,
        targetValue: 92,
        unit: '%',
      },
      {
        id: 'quality',
        title: 'Quality Score',
        value: '93.8%',
        change: '-0.8%',
        changeType: 'negative',
        icon: 'CheckCircle2',
        description: 'quality metrics',
        gauge: 94,
        color: 'purple',
        trendData: [94, 94, 94, 93, 93, 93, 94],
        actualValue: 93.8,
        targetValue: 94.5,
        unit: '%',
      },
      {
        id: 'resolution',
        title: 'First Response',
        value: '1.1s',
        change: '-0.4s',
        changeType: 'positive',
        icon: 'Zap',
        description: 'avg response time',
        gauge: 90,
        color: 'indigo',
        trendData: [1.8, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1],
        actualValue: 1.1,
        targetValue: 1.5,
        unit: 'seconds',
      },
      {
        id: 'engagement',
        title: 'Engagement Rate',
        value: '82.1%',
        change: '+7.3%',
        changeType: 'positive',
        icon: 'Users',
        description: 'user engagement',
        gauge: 82,
        color: 'green',
        trendData: [75, 76, 77, 78, 79, 80, 82],
        actualValue: 82.1,
        targetValue: 78,
        unit: '%',
      },
    ],
    month: [
      {
        id: 'volume',
        title: 'Monthly Conversations',
        value: '36.8K',
        change: '+22.4%',
        changeType: 'positive',
        icon: 'MessageSquare',
        description: 'vs last month',
        gauge: 82,
        color: 'blue',
        trendData: [65, 68, 72, 75, 78, 80, 82],
        actualValue: 36800,
        targetValue: 32000,
        unit: 'conversations',
      },
      {
        id: 'duration',
        title: 'Avg Duration',
        value: '5m 12s',
        change: '+15.3%',
        changeType: 'positive',
        icon: 'Clock',
        description: 'vs last month',
        gauge: 70,
        color: 'green',
        trendData: [55, 58, 61, 63, 65, 67, 70],
        actualValue: 312,
        targetValue: 270,
        unit: 'seconds',
      },
      {
        id: 'satisfaction',
        title: 'Satisfaction Rate',
        value: '96.5%',
        change: '+4.2%',
        changeType: 'positive',
        icon: 'Star',
        description: 'avg rating',
        gauge: 97,
        color: 'orange',
        trendData: [90, 91, 92, 93, 94, 95, 97],
        actualValue: 96.5,
        targetValue: 93,
        unit: '%',
      },
      {
        id: 'quality',
        title: 'Quality Score',
        value: '94.2%',
        change: '+1.1%',
        changeType: 'positive',
        icon: 'CheckCircle2',
        description: 'quality metrics',
        gauge: 94,
        color: 'purple',
        trendData: [92, 92, 93, 93, 94, 94, 94],
        actualValue: 94.2,
        targetValue: 93,
        unit: '%',
      },
      {
        id: 'resolution',
        title: 'First Response',
        value: '0.9s',
        change: '-0.6s',
        changeType: 'positive',
        icon: 'Zap',
        description: 'avg response time',
        gauge: 92,
        color: 'indigo',
        trendData: [1.8, 1.6, 1.4, 1.2, 1.1, 1.0, 0.9],
        actualValue: 0.9,
        targetValue: 1.3,
        unit: 'seconds',
      },
      {
        id: 'engagement',
        title: 'Engagement Rate',
        value: '85.7%',
        change: '+9.2%',
        changeType: 'positive',
        icon: 'Users',
        description: 'user engagement',
        gauge: 86,
        color: 'green',
        trendData: [75, 77, 79, 81, 83, 84, 86],
        actualValue: 85.7,
        targetValue: 80,
        unit: '%',
      },
    ],
  };

  const metrics = metricsData[timeRange] || metricsData.week;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      icon: 'text-blue-600 dark:text-blue-400',
      gauge: 'text-blue-500 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      icon: 'text-green-600 dark:text-green-400',
      gauge: 'text-green-500 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      icon: 'text-orange-600 dark:text-orange-400',
      gauge: 'text-orange-500 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      icon: 'text-purple-600 dark:text-purple-400',
      gauge: 'text-purple-500 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      icon: 'text-red-600 dark:text-red-400',
      gauge: 'text-red-500 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      icon: 'text-indigo-600 dark:text-indigo-400',
      gauge: 'text-indigo-500 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
  };

  const GaugeChart: React.FC<{ value: number; size?: number; color?: string }> = ({ 
    value, 
    size = 40, 
    color = 'blue' 
  }) => {
    const radius = size / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClass.gauge} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-gray-900 dark:text-white">
            {value}%
          </span>
        </div>
      </div>
    );
  };

  const iconMap: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
    MessageSquare,
    Clock,
    Star,
    CheckCircle2,
    Users,
    Zap,
    Eye,
    ThumbsUp,
  };

  const TrendSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end h-4 space-x-px">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 12 + 4 : 8;
          return (
            <div
              key={index}
              className={`w-1 rounded-t ${
                color === 'blue' ? 'bg-blue-300 dark:bg-blue-400' :
                color === 'green' ? 'bg-green-300 dark:bg-green-400' :
                color === 'orange' ? 'bg-orange-300 dark:bg-orange-400' :
                color === 'purple' ? 'bg-purple-300 dark:bg-purple-400' :
                color === 'indigo' ? 'bg-indigo-300 dark:bg-indigo-400' :
                'bg-red-300 dark:bg-red-400'
              }`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>
    );
  };

  const ProgressBar: React.FC<{ actual: number; target: number; color: string }> = ({ 
    actual, 
    target, 
    color 
  }) => {
    const percentage = Math.min((actual / target) * 100, 100);
    
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
        <div
          className={`h-1.5 rounded-full ${
            color === 'blue' ? 'bg-blue-500' :
            color === 'green' ? 'bg-green-500' :
            color === 'orange' ? 'bg-orange-500' :
            color === 'purple' ? 'bg-purple-500' :
            color === 'indigo' ? 'bg-indigo-500' :
            'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const SkeletonLoader: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
            </div>
            <div className="w-11 h-11 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Conversation Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and analyze your conversation metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
            
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === range.value
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">36.8K</p>
              </div>
              <MessageSquare className="text-blue-500" size={24} />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-500 text-sm ml-1">+22.4%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">96.5%</p>
              </div>
              <Star className="text-orange-500" size={24} />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-500 text-sm ml-1">+4.2%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Response Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0.9s</p>
              </div>
              <Zap className="text-indigo-500" size={24} />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown size={16} className="text-green-500" />
              <span className="text-green-500 text-sm ml-1">-0.6s</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">85.7%</p>
              </div>
              <Users className="text-green-500" size={24} />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-500 text-sm ml-1">+9.2%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric) => {
          const Icon = iconMap[metric.icon];
          const colorClass = colorClasses[metric.color];

          return (
            <div
              key={metric.id}
              className={`
                relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105
                ${colorClass.bg} ${colorClass.border}
              `}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass.iconBg}`}>
                      <Icon size={20} className={colorClass.icon} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-clamp-1">
                        {metric.title}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                  <GaugeChart value={metric.gauge} size={44} color={metric.color} />
                </div>

                {/* Trend Sparkline */}
                <div className="mb-3">
                  <TrendSparkline data={metric.trendData} color={metric.color} />
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{Math.round((metric.actualValue / metric.targetValue) * 100)}%</span>
                  </div>
                  <ProgressBar actual={metric.actualValue} target={metric.targetValue} color={metric.color} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {metric.changeType === 'positive' ? (
                      <TrendingUp size={14} className="text-green-500" />
                    ) : (
                      <TrendingDown size={14} className="text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {metric.description}
                  </span>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className={`
                absolute top-0 right-0 w-16 h-16 opacity-10
                ${metric.color === 'blue' ? 'bg-blue-500' :
                  metric.color === 'green' ? 'bg-green-500' :
                  metric.color === 'orange' ? 'bg-orange-500' :
                  metric.color === 'purple' ? 'bg-purple-500' :
                  metric.color === 'indigo' ? 'bg-indigo-500' :
                  'bg-red-500'
                }
              `} />
            </div>
          );
        })}
      </div>

      {/* Footer Notes */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()} • Data refreshes every 15 minutes
        </p>
      </div>
    </div>
  );
};

export default ConversationMetrics;