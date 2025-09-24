// src/components/conversation-analytics/ConversationFilters.tsx
import React, { useState } from 'react';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  Save,
  SlidersHorizontal,
} from 'lucide-react';
import Select from '../ui/Select';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// Define interfaces for filter state and options
interface FilterState {
  agents: string[];
  conversationType: string;
  sentimentRange: [number, number];
  dateRange: string;
  qualityScore: [number, number];
  duration: string;
  outcome: string;
}

interface SelectOption {
  value: string;
  label: string;
}

// Define props for the ConversationFilters component
interface ConversationFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}

// Define props for the RangeSlider component
interface RangeSliderProps {
  label: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const ConversationFilters: React.FC<ConversationFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    agents: [],
    conversationType: 'all',
    sentimentRange: [0, 100],
    dateRange: '7d',
    qualityScore: [0, 100],
    duration: 'all',
    outcome: 'all',
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  const agentOptions: SelectOption[] = [
    { value: 'customer-support', label: 'Customer Support Bot' },
    { value: 'sales-assistant', label: 'Sales Assistant' },
    { value: 'technical-support', label: 'Technical Support' },
    { value: 'lead-qualifier', label: 'Lead Qualifier' },
    { value: 'faq-assistant', label: 'FAQ Assistant' },
  ];

