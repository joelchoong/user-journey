import { AppState, Persona, JourneyColumn } from '@/types/journey';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const createEmptyPersona = (name: string = 'New Persona'): Persona => ({
  id: generateId(),
  name,
  description: 'Describe this persona...',
  goals: ['Add a goal...'],
  painPoints: ['Add a pain point...'],
  columns: [
    {
      id: generateId(),
      title: 'Step 1',
      cards: [],
    },
    {
      id: generateId(),
      title: 'Step 2',
      cards: [],
    },
    {
      id: generateId(),
      title: 'Step 3',
      cards: [],
    },
  ],
});

export const createEmptyProject = (name: string = 'New Project'): { project: ReturnType<typeof createProjectWithPersona>['project']; personaId: string } => {
  const persona = createEmptyPersona('Persona 1');
  return {
    project: {
      id: generateId(),
      name,
      personas: [persona],
      activePersonaId: persona.id,
    },
    personaId: persona.id,
  };
};

const createProjectWithPersona = (name: string, persona: Persona) => ({
  project: {
    id: generateId(),
    name,
    personas: [persona],
    activePersonaId: persona.id,
  },
  personaId: persona.id,
});

// Sample data for demo
const samplePersona: Persona = {
  id: 'persona-1',
  name: 'Alex Chen',
  description: 'A busy professional who wants to protect their household electronics and appliances with minimal effort. Values convenience and peace of mind.',
  goals: [
    'Easily register devices for protection',
    'Quick claim submission when issues arise',
    'Clear visibility of coverage status',
  ],
  painPoints: [
    'Too many steps to submit a claim',
    'Unclear warranty coverage terms',
    'Difficulty tracking multiple devices',
  ],
  workflows: [
    { id: 'wf-onboarding', title: 'Onboarding', color: '#E0F2FE' },
    { id: 'wf-usage', title: 'Active Usage', color: '#F0FDF4' },
    { id: 'wf-support', title: 'Support & Claims', color: '#FEF2F2' },
  ],
  columns: [
    {
      id: 'col-1',
      title: 'Evidence Event / Trigger',
      workflowId: 'wf-onboarding',
      cards: [
        {
          id: 'card-1',
          title: 'User receives device purchase confirmation email',
          description: 'Email contains receipt/invoice with product details',
          tags: ['system'],
        },
        {
          id: 'card-2',
          title: 'User discovers device issue requiring claim',
          tags: ['user'],
        },
      ],
    },
    {
      id: 'col-2',
      title: 'Registration & Authentication',
      workflowId: 'wf-onboarding',
      cards: [
        {
          id: 'card-3',
          title: 'User logs in with phone number & verification code',
          tags: ['user'],
        },
        {
          id: 'card-4',
          title: 'System sends OTP via SMS',
          tags: ['system'],
        },
        {
          id: 'card-5',
          title: 'Alternative: Social login (Google/Apple)',
          description: 'Fallback if SMS fails or user prefers',
          tags: ['user', 'edge'],
        },
      ],
    },
    {
      id: 'col-3',
      title: 'Home Page',
      workflowId: 'wf-usage',
      cards: [
        {
          id: 'card-6',
          title: 'User views dashboard with registered devices',
          tags: ['user'],
        },
        {
          id: 'card-7',
          title: 'System displays coverage status indicators',
          tags: ['system'],
        },
      ],
    },
    {
      id: 'col-4',
      title: 'Device Details',
      workflowId: 'wf-usage',
      cards: [
        {
          id: 'card-9',
          title: 'User views device info and warranty details',
          tags: ['user'],
        },
        {
          id: 'card-10',
          title: 'Upload evidence (optional)',
          description: 'Receipt, photos, manual',
          tags: ['user'],
        },
      ],
    },
    {
      id: 'col-5',
      title: 'Claims',
      workflowId: 'wf-support',
      cards: [
        {
          id: 'card-12',
          title: 'User initiates claim for device',
          tags: ['user'],
        },
        {
          id: 'card-13',
          title: 'Upload photos of damage/issue',
          tags: ['user'],
        },
      ],
    },
  ],
};

export const initialAppState: AppState = {
  projects: [
    {
      id: 'project-1',
      name: 'Device Protection App',
      personas: [samplePersona],
      activePersonaId: 'persona-1',
    },
  ],

  activeProjectId: 'project-1',
};
