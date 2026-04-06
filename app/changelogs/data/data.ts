import { Rocket, Sparkles, Bug, Zap, Wrench } from 'lucide-react'

export const changelogData = [
    {
        version: 'v0.8.0',
        title: 'Release v0.8.0 – Design Tools Suite Launch',
        date: '2026-03-29',
        releaseType: 'minor',
        description: 'Launch of comprehensive design tools suite featuring color palette generator, gradient creator, and CSS framework converter',
        tags: ['Tools', 'Design', 'Developer Tools'],
        videoPreview: null,
        sections: [
            {
                title: 'New Features',
                icon: Rocket,
                items: [
                    {
                        title: 'Color Palette Generator',
                        description: 'Generate beautiful, harmonious color schemes based on color theory principles. Create palettes from a base color or generate random combinations with customizable export formats.',
                        codeExample: `// Color palette generation
const generatePalette = (baseColor: string) => {
  const palette = generateComplementary(baseColor)
  return {
    primary: palette[0],
    secondary: palette[1],
    accent: palette[2],
  }
}`,
                        isPriority: true,
                    },
                    {
                        title: 'Gradient Generator',
                        description: 'Create smooth gradient transitions with real-time preview. Support for linear, radial, and conic gradients with angle and color stop customization.',
                        isPriority: true,
                    },
                    {
                        title: 'CSS Framework Converter',
                        description: 'Convert CSS between different frameworks and methodologies. Supports Tailwind CSS, CSS-in-JS, Styled Components, and more with automatic syntax transformation.',
                        isPriority: true,
                    },
                ],
            },
            {
                title: 'Improvements',
                icon: Sparkles,
                items: [
                    {
                        title: 'Tools Dashboard Integration',
                        description: 'New dedicated tools section in dashboard with organized categories and quick access to all design utilities.',
                        isPriority: false,
                    },
                    {
                        title: 'Export Functionality',
                        description: 'Multiple export options for generated designs including CSS, JSON, and image formats with copy-to-clipboard support.',
                        isPriority: false,
                    },
                ],
            },
        ],
    },
    {
        version: 'v0.7.0',
        title: 'Release v0.7.0 – Dashboard & Sidebar Improvements',
        date: '2026-03-26',
        releaseType: 'minor',
        description: 'Enhanced dashboard sidebar with responsive footer behavior, improved layout control, and better user experience on different screen sizes',
        tags: ['Dashboard', 'UI/UX', 'Responsive'],
        videoPreview: null,
        sections: [
            {
                title: 'New Features',
                icon: Rocket,
                items: [
                    {
                        title: 'Responsive Sidebar Footer',
                        description: 'Sidebar footer now dynamically responds to collapse state, automatically adjusting layout, hiding labels, and repositioning elements for better space utilization.',
                        codeExample: `// Responsive sidebar footer
const SidebarFooter = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <div className={isCollapsed ? 'px-2' : 'px-4'}>
      <button className={isCollapsed ? 'p-2' : 'w-full p-2'}>
        {!isCollapsed && <span>Profile</span>}
      </button>
    </div>
  )
}`,
                        isPriority: true,
                    },
                ],
            },
            {
                title: 'Improvements',
                icon: Sparkles,
                items: [
                    {
                        title: 'Dashboard Layout',
                        description: 'Improved dashboard layout responsiveness with better sidebar integration and adaptive content areas.',
                        isPriority: false,
                    },
                    {
                        title: 'Sidebar Collapse Animation',
                        description: 'Smooth collapse/expand animations for sidebar with synchronized footer and menu item transitions.',
                        isPriority: false,
                    },
                ],
            },
        ],
    },
    {
        version: 'v0.6.0',
        title: 'Release v0.6.0 – Team Member Management & RBAC',
        date: '2026-03-21',
        releaseType: 'minor',
        description: 'Team member display interface with comprehensive role-based access control, permission management, and team collaboration features',
        tags: ['Team', 'Collaboration', 'Security'],
        videoPreview: null,
        sections: [
            {
                title: 'New Features',
                icon: Rocket,
                items: [
                    {
                        title: 'Team Member Display',
                        description: 'Visual team member interface showing active members, their roles, and invitation status. Includes member profiles and activity indicators.',
                        codeExample: `// Team member component
const TeamMembers = ({ teamId }: { teamId: string }) => {
  const { data: members } = trpc.team.getMembers.useQuery({ teamId })
  return (
    <div className="space-y-2">
      {members?.map(member => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  )
}`,
                        isPriority: true,
                    },
                    {
                        title: 'Role-Based Access Control',
                        description: 'Comprehensive RBAC system with predefined roles (Owner, Admin, Editor, Viewer) and granular permission management for team operations.',
                        isPriority: true,
                    },
                    {
                        title: 'Permission Management UI',
                        description: 'Intuitive interface to manage member permissions, assign roles, and control access to flowcharts and team resources.',
                        isPriority: false,
                    },
                ],
            },
            {
                title: 'Improvements',
                icon: Sparkles,
                items: [
                    {
                        title: 'Member Invitation System',
                        description: 'Enhanced invitation workflow with email notifications, acceptance tracking, and expiration handling.',
                        isPriority: false,
                    },
                    {
                        title: 'Access Control Middleware',
                        description: 'Server-side permission validation for all team operations with automatic enforcement of role-based rules.',
                        isPriority: false,
                    },
                ],
            },
        ],
    },
    {
        version: 'v0.5.0',
        title: 'Release v0.5.0 – Auth Validation & Team Management',
        date: '2026-03-20',
        releaseType: 'minor',
        description: 'Enhanced authentication validation, team management system, and comprehensive UI/UX refinements across auth and flowchart modules',
        tags: ['Auth', 'Team', 'UX', 'Refactoring'],
        videoPreview: null,
        sections: [
            {
                title: 'New Features',
                icon: Rocket,
                items: [
                    {
                        title: 'Email Existence Validation',
                        description: 'Smart email validation before sending login OTP. Validates email existence and account status to prevent unnecessary OTP sending and improve security.',
                        codeExample: `// Email validation before OTP
const validateEmail = async (email: string) => {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()
  return !!data
}`,
                        isPriority: true,
                    },
                    {
                        title: 'Team Management System',
                        description: 'Complete team management implementation with automatic cache invalidation, member invitations, and role-based access control.',
                        isPriority: true,
                    },
                ],
            },
            {
                title: 'Improvements',
                icon: Sparkles,
                items: [
                    {
                        title: 'Auth UI Refactoring',
                        description: 'Comprehensive refactoring of authentication pages with improved form validation, error handling, and visual consistency.',
                        isPriority: false,
                    },
                    {
                        title: 'Flowchart UI Enhancements',
                        description: 'Enhanced flowchart editor UI with better canvas controls, improved node interactions, and refined visual feedback.',
                        isPriority: false,
                    },
                    {
                        title: 'Cache Invalidation',
                        description: 'Implemented automatic cache invalidation for team operations ensuring data consistency across the application.',
                        isPriority: false,
                    },
                ],
            },
            {
                title: 'Bug Fixes',
                icon: Bug,
                items: [
                    {
                        title: 'useSearchParams Prerendering',
                        description: 'Fixed useSearchParams hook issues during prerendering by wrapping in suspense boundaries. Ensures proper hydration and SEO compliance.',
                        codeExample: `// Wrapped in Suspense for prerendering
<Suspense fallback={<div>Loading...</div>}>
  <VerifyPage />
</Suspense>`,
                        isPriority: false,
                    },
                ],
            },
        ],
    },
    {
        version: 'v0.4.0',
        title: 'Release v0.4.0 – Complete Authentication Flow',
        date: '2026-03-18',
        releaseType: 'minor',
        description: 'Complete authentication flow with comprehensive email OTP verification, session management, and security improvements',
        tags: ['Auth', 'Security', 'UX'],
        videoPreview: null,
        sections: [
            {
                title: 'New Features',
                icon: Rocket,
                items: [
                    {
                        title: 'Complete Auth Flow',
                        description: 'End-to-end authentication flow with email OTP verification, session creation, and secure token management. Includes resend OTP functionality and expiration handling.',
                        codeExample: `// Complete flow
                        const signUp = async (email: string) => {
                        const { data, error } = await supabase.auth.signUp({
                            email,
                            password: generateSecurePassword(),
                        })
                        return { data, error }
                        }`,
                        isPriority: true,
                    },
                    {
                        title: 'Session Persistence',
                        description: 'Automatic session management with secure cookie storage and automatic token refresh.',
                        isPriority: true,
                    },
                ],
            },
            {
                title: 'Improvements',
                icon: Sparkles,
                items: [
                    {
                        title: 'Security Enhancements',
                        description: 'Added rate limiting on OTP requests, CSRF protection, and improved password validation rules.',
                        isPriority: false,
                    },
                    {
                        title: 'Auth UI Refinements',
                        description: 'Improved form validation, error messaging, and loading states for better user experience.',
                        isPriority: false,
                    },
                ],
            },
        ],
    },
    {
        version: 'v0.3.0',
        title: 'Release v0.3.0 – Node Shapes & Canvas Updates',
        date: '2026-03-17',
        releaseType: 'minor',
        description: 'New node shapes and canvas improvements for enhanced flowchart design capabilities',
        tags: ['Nodes', 'Canvas', 'Design'],
        videoPreview: null,
        sections: [
            {
                title: 'New Features',
                icon: Rocket,
                items: [
                    {
                        title: 'Document Node Shape',
                        description: 'New document node shape with distinctive wavy bottom detail for representing document-type elements in flowcharts. Includes smooth animations and customizable styling.',
                        codeExample: `// Document node example
const documentNode = {
  id: 'doc-1',
  type: 'document',
  data: { label: 'Report' },
  position: { x: 250, y: 50 },
}`,
                        isPriority: true,
                    },
                    {
                        title: 'Enhanced Node Customization',
                        description: 'Extended styling options for all node types including gradients, shadows, and border effects.',
                        isPriority: false,
                    },
                ],
            },
            {
                title: 'Improvements',
                icon: Sparkles,
                items: [
                    {
                        title: 'Node Rendering Performance',
                        description: 'Optimized node rendering pipeline for smoother canvas interactions with large diagrams.',
                        isPriority: false,
                    },
                    {
                        title: 'Canvas Zoom & Pan',
                        description: 'Improved zoom and pan controls with better keyboard shortcuts and touch gesture support.',
                        isPriority: false,
                    },
                ],
            },
        ],
    },
    {
        version: 'v0.2.0',
        title: 'Release v0.2.0 – Authentication & Landing Page',
        date: '2026-03-15',
        releaseType: 'major',
        description: 'Foundation release with secure authentication and professional landing page',
        tags: ['Auth', 'UX', 'Foundation'],
        videoPreview: null,
        sections: [
            {
                title: 'New Features',
                icon: Rocket,
                items: [
                    {
                        title: 'Supabase OTP Authentication',
                        description: 'Secure email-based one-time password authentication system for user registration and login. Includes automated email verification workflow with OTP token validation.',
                        codeExample: `// Usage
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
})`,
                        isPriority: true,
                    },
                    {
                        title: 'Email Verification System',
                        description: 'Automated email verification workflow with OTP token validation and secure session management.',
                        isPriority: true,
                    },
                    {
                        title: 'Landing Page',
                        description: 'Professional marketing landing page with hero section, features showcase, and strategic call-to-action buttons designed to convert visitors.',
                        isPriority: false,
                    },
                ],
            },
            {
                title: 'Improvements',
                icon: Sparkles,
                items: [
                    {
                        title: 'Full-stack Setup',
                        description: 'Complete Next.js 14 application structure with API routes, database integration, and TypeScript support.',
                        isPriority: false,
                    },
                    {
                        title: 'Database Schema',
                        description: 'Initial Supabase database migrations for users, authentication, teams, and flowcharts with proper relationships.',
                        codeExample: `-- Users table with authentication
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)`,
                        isPriority: false,
                    },
                ],
            },
            {
                title: 'Developer Experience',
                icon: Wrench,
                items: [
                    {
                        title: 'tRPC Integration',
                        description: 'Type-safe API endpoints with end-to-end TypeScript support for seamless client-server communication.',
                        isPriority: false,
                    },
                    {
                        title: 'Project Configuration',
                        description: 'ESLint, TypeScript, Tailwind CSS, and PostCSS configuration for consistent code quality and styling.',
                        isPriority: false,
                    },
                ],
            },
        ],
    },
]

export type Changelog = typeof changelogData[0]
export type ChangelogSection = Changelog['sections'][0]
export type ChangelogItem = ChangelogSection['items'][0]