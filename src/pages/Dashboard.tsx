import React, { useState, useEffect } from "react";
import { Card, StatCard } from "../components/ui/Card";
import { Award, TrendingUp, Calendar, Star } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "../utils/api";

interface DashboardResponse {
  this_month_nominations: number;
  last_month_nominations: number;
  quarterly_nominations: number;
  yearly_nominations: number;
  trending_percentage: number;
  average_sentiment_this_month: number;
  monthly_nomination_trends: Record<string, number>;
  average_sentiment_trends: Record<string, number>;
}

interface ChartData {
  month: string;
  nominations: number;
  sentiment: number;
}

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardResponse | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get<DashboardResponse>("/dashboard/");
        setMetrics(data);

        // Convert trends to chart data
        const months = Object.keys(data.monthly_nomination_trends);
        const chart: ChartData[] = months.map((month) => ({
          month,
          nominations: data.monthly_nomination_trends[month],
          sentiment: data.average_sentiment_trends[month] ?? 0,
        }));
        setChartData(chart);
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
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
        <p className="text-gray-500 dark:text-gray-400">
          Failed to load dashboard data
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Overview of nomination activities and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="This Month"
          value={metrics.this_month_nominations}
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
          change={{
            value: metrics.trending_percentage,
            label: "from last month",
            trend: metrics.trending_percentage >= 0 ? "up" : "down",
          }}
        />

        <StatCard
          title="Avg Sentiment Score"
          value={`${(metrics.average_sentiment_this_month * 100).toFixed(1)}%`}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          change={{
            value: 0, // Optional: can calculate change if API provides
            label: "from last month",
            trend: "up",
          }}
        />

        <StatCard
          title="Quarterly Nominations"
          value={metrics.quarterly_nominations}
          icon={<Star className="h-6 w-6 text-green-600" />}
          change={{
            value: 0,
            label: "",
            trend: "up",
          }}
        />

        <StatCard
          title="Yearly Nominations"
          value={metrics.yearly_nominations}
          icon={<Award className="h-6 w-6 text-yellow-600" />}
          change={{
            value: 0,
            label: "",
            trend: "up",
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Nomination Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(31 41 55)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="nominations"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", strokeWidth: 2 }}
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
            <BarChart data={chartData}>
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
                  backgroundColor: "rgb(31 41 55)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
                formatter={(value: any) => [
                  `${(value * 100).toFixed(1)}%`,
                  "Sentiment",
                ]}
              />
              <Bar dataKey="sentiment" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
