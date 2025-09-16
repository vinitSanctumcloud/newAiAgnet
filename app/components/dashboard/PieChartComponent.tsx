// components/dashboard/PieChartComponent.tsx
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

interface PieChartData {
    name: string;
    value: number; // Explicitly define value as number
}

interface PieChartProps {
    data: PieChartData[];
    title: string;
    description: string;
}

export default function PieChartComponent({ data, title, description }: PieChartProps) {
    // Calculate the total value for percentage calculations
    const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{title}</CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => {
                                const numericValue = typeof value === 'number' ? value : 0;
                                const percentage = totalValue > 0 ? ((numericValue / totalValue) * 100).toFixed(0) : '0';
                                return `${name} ${percentage}%`;
                            }}

                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}