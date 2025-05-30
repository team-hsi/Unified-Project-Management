export type MilestonePayload = {
  name: string;
  projectId: string;
  id: string;
  description: string;
  startDate: string;
  targetDate: string;
};

export type Milestone = {
  id: string;
  name: string;
  projectId: string;
  description: string;
  startDate: string | null;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
};
