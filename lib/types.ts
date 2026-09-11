export type ProjectStatus =
  | "lead"
  | "in_progress"
  | "review"
  | "completed"
  | "on_hold"
  | "cancelled";

export const STATUS_META: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  lead: { label: "Lead", color: "#8E8E93", bg: "rgba(142,142,147,0.12)", dot: "#8E8E93" },
  in_progress: { label: "In Progress", color: "#0A84FF", bg: "rgba(10,132,255,0.12)", dot: "#0A84FF" },
  review: { label: "In Review", color: "#BF5AF2", bg: "rgba(191,90,242,0.12)", dot: "#BF5AF2" },
  completed: { label: "Completed", color: "#30D158", bg: "rgba(48,209,88,0.14)", dot: "#30D158" },
  on_hold: { label: "On Hold", color: "#FF9F0A", bg: "rgba(255,159,10,0.14)", dot: "#FF9F0A" },
  cancelled: { label: "Cancelled", color: "#FF453A", bg: "rgba(255,69,58,0.12)", dot: "#FF453A" },
};

export const STATUS_ORDER: ProjectStatus[] = [
  "lead",
  "in_progress",
  "review",
  "on_hold",
  "completed",
  "cancelled",
];

export type Manager = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  manager_id: string | null;
  client_name: string | null;
  status: ProjectStatus;
  booked_amount: number;
  currency: string;
  deadline: string | null;
  started_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  project_id: string;
  amount: number;
  paid_on: string;
  method: string | null;
  notes: string | null;
  created_at: string;
};

// Project joined with its manager + payment totals (computed in queries).
export type ProjectWithStats = Project & {
  manager: Manager | null;
  paid: number;
  balance: number;
  payments_count: number;
};
