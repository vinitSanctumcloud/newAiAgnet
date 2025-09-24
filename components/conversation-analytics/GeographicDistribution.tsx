// src/components/conversation-analytics/GeographicDistribution.tsx
import React, { useState } from 'react';
import { Star, ChevronUp, ChevronDown, TrendingUp, MapPin, Users, Clock, Target } from 'lucide-react';

// Define interface for geographic data
interface Region {
  country: string;
  code: string;
  conversations: number;
  users: number;
  avgDuration: string;
  satisfaction: number;
  coordinates: { lat: number; lng: number };
  percentage: number;
  growth: number;
  peakHours: string;
  flag: string;
}

const GeographicDistribution: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [viewMode, setViewMode] = useState<'conversations' | 'satisfaction'>('conversations');

  const geographicData: Region[] = [
    {
      country: 'United States',
      code: 'US',
      conversations: 4823,
      users: 3241,
      avgDuration: '4m 32s',
      satisfaction: 4.6,
      coordinates: { lat: 39.8283, lng: -98.5795 },
      percentage: 37.5,
      growth: 12.4,
      peakHours: '2-4 PM',
      flag: '🇺🇸'
    },
    {
      country: 'United Kingdom',
      code: 'GB',
      conversations: 2156,
      users: 1432,
      avgDuration: '5m 12s',
      satisfaction: 4.4,
      coordinates: { lat: 55.3781, lng: -3.4360 },
      percentage: 16.8,
      growth: 8.7,
      peakHours: '3-5 PM',
      flag: '🇬🇧'
    },
    {
      country: 'Canada',
      code: 'CA',
      conversations: 1834,
      users: 1203,
      avgDuration: '4m 45s',
      satisfaction: 4.7,
      coordinates: { lat: 56.1304, lng: -106.3468 },
      percentage: 14.3,
      growth: 15.2,
      peakHours: '1-3 PM',
      flag: '🇨🇦'
    },
    {
      country: 'Australia',
      code: 'AU',
      conversations: 1245,
      users: 876,
      avgDuration: '3m 58s',
      satisfaction: 4.3,
      coordinates: { lat: -25.2744, lng: 133.7751 },
      percentage: 9.7,
      growth: 22.1,
      peakHours: '4-6 PM',
      flag: '🇦🇺'
    },
    {
      country: 'Germany',
      code: 'DE',
      conversations: 987,
      users: 654,
      avgDuration: '6m 15s',
      satisfaction: 4.8,
      coordinates: { lat: 51.1657, lng: 10.4515 },
      percentage: 7.7,
      growth: 9.3,
      peakHours: '10-12 AM',
      flag: '🇩🇪'
    },
    {
      country: 'Japan',
      code: 'JP',
      conversations: 756,
      users: 543,
      avgDuration: '7m 22s',
      satisfaction: 4.2,
      coordinates: { lat: 36.2048, lng: 138.2529 },
      percentage: 5.9,
      growth: 18.6,
      peakHours: '8-10 PM',
      flag: '🇯🇵'
    }
  ];

  const totalConversations = geographicData.reduce((sum, item) => sum + item.conversations, 0);

  const getIntensityColor = (value: number, mode: 'conversations' | 'satisfaction'): string => {
    if (mode === 'conversations') {
      if (value > 30) return 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25';
      if (value > 20) return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-400/25';
      if (value > 10) return 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-sm shadow-blue-300/25';
      if (value > 5) return 'bg-gradient-to-br from-blue-300 to-blue-400';
      return 'bg-gradient-to-br from-blue-200 to-blue-300';
    } else {
      if (value > 4.5) return 'bg-gradient-to-br from-green-600 to-green-700 shadow-lg shadow-green-500/25';
      if (value > 4.0) return 'bg-gradient-to-br from-green-500 to-green-600 shadow-md shadow-green-400/25';
      if (value > 3.5) return 'bg-gradient-to-br from-green-400 to-green-500 shadow-sm shadow-green-300/25';
      if (value > 3.0) return 'bg-gradient-to-br from-green-300 to-green-400';
      return 'bg-gradient-to-br from-green-200 to-green-300';
    }
  };

  const handleRegionClick = (region: Region): void => {
    setSelectedRegion(selectedRegion?.code === region.code ? null : region);
  };

  const getGrowthColor = (growth: number): string => {
    return growth >= 15 ? 'text-green-500' : growth >= 10 ? 'text-yellow-500' : 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Geographic Distribution
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
            Conversation origins and regional performance metrics across {geographicData.length} countries
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('conversations')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              viewMode === 'conversations'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users size={16} />
            <span>Conversations</span>
          </button>
          <button
            onClick={() => setViewMode('satisfaction')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              viewMode === 'satisfaction'
                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Star size={16} />
            <span>Satisfaction</span>
          </button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Countries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{geographicData.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Conversations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalConversations.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500 dark:text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Avg Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(geographicData.reduce((sum, item) => sum + item.satisfaction, 0) / geographicData.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5m 18s</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl relative overflow-hidden shadow-inner border border-gray-200 dark:border-gray-800">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Global Conversation Distribution"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=0,0&z=2&output=embed"
            className="rounded-2xl"
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="relative w-full h-full">
              {geographicData.map((region) => (
                <button
                  key={region.code}
                  className={`absolute w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 shadow-lg transition-all duration-300 hover:scale-150 hover:z-10 pointer-events-auto ${
                    viewMode === 'conversations'
                      ? getIntensityColor(region.percentage, 'conversations')
                      : getIntensityColor(region.satisfaction, 'satisfaction')
                  } ${selectedRegion?.code === region.code ? 'scale-150 z-10 ring-2 ring-white' : ''}`}
                  style={{
                    left: `${((region.coordinates.lng + 180) / 360) * 100}%`,
                    top: `${((90 - region.coordinates.lat) / 180) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={`${region.country}: ${viewMode === 'conversations' ? `${region.conversations} conversations` : `${region.satisfaction} satisfaction`}`}
                  onClick={() => handleRegionClick(region)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Data Cards */}
      <div className="grid grid-cols-1  gap-4 mb-8">
        {geographicData.map((region) => (
          <div
            key={region.code}
            className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
              selectedRegion?.code === region.code
                ? 'border-blue-500 shadow-xl shadow-blue-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => handleRegionClick(region)}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{region.flag}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{region.country}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{region.users.toLocaleString()} users</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getGrowthColor(region.growth)} bg-opacity-20`}>
                    ↗ {region.growth}%
                  </div>
                  {selectedRegion?.code === region.code ? (
                    <ChevronUp className="text-gray-400" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {viewMode === 'conversations' ? region.conversations.toLocaleString() : region.satisfaction.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {viewMode === 'conversations' ? 'Conversations' : 'Satisfaction'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {region.percentage}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">of total</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {region.satisfaction.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">rating</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{viewMode === 'conversations' ? region.percentage : (region.satisfaction / 5 * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                      viewMode === 'conversations' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${viewMode === 'conversations' ? region.percentage : (region.satisfaction / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {selectedRegion?.code === region.code && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{region.avgDuration}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Peak Hours</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{region.peakHours}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(region.satisfaction) 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300 dark:text-gray-600'
                          }
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp size={14} className={getGrowthColor(region.growth)} />
                      <span className={`text-sm font-semibold ${getGrowthColor(region.growth)}`}>
                        +{region.growth}% growth
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Intensity Legend:</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistribution;