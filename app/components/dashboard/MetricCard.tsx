// components/dashboard/MetricCard.tsx
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trendData: { name: string; value: number }[];
}

export default function MetricCard({ title, value, description, trendData }: MetricCardProps) {
  // State for dark mode detection
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to detect theme changes
  useEffect(() => {
    // Check initial theme
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark');
      setIsDarkMode(darkMode);
      console.log('Dark mode:', darkMode); // Debug theme
    };

    // Run on mount
    checkDarkMode();

    // Observe changes to the classList
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  // Determine trend direction for line color
  const getTrendColor = () => {
    if (trendData.length < 2) return '#4F46E5'; // Neutral color if insufficient data
    const firstValue = trendData[0].value;
    const lastValue = trendData[trendData.length - 1].value;
    if (lastValue > firstValue) return '#22C55E'; // Green for upward trend
    if (lastValue < firstValue) return '#EF4444'; // Red for downward trend
    return '#4F46E5'; // Neutral color for no change
  };

  const trendColor = getTrendColor();

  // Format value with proper formatting if it's a number
  const formatValue = (val: string) => {
    // Check if value is a number with possible commas/decimals
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) {
      // Format based on the size of the number
      if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(1)}K`;
      } else if (num % 1 !== 0) {
        return `$${num.toFixed(2)}`;
      } else {
        return `$${num.toLocaleString()}`;
      }
    }
    return val;
  };

  // Sample data if no trendData provided
  const displayData = trendData && trendData.length > 0
    ? trendData
    : [
        { name: 'Jan', value: 45 },
        { name: 'Feb', value: 52 },
        { name: 'Mar', value: 49 },
        { name: 'Apr', value: 62 },
        { name: 'May', value: 55 },
        { name: 'Jun', value: 58 },
      ];

  return (
    <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 rounded-xl border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {formatValue(value)}
        </div>
        
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? '#4b5563' : '#e5e7eb'} // gray-600 for dark, gray-200 for light
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: isDarkMode ? '#ffffff' : '#000000' }} // white for dark, black for light
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: isDarkMode ? '#ffffff' : '#000000' }} // white for dark, black for light
                width={30}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${value / 1000}k`;
                  return value;
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff', // gray-700 for dark, white for light
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`, // gray-600 for dark, gray-200 for light
                  borderRadius: '6px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#f3f4f6' : '#374151', // gray-100 for dark, gray-700 for light
                }}
                formatter={(value) => [`${value}`, title]}
                labelStyle={{ color: isDarkMode ? '#f3f4f6' : '#4b5563', fontWeight: 'bold' }} // gray-100 for dark, gray-600 for light
                cursor={{ stroke: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} // white with opacity for dark, black with opacity for light
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={trendColor}
                strokeWidth={2}
                dot={{ r: 3, fill: trendColor, strokeWidth: 2, stroke: isDarkMode ? '#000000' : '#ffffff' }} // black stroke for dark, white for light
                activeDot={{ r: 5, fill: trendColor, stroke: isDarkMode ? '#000000' : '#ffffff', strokeWidth: 2 }} // black stroke for dark, white for light
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: trendColor }}
          ></div>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            {trendColor === '#22C55E' ? 'Upward trend' :
             trendColor === '#EF4444' ? 'Downward trend' : 'Stable trend'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}