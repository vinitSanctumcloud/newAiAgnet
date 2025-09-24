// src/components/conversation-analytics/ConversationFlow.tsx
import React, { useState } from 'react';
import {
  Users,
  Target,
  Play,
  CheckCircle,
  ArrowUp,
  X,
  MessageCircle,
  ArrowDown,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
  BarChart3,
  ChevronRight,
  Sparkles,
  Shield,
  AlertTriangle,
  ThumbsUp,
  Calendar,
} from 'lucide-react';

type FlowKey = 'support' | 'sales' | 'onboarding';

type NodeType = {
  id: string;
  label: string;
  count: number;
  percentage: number;
  type: string;
  avgDuration: string;
  satisfaction: number;
  trend: 'up' | 'down' | 'stable';
  improvement: number;
  issues?: string[];
};

type ConnectionType = {
  from: string;
  to: string;
  percentage: number;
  dropoffReason?: string;
  avgTransitionTime: string;
};

type FlowDataType = {
  [key in FlowKey]: {
    title: string;
    description: string;
    icon: React.ReactNode;
    totalSessions: number;
    completionRate: number;
    avgDuration: string;
    nodes: NodeType[];
    connections?: ConnectionType[];
    insights: string[];
    performance: {
      week: number;
      month: number;
      quarter: number;
    };
  };
};

