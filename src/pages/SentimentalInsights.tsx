import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import api from "../utils/api";
import { SentimentResult } from "../types";
import {
  Users,
  Target,
  Calendar,
  Award,
  Heart,
  Star,
  Shield,
} from "lucide-react";

export function SentimentalInsights() {
  const { showToast } = useToast();
  const [sentimentResults, setSentimentResults] = useState<SentimentResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sentimentLabel: "",
    nominationType: "",
    projectName: "",
    managerName: "",
  });

  const pageSize = 10;

  useEffect(() => {
    fetchSentimentResults();
  }, [currentPage, searchQuery, filters]);

  const fetchSentimentResults = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
        sentiment_label: filters.sentimentLabel || undefined,
        nomination_type: filters.nominationType || undefined,
        project_name: filters.projectName || undefined,
        manager_name: filters.managerName || undefined,
      };

      const response = await api.get("/api/sentiment-results", { params });

      if (Array.isArray(response.data)) {
        setSentimentResults(response.data);
        setTotalResults(response.data.length);
      } else {
        setSentimentResults(response.data.results || []);
        setTotalResults(response.data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch sentiment results:", error);
      showToast("error", "Error", "Failed to load sentiment results");
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case "POSITIVE":
        return "text-green-600 dark:text-green-400";
      case "NEGATIVE":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const getSentimentBadge = (label: string) => {
    const colors = {
      POSITIVE:
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400",
      NEGATIVE: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400",
      NEUTRAL:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[label as keyof typeof colors]
        }`}
      >
        {label}
      </span>
    );
  };

  const getCoreValueIcon = (value: string) => {
    switch (value?.toLowerCase()) {
      case "customer delight":
        return <Heart className="h-4 w-4" />;
      case "innovation":
        return <Star className="h-4 w-4" />;
      case "team work":
        return <Users className="h-4 w-4" />;
      case "being fair":
        return <Shield className="h-4 w-4" />;
      case "ownership":
        return <Target className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sentimental Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AI-powered sentiment analysis and core value predictions for
          nominations
        </p>
      </div>

      {/* Detailed Results Table */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detailed Sentiment Results
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white ">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white">
                  Sentiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white">
                  Core Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white">
                  Alignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white">
                  Analyzed
                </th>
              </tr>
            </thead>
            <tbody>
              {sentimentResults.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No sentiment results found
                  </td>
                </tr>
              ) : (
                sentimentResults.map((result) => (
                  <tr
                    key={result.nomination_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 dark:text-white">
                      {result.employee_name} <br />{" "}
                      <span className="text-xs text-gray-400">
                        ID: {result.employee_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 dark:text-white">
                      {result.manager_name}
                    </td>
                    <td className="px-6 py-4 dark:text-white">
                      {result.project_name}
                    </td>
                    <td className="px-6 py-4 dark:text-white">
                      {getSentimentBadge(result.sentiment_label)}
                    </td>
                    <td className="px-6 py-4 ">
                      <span
                        className={`font-medium ${getSentimentColor(
                          result.sentiment_label
                        )}`}
                      >
                        {(result.sentiment_score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2 dark:text-white">
                      {getCoreValueIcon(result.predicted_core_value)}
                      <span>{result.predicted_core_value}</span>
                    </td>
                    <td className="px-6 py-4 dark:text-white">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${result.core_value_alignment}%` }}
                        />
                      </div>
                      <span>{result.core_value_alignment}%</span>
                    </td>
                    <td className="px-6 py-4 capitalize dark:text-white">
                      {result.nomination_type}
                    </td>
                    <td className="px-6 py-4 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(result.analyzed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t dark:border-gray-700 flex justify-between">
            <div className="text-sm">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalResults)} of {totalResults}{" "}
              results
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
