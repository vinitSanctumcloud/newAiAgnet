// src/components/conversation-analytics/ConversationHeatmap.tsx
import React, { useState } from 'react';
import { Clock, Calendar, X } from 'lucide-react';

// Define interfaces for data points
interface HourlyDataPoint {
  day: number;
  hour: number;
  intensity: number;
  conversations: number;
}

interface WeeklyDataPoint {
  week: number;
  day: number;
  intensity: number;
  conversations: number;
}

const ConversationHeatmap: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'hourly' | 'weekly'>('hourly');
  const [selectedDay, setSelectedDay] = useState<HourlyDataPoint | null>(null);

  // Mock heatmap data - intensity values from 0-100
  const hourlyData: HourlyDataPoint[] = Array.from({ length: 7 }, (_, dayIndex) =>
    Array.from({ length: 24 }, (_, hourIndex) => ({
      day: dayIndex,
      hour: hourIndex,
      intensity: Math.floor(Math.random() * 100),
      conversations: Math.floor(Math.random() * 500) + 50,
    }))
  ).flat();

  const weeklyData: WeeklyDataPoint[] = Array.from({ length: 52 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => ({
      week: weekIndex,
      day: dayIndex,
      intensity: Math.floor(Math.random() * 100),
      conversations: Math.floor(Math.random() * 2000) + 200,
    }))
  ).flat();

  const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  const weeks: number[] = Array.from({ length: 52 }, (_, i) => i + 1);

  const getIntensityColor = (intensity: number): string => {
    if (intensity < 20) return 'bg-blue-100 dark:bg-blue-900';
    if (intensity < 40) return 'bg-blue-200 dark:bg-blue-800';
    if (intensity < 60) return 'bg-blue-400 dark:bg-blue-600';
    if (intensity < 80) return 'bg-blue-600 dark:bg-blue-400';
    return 'bg-blue-800 dark:bg-blue-300';
  };

  const handleCellClick = (data: HourlyDataPoint | WeeklyDataPoint): void => {
    if ('hour' in data) {
      setSelectedDay(data as HourlyDataPoint);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-all duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Conversation Activity Heatmap
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualize peak engagement periods and conversation patterns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedView('hourly')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedView === 'hourly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setSelectedView('weekly')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedView === 'weekly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Heatmap Section */}
      {selectedView === 'hourly' && (
        <div className="space-y-4">
          {/* Hour Labels */}
          <div className="grid grid-cols-[auto_repeat(24,minmax(0,1fr))] gap-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-10"></div>
            {hours.map((hour) => (
              <div key={hour} className="text-center font-medium">
                {hour % 3 === 0 ? `${hour}:00` : ''}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="space-y-1">
            {days.map((day, dayIndex) => (
              <div
                key={day}
                className="grid grid-cols-[auto_repeat(24,minmax(0,1fr))] gap-1 items-center"
              >
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-10">
                  {day}
                </div>
                {hours.map((hour) => {
                  const dataPoint = hourlyData.find(
                    (d) => d.day === dayIndex && d.hour === hour
                  );
                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className={`w-full h-6 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 hover:ring-2 hover:ring-blue-400/50 ${getIntensityColor(
                        dataPoint?.intensity || 0
                      )}`}
                      onClick={() => dataPoint && handleCellClick(dataPoint)}
                      title={`${day} ${hour}:00 - ${dataPoint?.conversations || 0} conversations, ${dataPoint?.intensity || 0}% intensity`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend and Insights */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
              <span>Low</span>
              <div className="flex space-x-1">
                {[0, 20, 40, 60, 80].map((intensity) => (
                  <div
                    key={intensity}
                    className={`w-4 h-4 rounded-md ${getIntensityColor(intensity)}`}
                  />
                ))}
              </div>
              <span>High</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-gray-500 dark:text-gray-400" />
                <span>Peak: 2-4 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-gray-500 dark:text-gray-400" />
                <span>Best: Tue-Thu</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'weekly' && (
        <div className="space-y-4">
          {/* Week Labels */}
          <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-10"></div>
            {days.map((day) => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Weekly Heatmap Grid */}
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {weeks.map((week) => (
              <div
                key={week}
                className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-1 items-center"
              >
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-10">
                  Wk {week}
                </div>
                {days.map((_, dayIndex) => {
                  const dataPoint = weeklyData.find(
                    (d) => d.week === week - 1 && d.day === dayIndex
                  );
                  return (
                    <div
                      key={`${week}-${dayIndex}`}
                      className={`w-full h-6 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 hover:ring-2 hover:ring-blue-400/50 ${getIntensityColor(
                        dataPoint?.intensity || 0
                      )}`}
                      onClick={() => dataPoint && handleCellClick(dataPoint)}
                      title={`Week ${week}, ${days[dayIndex]} - ${dataPoint?.conversations || 0} conversations, ${dataPoint?.intensity || 0}% intensity`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend and Insights */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
              <span>Low</span>
              <div className="flex space-x-1">
                {[0, 20, 40, 60, 80].map((intensity) => (
                  <div
                    key={intensity}
                    className={`w-4 h-4 rounded-md ${getIntensityColor(intensity)}`}
                  />
                ))}
              </div>
              <span>High</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar size= {14} className="text-gray-500 dark:text-gray-400" />
                <span>Peak: Weeks 10-12</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-gray-500 dark:text-gray-400" />
                <span>Best: Tue-Thu</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {days[selectedDay.day]} at {selectedDay.hour}:00
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedDay.conversations.toLocaleString()} conversations • {selectedDay.intensity}% intensity
              </p>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHeatmap;