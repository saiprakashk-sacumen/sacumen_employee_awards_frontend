import { faker } from '@faker-js/faker';
import { Nomination, User, DashboardMetrics, Evidence } from '../types';

// Generate mock users
export const generateMockUsers = (): User[] => {
  const roles: Array<'admin' | 'manager' | 'employee'> = ['admin', 'manager', 'employee'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  
  return Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(roles),
    department: faker.helpers.arrayElement(departments),
    avatar: faker.image.avatar(),
  }));
};

// Generate evidence data
const generateEvidence = (): Evidence => ({
  slackMessages: Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, () => ({
    id: faker.string.uuid(),
    channel: faker.helpers.arrayElement(['#general', '#team-updates', '#kudos', '#random']),
    timestamp: faker.date.recent({ days: 30 }).toISOString(),
    author: faker.person.fullName(),
    message: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    reactions: faker.number.int({ min: 0, max: 15 }),
  })),
  jiraTickets: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    id: `TICKET-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['Done', 'In Progress', 'Completed']),
    assignee: faker.person.fullName(),
    completedDate: faker.date.recent({ days: 60 }).toISOString(),
    storyPoints: faker.number.int({ min: 1, max: 8 }),
  })),
  attendanceData: Array.from({ length: 30 }, (_, index) => ({
    date: faker.date.recent({ days: 30 - index }).toISOString().split('T')[0],
    hoursWorked: faker.number.float({ min: 7, max: 10, fractionDigits: 1 }),
    overtime: faker.number.float({ min: 0, max: 3, fractionDigits: 1 }),
    status: faker.helpers.arrayElement(['present', 'present', 'present', 'partial', 'absent']),
  })),
});

// Generate mock nominations
export const generateMockNominations = (users: User[]): Nomination[] => {
  const awardTypes: Array<'monthly' | 'quarterly' | 'yearly'> = ['monthly', 'quarterly', 'yearly'];
  const biasTypes = ['Gender bias', 'Age bias', 'Department bias', 'Tenure bias'];
  const statuses: Array<'pending' | 'approved' | 'rejected' | 'under_review'> = 
    ['pending', 'approved', 'rejected', 'under_review'];

  return Array.from({ length: 150 }, () => {
    const employee = faker.helpers.arrayElement(users);
    const nominator = faker.helpers.arrayElement(users.filter(u => u.id !== employee.id));
    const sentimentScore = faker.number.float({ min: 0.1, max: 1.0, fractionDigits: 2 });
    const hasBiasIssues = faker.datatype.boolean({ probability: 0.15 });
    
    return {
      id: faker.string.uuid(),
      employeeName: employee.name,
      employeeId: employee.id,
      department: employee.department,
      nominatorName: nominator.name,
      nominatorId: nominator.id,
      awardType: faker.helpers.arrayElement(awardTypes),
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      description: faker.lorem.paragraphs(faker.number.int({ min: 2, max: 4 })),
      resourceName: employee.name,
      projectAligned: faker.helpers.maybe(() => faker.company.name(), { probability: 0.6 }),
      verbiage: faker.lorem.paragraphs(faker.number.int({ min: 2, max: 4 })),
      supportingAcknowledgement: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 2 })),
      coreValues: faker.helpers.arrayElements(['customer_delight', 'innovation', 'team_work', 'being_fair', 'ownership'], { min: 1, max: 3 }),
      overallRating: faker.number.int({ min: 3, max: 5 }),
      supportingDocuments: [],
      sentimentScore,
      biasFlags: hasBiasIssues ? faker.helpers.arrayElements(biasTypes, { min: 1, max: 2 }) : [],
      hasBiasIssues,
      dateSubmitted: faker.date.recent({ days: 90 }).toISOString(),
      status: faker.helpers.arrayElement(statuses),
      evidence: generateEvidence(),
    };
  });
};

// Generate dashboard metrics
export const generateDashboardMetrics = (nominations: Nomination[]): DashboardMetrics => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const thisMonth = nominations.filter(n => {
    const date = new Date(n.dateSubmitted);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  const thisQuarter = nominations.filter(n => {
    const date = new Date(n.dateSubmitted);
    const quarter = Math.floor(date.getMonth() / 3);
    const currentQuarter = Math.floor(currentMonth / 3);
    return quarter === currentQuarter && date.getFullYear() === currentYear;
  });
  
  const thisYear = nominations.filter(n => {
    const date = new Date(n.dateSubmitted);
    return date.getFullYear() === currentYear;
  });

  const uniqueNominees = new Set(nominations.map(n => n.employeeId)).size;
  const avgSentimentScore = nominations.reduce((acc, n) => acc + n.sentimentScore, 0) / nominations.length;
  const flaggedNominations = nominations.filter(n => n.hasBiasIssues).length;

  // Generate monthly trends for the past 6 months
  const monthlyTrends = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(currentYear, currentMonth - index, 1);
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
    const monthNominations = nominations.filter(n => {
      const date = new Date(n.dateSubmitted);
      return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear();
    });
    
    return {
      month: monthName,
      nominations: monthNominations.length,
      sentiment: monthNominations.length > 0 
        ? monthNominations.reduce((acc, n) => acc + n.sentimentScore, 0) / monthNominations.length 
        : 0,
    };
  }).reverse();

  return {
    totalNominations: {
      month: thisMonth.length,
      quarter: thisQuarter.length,
      year: thisYear.length,
    },
    uniqueNominees,
    avgSentimentScore: Number(avgSentimentScore.toFixed(2)),
    biasCheckResults: {
      total: nominations.length,
      flagged: flaggedNominations,
      percentage: Number(((flaggedNominations / nominations.length) * 100).toFixed(1)),
    },
    monthlyTrends,
  };
};

// Initialize mock data
export const mockUsers = generateMockUsers();
export const mockNominations = generateMockNominations(mockUsers);
export const mockMetrics = generateDashboardMetrics(mockNominations);

// Current user for demo purposes
export const currentUser: User = {
  id: 'current-user-id',
  name: 'John Admin',
  email: 'john.admin@company.com',
  role: 'admin',
  department: 'Engineering',
  avatar: faker.image.avatar(),
};