// Core types for the Employee Awards Automation system
export type UserRole = "admin" | "manager" | "employee";

export interface User {
  is_approved?: boolean;
  id?: string;
  name?: string;
  email?: string;
  role: string;
  department?: string;
  avatar?: string;
}

export interface Nomination {
  id: number;
  nominee_id: string;
  nominee_name: string;
  project_name: string;
  justification_text: string;
  customer_email: string;
  core_value: string;
  rating: number;
  nomination_type: string;
  manager_id: number;
  manager_name: string;
  created_at: string;
  updated_at: string | null;
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

// Onboarding Manager types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "completed";
  createdAt: string;
}

export interface ManagerProjectMapping {
  id: string;
  managerId: string;
  managerName: string;
  projectId: string;
  projectName: string;
  employeeCount: number;
  employees: User[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingMetrics {
  totalManagers: number;
  totalProjects: number;
  totalEmployees: number;
  overloadedManagers: number;
  managerDistribution: Array<{
    managerName: string;
    employeeCount: number;
  }>;
}
// Sentimental Insights types
export interface SentimentResult {
  nomination_id: number;
  employee_id: string;
  employee_name: string;
  manager_id: number;
  manager_name: string;
  project_name: string;
  nomination_type: "monthly" | "quarterly" | "yearly";
  sentiment_label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  sentiment_score: number;
  predicted_core_value: string;
  core_value_alignment: number;
  analyzed_at: string;
}

export interface SentimentMetrics {
  totalAnalyzed: number;
  averageSentimentScore: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topCoreValues: Array<{
    value: string;
    count: number;
    averageAlignment: number;
  }>;
  projectSentiments: Array<{
    project: string;
    averageScore: number;
    totalNominations: number;
  }>;
  managerPerformance: Array<{
    manager: string;
    averageScore: number;
    totalNominations: number;
  }>;
}
