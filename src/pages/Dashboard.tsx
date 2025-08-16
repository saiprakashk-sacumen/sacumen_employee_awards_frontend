import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/ui/Card';
import { DashboardMetrics } from '../types';
import { MockAPI } from '../utils/mockApi';
import { Users, Award, TrendingUp, AlertTriangle, Calendar, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await MockAPI.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Overview of nomination activities and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="This Month"
          value={metrics.totalNominations.month}
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
          change={{
            value: 12.5,
            label: 'from last month',
            trend: 'up',
          }}
        />
        
        <StatCard
          title="Unique Nominees"
          value={metrics.uniqueNominees}
          icon={<Users className="h-6 w-6 text-green-600" />}
          change={{
            value: 8.2,
            label: 'from last month',
            trend: 'up',
          }}
        />
        
        <StatCard
          title="Avg Sentiment Score"
          value={`${(metrics.avgSentimentScore * 100).toFixed(0)}%`}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          change={{
            value: 2.1,
            label: 'from last month',
            trend: 'up',
          }}
        />
        
        <StatCard
          title="Bias Detection Rate"
          value={`${metrics.biasCheckResults.percentage}%`}
          icon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
          change={{
            value: 3.4,
            label: 'from last month',
            trend: 'down',
          }}
        />
      </div>

      {/* Period Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Nominations
            </h3>
            <Award className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {metrics.totalNominations.month}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current month total
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quarterly Nominations
            </h3>
            <Star className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {metrics.totalNominations.quarter}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current quarter total
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Yearly Nominations
            </h3>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {metrics.totalNominations.year}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current year total
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Nomination Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="nominations" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sentiment Trends */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Average Sentiment Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
                formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Sentiment']}
              />
              <Bar 
                dataKey="sentiment" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.biasCheckResults.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Nominations
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {metrics.biasCheckResults.flagged}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Flagged for Bias
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.biasCheckResults.total - metrics.biasCheckResults.flagged}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Clean Nominations
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {((metrics.biasCheckResults.total - metrics.biasCheckResults.flagged) / metrics.biasCheckResults.total * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Clean Rate
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}