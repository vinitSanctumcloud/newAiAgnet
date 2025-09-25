// src/components/conversation-analytics/ConversationTable.tsx
import React, { useState } from 'react';
import { ArrowUpDown, Star, Eye, Flag, MoreHorizontal, Download, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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
  const [isMobileView, setIsMobileView] = useState(false);
  const conversationsPerPage = 5;

  // Check screen size on component mount and resize
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Mobile Card View
  const MobileCardView = ({ conversation }: { conversation: Conversation }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectedConversations.includes(conversation.id)}
            onChange={() => handleSelectConversation(conversation.id)}
            className="w-4 h-4 text-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 mt-1"
          />
          <img
            src={conversation.avatar}
            alt={conversation.user}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {conversation.user}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {conversation.messages} messages • {conversation.duration}
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Agent</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {conversation.agent}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Type</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
            {conversation.type}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Quality</div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getQualityScoreColor(conversation.qualityScore)}`}>
              {conversation.qualityScore}%
            </span>
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < conversation.satisfaction ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {conversation.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(conversation.sentiment)}`}>
            {conversation.sentiment}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(conversation.outcome)}`}>
            {conversation.outcome.replace('_', ' ')}
          </span>
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400">
            <Flag size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Recent Conversations
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Detailed conversation history with quality metrics
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Filter by outcome"
              >
                <option value="all">All Outcomes</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
                <option value="follow_up">Follow-up</option>
                <option value="qualified">Qualified</option>
              </select>
              <button
                className="w-full sm:w-auto px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                aria-label="Export conversations"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedConversations.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3 sm:space-y-0">
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {selectedConversations.length} conversation{selectedConversations.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                  aria-label="Flag selected conversations for review"
                >
                  <Flag size={16} />
                  <span>Flag for Review</span>
                </button>
                <button
                  className="w-full sm:w-auto px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                  aria-label="Archive selected conversations"
                >
                  <Archive size={16} />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isMobileView ? (
        // Mobile Card View
        <div className="p-3 sm:p-4">
          {paginatedConversations.map((conversation) => (
            <MobileCardView key={conversation.id} conversation={conversation} />
          ))}
        </div>
      ) : (
        // Desktop Table View
        <Table className="min-w-[1000px] lg:min-w-0">
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead className="w-12 p-3 sm:p-4">
                <input
                  type="checkbox"
                  checked={selectedConversations.length === filteredConversations.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  aria-label="Select all conversations"
                />
              </TableHead>
              <TableHead className="p-3 sm:p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                User
              </TableHead>
              <TableHead className="p-3 sm:p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                Agent
              </TableHead>
              <TableHead
                className="p-3 sm:p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('duration')}
              >
                <div className="flex items-center space-x-1">
                  <span>Duration</span>
                  <ArrowUpDown size={14} className={sortField === 'duration' ? 'text-blue-500' : ''} />
                </div>
              </TableHead>
              <TableHead
                className="p-3 sm:p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('qualityScore')}
              >
                <div className="flex items-center space-x-1">
                  <span>Quality</span>
                  <ArrowUpDown size={14} className={sortField === 'qualityScore' ? 'text-blue-500' : ''} />
                </div>
              </TableHead>
              <TableHead className="p-3 sm:p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                Sentiment
              </TableHead>
              <TableHead className="p-3 sm:p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                Outcome
              </TableHead>
              <TableHead
                className="p-3 sm:p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center space-x-1">
                  <span>Time</span>
                  <ArrowUpDown size={14} className={sortField === 'timestamp' ? 'text-blue-500' : ''} />
                </div>
              </TableHead>
              <TableHead className="p-3 sm:p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedConversations.map((conversation) => (
              <TableRow
                key={conversation.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                data-state={selectedConversations.includes(conversation.id) ? 'selected' : undefined}
              >
                <TableCell className="p-3 sm:p-4">
                  <input
                    type="checkbox"
                    checked={selectedConversations.includes(conversation.id)}
                    onChange={() => handleSelectConversation(conversation.id)}
                    className="w-4 h-4 text-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    aria-label={`Select conversation with ${conversation.user}`}
                  />
                </TableCell>
                <TableCell className="p-3 sm:p-4">
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
                </TableCell>
                <TableCell className="p-3 sm:p-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {conversation.agent}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {conversation.type}
                  </div>
                </TableCell>
                <TableCell className="p-3 sm:p-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {conversation.duration}
                  </div>
                </TableCell>
                <TableCell className="p-3 sm:p-4">
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
                </TableCell>
                <TableCell className="p-3 sm:p-4">
                  <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getSentimentColor(conversation.sentiment)}`}>
                    {conversation.sentiment}
                  </span>
                </TableCell>
                <TableCell className="p-3 sm:p-4">
                  <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getOutcomeColor(conversation.outcome)}`}>
                    {conversation.outcome.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell className="p-3 sm:p-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {conversation.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.timestamp.toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="p-3 sm:p-4">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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
              className={`px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center space-x-2 transition-colors ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center space-x-2 transition-colors ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationTable;