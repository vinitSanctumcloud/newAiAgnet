import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AlertItem {
  message: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

interface AlertCardProps {
  title: string;
  alerts: AlertItem[];
  emptyMessage?: string;
}

export default function AlertCard({ title, alerts, emptyMessage = "No alerts to display" }: AlertCardProps) {
  // Function to get appropriate icon based on severity
  const getIcon = (severity: AlertItem['severity'] = 'info') => {
    switch (severity) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  // Function to get appropriate color classes based on severity
  const getAlertVariant = (severity: AlertItem['severity'] = 'info') => {
    switch (severity) {
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-300 dark:border-amber-700',
          text: 'text-amber-800 dark:text-amber-200',
          icon: 'text-amber-600 dark:text-amber-400'
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950/30',
          border: 'border-red-300 dark:border-red-700',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-600 dark:text-red-400'
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-950/30',
          border: 'border-green-300 dark:border-green-700',
          text: 'text-green-800 dark:text-green-200',
          icon: 'text-green-600 dark:text-green-400'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'border-blue-300 dark:border-blue-700',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg w-full transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl max-w-full mx-auto">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const variant = getAlertVariant(alert.severity);
            return (
              <Alert 
                key={index} 
                className={`p-4 rounded-lg ${variant.bg} ${variant.border} border transition-all duration-200 hover:shadow-md`}
              >
                <div className={`flex items-center gap-3 ${variant.icon}`}>
                  {getIcon(alert.severity)}
                </div>
                <div className="flex-1">
                  <AlertTitle className={`text-lg font-semibold ${variant.text}`}>
                    {alert.severity ? alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1) : 'Notification'}
                  </AlertTitle>
                  <AlertDescription className={`text-sm ${variant.text}`}>
                    {alert.message}
                  </AlertDescription>
                </div>
              </Alert>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-base font-medium">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}