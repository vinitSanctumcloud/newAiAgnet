// Additional mock data files or integrate in main if needed
// For simplicity, keeping mock data in the main Dashboard.tsx

// Now the main Dashboard.tsx
'use client';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import LineChartComponent from '../components/dashboard/LineChartComponent';
import BarChartComponent from '../components/dashboard/BarChartComponent';
import PieChartComponent from '../components/dashboard/PieChartComponent';
import AreaChartComponent from '../components/dashboard/AreaChartComponent';
import TableComponent from '../components/dashboard/TableComponent';
import AlertCard from '../components/dashboard/AlertCard';


// Mock data
const lineChartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const barChartData = [
  { name: 'Product A', sales: 1200 },
  { name: 'Product B', sales: 1800 },
  { name: 'Product C', sales: 800 },
  { name: 'Product D', sales: 2200 },
  { name: 'Product E', sales: 1500 },
];

const pieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
];

const areaChartData = [
  { name: 'Page A', uv: 4000, pv: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398 },
  { name: 'Page C', uv: 2000, pv: 9800 },
  { name: 'Page D', uv: 2780, pv: 3908 },
  { name: 'Page E', uv: 1890, pv: 4800 },
  { name: 'Page F', uv: 2390, pv: 3800 },
];

const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Admin' },
];

const metrics = [
  {
    title: 'Total Users',
    value: '1,234',
    description: 'Active users this month',
    trendData: [
      { name: 'Week 1', value: 100 },
      { name: 'Week 2', value: 1150 },
      { name: 'Week 3', value: 100 },
      { name: 'Week 4', value: 1234 },
    ],
  },
  {
    title: 'Revenue',
    value: '$45,678',
    description: 'Total revenue generated',
    trendData: [
      { name: 'Week 1', value: 1000 },
      { name: 'Week 2', value: 15000 },
      { name: 'Week 3', value: 3000 },
      { name: 'Week 4', value: 45678 },
    ],
  },
  {
    title: 'New Signups',
    value: '567',
    description: 'Signups in the last week',
    trendData: [
      { name: 'Week 1', value: 10 },
      { name: 'Week 2', value: 150 },
      { name: 'Week 3', value: 20 },
      { name: 'Week 4', value: 567 },
    ],
  },
  {
    title: 'Active Sessions',
    value: '890',
    description: 'Current active sessions',
    trendData: [
      { name: 'Week 1', value: 70 },
      { name: 'Week 2', value: 750 },
      { name: 'Week 3', value: 80 },
      { name: 'Week 4', value: 890 },
    ],
  },
  {
    title: 'Conversion Rate',
    value: '12.5%',
    description: 'Average conversion rate',
    trendData: [
      { name: 'Week 1', value: 100 },
      { name: 'Week 2', value: 11 },
      { name: 'Week 3', value: 121 },
      { name: 'Week 4', value: 12.5 },
    ],
  },
  {
    title: 'Bounce Rate',
    value: '45%',
    description: 'Site bounce rate',
    trendData: [
      { name: 'Week 1', value: 5 },
      { name: 'Week 2', value: 48 },
      { name: 'Week 3', value: 4 },
      { name: 'Week 4', value: 45 },
    ],
  },
];

const progressMetrics = [
  { title: 'Project Completion', value: 75, description: 'Overall project progress' },
  { title: 'Sales Target', value: 60, description: 'Monthly sales goal' },
];

const alerts = [
  { message: 'New user signup: John Doe' },
  { message: 'System update available' },
  { message: 'High traffic alert' },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !session.user) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/auth/login' });
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  if (status === 'loading' || !mounted) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">Loading...</div>;
  }

  if (session && session.user) {
    return (
      <DashboardLayout>
        <div className=" space-y-8  dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">

          {/* Metric Cards - 6 components */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Progress Cards - 2 components */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {progressMetrics.map((progress, index) => (
              <ProgressCard key={index} {...progress} />
            ))}
          </div>

          {/* Charts Section - 4 components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChartComponent data={lineChartData} title="Monthly Performance" description="Trends over time" />
            <BarChartComponent data={barChartData} title="Product Sales" description="Sales by product" />
            <PieChartComponent data={pieChartData} title="Market Share" description="Distribution by group" />
            <AreaChartComponent data={areaChartData} title="Page Views" description="UV and PV over pages" />
          </div>

          {/* Table and Alerts - 2 components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TableComponent data={tableData} title="User List" description="Recent users and roles" />
            <AlertCard title="Recent Alerts" alerts={alerts} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return null;
}