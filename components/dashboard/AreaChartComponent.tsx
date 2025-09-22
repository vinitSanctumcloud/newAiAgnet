// components/dashboard/AreaChartComponent.tsx
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AreaChartProps {
  data: { name: string; uv: number; pv: number }[];
  title: string;
  description: string;
}

export default function AreaChartComponent({ data, title, description }: AreaChartProps) {
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

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? '#4b5563' : '#e5e7eb'} // gray-600 for dark, gray-200 for light
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: isDarkMode ? '#ffffff' : '#000000' }} // white for dark, black for light
            />
            <YAxis
              tick={{ fontSize: 12, fill: isDarkMode ? '#ffffff' : '#000000' }} // white for dark, black for light
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff', // gray-700 for dark, white for light
                border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`, // gray-600 for dark, gray-200 for light
                borderRadius: '4px',
                color: isDarkMode ? '#f3f4f6' : '#1f2937', // gray-100 for dark, gray-900 for light
              }}
              itemStyle={{ color: isDarkMode ? '#f3f4f6' : '#1f2937' }} // Match tooltip text color
              cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} // white with opacity for dark, black with opacity for light
            />
            <Legend
              className={isDarkMode ? 'text-white' : 'text-black'} // Tailwind classes for legend text
              wrapperStyle={{
                paddingTop: '16px',
              }}
            />
            <Area
              type="monotone"
              dataKey="uv"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="pv"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}