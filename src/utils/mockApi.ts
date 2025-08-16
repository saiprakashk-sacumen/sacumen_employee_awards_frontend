import { Nomination, User, DashboardMetrics } from '../types';
import { NominationFormData } from '../types';
import { mockUsers, mockNominations, mockMetrics, currentUser } from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export class MockAPI {
  // Authentication
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(800);
    
    if (email === 'admin@company.com' && password === 'admin123') {
      return { user: currentUser, token: 'mock-jwt-token' };
    }
    
    throw new Error('Invalid credentials');
  }

  static async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem('authToken');
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
  ): Promise<{ data: Nomination[]; total: number; page: number; pageSize: number }> {
    await delay(400);
    
    let filteredNominations = [...mockNominations];

    // Apply search filter
    if (search) {
      filteredNominations = filteredNominations.filter(nomination =>
        nomination.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        nomination.title.toLowerCase().includes(search.toLowerCase()) ||
        nomination.department.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.awardType) {
      filteredNominations = filteredNominations.filter(n => n.awardType === filters.awardType);
    }

    if (filters?.department) {
      filteredNominations = filteredNominations.filter(n => n.department === filters.department);
    }

    if (filters?.dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (filters.dateRange) {
        case 'last7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last3months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      filteredNominations = filteredNominations.filter(n => 
        new Date(n.dateSubmitted) >= startDate
      );
    }

    // Sort by date (newest first)
    filteredNominations.sort((a, b) => 
      new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
    );

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredNominations.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total: filteredNominations.length,
      page,
      pageSize,
    };
  }

  static async getNominationById(id: string): Promise<Nomination | null> {
    await delay(300);
    return mockNominations.find(n => n.id === id) || null;
  }

  static async updateNominationStatus(id: string, status: Nomination['status']): Promise<Nomination> {
    await delay(600);
    const nomination = mockNominations.find(n => n.id === id);
    if (!nomination) {
      throw new Error('Nomination not found');
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
  static async exportNominations(format: 'csv' | 'pdf'): Promise<{ url: string; filename: string }> {
    await delay(1500);
    
    const filename = `nominations_export_${new Date().toISOString().split('T')[0]}.${format}`;
    return {
      url: `#`, // In a real app, this would be a download URL
      filename,
    };
  }

  // Settings
  static async updateIntegrationSettings(settings: any): Promise<void> {
    await delay(800);
    // Mock saving integration settings
    console.log('Integration settings updated:', settings);
  }

  // Submit nomination
  static async submitNomination(formData: NominationFormData & { coreValues: string[]; supportingDocuments: File[] }): Promise<void> {
    await delay(1200);
    // Mock submission - in real app, this would upload files and save to database
    console.log('Nomination submitted:', formData);
  }
}