// Core types for the Employee Awards Automation system
export type UserRole = "admin" | "manager" | "employee";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role: string; // simplify for now
  department?: string;
  avatar?: string;
}

export interface Nomination {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  nominatorName: string;
  nominatorId: string;
  awardType: "monthly" | "quarterly" | "yearly";
  title: string;
  description: string;
  resourceName: string;
  projectAligned?: string;
  verbiage: string;
  supportingAcknowledgement: string;
  coreValues: CoreValue[];
  overallRating: number;
  supportingDocuments: SupportingDocument[];
  sentimentScore: number;
  biasFlags: string[];
  hasBiasIssues: boolean;
  dateSubmitted: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  evidence: Evidence;
}

export type CoreValue =
  | "customer_delight"
  | "innovation"
  | "team_work"
  | "being_fair"
  | "ownership";

export interface SupportingDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface NominationFormData {
  resourceName: string;
  projectAligned?: string;
  verbiage: string;
  supportingAcknowledgement: string;
  coreValues: CoreValue[];
  overallRating: number;
  supportingDocuments: File[];
  awardType: "monthly" | "quarterly" | "yearly";
}
export interface Evidence {
  slackMessages: SlackMessage[];
  jiraTickets: JiraTicket[];
  attendanceData: AttendanceRecord[];
}

export interface SlackMessage {
  id: string;
  channel: string;
  timestamp: string;
  author: string;
  message: string;
  reactions: number;
}

export interface JiraTicket {
  id: string;
  title: string;
  status: string;
  assignee: string;
  completedDate: string;
  storyPoints: number;
}

export interface AttendanceRecord {
  date: string;
  hoursWorked: number;
  overtime: number;
  status: "present" | "absent" | "partial";
}

export interface DashboardMetrics {
  totalNominations: {
    month: number;
    quarter: number;
    year: number;
  };
  uniqueNominees: number;
  avgSentimentScore: number;
  biasCheckResults: {
    total: number;
    flagged: number;
    percentage: number;
  };
  monthlyTrends: Array<{
    month: string;
    nominations: number;
    sentiment: number;
  }>;
}
