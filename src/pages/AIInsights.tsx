import React from 'react';
import { Card } from '../components/ui/Card';
import { Brain, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function AIInsights() {
  // Mock data for bias detection
  const biasBreakdown = [
    { name: 'Gender Bias', value: 35, color: '#EF4444' },
    { name: 'Age Bias', value: 28, color: '#F97316' },
    { name: 'Department Bias', value: 22, color: '#EAB308' },
    { name: 'Tenure Bias', value: 15, color: '#84CC16' },
  ];

  // Mock data for sentiment trends
  const sentimentTrends = [
    { department: 'Engineering', positive: 78, neutral: 15, negative: 7 },
    { department: 'Marketing', positive: 65, neutral: 22, negative: 13 },
    { department: 'Sales', positive: 82, neutral: 12, negative: 6 },
    { department: 'HR', positive: 74, neutral: 18, negative: 8 },
    { department: 'Finance', positive: 69, neutral: 25, negative: 6 },
    { department: 'Operations', positive: 71, neutral: 20, negative: 9 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bias detection and sentiment analysis powered by artificial intelligence
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                150
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyzed Nominations
              </p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                22
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bias Flags Detected
              </p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                74%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg Sentiment Score
              </p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                85.3%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Clean Rate
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bias Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bias Detection Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={biasBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {biasBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {biasBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {item.value} cases
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sentiment by Department */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sentiment Analysis by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sentimentTrends}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="department" 
                className="text-gray-600 dark:text-gray-400"
                angle={-45}
                textAnchor="end"
                height={60}
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
              <Bar dataKey="positive" stackId="a" fill="#10B981" />
              <Bar dataKey="neutral" stackId="a" fill="#6B7280" />
              <Bar dataKey="negative" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Bias Patterns
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">
                Gender Bias Alert
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Detected potential gender bias in nominations for technical roles. 
                Male employees are receiving 2.3x more nominations in engineering.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-medium text-orange-800 dark:text-orange-400 mb-2">
                Department Imbalance
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Sales department has 40% higher nomination rates compared to other departments 
                of similar size. Consider reviewing nomination criteria.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                Tenure Pattern
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Employees with 5+ years experience receive 60% more nominations. 
                New hire contributions may be underrecognized.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Recommendations
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                Nomination Review Process
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Implement blind review for initial screening to reduce unconscious bias. 
                Names and demographic identifiers should be hidden during first review.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">
                Diversity Targets
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Set department-specific nomination targets to ensure equal recognition 
                opportunities across all teams and roles.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-2">
                Training Initiative
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Provide bias awareness training for managers and nomination reviewers 
                to improve fairness in the selection process.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}