export const SIDEBAR_NAV = [
  { id: 'overview', label: 'Overview', icon: 'Layers' },
  { id: 'profile', label: 'My Profile', icon: 'Users' },
  { id: 'aadi-id', label: 'AADI ID', icon: 'Shield' },
  { id: 'passport', label: 'Passport', icon: 'Globe' },
  { id: 'communities', label: 'Communities', icon: 'Users' },
  { id: 'challenges', label: 'Challenges', icon: 'Trophy' },
  { id: 'projects', label: 'Projects', icon: 'Rocket' },
  { id: 'feed', label: 'Feed', icon: 'Message' },
  { id: 'opportunities', label: 'Opportunities', icon: 'Briefcase' },
  { id: 'campus', label: 'Campus', icon: 'Graduation' },
  { id: 'reputation', label: 'Reputation', icon: 'Award' },
]

export const SIDEBAR_BOTTOM = [
  { id: 'settings', label: 'Settings', icon: 'Target' },
  { id: 'help', label: 'Help', icon: 'Lightbulb' },
]

export const QUICK_ACTIONS = [
  { id: 'build', label: 'Build', description: 'Start or join a project.', icon: 'Rocket' },
  { id: 'connect', label: 'Connect', description: 'Discover people and communities.', icon: 'Users' },
  { id: 'learn', label: 'Learn', description: 'Explore challenges and learning.', icon: 'Lightbulb' },
  { id: 'create', label: 'Create', description: 'Share something you are building.', icon: 'PenTool' },
  { id: 'compete', label: 'Compete', description: 'Join AADI challenges.', icon: 'Trophy' },
  { id: 'opportunities', label: 'Opportunities', description: 'Discover opportunities.', icon: 'Briefcase' },
]

export const COMMUNITIES = [
  { id: 'ai', name: 'AI Builders', color: '#B5E84A', members: 120, description: 'Artificial intelligence and machine learning.' },
  { id: 'ds', name: 'Data Science', color: '#9CD3F0', members: 95, description: 'Data analysis, visualization, and modeling.' },
  { id: 'dev', name: 'Developers', color: '#C8A6F0', members: 210, description: 'Web, mobile, and systems development.' },
  { id: 'design', name: 'Designers', color: '#F0C96E', members: 78, description: 'UI/UX design and creative direction.' },
]

export const CHALLENGES = [
  { id: 'daily', title: '30-Minute Build', type: 'Daily', status: 'active', description: 'Build something in 30 minutes. Ship fast, learn faster.' },
  { id: 'weekly', title: 'Design Battle', type: 'Weekly', status: 'upcoming', description: 'Design a landing page in 60 minutes. Best design wins.' },
  { id: 'ai', title: 'AI Build Battle', type: 'Special', status: 'coming', description: 'Build an AI-powered tool. Teams of 3.' },
]

export const PROJECTS = [
  {
    id: 'ai-assistant',
    title: 'AI Study Assistant',
    lookingFor: ['React Developer', 'UI Designer', 'Data Scientist'],
    description: 'An intelligent study companion that adapts to your learning style.',
  },
  {
    id: 'campus-hub',
    title: 'Campus Hub',
    lookingFor: ['Full Stack Developer', 'Backend Engineer'],
    description: 'A platform connecting students across campuses for collaboration.',
  },
]

export const FEED_PREVIEW = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'AI Builders',
    text: 'Just shipped a new feature for our campus project. Feeling productive!',
    time: '2h ago',
  },
  {
    id: 2,
    name: 'Arjun Reddy',
    role: 'Developers',
    text: 'Looking for a UI designer to join a weekend hackathon project.',
    time: '5h ago',
  },
  {
    id: 3,
    name: 'Sneha Patel',
    role: 'Data Science',
    text: 'Completed the 30-Minute Build challenge today. Great experience.',
    time: '1d ago',
  },
]

export const GOALS = [
  { id: 'profile', label: 'Complete your AADI profile', progress: 40 },
  { id: 'community', label: 'Join your first community', progress: 0 },
  { id: 'challenge', label: 'Complete your first challenge', progress: 0 },
]

export const NOTIFICATIONS = [
  { id: 1, text: 'Your AADI ID was created successfully.', type: 'success', time: 'Just now' },
  { id: 2, text: 'Complete your profile to unlock more features.', type: 'reminder', time: '1h ago' },
]

export const WELCOME_STEPS = [
  { id: 1, label: 'AADI ID', status: 'done' },
  { id: 2, label: 'Identity', status: 'done' },
  { id: 3, label: 'Profile', status: 'done' },
  { id: 4, label: 'Workspace', status: 'loading' },
]

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
