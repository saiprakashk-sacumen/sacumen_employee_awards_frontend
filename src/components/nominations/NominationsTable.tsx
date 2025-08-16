import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
import { Nomination } from '../../types';
import { MockAPI } from '../../utils/mockApi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { EvidenceModal } from './EvidenceModal';

interface NominationsTableProps {
  onViewEvidence?: (nomination: Nomination) => void;
}

export function NominationsTable({ onViewEvidence }: NominationsTableProps) {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNominations, setTotalNominations] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    awardType: '',
    dateRange: '',
    department: '',
  });
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const pageSize = 10;

  const fetchNominations = async () => {
    setIsLoading(true);
    try {
      const response = await MockAPI.getNominations(
        currentPage,
        pageSize,
        searchQuery,
        filters
      );
      setNominations(response.data);
      setTotalNominations(response.total);
    } catch (error) {
      console.error('Failed to fetch nominations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominations();
  }, [currentPage, searchQuery, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleViewEvidence = (nomination: Nomination) => {
    setSelectedNomination(nomination);
    setShowEvidenceModal(true);
    onViewEvidence?.(nomination);
  };

  const handleStatusUpdate = async (nominationId: string, newStatus: Nomination['status']) => {
    try {
      await MockAPI.updateNominationStatus(nominationId, newStatus);
      fetchNominations(); // Refresh the table
    } catch (error) {
      console.error('Failed to update nomination status:', error);
    }
  };

  const getStatusBadge = (status: Nomination['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
      under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getBiasIndicator = (nomination: Nomination) => {
    if (!nomination.hasBiasIssues) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
          Clear
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400">
        {nomination.biasFlags.length} Flag{nomination.biasFlags.length > 1 ? 's' : ''}
      </span>
    );
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600 dark:text-green-400';
    if (score >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const totalPages = Math.ceil(totalNominations / pageSize);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search nominations..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Select
              value={filters.awardType}
              onChange={(e) => handleFilterChange('awardType', e.target.value)}
              options={[
                { value: '', label: 'All Award Types' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
            
            <Select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              options={[
                { value: '', label: 'All Time' },
                { value: 'last7days', label: 'Last 7 Days' },
                { value: 'last30days', label: 'Last 30 Days' },
                { value: 'last3months', label: 'Last 3 Months' },
              ]}
            />
            
            <Select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              options={[
                { value: '', label: 'All Departments' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Sales', label: 'Sales' },
                { value: 'HR', label: 'HR' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Operations', label: 'Operations' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Award Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sentiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bias Check
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
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
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : nominations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No nominations found
                  </td>
                </tr>
              ) : (
                nominations.map((nomination) => (
                  <tr key={nomination.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {nomination.employeeName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {nomination.department}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-gray-900 dark:text-white">
                        {nomination.awardType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getSentimentColor(nomination.sentimentScore)}`}>
                        {(nomination.sentimentScore * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getBiasIndicator(nomination)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(nomination.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(nomination.dateSubmitted).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEvidence(nomination)}
                          title="View Evidence"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalNominations)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{totalNominations}</span>{' '}
                results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
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