// components/dashboard/ProgressCard.tsx
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProgressCardProps {
  title: string;
  value: number;
  description: string;
}

export default function ProgressCard({ title, value, description }: ProgressCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={value} className="w-full h-2" />
        <div className="text-right mt-2 text-sm font-medium">{value}% Complete</div>
      </CardContent>
    </Card>
  );
}