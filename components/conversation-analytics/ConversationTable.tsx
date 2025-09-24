// src/components/conversation-analytics/ConversationTable.tsx
import React, { useState } from 'react';
import { ArrowUpDown, Star, Eye, Flag, MoreHorizontal, Download, Archive, ChevronLeft, ChevronRight } from 'lucide-react';

// Define interface for conversation data
interface Conversation {
  id: string;
  user: string;
  avatar: string;
  agent: string;
  type: string;
  duration: string;
  messages: number;
  qualityScore: number;
  sentiment: string;
  outcome: string;
  timestamp: Date;
  tags: string[];
  satisfaction: number;
}

const ConversationTable: React.FC = () => {
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Conversation>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const conversationsPerPage = 5;

  const conversations: Conversation[] = [
    {
      id: 'conv_001',
      user: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
      agent: 'Customer Support Bot',
      type: 'support',
      duration: '4m 32s',
      messages: 12,
      qualityScore: 94,
      sentiment: 'positive',
      outcome: 'resolved',
      timestamp: new Date('2024-09-24T14:30:00'),
      tags: ['billing', 'refund'],
      satisfaction: 5,
    },
    {
      id: 'conv_002',
      user: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      agent: 'Sales Assistant',
      type: 'sales',
      duration: '8m 15s',
      messages: 24,
      qualityScore: 87,
      sentiment: 'neutral',
      outcome: 'follow_up',
      timestamp: new Date('2024-09-24T14:15:00'),
      tags: ['pricing', 'demo'],
      satisfaction: 4,
    },
    {
      id: 'conv_003',
      user: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      agent: 'Technical Support',
      type: 'support',
      duration: '12m 45s',
      messages: 31,
      qualityScore: 76,
      sentiment: 'negative',
      outcome: 'escalated',
      timestamp: new Date('2024-09-24T13:45:00'),
      tags: ['integration', 'api'],
      satisfaction: 2,
    },
    {
      id: 'conv_004',
      user: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      agent: 'Lead Qualifier',
      type: 'sales',
      duration: '6m 20s',
      messages: 18,
      qualityScore: 91,
      sentiment: 'positive',
      outcome: 'qualified',
      timestamp: new Date('2024-09-24T13:20:00'),
      tags: ['enterprise', 'features'],
      satisfaction: 5,
    },
    {
      id: 'conv_005',
      user: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
      agent: 'FAQ Assistant',
      type: 'general',
      duration: '2m 10s',
      messages: 6,
      qualityScore: 89,
      sentiment: 'positive',
      outcome: 'resolved',
      timestamp: new Date('2024-09-24T12:55:00'),
      tags: ['documentation'],
      satisfaction: 4,
    },
  ];

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500 bg-green-100 dark:bg-green-900/50';
      case 'negative':
        return 'text-red-500 bg-red-100 dark:bg-red-900/50';
      case 'neutral':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700/50';
    }
  };

  const getOutcomeColor = (outcome: string): string => {
    switch (outcome) {
      case 'resolved':
        return 'text-green-500 bg-green-100 dark:bg-green-900/50';
      case 'escalated':
        return 'text-red-500 bg-red-100 dark:bg-red-900/50';
      case 'follow_up':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50';
      case 'qualified':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/50';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700/50';
    }
  };

  const getQualityScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleSort = (field: keyof Conversation): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectConversation = (conversationId: string): void => {
    setSelectedConversations((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  const handleSelectAll = (): void => {
    setSelectedConversations(
      selectedConversations.length === filteredConversations.length
        ? []
        : filteredConversations.map((c) => c.id)
    );
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filterStatus === 'all') return true;
    return conv.outcome === filterStatus;
  });

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'timestamp') {
      aValue = aValue instanceof Date ? aValue.getTime() : aValue;
      bValue = bValue instanceof Date ? bValue.getTime() : bValue;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedConversations.length / conversationsPerPage);
  const paginatedConversations = sortedConversations.slice(
    (currentPage - 1) * conversationsPerPage,
    currentPage * conversationsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Conversations
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Detailed conversation history with quality metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Filter by outcome"
            >
              <option value="all">All Outcomes</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
              <option value="follow_up">Follow-up</option>
              <option value="qualified">Qualified</option>
            </select>
            <button
              className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              aria-label="Export conversations"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedConversations.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3 sm:space-y-0">
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {selectedConversations.length} conversation{selectedConversations.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                aria-label="Flag selected conversations for review"
              >
                <Flag size={16} />
                <span>Flag for Review</span>
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                aria-label="Archive selected conversations"
              >
                <Archive size={16} />
                <span>Archive</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedConversations.length === filteredConversations.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  aria-label="Select all conversations"
                />
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                User
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                Agent
              </th>
              <th
                className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('duration')}
              >
                <div className="flex items-center space-x-1">
                  <span>Duration</span>
                  <ArrowUpDown size={14} className={sortField === 'duration' ? 'text-blue-500' : ''} />
                </div>
              </th>
              <th
                className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('qualityScore')}
              >
                <div className="flex items-center space-x-1">
                  <span>Quality</span>
                  <ArrowUpDown size={14} className={sortField === 'qualityScore' ? 'text-blue-500' : ''} />
                </div>
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                Sentiment
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                Outcome
              </th>
              <th
                className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center space-x-1">
                  <span>Time</span>
                  <ArrowUpDown size={14} className={sortField === 'timestamp' ? 'text-blue-500' : ''} />
                </div>
              </th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedConversations.map((conversation) => (
              <tr
                key={conversation.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedConversations.includes(conversation.id)}
                    onChange={() => handleSelectConversation(conversation.id)}
                    className="w-4 h-4 text-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    aria-label={`Select conversation with ${conversation.user}`}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={conversation.avatar}
                      alt={conversation.user}
                      className="w-8 h-8 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {conversation.user}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {conversation.messages} messages
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {conversation.agent}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {conversation.type}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {conversation.duration}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getQualityScoreColor(conversation.qualityScore)}`}>
                      {conversation.qualityScore}%
                    </span>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < conversation.satisfaction ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}
                        />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(conversation.sentiment)}`}>
                    {conversation.sentiment}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOutcomeColor(conversation.outcome)}`}>
                    {conversation.outcome.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {conversation.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.timestamp.toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      aria-label={`View conversation with ${conversation.user}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      aria-label={`Flag conversation with ${conversation.user}`}
                    >
                      <Flag size={16} />
                    </button>
                    <button
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      aria-label={`More actions for conversation with ${conversation.user}`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {paginatedConversations.length} of {filteredConversations.length} conversations
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center space-x-2 transition-colors ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center space-x-2 transition-colors ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationTable;