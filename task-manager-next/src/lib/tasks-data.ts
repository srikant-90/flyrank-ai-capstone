export interface TaskItem {
  id: string;
  title: string;
  category: "Frontend" | "Backend" | "DevOps" | "Design" | "Database" | "General";
  complexity: "low" | "medium" | "high" | "critical";
  status: "In Progress" | "Completed" | "Pending Review" | "Blocked";
  estimatedHours: number;
  daysUntilDeadline: number;
  description: string;
  assignee: string;
  riskScore: number;
  blockers: string[];
}

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: "task-101",
    title: "Refactor Next.js App Router API Routes",
    category: "Backend",
    complexity: "high",
    status: "In Progress",
    estimatedHours: 24,
    daysUntilDeadline: 2,
    description: "Migrate legacy REST endpoints to typed App Router route handlers using AI SDK v7 streamText and Zod schema validation.",
    assignee: "Srikant (Lead AI Engineer)",
    riskScore: 65,
    blockers: ["Tight 2-day deadline buffer", "Requires peer code review for stream abort safety"],
  },
  {
    id: "task-102",
    title: "Database Migration & Schema Audit",
    category: "Database",
    complexity: "critical",
    status: "Pending Review",
    estimatedHours: 40,
    daysUntilDeadline: 1,
    description: "Execute PostgreSQL schema migration for task audit logs and generative UI payload telemetry persistence.",
    assignee: "Database Ops Team",
    riskScore: 85,
    blockers: ["Scope exceeds single sprint capacity (>40h)", "High risk of lock contention during migration"],
  },
  {
    id: "task-103",
    title: "Implement Generative UI Radial Health Gauge",
    category: "Frontend",
    complexity: "medium",
    status: "Completed",
    estimatedHours: 12,
    daysUntilDeadline: 5,
    description: "Build SVG-based dynamic radial health score gauge component with color-coded risk level indicator and smooth transitions.",
    assignee: "Frontend UI Specialist",
    riskScore: 25,
    blockers: ["No critical blocking risks identified"],
  },
  {
    id: "task-104",
    title: "Groq LLaMA 3.3 Stream Integration & Sabotage Testing",
    category: "Backend",
    complexity: "high",
    status: "In Progress",
    estimatedHours: 18,
    daysUntilDeadline: 3,
    description: "Configure Groq model inference stream with error recovery, mid-stream abort handling, 429 rate limit handling, and developer sabotage toolbar.",
    assignee: "Srikant (Lead AI Engineer)",
    riskScore: 45,
    blockers: ["Requires rigorous sabotage checklist verification"],
  },
];
