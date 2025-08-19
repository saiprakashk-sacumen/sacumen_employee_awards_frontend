import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Trophy, BarChart3 } from "lucide-react";
import { Select } from "../components/ui/Select";
import api from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface TopEmployee {
  employee_id: string;
  employee_name: string;
  score: number;
  rank: number;
}

interface Manager {
  manager_id: number;
  manager_name: string;
  email: string;
  projects: string;
  total_employees: number;
}

export function TopNominees() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
    null
  );
  const [employees, setEmployees] = useState<TopEmployee[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoadingManagers(true);
        const { data } = await api.get<Manager[]>("/managers/approved");
        setManagers(data);
        if (data.length > 0) setSelectedManagerId(data[0].manager_id);
      } catch (error) {
        console.error("Failed to fetch managers:", error);
      } finally {
        setLoadingManagers(false);
      }
    };
    fetchManagers();
  }, []);

  // Fetch top employees for selected manager
  useEffect(() => {
    if (!selectedManagerId) return;

    const fetchTopEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const { data } = await api.get(
          `/superadmin/best_employees?manager_id=${selectedManagerId}`
        );
        setEmployees(data.top_employees || []);
      } catch (error) {
        console.error("Failed to fetch top employees:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchTopEmployees();
  }, [selectedManagerId]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Top Nominees
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Recognizing the best performing employees
          </p>
        </div>
      </div>

      {/* Manager Selection */}
      <Card>
        <Select
          label="Select Manager"
          value={selectedManagerId?.toString() || ""}
          onChange={(e) => setSelectedManagerId(Number(e.target.value))}
          options={[
            {
              value: "",
              label: loadingManagers ? "Loading..." : "Select Manager",
            },
            ...managers.map((m) => ({
              value: m.manager_id.toString(),
              label: `${m.manager_name} (${m.total_employees} employees)`,
            })),
          ]}
          disabled={loadingManagers || managers.length === 0}
        />
      </Card>

      {/* Loading & Empty States */}
      {loadingEmployees && (
        <Card className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Loading top nominees...
          </p>
        </Card>
      )}

      {!loadingEmployees && employees.length === 0 && selectedManagerId && (
        <Card className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No nominees data available for this manager.
          </p>
        </Card>
      )}

      {/* Leaderboard Table */}
      {!loadingEmployees && employees.length > 0 && (
        <>
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Leaderboard
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {employees.map((emp) => (
                    <tr
                      key={emp.employee_id}
                      className={
                        emp.rank === 1
                          ? "bg-yellow-50 dark:bg-yellow-900/10"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                        #{emp.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-300">
                        {emp.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-300">
                        {(emp.score * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Bar Chart */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Performance Scores
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={employees}
                layout="vertical"
                margin={{ left: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 1]}
                  tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                />
                <YAxis dataKey="employee_name" type="category" width={150} />
                <Tooltip
                  formatter={(val: number) => `${(val * 100).toFixed(2)}%`}
                />
                <Bar
                  dataKey="score"
                  fill="#3b82f6"
                  radius={[0, 6, 6, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
