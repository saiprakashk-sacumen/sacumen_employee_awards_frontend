import { Nomination, User, DashboardMetrics } from "../types";
import { NominationFormData } from "../types";
import {
  mockUsers,
  mockNominations,
  mockMetrics,
  currentUser,
  mockProjects,
  mockManagerProjectMappings,
  mockOnboardingMetrics,
  mockSentimentResults,
  mockSentimentMetrics,
} from "./mockData";
import {
  Project,
  ManagerProjectMapping,
  OnboardingMetrics,
  SentimentResult,
  SentimentMetrics,
} from "../types";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export class MockAPI {
  // Authentication
  static async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    await delay(800);

    if (email === "admin@company.com" && password === "admin123") {
      return { user: currentUser, token: "mock-jwt-token" };
    }

    throw new Error("Invalid credentials");
  }

  static async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem("authToken");
  }

  // Dashboard metrics
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    await delay(500);
    return mockMetrics;
  }

  // Nominations
  static async getNominations(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    filters?: { awardType?: string; dateRange?: string; department?: string }
  ): Promise<{
    data: Nomination[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    await delay(400);

    let filteredNominations = [...mockNominations];

    // Apply search filter
    if (search) {
      filteredNominations = filteredNominations.filter(
        (nomination) =>
          nomination.employeeName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          nomination.title.toLowerCase().includes(search.toLowerCase()) ||
          nomination.department.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.awardType) {
      filteredNominations = filteredNominations.filter(
        (n) => n.awardType === filters.awardType
      );
    }

    if (filters?.department) {
      filteredNominations = filteredNominations.filter(
        (n) => n.department === filters.department
      );
    }

    if (filters?.dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case "last7days":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "last30days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "last3months":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      filteredNominations = filteredNominations.filter(
        (n) => new Date(n.dateSubmitted) >= startDate
      );
    }

    // Sort by date (newest first)
    filteredNominations.sort(
      (a, b) =>
        new Date(b.dateSubmitted).getTime() -
        new Date(a.dateSubmitted).getTime()
    );

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredNominations.slice(
      startIndex,
      startIndex + pageSize
    );

    return {
      data: paginatedData,
      total: filteredNominations.length,
      page,
      pageSize,
    };
  }

  static async getNominationById(id: string): Promise<Nomination | null> {
    await delay(300);
    return mockNominations.find((n) => n.id === id) || null;
  }

  static async updateNominationStatus(
    id: string,
    status: Nomination["status"]
  ): Promise<Nomination> {
    await delay(600);
    const nomination = mockNominations.find((n) => n.id === id);
    if (!nomination) {
      throw new Error("Nomination not found");
    }
    nomination.status = status;
    return nomination;
  }

  // Users
  static async getUsers(): Promise<User[]> {
    await delay(400);
    return mockUsers;
  }

  // Export functions
  static async exportNominations(
    format: "csv" | "pdf"
  ): Promise<{ url: string; filename: string }> {
    await delay(1500);

    const filename = `nominations_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return {
      url: `#`, // In a real app, this would be a download URL
      filename,
    };
  }

  // Settings
  static async updateIntegrationSettings(settings: any): Promise<void> {
    await delay(800);
    // Mock saving integration settings
    console.log("Integration settings updated:", settings);
  }

  // Submit nomination
  static async submitNomination(
    formData: NominationFormData & {
      coreValues: string[];
      supportingDocuments: File[];
    }
  ): Promise<void> {
    await delay(1200);
    // Mock submission - in real app, this would upload files and save to database
    console.log("Nomination submitted:", formData);
  }

  // Onboarding Manager APIs
  static async getOnboardingMetrics(): Promise<OnboardingMetrics> {
    await delay(500);
    return mockOnboardingMetrics;
  }

  static async getProjects(): Promise<Project[]> {
    await delay(400);
    return mockProjects;
  }

  static async getManagerProjectMappings(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    filters?: { managerId?: string; projectId?: string }
  ): Promise<{
    data: ManagerProjectMapping[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    await delay(400);

    let filteredMappings = [...mockManagerProjectMappings];

    // Apply search filter
    if (search) {
      filteredMappings = filteredMappings.filter(
        (mapping) =>
          mapping.managerName.toLowerCase().includes(search.toLowerCase()) ||
          mapping.projectName.toLowerCase().includes(search.toLowerCase()) ||
          mapping.employees.some((emp) =>
            emp.name.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // Apply filters
    if (filters?.managerId) {
      filteredMappings = filteredMappings.filter(
        (m) => m.managerId === filters.managerId
      );
    }

    if (filters?.projectId) {
      filteredMappings = filteredMappings.filter(
        (m) => m.projectId === filters.projectId
      );
    }

    // Sort by manager name
    filteredMappings.sort((a, b) => a.managerName.localeCompare(b.managerName));

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredMappings.slice(
      startIndex,
      startIndex + pageSize
    );

    return {
      data: paginatedData,
      total: filteredMappings.length,
      page,
      pageSize,
    };
  }

  static async assignManagerToProject(
    managerId: string,
    projectId: string
  ): Promise<ManagerProjectMapping> {
    await delay(800);

    // Check for duplicate assignment
    const existingMapping = mockManagerProjectMappings.find(
      (m) => m.managerId === managerId && m.projectId === projectId
    );

    if (existingMapping) {
      throw new Error("Manager is already assigned to this project");
    }

    const manager = mockUsers.find((u) => u.id === managerId);
    const project = mockProjects.find((p) => p.id === projectId);

    if (!manager || !project) {
      throw new Error("Manager or project not found");
    }

    // Create new mapping with random employees
    const employees = mockUsers.filter((u) => u.role === "employee");
    const assignedEmployees = employees.slice(
      0,
      Math.floor(Math.random() * 5) + 2
    );

    const newMapping: ManagerProjectMapping = {
      id: `mapping-${Date.now()}`,
      managerId,
      managerName: manager.name,
      projectId,
      projectName: project.name,
      employeeCount: assignedEmployees.length,
      employees: assignedEmployees,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockManagerProjectMappings.push(newMapping);
    return newMapping;
  }

  static async exportManagerProjectMappings(
    format: "csv"
  ): Promise<{ url: string; filename: string }> {
    await delay(1000);

    const filename = `manager_project_mappings_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return {
      url: `#`, // In a real app, this would be a download URL
      filename,
    };
  }

  // Sentimental Insights APIs
  static async getSentimentResults(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    filters?: {
      sentimentLabel?: string;
      nominationType?: string;
      projectName?: string;
      managerName?: string;
    }
  ): Promise<{
    data: SentimentResult[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    await delay(400);

    let filteredResults = [...mockSentimentResults];

    // Apply search filter
    if (search) {
      filteredResults = filteredResults.filter(
        (result) =>
          result.employee_name.toLowerCase().includes(search.toLowerCase()) ||
          result.manager_name.toLowerCase().includes(search.toLowerCase()) ||
          result.project_name.toLowerCase().includes(search.toLowerCase()) ||
          result.predicted_core_value
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.sentimentLabel) {
      filteredResults = filteredResults.filter(
        (r) => r.sentiment_label === filters.sentimentLabel
      );
    }

    if (filters?.nominationType) {
      filteredResults = filteredResults.filter(
        (r) => r.nomination_type === filters.nominationType
      );
    }

    if (filters?.projectName) {
      filteredResults = filteredResults.filter(
        (r) => r.project_name === filters.projectName
      );
    }

    if (filters?.managerName) {
      filteredResults = filteredResults.filter(
        (r) => r.manager_name === filters.managerName
      );
    }

    // Sort by analyzed date (newest first)
    filteredResults.sort(
      (a, b) =>
        new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime()
    );

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredResults.slice(
      startIndex,
      startIndex + pageSize
    );

    return {
      data: paginatedData,
      total: filteredResults.length,
      page,
      pageSize,
    };
  }

  static async getSentimentMetrics(): Promise<SentimentMetrics> {
    await delay(500);
    return mockSentimentMetrics;
  }

  static async exportSentimentResults(
    format: "csv"
  ): Promise<{ url: string; filename: string }> {
    await delay(1000);

    const filename = `sentiment_results_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return {
      url: `#`, // In a real app, this would be a download URL
      filename,
    };
  }
}
