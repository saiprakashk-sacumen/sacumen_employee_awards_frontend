import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Download, FileText, Calendar } from 'lucide-react';
import { MockAPI } from '../utils/mockApi';

export function Reports() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await MockAPI.exportNominations(exportFormat);
      
      // Simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message (in a real app, you'd use a toast notification)
      alert(`Export complete! File: ${result.filename}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports & Exports
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Generate and download comprehensive reports
        </p>
      </div>

      {/* Export Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export Nominations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Download all nomination data with filters applied
            </p>
          </div>
          <Download className="h-6 w-6 text-blue-600" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <Select
            label="Export Format"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}
            options={[
              { value: 'csv', label: 'CSV Spreadsheet' },
              { value: 'pdf', label: 'PDF Report' },
            ]}
          />
          
          <Button 
            onClick={handleExport}
            isLoading={isExporting}
            className="sm:mb-1"
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </Card>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Summary Report
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current month nomination overview
              </p>
            </div>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Nominations:</span>
              <span className="font-medium text-gray-900 dark:text-white">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Approved:</span>
              <span className="font-medium text-green-600 dark:text-green-400">32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Under Review:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rejected:</span>
              <span className="font-medium text-red-600 dark:text-red-400">3</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bias Analysis Report
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI bias detection insights
              </p>
            </div>
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Analyzed:</span>
              <span className="font-medium text-gray-900 dark:text-white">150</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Bias Flags:</span>
              <span className="font-medium text-orange-600 dark:text-orange-400">22</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
              <span className="font-medium text-green-600 dark:text-green-400">85.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Sentiment:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">72%</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </Card>
      </div>

      {/* Historical Data */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Historical Performance
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Year-over-year comparison and trends
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nominations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg Sentiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bias Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Approval Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Q4 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  127
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  74.2%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  14.6%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  68.1%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Q3 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  98
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  71.8%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  18.4%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  65.3%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Q2 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  112
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  69.4%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  22.3%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  62.5%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}