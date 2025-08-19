import { faker } from "@faker-js/faker";
import {
  Nomination,
  User,
  DashboardMetrics,
  Evidence,
  Project,
  ManagerProjectMapping,
  OnboardingMetrics,
  SentimentResult,
  SentimentMetrics,
} from "../types";

// Generate mock users
export const generateMockUsers = (): User[] => {
  const roles: Array<"admin" | "manager" | "employee"> = [
    "admin",
    "manager",
    "employee",
  ];
  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
  ];

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
  slackMessages: Array.from(
    { length: faker.number.int({ min: 2, max: 8 }) },
    () => ({
      id: faker.string.uuid(),
      channel: faker.helpers.arrayElement([
        "#general",
        "#team-updates",
        "#kudos",
        "#random",
      ]),
      timestamp: faker.date.recent({ days: 30 }).toISOString(),
      author: faker.person.fullName(),
      message: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
      reactions: faker.number.int({ min: 0, max: 15 }),
    })
  ),
  jiraTickets: Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    () => ({
      id: `TICKET-${faker.number.int({ min: 1000, max: 9999 })}`,
      title: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(["Done", "In Progress", "Completed"]),
      assignee: faker.person.fullName(),
      completedDate: faker.date.recent({ days: 60 }).toISOString(),
      storyPoints: faker.number.int({ min: 1, max: 8 }),
    })
  ),
  attendanceData: Array.from({ length: 30 }, (_, index) => ({
    date: faker.date
      .recent({ days: 30 - index })
      .toISOString()
      .split("T")[0],
    hoursWorked: faker.number.float({ min: 7, max: 10, fractionDigits: 1 }),
    overtime: faker.number.float({ min: 0, max: 3, fractionDigits: 1 }),
    status: faker.helpers.arrayElement([
      "present",
      "present",
      "present",
      "partial",
      "absent",
    ]),
  })),
});

// Generate mock nominations
export const generateMockNominations = (users: User[]): Nomination[] => {
  const awardTypes: Array<"monthly" | "quarterly" | "yearly"> = [
    "monthly",
    "quarterly",
    "yearly",
  ];
  const biasTypes = [
    "Gender bias",
    "Age bias",
    "Department bias",
    "Tenure bias",
  ];
  const statuses: Array<"pending" | "approved" | "rejected" | "under_review"> =
    ["pending", "approved", "rejected", "under_review"];

  return Array.from({ length: 150 }, () => {
    const employee = faker.helpers.arrayElement(users);
    const nominator = faker.helpers.arrayElement(
      users.filter((u) => u.id !== employee.id)
    );
    const sentimentScore = faker.number.float({
      min: 0.1,
      max: 1.0,
      fractionDigits: 2,
    });
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
      projectAligned: faker.helpers.maybe(() => faker.company.name(), {
        probability: 0.6,
      }),
      verbiage: faker.lorem.paragraphs(faker.number.int({ min: 2, max: 4 })),
      supportingAcknowledgement: faker.lorem.paragraphs(
        faker.number.int({ min: 1, max: 2 })
      ),
      coreValues: faker.helpers.arrayElements(
        [
          "customer_delight",
          "innovation",
          "team_work",
          "being_fair",
          "ownership",
        ],
        { min: 1, max: 3 }
      ),
      overallRating: faker.number.int({ min: 3, max: 5 }),
      supportingDocuments: [],
      sentimentScore,
      biasFlags: hasBiasIssues
        ? faker.helpers.arrayElements(biasTypes, { min: 1, max: 2 })
        : [],
      hasBiasIssues,
      dateSubmitted: faker.date.recent({ days: 90 }).toISOString(),
      status: faker.helpers.arrayElement(statuses),
      evidence: generateEvidence(),
    };
  });
};

