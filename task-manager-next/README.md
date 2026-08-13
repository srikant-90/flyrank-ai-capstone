# Task Manager — Next.js AI Capstone

This repository contains the Next.js application built for the **FlyRank AI Capstone**.

## FE-07 Generative UI Tool Contracts

### Tool 1: `auditTaskRisk`

**Description:** Analyzes a task's complexity, estimated effort, and deadline constraints to generate a structured risk audit score card and SVG health gauge.

#### Zod Input Schema:
```ts
z.object({
  taskTitle: z.string().describe("Title or description of the task"),
  category: z.enum(["Frontend", "Backend", "DevOps", "Design", "Database", "General"]),
  complexity: z.enum(["low", "medium", "high", "critical"]),
  estimatedHours: z.number().describe("Estimated hours needed"),
  daysUntilDeadline: z.number().describe("Days remaining until deadline"),
  simulateError: z.boolean().optional().describe("Simulate an error state for testing"),
})
```

#### Return Shape:
```ts
{
  auditId: string;
  timestamp: string;
  taskTitle: string;
  category: string;
  complexity: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  daysUntilDeadline: number;
  riskScore: number; // 0 - 100
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  healthScore: number; // 0 - 100
  blockers: string[];
  recommendations: string[];
}
```

### Tool 2: `requestUserConfirmation`

**Description:** Requests interactive user confirmation before performing high-impact or destructive actions.

#### Zod Input Schema:
```ts
z.object({
  action: z.string().describe("The action requiring confirmation"),
  details: z.string().describe("Explanation of why confirmation is required"),
})
```

### 4 Lifecycle Tool Part States
1. **State 1: Input Streaming** — Glassmorphic pulsing loading card showing active tool execution.
2. **State 2: Input Available** — Typed parameter pill tags with expandable JSON code viewer.
3. **State 3: Output Available** — Generative UI Task Audit Score Card with interactive SVG Health Gauge chart.
4. **State 4: Output Error** — Designed red error card with diagnostic details and retry mechanism.

---

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/chat](http://localhost:3000/chat) with your browser to test Generative UI tool calls.