  const conversationTypeOptions: SelectOption[] = [
    { value: 'all', label: 'All Types' },
    { value: 'support', label: 'Support' },
    { value: 'sales', label: 'Sales' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical' },
  ];

  const dateRangeOptions: SelectOption[] = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const durationOptions: SelectOption[] = [
    { value: 'all', label: 'Any Duration' },
    { value: 'short', label: 'Under 2 minutes' },
    { value: 'medium', label: '2-10 minutes' },
    { value: 'long', label: 'Over 10 minutes' },
  ];

  const outcomeOptions: SelectOption[] = [
    { value: 'all', label: 'All Outcomes' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'escalated', label: 'Escalated' },
    { value: 'follow_up', label: 'Follow-up Required' },
    { value: 'abandoned', label: 'Abandoned' },
  ];

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters: FilterState = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      agents: [],
      conversationType: 'all',
      sentimentRange: [0, 100],
      dateRange: '7d',
      qualityScore: [0, 100],
      duration: 'all',
      outcome: 'all',
    };
    setFilters(resetFilters);
    setSearchQuery('');
    if (onFiltersChange) {
      onFiltersChange(resetFilters);
    }
  };

  const hasActiveFilters = (): boolean => {
    return (
      filters.agents.length > 0 ||
      filters.conversationType !== 'all' ||
      filters.sentimentRange[0] > 0 ||
      filters.sentimentRange[1] < 100 ||
      filters.dateRange !== '7d' ||
      filters.qualityScore[0] > 0 ||
      filters.qualityScore[1] < 100 ||
      filters.duration !== 'all' ||
      filters.outcome !== 'all' ||
      searchQuery.length > 0
    );
  };

  const RangeSlider: React.FC<RangeSliderProps> = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
  }) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{label}</label>
          <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            {value[0]} - {value[1]}
          </span>
        </div>
        <div className="relative pt-4">
          <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            <span>{min}</span>
            <span>{max}</span>
          </div>
          <div className="relative h-8 flex items-center">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value[0]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange([parseInt(e.target.value), value[1]])
              }
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
            />
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value[1]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange([value[0], parseInt(e.target.value)])
              }
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
            />
          </div>
        </div>
      </div>
    );
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.agents.length > 0) count += filters.agents.length;
    if (filters.conversationType !== 'all') count += 1;
    if (filters.sentimentRange[0] > 0 || filters.sentimentRange[1] < 100) count += 1;
    if (filters.dateRange !== '7d') count += 1;
    if (filters.qualityScore[0] > 0 || filters.qualityScore[1] < 100) count += 1;
    if (filters.duration !== 'all') count += 1;
    if (filters.outcome !== 'all') count += 1;
    if (searchQuery.length > 0) count += 1;
    return count;
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Conversation Filters
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                {activeFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground hidden sm:flex"
              >
                <X size={16} className="mr-2" />
                Clear All
              </Button>
            )}

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsExpanded(!isExpanded);
                setIsMobileFiltersOpen(!isMobileFiltersOpen);
              }}
              className="lg:hidden flex-1 sm:flex-none"
            >
              {isExpanded ? <ChevronUp size={16} /> : <Filter size={16} />}
              <span className="ml-2">Filters</span>
              {hasActiveFilters() && (
                <Badge variant="default" className="ml-2 h-5 w-5 p-0 bg-primary">
                  {activeFilterCount()}
                </Badge>
              )}
            </Button>

            {/* Desktop Expand Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:flex"
            >
              {isExpanded ? <ChevronUp size={16} /> : <Filter size={16} />}
              <span className="ml-2">{isExpanded ? 'Hide' : 'Show'} Filters</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Quick Date Filter */}
          <div className="w-full">
            <Select
              options={dateRangeOptions}
              value={filters.dateRange}
              onChange={(value: string | number | number[] | string[]) => {
                if (typeof value === 'string') {
                  handleFilterChange('dateRange', value);
                }
              }}
              className="w-full"
              placeholder="Time range"
            />
          </div>

          {/* Quick Type Filter */}
          <div className="w-full">
            <Select
              options={conversationTypeOptions}
              value={filters.conversationType}
              onChange={(value: string | number | string[] | number[]) => {
                if (typeof value === 'string') {
                  handleFilterChange('conversationType', value);
                }
              }}
              className="w-full"
              placeholder="Conversation type"
            />
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="pt-4 border-t border-border animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Agent Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">AI Agents</label>
                <Select
                  options={agentOptions}
                  value={filters.agents}
                  onChange={(value: string | number | string[] | number[]) => {
                    if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
                      handleFilterChange('agents', value as string[]);
                    }
                  }}
                  multiple
                  searchable
                  placeholder="Select agents..."
                  className="w-full"
                />
              </div>

              {/* Duration Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Duration</label>
                <Select
                  options={durationOptions}
                  value={filters.duration}
                  onChange={(value: string | number | string[] | number[]) => {
                    if (typeof value === 'string') {
                      handleFilterChange('duration', value);
                    }
                  }}
                  className="w-full"
                />
              </div>

              {/* Outcome Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Outcome</label>
                <Select
                  options={outcomeOptions}
                  value={filters.outcome}
                  onChange={(value: string | number | string[] | number[]) => {
                    if (typeof value === 'string') {
                      handleFilterChange('outcome', value);
                    }
                  }}
                  className="w-full"
                />
              </div>

              {/* Sentiment Range */}
              <div className="md:col-span-2 xl:col-span-1">
                <RangeSlider
                  label="Sentiment Score"
                  value={filters.sentimentRange}
                  onChange={(value: [number, number]) => handleFilterChange('sentimentRange', value)}
                  min={0}
                  max={100}
                />
              </div>

              {/* Quality Score Range */}
              <div className="md:col-span-2 xl:col-span-1">
                <RangeSlider
                  label="Quality Score"
                  value={filters.qualityScore}
                  onChange={(value: [number, number]) => handleFilterChange('qualityScore', value)}
                  min={0}
                  max={100}
                />
              </div>

              {/* Custom Date Range */}
              {filters.dateRange === 'custom' && (
                <div className="space-y-2 md:col-span-2 xl:col-span-1">
                  <label className="text-sm font-medium text-foreground">Custom Date Range</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">From</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">To</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter size={14} />
                <span>{activeFilterCount()} filters applied</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 sm:flex-none gap-2"
                  onClick={handleReset}
                >
                  <X size={14} />
                  Clear Filters
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2">
                    <Download size={14} />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2">
                    <Save size={14} />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Action Buttons when filters are collapsed */}
        {!isExpanded && hasActiveFilters() && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border lg:hidden">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter size={14} />
              <span>{activeFilterCount()} filters active</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground w-full sm:w-auto"
            >
              <X size={14} className="mr-2" />
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationFilters;