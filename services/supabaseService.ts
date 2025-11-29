
import { User, Project, Client, KpiData, ChartData } from '../types';

// This is a SIMULATION of the Supabase Client.
// in a real app, you would import { createClient } from '@supabase/supabase-js'

const MOCK_USER: User = {
  id: 'user-123',
  email: 'alex.creator@viralcopy.ai',
  name: 'Alex Creator',
  role: 'admin',
  avatar_url: 'https://picsum.photos/100/100'
};

const MOCK_PROJECTS: Project[] = [
  { 
    id: '1', 
    name: 'Launch Email Sequence', 
    type: 'Email Marketing', 
    status: 'completed', 
    created_at: '2023-10-25',
    brief: 'Launch for a new SaaS product focused on AI.',
    content: 'Subject: The future is here...\n\nHi [Name],\n\nWe are thrilled to announce...'
  },
  { id: '2', name: 'Instagram Black Friday', type: 'Social Media', status: 'draft', created_at: '2023-10-26' },
  { id: '3', name: 'Landing Page Hero V2', type: 'Website Copy', status: 'generating', created_at: '2023-10-27' },
  { id: '4', name: 'LinkedIn Thought Leader', type: 'Social Media', status: 'completed', created_at: '2023-10-28' },
];

const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Marina Santos', email: 'marina@techstart.com.br', company: 'TechStart Brasil', status: 'active', plan: 'Professional', projects_count: 8, created_at: '2025-11-29' },
  { id: 'c2', name: 'Ricardo Oliveira', email: 'ricardo@agenciadigital.com', company: 'Agência Digital Plus', status: 'active', plan: 'Enterprise', projects_count: 15, created_at: '2025-11-29' },
  { id: 'c3', name: 'Carla Mendes', email: 'carla.mendes@email.com', company: 'Mendes Consultoria', status: 'active', plan: 'Starter', projects_count: 3, created_at: '2025-11-29' },
  { id: 'c4', name: 'Fernando Costa', email: 'fernando@ecommercepro.com.br', company: 'E-commerce Pro', status: 'pending', plan: 'Professional', projects_count: 0, created_at: '2025-11-29' },
  { id: 'c5', name: 'Ana Paula Silva', email: 'anapaula@freelancer.com', company: '-', status: 'active', plan: 'Free', projects_count: 1, created_at: '2025-11-29' },
  { id: 'c6', name: 'João Silva', email: 'joao.silva@empresa.com', company: 'Tech Solutions', status: 'active', plan: 'Professional', projects_count: 8, created_at: '2025-11-29' },
];

export const supabaseService = {
  auth: {
    signInWithPassword: async (email: string, password: string): Promise<{ data: { user: User } | null; error: any }> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email && password) {
        localStorage.setItem('viralcopy_session', JSON.stringify(MOCK_USER));
        return { data: { user: MOCK_USER }, error: null };
      }
      return { data: null, error: { message: 'Invalid credentials' } };
    },
    
    signUp: async (email: string, password: string, name?: string): Promise<{ data: { user: User } | null; error: any }> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newUser = { ...MOCK_USER, email, name: name || email.split('@')[0] };
      localStorage.setItem('viralcopy_session', JSON.stringify(newUser));
      return { data: { user: newUser }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem('viralcopy_session');
    },

    getSession: () => {
      const session = localStorage.getItem('viralcopy_session');
      return session ? JSON.parse(session) : null;
    },
    
    updateUser: async (updates: Partial<User>) => {
       await new Promise(resolve => setTimeout(resolve, 500));
       const current = JSON.parse(localStorage.getItem('viralcopy_session') || '{}');
       const updated = { ...current, ...updates };
       localStorage.setItem('viralcopy_session', JSON.stringify(updated));
       return { data: updated, error: null };
    }
  },

  from: (table: string) => {
    return {
      select: async (query?: string) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        if (table === 'projects') {
            // Simulate sorting/filtering if needed
            return { data: [...MOCK_PROJECTS], error: null };
        }
        if (table === 'clients') {
            return { data: [...MOCK_CLIENTS], error: null };
        }
        if (table === 'analytics') {
             const chartData: ChartData[] = [
                { name: 'Mon', value: 4000, secondary: 2400 },
                { name: 'Tue', value: 3000, secondary: 1398 },
                { name: 'Wed', value: 2000, secondary: 9800 },
                { name: 'Thu', value: 2780, secondary: 3908 },
                { name: 'Fri', value: 1890, secondary: 4800 },
                { name: 'Sat', value: 2390, secondary: 3800 },
                { name: 'Sun', value: 3490, secondary: 4300 },
            ];
            return { data: chartData, error: null };
        }
        if (table === 'kpis') {
             const kpis: KpiData[] = [
                { label: 'Words Generated', value: '124,592', change: 12.5, trend: 'up' },
                { label: 'Active Projects', value: '14', change: 2.1, trend: 'up' },
                { label: 'Conversion Rate', value: '3.4%', change: -0.4, trend: 'down' },
                { label: 'Time Saved', value: '126h', change: 8.4, trend: 'up' },
            ];
            return { data: kpis, error: null };
        }
        return { data: [], error: null };
      },
      insert: async (data: any) => {
         await new Promise(resolve => setTimeout(resolve, 600));
         if (table === 'projects') {
             const newProject = { ...data[0], id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
             MOCK_PROJECTS.push(newProject);
             return { data: [newProject], error: null };
         }
         return { data: null, error: null };
      },
      update: (updates: any) => {
          return {
              eq: async (col: string, val: any) => {
                  await new Promise(resolve => setTimeout(resolve, 400));
                  if (table === 'projects' && col === 'id') {
                      const idx = MOCK_PROJECTS.findIndex(p => p.id === val);
                      if (idx > -1) {
                          MOCK_PROJECTS[idx] = { ...MOCK_PROJECTS[idx], ...updates };
                          return { data: [MOCK_PROJECTS[idx]], error: null };
                      }
                  }
                  return { data: null, error: 'Not found' };
              }
          }
      },
      delete: async () => {
           // Mock delete functionality
           return { error: null };
      },
      eq: (col: string, val: any) => {
          return {
              select: async () => {
                 if (table === 'projects' && col === 'id') {
                     const project = MOCK_PROJECTS.find(p => p.id === val);
                     return { data: project ? [project] : [], error: null };
                 }
                 return { data: [], error: null };
              },
              delete: async () => {
                  if (table === 'projects' && col === 'id') {
                      const idx = MOCK_PROJECTS.findIndex(p => p.id === val);
                      if (idx > -1) MOCK_PROJECTS.splice(idx, 1);
                  }
                  return { error: null };
              }
          }
      }
    };
  }
};