// Generate dashboard metrics
export const generateDashboardMetrics = (
  nominations: Nomination[]
): DashboardMetrics => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonth = nominations.filter((n) => {
    const date = new Date(n.dateSubmitted);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const thisQuarter = nominations.filter((n) => {
    const date = new Date(n.dateSubmitted);
    const quarter = Math.floor(date.getMonth() / 3);
    const currentQuarter = Math.floor(currentMonth / 3);
    return quarter === currentQuarter && date.getFullYear() === currentYear;
  });

  const thisYear = nominations.filter((n) => {
    const date = new Date(n.dateSubmitted);
    return date.getFullYear() === currentYear;
  });

  const uniqueNominees = new Set(nominations.map((n) => n.employeeId)).size;
  const avgSentimentScore =
    nominations.reduce((acc, n) => acc + n.sentimentScore, 0) /
    nominations.length;
  const flaggedNominations = nominations.filter((n) => n.hasBiasIssues).length;

  // Generate monthly trends for the past 6 months
  const monthlyTrends = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(currentYear, currentMonth - index, 1);
    const monthName = monthDate.toLocaleDateString("en-US", { month: "short" });
    const monthNominations = nominations.filter((n) => {
      const date = new Date(n.dateSubmitted);
      return (
        date.getMonth() === monthDate.getMonth() &&
        date.getFullYear() === monthDate.getFullYear()
      );
    });

    return {
      month: monthName,
      nominations: monthNominations.length,
      sentiment:
        monthNominations.length > 0
          ? monthNominations.reduce((acc, n) => acc + n.sentimentScore, 0) /
            monthNominations.length
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
      percentage: Number(
        ((flaggedNominations / nominations.length) * 100).toFixed(1)
      ),
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
  id: "current-user-id",
  name: "John Admin",
  email: "john.admin@company.com",
  role: "admin",
  department: "Engineering",
  avatar: faker.image.avatar(),
};

// Generate mock projects
export const generateMockProjects = (): Project[] => {
  const projectNames = [
    "Customer Portal Redesign",
    "Mobile App Development",
    "Data Analytics Platform",
    "E-commerce Integration",
    "Cloud Migration",
    "Security Enhancement",
    "API Gateway Implementation",
    "Machine Learning Pipeline",
    "DevOps Automation",
    "User Experience Optimization",
    "Payment System Upgrade",
    "Inventory Management System",
    "CRM Integration",
    "Business Intelligence Dashboard",
    "Microservices Architecture",
  ];

  return projectNames.map((name) => ({
    id: faker.string.uuid(),
    name,
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(["active", "inactive", "completed"]),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
  }));
};

// Generate manager-project mappings
export const generateManagerProjectMappings = (
  users: User[],
  projects: Project[]
): ManagerProjectMapping[] => {
  const managers = users.filter((user) => user.role === "manager");
  const employees = users.filter((user) => user.role === "employee");
  const mappings: ManagerProjectMapping[] = [];

  // Create mappings ensuring each manager has 1-3 projects
  managers.forEach((manager) => {
    const numProjects = faker.number.int({ min: 1, max: 3 });
    const assignedProjects = faker.helpers.arrayElements(projects, numProjects);

    assignedProjects.forEach((project) => {
      const numEmployees = faker.number.int({ min: 2, max: 8 });
      const assignedEmployees = faker.helpers.arrayElements(
        employees,
        numEmployees
      );

      mappings.push({
        id: faker.string.uuid(),
        managerId: manager.id,
        managerName: manager.name,
        projectId: project.id,
        projectName: project.name,
        employeeCount: assignedEmployees.length,
        employees: assignedEmployees,
        createdBy: currentUser.name,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
        updatedAt: faker.date.recent({ days: 30 }).toISOString(),
      });
    });
  });

  return mappings;
};

// Generate onboarding metrics
export const generateOnboardingMetrics = (
  mappings: ManagerProjectMapping[]
): OnboardingMetrics => {
  const uniqueManagers = new Set(mappings.map((m) => m.managerId)).size;
  const uniqueProjects = new Set(mappings.map((m) => m.projectId)).size;
  const totalEmployees = mappings.reduce((sum, m) => sum + m.employeeCount, 0);

  // Calculate manager distribution
  const managerEmployeeCounts = new Map<string, number>();
  mappings.forEach((mapping) => {
    const current = managerEmployeeCounts.get(mapping.managerName) || 0;
    managerEmployeeCounts.set(
      mapping.managerName,
      current + mapping.employeeCount
    );
  });

  const managerDistribution = Array.from(managerEmployeeCounts.entries()).map(
    ([name, count]) => ({
      managerName: name,
      employeeCount: count,
    })
  );

  const overloadedManagers = managerDistribution.filter(
    (m) => m.employeeCount > 15
  ).length;

  return {
    totalManagers: uniqueManagers,
    totalProjects: uniqueProjects,
    totalEmployees,
    overloadedManagers,
    managerDistribution,
  };
};

// Initialize onboarding data
export const mockProjects = generateMockProjects();
export const mockManagerProjectMappings = generateManagerProjectMappings(
  mockUsers,
  mockProjects
);
export const mockOnboardingMetrics = generateOnboardingMetrics(
  mockManagerProjectMappings
);

// Generate mock sentiment results
export const generateMockSentimentResults = (): SentimentResult[] => {
  const coreValues = [
    "Customer delight",
    "Innovation",
    "Team work",
    "Being fair",
    "Ownership",
  ];
  const sentimentLabels: Array<"POSITIVE" | "NEGATIVE" | "NEUTRAL"> = [
    "POSITIVE",
    "NEGATIVE",
    "NEUTRAL",
  ];
  const nominationTypes: Array<"monthly" | "quarterly" | "yearly"> = [
    "monthly",
    "quarterly",
    "yearly",
  ];

  return Array.from({ length: 200 }, (_, index) => {
    const employee = faker.helpers.arrayElement(
      mockUsers.filter((u) => u.role === "employee")
    );
    const manager = faker.helpers.arrayElement(
      mockUsers.filter((u) => u.role === "manager")
    );
    const project = faker.helpers.arrayElement(mockProjects);
    const sentimentLabel = faker.helpers.arrayElement(sentimentLabels);

    // Generate sentiment score based on label
    let sentimentScore: number;
    switch (sentimentLabel) {
      case "POSITIVE":
        sentimentScore = faker.number.float({
          min: 0.7,
          max: 1.0,
          fractionDigits: 10,
        });
        break;
      case "NEGATIVE":
        sentimentScore = faker.number.float({
          min: 0.0,
          max: 0.3,
          fractionDigits: 10,
        });
        break;
      default: // NEUTRAL
        sentimentScore = faker.number.float({
          min: 0.3,
          max: 0.7,
          fractionDigits: 10,
        });
    }

    return {
      nomination_id: index + 1,
      employee_id: employee.id,
      employee_name: employee.name,
      manager_id: parseInt(manager.id.slice(-3)),
      manager_name: manager.name,
      project_name: project.name,
      nomination_type: faker.helpers.arrayElement(nominationTypes),
      sentiment_label: sentimentLabel,
      sentiment_score: sentimentScore,
      predicted_core_value: faker.helpers.arrayElement(coreValues),
      core_value_alignment: faker.number.int({ min: 20, max: 95 }),
      analyzed_at: faker.date.recent({ days: 90 }).toISOString(),
    };
  });
};

// Generate sentiment metrics
export const generateSentimentMetrics = (
  results: SentimentResult[]
): SentimentMetrics => {
  const totalAnalyzed = results.length;
  const averageSentimentScore =
    results.reduce((sum, r) => sum + r.sentiment_score, 0) / totalAnalyzed;

  const sentimentDistribution = {
    positive: results.filter((r) => r.sentiment_label === "POSITIVE").length,
    negative: results.filter((r) => r.sentiment_label === "NEGATIVE").length,
    neutral: results.filter((r) => r.sentiment_label === "NEUTRAL").length,
  };

  // Core values analysis
  const coreValueCounts = new Map<
    string,
    { count: number; totalAlignment: number }
  >();
  results.forEach((result) => {
    const existing = coreValueCounts.get(result.predicted_core_value) || {
      count: 0,
      totalAlignment: 0,
    };
    coreValueCounts.set(result.predicted_core_value, {
      count: existing.count + 1,
      totalAlignment: existing.totalAlignment + result.core_value_alignment,
    });
  });

  const topCoreValues = Array.from(coreValueCounts.entries())
    .map(([value, data]) => ({
      value,
      count: data.count,
      averageAlignment: data.totalAlignment / data.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Project sentiments
  const projectSentiments = new Map<
    string,
    { totalScore: number; count: number }
  >();
  results.forEach((result) => {
    const existing = projectSentiments.get(result.project_name) || {
      totalScore: 0,
      count: 0,
    };
    projectSentiments.set(result.project_name, {
      totalScore: existing.totalScore + result.sentiment_score,
      count: existing.count + 1,
    });
  });

  const projectSentimentArray = Array.from(projectSentiments.entries())
    .map(([project, data]) => ({
      project,
      averageScore: data.totalScore / data.count,
      totalNominations: data.count,
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 10);

  // Manager performance
  const managerPerformance = new Map<
    string,
    { totalScore: number; count: number }
  >();
  results.forEach((result) => {
    const existing = managerPerformance.get(result.manager_name) || {
      totalScore: 0,
      count: 0,
    };
    managerPerformance.set(result.manager_name, {
      totalScore: existing.totalScore + result.sentiment_score,
      count: existing.count + 1,
    });
  });

  const managerPerformanceArray = Array.from(managerPerformance.entries())
    .map(([manager, data]) => ({
      manager,
      averageScore: data.totalScore / data.count,
      totalNominations: data.count,
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 10);

  return {
    totalAnalyzed,
    averageSentimentScore,
    sentimentDistribution,
    topCoreValues,
    projectSentiments: projectSentimentArray,
    managerPerformance: managerPerformanceArray,
  };
};

// Initialize sentiment data
export const mockSentimentResults = generateMockSentimentResults();
export const mockSentimentMetrics =
  generateSentimentMetrics(mockSentimentResults);
