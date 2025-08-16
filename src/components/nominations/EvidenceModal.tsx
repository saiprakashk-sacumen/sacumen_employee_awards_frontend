import React from 'react';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { Nomination } from '../../types';
import { MessageSquare, FileText, Clock, Calendar, User, TrendingUp } from 'lucide-react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomination: Nomination | null;
}

export function EvidenceModal({ isOpen, onClose, nomination }: EvidenceModalProps) {
  if (!nomination) return null;

  const { evidence } = nomination;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Evidence for ${nomination.employeeName}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="sm">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evidence.slackMessages.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Slack Messages
                </p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evidence.jiraTickets.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jira Tickets
                </p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evidence.attendanceData
                    .reduce((total, record) => total + record.hoursWorked, 0)
                    .toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hours Worked
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Slack Messages */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
            Slack Messages
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {evidence.slackMessages.map((message) => (
              <Card key={message.id} padding="sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {message.author}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {message.channel}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {message.message}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(message.timestamp).toLocaleString()}</span>
                    <span>{message.reactions} reactions</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Jira Tickets */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            Jira Tickets
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {evidence.jiraTickets.map((ticket) => (
              <Card key={ticket.id} padding="sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {ticket.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === 'Done' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {ticket.title}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Assignee: {ticket.assignee}</span>
                    <span>{ticket.storyPoints} points</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Completed: {new Date(ticket.completedDate).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Recent Attendance (Last 30 Days)
          </h3>
          <Card padding="sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evidence.attendanceData.filter(d => d.status === 'present').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days Present</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evidence.attendanceData
                    .reduce((total, record) => total + record.hoursWorked, 0)
                    .toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {evidence.attendanceData
                    .reduce((total, record) => total + record.overtime, 0)
                    .toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overtime Hours</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(evidence.attendanceData
                    .reduce((total, record) => total + record.hoursWorked, 0) / evidence.attendanceData.length)
                    .toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Hours/Day</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
}