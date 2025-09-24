// src/components/conversation-analytics/ABTestingWidget.tsx
import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  Trophy,
  Crown,
  Star,
  Users,
  Plus,
  Pause,
  Square,
  CheckCircle,
  BarChart3,
  Zap,
  Target,
  Clock,
  Award,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

// Define interfaces for A/B test data
interface Variant {
  id: string;
  name: string;
  description: string;
  traffic: number;
  conversions: number;
  conversionRate: number;
  avgDuration: string;
  satisfaction: number;
  qualityScore: number;
}

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  confidence: number;
  significance: 'significant' | 'not_significant' | 'inconclusive';
  variants: Variant[];
}

// Type for the abTests object
interface ABTests {
  [key: string]: ABTest;
}

const ABTestingWidget: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string>('persona_test_1');

  const abTests: ABTests = {
    persona_test_1: {
      id: 'persona_test_1',
      name: 'Friendly vs Professional Persona',
      status: 'running',
      startDate: '2024-09-17',
      endDate: '2024-09-30',
      confidence: 95.2,
      significance: 'significant',
      variants: [
        {
          id: 'friendly',
          name: 'Friendly Persona',
          description: 'Casual, empathetic tone with emojis',
          traffic: 50,
          conversions: 847,
          conversionRate: 18.4,
          avgDuration: '5m 23s',
          satisfaction: 4.6,
          qualityScore: 89,
        },
        {
          id: 'professional',
          name: 'Professional Persona',
          description: 'Formal, business-focused communication',
          traffic: 50,
          conversions: 723,
          conversionRate: 15.7,
          avgDuration: '4m 12s',
          satisfaction: 4.2,
          qualityScore: 92,
        },
      ],
    },
    response_test_1: {
      id: 'response_test_1',
      name: 'Short vs Detailed Responses',
      status: 'completed',
      startDate: '2024-09-01',
      endDate: '2024-09-15',
      confidence: 87.3,
      significance: 'significant',
      variants: [
        {
          id: 'short',
          name: 'Concise Responses',
          description: 'Brief, direct answers',
          traffic: 50,
          conversions: 1234,
          conversionRate: 22.1,
          avgDuration: '3m 45s',
          satisfaction: 4.3,
          qualityScore: 85,
        },
        {
          id: 'detailed',
          name: 'Detailed Responses',
          description: 'Comprehensive explanations',
          traffic: 50,
          conversions: 1089,
          conversionRate: 19.5,
          avgDuration: '6m 18s',
          satisfaction: 4.5,
          qualityScore: 91,
        },
      ],
    },
  };

  const currentTest: ABTest | undefined = abTests?.[selectedTest];

  const getStatusConfig = (status: ABTest['status']) => {
    switch (status) {
      case 'running':
        return { color: 'text-green-600 bg-green-50 border-green-200', icon: Zap };
      case 'completed':
        return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle };
      case 'paused':
        return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Pause };
      default:
        return { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Clock };
    }
  };

  const getSignificanceConfig = (significance: ABTest['significance']) => {
    switch (significance) {
      case 'significant':
        return { color: 'text-green-600', icon: Award, label: 'Significant' };
      case 'not_significant':
        return { color: 'text-amber-600', icon: TrendingUp, label: 'Not Significant' };
      case 'inconclusive':
        return { color: 'text-gray-600', icon: BarChart3, label: 'Inconclusive' };
      default:
        return { color: 'text-gray-600', icon: BarChart3, label: 'Unknown' };
    }
  };

  const getWinnerVariant = (): Variant | undefined => {
    return currentTest?.variants?.reduce((winner, variant) =>
      variant?.conversionRate > winner?.conversionRate ? variant : winner,
      currentTest.variants[0]
    );
  };

  const winner = getWinnerVariant();
  const statusConfig = getStatusConfig(currentTest?.status);
  const significanceConfig = getSignificanceConfig(currentTest?.significance);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              A/B Testing Dashboard
            </CardTitle>
            <CardDescription>
              Compare agent persona performance and optimize conversion rates
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e?.target?.value)}
              className="px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            >
              {Object.values(abTests)?.map((test) => (
                <option key={test?.id} value={test?.id}>
                  {test?.name}
                </option>
              ))}
            </select>

            <Button className="gap-2">
              <Plus size={16} />
              New Test
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Test Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-foreground">
                    {currentTest?.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`${statusConfig.color} border font-medium`}
                  >
                    <statusConfig.icon className="h-3 w-3 mr-1" />
                    {currentTest?.status?.charAt(0).toUpperCase() + currentTest?.status?.slice(1)}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{currentTest?.startDate} - {currentTest?.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className={significanceConfig.color}>
                      {currentTest?.confidence}% confidence
                    </span>
                  </div>
                  <Badge variant="secondary" className={significanceConfig.color}>
                    <significanceConfig.icon className="h-3 w-3 mr-1" />
                    {significanceConfig.label}
                  </Badge>
                </div>
              </div>

              {currentTest?.status === 'completed' && winner && (
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-amber-200">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Winner: <span className="text-amber-600">{winner.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {winner.conversionRate}% conversion rate
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Variants Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentTest?.variants?.map((variant, index) => {
            const isWinner = variant?.id === winner?.id && currentTest?.status === 'completed';
            return (
              <Card 
                key={variant?.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                  isWinner ? 'border-2 border-green-200 bg-green-50/50' : 'border-border'
                }`}
              >
                {isWinner && (
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <Crown className="h-6 w-6 text-green-500" />
                      <div className="absolute inset-0 animate-ping opacity-25">
                        <Crown className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {variant.name}
                        {isWinner && (
                          <Badge variant="default" className="bg-green-500">
                            Winner
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{variant.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {variant.traffic}%
                      </div>
                      <div className="text-xs text-muted-foreground">Traffic Split</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-foreground">
                        {variant.conversions?.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-primary">
                        {variant.conversionRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Conversion Rate</div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Duration</span>
                      <span className="text-sm font-medium text-foreground">
                        {variant.avgDuration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Satisfaction</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {variant.satisfaction}/5
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < Math.floor(variant.satisfaction)
                                  ? 'text-amber-500 fill-current'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Quality Score</span>
                      <span className="text-sm font-medium text-foreground">
                        {variant.qualityScore}%
                      </span>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Performance</span>
                      <span className="text-xs font-medium text-foreground">
                        {variant.conversionRate}%
                      </span>
                    </div>
                    <Progress 
                      value={variant.conversionRate} 
                      max={25}
                      className={`h-2 ${
                        isWinner ? 'bg-green-100' : 'bg-gray-100'
                      } ${isWinner ? 'progress-indicator-green' : 'progress-indicator-primary'}`}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            <span>
              {currentTest?.variants
                ?.reduce((total, variant) => total + variant?.conversions, 0)
                ?.toLocaleString()}{' '}
              total participants
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {currentTest?.status === 'running' && (
              <>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pause size={14} />
                  Pause Test
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Square size={14} />
                  Stop Test
                </Button>
              </>
            )}

            {currentTest?.status === 'completed' && (
              <Button variant="default" size="sm" className="gap-2">
                <CheckCircle size={14} />
                Implement Winner
              </Button>
            )}

            <Button variant="ghost" size="sm" className="gap-2">
              <BarChart3 size={14} />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ABTestingWidget;