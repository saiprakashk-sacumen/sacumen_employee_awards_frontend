import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Settings as SettingsIcon, Slack, FileText, Clock, Key } from 'lucide-react';
import { MockAPI } from '../utils/mockApi';

export function Settings() {
  const [integrationSettings, setIntegrationSettings] = useState({
    slackToken: '',
    jiraUrl: '',
    jiraUsername: '',
    jiraApiKey: '',
    attendanceSystemUrl: '',
    prometheusEndpoint: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await MockAPI.updateIntegrationSettings(integrationSettings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure integrations, metrics, and system preferences
        </p>
      </div>

      {/* Integration Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <Key className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Integration Settings
          </h2>
        </div>

        <div className="space-y-6">
          {/* Slack Integration */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Slack className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Slack Integration
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Slack Bot Token"
                type="password"
                placeholder="xoxb-your-slack-bot-token"
                value={integrationSettings.slackToken}
                onChange={(e) => setIntegrationSettings(prev => ({ ...prev, slackToken: e.target.value }))}
                hint="Required for fetching team messages and mentions"
              />
              <div className="flex items-end">
                <Button variant="outline" size="sm" className="mb-1">
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* Jira Integration */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Jira Integration
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Jira URL"
                placeholder="https://yourcompany.atlassian.net"
                value={integrationSettings.jiraUrl}
                onChange={(e) => setIntegrationSettings(prev => ({ ...prev, jiraUrl: e.target.value }))}
              />
              <Input
                label="Username"
                placeholder="user@company.com"
                value={integrationSettings.jiraUsername}
                onChange={(e) => setIntegrationSettings(prev => ({ ...prev, jiraUsername: e.target.value }))}
              />
              <Input
                label="API Key"
                type="password"
                placeholder="Your Jira API key"
                value={integrationSettings.jiraApiKey}
                onChange={(e) => setIntegrationSettings(prev => ({ ...prev, jiraApiKey: e.target.value }))}
              />
              <div className="flex items-end">
                <Button variant="outline" size="sm" className="mb-1">
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          {/* Attendance System */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Attendance System
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="System URL"
                placeholder="https://attendance.company.com/api"
                value={integrationSettings.attendanceSystemUrl}
                onChange={(e) => setIntegrationSettings(prev => ({ ...prev, attendanceSystemUrl: e.target.value }))}
              />
              <div className="flex items-end">
                <Button variant="outline" size="sm" className="mb-1">
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveSettings} isLoading={isSaving}>
            {isSaving ? 'Saving...' : 'Save Integration Settings'}
          </Button>
        </div>
      </Card>

      {/* Prometheus Metrics */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="h-6 w-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Metrics & Monitoring
          </h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Prometheus Endpoint"
            placeholder="http://prometheus:9090/metrics"
            value={integrationSettings.prometheusEndpoint}
            onChange={(e) => setIntegrationSettings(prev => ({ ...prev, prometheusEndpoint: e.target.value }))}
            hint="Endpoint for pushing application metrics"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Metric Collection Interval"
              value="5m"
              options={[
                { value: '1m', label: '1 minute' },
                { value: '5m', label: '5 minutes' },
                { value: '15m', label: '15 minutes' },
                { value: '30m', label: '30 minutes' },
              ]}
            />
            <Select
              label="Retention Period"
              value="30d"
              options={[
                { value: '7d', label: '7 days' },
                { value: '30d', label: '30 days' },
                { value: '90d', label: '90 days' },
                { value: '1y', label: '1 year' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Role Management */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Role Management
          </h2>
          <Button variant="outline" size="sm">
            Add User
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      John Admin
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      john.admin@company.com
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400">
                    Admin
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Engineering
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Sarah Manager
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      sarah.manager@company.com
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                    Manager
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Marketing
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}