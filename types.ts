
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  company?: string;
  phone?: string;
}

export interface Project {
  id: string;
  name: string;
  type: string; // e.g., 'Email Sequence', 'Instagram Post'
  status: 'draft' | 'completed' | 'generating';
  created_at: string;
  thumbnail_url?: string;
  brief?: string;   // User input/context
  content?: string; // The final output/copy
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  plan: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
  projects_count: number;
  created_at: string;
  last_activity?: string;
}

export interface KpiData {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down';
}

export interface ChartData {
  name: string;
  value: number;
  secondary: number;
}