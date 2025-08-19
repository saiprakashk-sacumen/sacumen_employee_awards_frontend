// src/pages/EmployeeMetrics.tsx
import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { getMetrics } from "../utils/api";
import { parsePrometheusMetrics, Metric } from "../services/parseMetrics";
import { getMetricValue } from "../services/helpers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const EmployeeMetrics = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User ID to name mapping (replace with real user directory if available)
  const userMapping: { [key: string]: string } = {
    USLACKBOT: "Slackbot",
    U09ALTU98N9: "Abhilash",
    U09ANKW5H0A: "Varsha",
    U09ANKXGRPC: "Saiprakash",
    U09ANKZMCRG: "Harsha",
    U09ANL082SW: "Prasanna",
  };

  const getUserName = (userId: string): string => {
    return userMapping[userId] || userId;
  };

  // Filter out zero values and Slackbot for cleaner charts
  const filterActiveUsers = (data: any[]) => {
    return data
      .filter((item) => item.count > 0 && item.user !== "USLACKBOT")
      .map((item) => ({
        ...item,
        user: getUserName(item.user),
      }));
  };

  // Fetch and parse metrics
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await getMetrics();
      const parsed = parsePrometheusMetrics(raw);
      console.log("Parsed metrics:", parsed);
      setMetrics(parsed);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setError("Failed to fetch metrics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl dark:text-white">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  /** ----------------- Jira Metrics ----------------- */
  const ticketsByStatus =
    metrics
      .find((m) => m.name === "jira_tickets_by_status")
      ?.values.map((v) => ({
        status: v.labels.status,
        count: v.value,
      })) || [];

  const ticketsByAssignee =
    metrics
      .find((m) => m.name === "jira_tickets_by_assignee")
      ?.values.map((v) => ({
        assignee:
          v.labels.assignee === "Unassigned"
            ? "Unassigned"
            : getUserName(v.labels.assignee),
        count: v.value,
      })) || [];

  const ticketsCompleted = getMetricValue(
    metrics,
    "jira_tickets_completed_total"
  );
  const openTickets = getMetricValue(metrics, "jira_open_tickets_total");
  const avgHoursPerTicket = getMetricValue(
    metrics,
    "jira_avg_hours_per_ticket"
  );
  const totalHoursLogged = getMetricValue(metrics, "jira_hours_logged_total");

  /** ----------------- Slack Metrics ----------------- */
  const slackMessages = filterActiveUsers(
    metrics
      .find((m) => m.name === "slack_messages_total")
      ?.values.map((v) => ({
        user: v.labels.user,
        count: v.value,
      })) || []
  );

  const slackReactions = filterActiveUsers(
    metrics
      .find((m) => m.name === "slack_reactions_total")
      ?.values.map((v) => ({
        user: v.labels.user,
        count: v.value,
      })) || []
  );

  const slackMentions = filterActiveUsers(
    metrics
      .find((m) => m.name === "slack_mentions_total")
      ?.values.map((v) => ({
        user: v.labels.user,
        count: v.value,
      })) || []
  );

  const slackActiveMinutes = filterActiveUsers(
    metrics
      .find((m) => m.name === "slack_active_minutes_total")
      ?.values.map((v) => ({
        user: v.labels.user,
        count: v.value,
      })) || []
  );

  const slackPositiveMessages = filterActiveUsers(
    metrics
      .find((m) => m.name === "slack_positive_messages_total")
      ?.values.map((v) => ({
        user: v.labels.user,
        count: v.value,
      })) || []
  );

  /** ----------------- Chart Colors ----------------- */
  const colors = [
    "#4ade80",
    "#3b82f6",
    "#facc15",
    "#ef4444",
    "#10b981",
    "#8b5cf6",
    "#f472b6",
  ];

  return (
    <div className="p-6 space-y-6 dark:text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Employee Awards Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time metrics from Jira, Slack, and Employee KPIs
        </p>
      </div>

      {/* Jira KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <h3 className="text-lg font-semibold mb-2">Tickets Completed</h3>
          <div className="text-3xl font-bold text-green-500">
            {ticketsCompleted}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-2">Open Tickets</h3>
          <div className="text-3xl font-bold text-blue-500">{openTickets}</div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-2">Hours Logged</h3>
          <div className="text-3xl font-bold text-purple-500">
            {totalHoursLogged}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-2">Avg Hours / Ticket</h3>
          <div className="text-3xl font-bold text-orange-500">
            {Array.isArray(avgHoursPerTicket)
              ? Number(avgHoursPerTicket[0] ?? 0).toFixed(1)
              : Number(avgHoursPerTicket ?? 0).toFixed(1)}
          </div>
        </Card>
      </div>

      {/* Jira Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Tickets by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ticketsByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ status, count }) => `${status}: ${count}`}
              >
                {ticketsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Tickets by Assignee</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketsByAssignee}>
              <XAxis dataKey="assignee" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Slack Section */}
      <h2 className="text-2xl font-bold mb-4">Slack Activity</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slackMessages.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Messages Sent</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={slackMessages}>
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
        {slackReactions.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Reactions Given</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={slackReactions}>
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
        {slackMentions.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Mentions Received</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={slackMentions}>
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
        {slackActiveMinutes.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Active Minutes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={slackActiveMinutes}>
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
        {slackPositiveMessages.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Positive Messages</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={slackPositiveMessages}>
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f472b6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default EmployeeMetrics;
