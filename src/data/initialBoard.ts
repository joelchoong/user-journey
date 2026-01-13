import { JourneyBoard } from '@/types/journey';

export const initialBoard: JourneyBoard = {
  persona: {
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
  },
  columns: [
    {
      id: 'col-1',
      title: 'Evidence Event / Trigger',
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
        {
          id: 'card-8',
          title: 'Quick action: Add new device',
          tags: ['user'],
        },
      ],
    },
    {
      id: 'col-4',
      title: 'Device Details Page',
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
        {
          id: 'card-11',
          title: 'System extracts data via OCR',
          tags: ['system'],
        },
      ],
    },
    {
      id: 'col-5',
      title: 'Add Claim / Upload Evidence',
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
        {
          id: 'card-14',
          title: 'System validates uploaded files',
          tags: ['system'],
        },
        {
          id: 'card-15',
          title: 'Edge: Low-quality image rejection',
          description: 'Prompt user to retake photo',
          tags: ['system', 'edge'],
        },
      ],
    },
    {
      id: 'col-6',
      title: 'Ask Poli / Chat',
      cards: [
        {
          id: 'card-16',
          title: 'User asks Poli about warranty coverage',
          tags: ['user'],
        },
        {
          id: 'card-17',
          title: 'AI provides contextual answer from manual',
          tags: ['system'],
        },
        {
          id: 'card-18',
          title: 'Escalate to human support if needed',
          tags: ['edge'],
        },
      ],
    },
    {
      id: 'col-7',
      title: 'Admin Panel',
      cards: [
        {
          id: 'card-19',
          title: 'Admin reviews pending claims',
          tags: ['admin'],
        },
        {
          id: 'card-20',
          title: 'Admin flags low-confidence OCR entries',
          tags: ['admin'],
        },
        {
          id: 'card-21',
          title: 'Approve or reject claim with notes',
          tags: ['admin'],
        },
      ],
    },
  ],
};
