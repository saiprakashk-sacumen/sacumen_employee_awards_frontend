import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { EvidenceModal } from "./EvidenceModal";
import api from "../../utils/api";
import { Nomination } from "../../types";

interface NominationsTableProps {
  onViewEvidence?: (nomination: Nomination) => void;
}

export function NominationsTable({ onViewEvidence }: NominationsTableProps) {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNomination, setSelectedNomination] =
    useState<Nomination | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const fetchNominations = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Nomination[]>("/nominations/");
      setNominations(response.data);
    } catch (error) {
      console.error("Failed to fetch nominations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominations();
  }, []);

  const handleViewEvidence = (nomination: Nomination) => {
    setSelectedNomination(nomination);
    setShowEvidenceModal(true);
    onViewEvidence?.(nomination);
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nominee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Justification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Core Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">
                        Loading...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : nominations.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No nominations found
                  </td>
                </tr>
              ) : (
                nominations.map((nomination) => (
                  <tr
                    key={nomination.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {nomination.nominee_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {nomination.nominee_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                      {nomination.project_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate dark:text-white">
                      {nomination.justification_text}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize dark:text-white">
                      {nomination.core_value.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                      {nomination.rating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize dark:text-white">
                      {nomination.nomination_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                      {nomination.manager_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(nomination.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEvidence(nomination)}
                        title="View Evidence"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        nomination={selectedNomination}
      />
    </div>
  );
}