const ConversationFlow = () => {
  const [selectedFlow, setSelectedFlow] = useState<FlowKey>('support');
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const flowData: FlowDataType = {
    support: {
      title: 'Customer Support Flow',
      description: 'End-to-end customer support journey with escalation paths',
      icon: <Shield className="w-5 h-5" />,
      totalSessions: 8247,
      completionRate: 71.8,
      avgDuration: '8m 24s',
      performance: {
        week: 12.4,
        month: 8.7,
        quarter: 15.2,
      },
      nodes: [
        {
          id: 'start',
          label: 'Conversation Start',
          count: 8247,
          percentage: 100,
          type: 'start',
          avgDuration: '0m 15s',
          satisfaction: 4.8,
          trend: 'up',
          improvement: 5.2,
        },
        {
          id: 'greeting',
          label: 'Greeting Exchange',
          count: 8102,
          percentage: 98.2,
          type: 'step',
          avgDuration: '0m 45s',
          satisfaction: 4.6,
          trend: 'stable',
          improvement: 2.1,
        },
        {
          id: 'issue_identification',
          label: 'Issue Identification',
          count: 7834,
          percentage: 95.0,
          type: 'step',
          avgDuration: '2m 15s',
          satisfaction: 4.3,
          trend: 'up',
          improvement: 8.7,
          issues: ['Vague descriptions', 'Multiple issues'],
        },
        {
          id: 'solution_provided',
          label: 'Solution Provided',
          count: 6891,
          percentage: 83.6,
          type: 'step',
          avgDuration: '3m 30s',
          satisfaction: 4.4,
          trend: 'up',
          improvement: 12.3,
        },
        {
          id: 'resolution',
          label: 'Issue Resolved',
          count: 5923,
          percentage: 71.8,
          type: 'success',
          avgDuration: '1m 30s',
          satisfaction: 4.7,
          trend: 'up',
          improvement: 6.5,
        },
        {
          id: 'escalation',
          label: 'Escalated to Human',
          count: 968,
          percentage: 11.7,
          type: 'escalation',
          avgDuration: '5m 12s',
          satisfaction: 3.8,
          trend: 'down',
          improvement: -3.2,
          issues: ['Complex cases', 'Technical limitations'],
        },
        {
          id: 'abandoned',
          label: 'User Abandoned',
          count: 1356,
          percentage: 16.4,
          type: 'exit',
          avgDuration: '2m 45s',
          satisfaction: 2.1,
          trend: 'down',
          improvement: -8.9,
          issues: ['Long wait times', 'Complex process'],
        },
      ],
      connections: [
        { from: 'start', to: 'greeting', percentage: 98.2, avgTransitionTime: '15s' },
        { from: 'greeting', to: 'issue_identification', percentage: 96.7, avgTransitionTime: '30s' },
        { from: 'issue_identification', to: 'solution_provided', percentage: 88.0, avgTransitionTime: '45s' },
        { from: 'solution_provided', to: 'resolution', percentage: 85.9, avgTransitionTime: '1m' },
        { from: 'solution_provided', to: 'escalation', percentage: 14.1, avgTransitionTime: '2m', dropoffReason: 'Complex issue' },
        { from: 'issue_identification', to: 'abandoned', percentage: 12.0, avgTransitionTime: '45s', dropoffReason: 'Process too long' },
      ],
      insights: [
        '98.2% of users complete the initial greeting successfully',
        'Issue identification has improved by 8.7% this quarter',
        'Escalation rate decreased by 3.2% due to better training',
      ],
    },
    sales: {
      title: 'Sales Conversation Flow',
      description: 'Lead qualification to conversion pipeline',
      icon: <Target className="w-5 h-5" />,
      totalSessions: 3421,
      completionRate: 13.3,
      avgDuration: '12m 18s',
      performance: {
        week: 8.3,
        month: 15.7,
        quarter: 22.4,
      },
      nodes: [
        {
          id: 'start',
          label: 'Initial Contact',
          count: 3421,
          percentage: 100,
          type: 'start',
          avgDuration: '1m 30s',
          satisfaction: 4.5,
          trend: 'up',
          improvement: 12.8,
        },
        {
          id: 'qualification',
          label: 'Lead Qualification',
          count: 2987,
          percentage: 87.3,
          type: 'step',
          avgDuration: '3m 45s',
          satisfaction: 4.2,
          trend: 'up',
          improvement: 18.3,
        },
        {
          id: 'demo_request',
          label: 'Demo Requested',
          count: 1876,
          percentage: 54.8,
          type: 'step',
          avgDuration: '2m 15s',
          satisfaction: 4.6,
          trend: 'up',
          improvement: 25.1,
        },
        {
          id: 'pricing_discussion',
          label: 'Pricing Discussion',
          count: 1234,
          percentage: 36.1,
          type: 'step',
          avgDuration: '4m 30s',
          satisfaction: 3.9,
          trend: 'stable',
          improvement: 3.2,
        },
        {
          id: 'conversion',
          label: 'Converted to Sale',
          count: 456,
          percentage: 13.3,
          type: 'success',
          avgDuration: '1m 15s',
          satisfaction: 4.8,
          trend: 'up',
          improvement: 32.7,
        },
        {
          id: 'follow_up',
          label: 'Follow-up Scheduled',
          count: 778,
          percentage: 22.7,
          type: 'step',
          avgDuration: '2m 00s',
          satisfaction: 4.1,
          trend: 'up',
          improvement: 15.6,
        },
        {
          id: 'not_interested',
          label: 'Not Interested',
          count: 1111,
          percentage: 32.5,
          type: 'exit',
          avgDuration: '3m 45s',
          satisfaction: 3.2,
          trend: 'down',
          improvement: -12.4,
        },
      ],
      insights: [
        'Conversion rate increased by 32.7% with new pricing strategy',
        '54.8% of qualified leads request a demo',
        'Follow-up scheduling improved by 15.6% with automation',
      ],
    },
    onboarding: {
      title: 'User Onboarding Flow',
      description: 'New user activation and feature adoption',
      icon: <Sparkles className="w-5 h-5" />,
      totalSessions: 15678,
      completionRate: 68.9,
      avgDuration: '6m 45s',
      performance: {
        week: 18.2,
        month: 22.7,
        quarter: 31.5,
      },
      nodes: [
        {
          id: 'start',
          label: 'Account Creation',
          count: 15678,
          percentage: 100,
          type: 'start',
          avgDuration: '2m 15s',
          satisfaction: 4.7,
          trend: 'up',
          improvement: 15.3,
        },
        {
          id: 'welcome',
          label: 'Welcome Tutorial',
          count: 14234,
          percentage: 90.8,
          type: 'step',
          avgDuration: '1m 30s',
          satisfaction: 4.4,
          trend: 'up',
          improvement: 22.8,
        },
        {
          id: 'feature1',
          label: 'Core Feature Setup',
          count: 12890,
          percentage: 82.2,
          type: 'step',
          avgDuration: '2m 00s',
          satisfaction: 4.5,
          trend: 'up',
          improvement: 18.7,
        },
        {
          id: 'feature2',
          label: 'Advanced Features',
          count: 9876,
          percentage: 63.0,
          type: 'step',
          avgDuration: '3m 15s',
          satisfaction: 4.2,
          trend: 'stable',
          improvement: 8.3,
        },
        {
          id: 'completion',
          label: 'Onboarding Complete',
          count: 10823,
          percentage: 68.9,
          type: 'success',
          avgDuration: '1m 00s',
          satisfaction: 4.8,
          trend: 'up',
          improvement: 27.4,
        },
      ],
      insights: [
        '90.8% of users complete the welcome tutorial',
        'Feature adoption increased by 27.4% with guided setup',
        '68.9% completion rate with new interactive onboarding',
      ],
    },
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25';
      case 'success':
        return 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-600 shadow-lg shadow-green-500/25';
      case 'escalation':
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-yellow-600 shadow-lg shadow-yellow-500/25';
      case 'exit':
        return 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-600 shadow-lg shadow-red-500/25';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'down':
        return <TrendingUp size={16} className="text-red-500 rotate-180" />;
      default:
        return <BarChart3 size={16} className="text-yellow-500" />;
    }
  };

  const currentFlow = flowData[selectedFlow];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {currentFlow.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentFlow.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentFlow.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {(['support', 'sales', 'onboarding'] as FlowKey[]).map((flow) => (
            <button
              key={flow}
              onClick={() => setSelectedFlow(flow)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                selectedFlow === flow
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{flow.charAt(0).toUpperCase() + flow.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentFlow.totalSessions.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400">
              +{currentFlow.performance.week}% this week
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentFlow.completionRate}%
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            {getTrendIcon('up')}
            <span className="text-xs text-green-600 dark:text-green-400">
              +{currentFlow.performance.month}% this month
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentFlow.avgDuration}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <Zap size={14} className="text-blue-500" />
            <span className="text-xs text-blue-600 dark:text-blue-400">-15% faster</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Quarter Growth</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                +{currentFlow.performance.quarter}%
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <Calendar size={14} className="text-orange-500" />
            <span className="text-xs text-orange-600 dark:text-orange-400">Q3 Performance</span>
          </div>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="relative mb-8">
        <div className="space-y-6">
          {currentFlow.nodes.map((node, index) => (
            <div key={node.id} className="relative">
              {/* Connection Line */}
              {index < currentFlow.nodes.length - 1 && node.type !== 'exit' && (
                <div className="absolute left-1/2 top-full w-0.5 h-6 bg-gradient-to-b from-blue-300 to-blue-200 dark:from-blue-600 dark:to-blue-700 transform -translate-x-0.5 z-0" />
              )}

              {/* Node Card */}
              <div className="flex items-center justify-center">
                <div
                  className={`
                    relative w-full max-w-2xl flex flex-col lg:flex-row items-center justify-between p-6 rounded-2xl border-2 shadow-lg transition-all duration-300 cursor-pointer
                    ${getNodeColor(node.type)}
                    ${expandedNode === node.id ? 'scale-105 shadow-2xl' : 'hover:scale-102'}
                  `}
                  onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                >
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="flex-shrink-0">
                      {node.type === 'start' && <Play size={24} />}
                      {node.type === 'success' && <CheckCircle size={24} />}
                      {node.type === 'escalation' && <ArrowUp size={24} />}
                      {node.type === 'exit' && <X size={24} />}
                      {node.type === 'step' && <MessageCircle size={24} />}
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="font-bold text-lg">{node.label}</div>
                      <div className="text-sm opacity-90 flex items-center space-x-2 mt-1">
                        <span>{node.count.toLocaleString()} users</span>
                        <span>•</span>
                        <span>{node.percentage.toFixed(1)}%</span>
                        <span>•</span>
                        <span>{node.avgDuration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Satisfaction */}
                    <div className="flex items-center space-x-2">
                      <ThumbsUp size={16} className="text-green-500" />
                      <span className="font-semibold">{node.satisfaction.toFixed(1)}</span>
                    </div>

                    {/* Trend */}
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(node.trend)}
                      <span className={`text-sm font-semibold ${
                        node.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {node.improvement >= 0 ? '+' : ''}{node.improvement}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-24 lg:w-32">
                      <div className="flex justify-between text-xs text-current opacity-80 mb-1">
                        <span>Progress</span>
                        <span>{node.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-current bg-opacity-20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-current bg-opacity-50 transition-all duration-1000 ease-out"
                          style={{ width: `${node.percentage}%` }}
                        />
                      </div>
                    </div>

                    <ChevronRight 
                      size={20} 
                      className={`transition-transform duration-300 ${
                        expandedNode === node.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedNode === node.id && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                          <span className="font-semibold">{node.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</span>
                          <span className="font-semibold">{node.avgDuration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</span>
                          <span className="font-semibold">{node.satisfaction.toFixed(1)}/5.0</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Trend Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Quarter Improvement</span>
                          <span className={`font-semibold ${node.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {node.improvement >= 0 ? '+' : ''}{node.improvement}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Trend</span>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(node.trend)}
                            <span className="font-semibold capitalize">{node.trend}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {node.issues && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Common Issues</h4>
                        <ul className="space-y-1">
                          {node.issues.map((issue, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <AlertTriangle size={14} className="text-yellow-500" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Connection Details */}
              {index < currentFlow.nodes.length - 1 && currentFlow.connections && (
                <div className="flex justify-center mt-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <ArrowDown size={14} />
                        <span>
                          {currentFlow.connections.find(c => c.from === node.id && c.to === currentFlow.nodes[index + 1].id)?.percentage.toFixed(1) || 0}% continue
                        </span>
                      </div>
                      {currentFlow.connections.find(c => c.from === node.id && c.to !== currentFlow.nodes[index + 1].id) && (
                        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                          <ArrowRight size={14} />
                          <span>
                            {currentFlow.connections.find(c => c.from === node.id && c.to !== currentFlow.nodes[index + 1].id)?.percentage.toFixed(1) || 0}% exit
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Sparkles size={20} className="text-blue-500" />
          <span>Key Insights</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentFlow.insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationFlow;