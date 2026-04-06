import {
    Palette,
    Code,
    Clock,
    Link,
    Database,
    Gauge,
    FileJson,
    Hash,
    Lock,
    QrCode,
    GitBranch,
    Copy,
    Type,
    Workflow,
    Zap,
} from 'lucide-react'
import { trpc } from '@/utils/trpc'

export const toolsData = [
    // Design Tools
    {
        id: 'color-palette',
        name: 'Color Palette Generator',
        category: 'design',
        icon: Palette,
        description: 'Generate beautiful color schemes',
        color: 'bg-pink-500/10',
        textColor: 'text-pink-600',
        route: '/dashboard/tools/c-p-g',
    },
    {
        id: 'gradient-generator',
        name: 'Gradient Generator',
        category: 'design',
        icon: Palette,
        description: 'Create smooth gradient transitions',
        color: 'bg-purple-500/10',
        textColor: 'text-purple-600',
        route: '/dashboard/tools/g-gen',
    },
    {
        id: 'css-converter',
        name: 'CSS Framework Converter',
        category: 'design',
        icon: Code,
        description: 'Convert CSS between frameworks',
        color: 'bg-blue-500/10',
        textColor: 'text-blue-600',
        route: '/dashboard/tools/c-f-c',
    },
    // Diagram Tools
    {
        id: 'uml-diagram',
        name: 'UML Diagram Creator',
        category: 'diagram',
        icon: GitBranch,
        description: 'Create UML diagrams easily',
        color: 'bg-indigo-500/10',
        textColor: 'text-indigo-600',
        route: '/dashboard/tools/uml-diagram',
    },
    {
        id: 'er-diagram',
        name: 'ER Diagram Creator',
        category: 'diagram',
        icon: Database,
        description: 'Design entity relationship diagrams',
        color: 'bg-cyan-500/10',
        textColor: 'text-cyan-600',
        route: '/dashboard/tools/er-diagram',
    },
    {
        id: 'architecture-diagram',
        name: 'System Architecture Tool',
        category: 'diagram',
        icon: GitBranch,
        description: 'Visualize system architecture',
        color: 'bg-teal-500/10',
        textColor: 'text-teal-600',
        route: '/dashboard/tools/architecture-diagram',
    },
    {
        id: 'process-diagram',
        name: 'Process Diagram Tool',
        category: 'diagram',
        icon: Workflow,
        description: 'Create process flowcharts',
        color: 'bg-green-500/10',
        textColor: 'text-green-600',
        route: '/dashboard/tools/process-diagram',
    },
    // API & Testing
    {
        id: 'api-testing',
        name: 'API Testing Tool',
        category: 'testing',
        icon: Zap,
        description: 'Test APIs and endpoints',
        color: 'bg-orange-500/10',
        textColor: 'text-orange-600',
        route: '/dashboard/tools/api-testing',
    },
    {
        id: 'load-testing',
        name: 'Load Testing Tool',
        category: 'testing',
        icon: Gauge,
        description: 'Measure system performance',
        color: 'bg-red-500/10',
        textColor: 'text-red-600',
        route: '/dashboard/tools/load-testing',
    },
    // Code Generation
    {
        id: 'json-generator',
        name: 'JSON Generator',
        category: 'generation',
        icon: FileJson,
        description: 'Generate JSON data structures',
        color: 'bg-yellow-500/10',
        textColor: 'text-yellow-600',
        route: '/dashboard/tools/json-generator',
    },
    {
        id: 'sql-generator',
        name: 'SQL Query Generator',
        category: 'generation',
        icon: Database,
        description: 'Build SQL queries visually',
        color: 'bg-blue-500/10',
        textColor: 'text-blue-600',
        route: '/dashboard/tools/sql-generator',
    },
    {
        id: 'regex-generator',
        name: 'Regex Generator',
        category: 'generation',
        icon: Type,
        description: 'Create regular expressions',
        color: 'bg-violet-500/10',
        textColor: 'text-violet-600',
        route: '/dashboard/tools/regex-generator',
    },
    {
        id: 'code-snippet',
        name: 'Code Snippet Generator',
        category: 'generation',
        icon: Code,
        description: 'Generate code snippets',
        color: 'bg-emerald-500/10',
        textColor: 'text-emerald-600',
        route: '/dashboard/tools/code-snippet',
    },
    {
        id: 'mock-data',
        name: 'Mock Data Generator',
        category: 'generation',
        icon: FileJson,
        description: 'Create realistic test data',
        color: 'bg-lime-500/10',
        textColor: 'text-lime-600',
        route: '/dashboard/tools/mock-data',
    },
    // Formatting
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        category: 'formatting',
        icon: FileJson,
        description: 'Format and validate JSON',
        color: 'bg-cyan-500/10',
        textColor: 'text-cyan-600',
        route: '/dashboard/tools/json-formatter',
    },
    {
        id: 'xml-formatter',
        name: 'XML Formatter',
        category: 'formatting',
        icon: Code,
        description: 'Format and validate XML',
        color: 'bg-blue-500/10',
        textColor: 'text-blue-600',
        route: '/dashboard/tools/xml-formatter',
    },
    // Database
    {
        id: 'db-migration',
        name: 'Database Migration Tool',
        category: 'database',
        icon: Database,
        description: 'Manage database migrations',
        color: 'bg-green-500/10',
        textColor: 'text-green-600',
        route: '/dashboard/tools/db-migration',
    },
    // Conversion & Encoding
    {
        id: 'password-generator',
        name: 'Password Generator',
        category: 'conversion',
        icon: Lock,
        description: 'Generate secure passwords',
        color: 'bg-red-500/10',
        textColor: 'text-red-600',
        route: '/dashboard/tools/password-generator',
    },
    {
        id: 'uuid-generator',
        name: 'UUID Generator',
        category: 'conversion',
        icon: Hash,
        description: 'Create UUIDs and GUIDs',
        color: 'bg-purple-500/10',
        textColor: 'text-purple-600',
        route: '/dashboard/tools/uuid-generator',
    },
    {
        id: 'base64-encoder',
        name: 'Base64 Encoder/Decoder',
        category: 'conversion',
        icon: Copy,
        description: 'Encode and decode Base64',
        color: 'bg-indigo-500/10',
        textColor: 'text-indigo-600',
        route: '/dashboard/tools/base64-encoder',
    },
    {
        id: 'hash-generator',
        name: 'Hash Generator',
        category: 'conversion',
        icon: Hash,
        description: 'Generate MD5, SHA hashes',
        color: 'bg-slate-500/10',
        textColor: 'text-slate-600',
        route: '/dashboard/tools/hash-generator',
    },
    {
        id: 'timestamp-converter',
        name: 'Timestamp Converter',
        category: 'conversion',
        icon: Clock,
        description: 'Convert timestamps',
        color: 'bg-orange-500/10',
        textColor: 'text-orange-600',
        route: '/dashboard/tools/timestamp-converter',
    },
    {
        id: 'url-encoder',
        name: 'URL Encoder/Decoder',
        category: 'conversion',
        icon: Link,
        description: 'Encode and decode URLs',
        color: 'bg-amber-500/10',
        textColor: 'text-amber-600',
        route: '/dashboard/tools/url-encoder',
    },
    {
        id: 'jwt-decoder',
        name: 'JWT Decoder',
        category: 'conversion',
        icon: Lock,
        description: 'Decode and verify JWT tokens',
        color: 'bg-rose-500/10',
        textColor: 'text-rose-600',
        route: '/dashboard/tools/jwt-decoder',
    },
    {
        id: 'qr-code',
        name: 'QR Code Generator',
        category: 'conversion',
        icon: QrCode,
        description: 'Generate QR codes',
        color: 'bg-emerald-500/10',
        textColor: 'text-emerald-600',
        route: '/dashboard/tools/qr-code',
    },
    {
        id: 'file-encryptor/decryptor',
        name: 'File Encryptor/Decryptor',
        category: 'conversion',
        icon: Lock,
        description: 'Encrypt and decrypt files securely',
        color: 'bg-zinc-500/10',
        textColor: 'text-zinc-600',
        route: '/dashboard/tools/file-encryptor-decryptor',
    }
]

export const categoriesData = [
    { id: 'all', label: 'All Tools' },
    { id: 'design', label: 'Design' },
    { id: 'diagram', label: 'Diagrams' },
    { id: 'testing', label: 'Testing' },
    { id: 'generation', label: 'Generation' },
    { id: 'formatting', label: 'Formatting' },
    { id: 'database', label: 'Database' },
    { id: 'conversion', label: 'Conversion' },
]

// Helper function to format date
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMilliseconds = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
}

// Hook to fetch user flowcharts and stats
export function useDashboardData() {
    const { data: userFlowcharts, isLoading: isLoadingFlowcharts, error: flowchartsError } = trpc.flowcharts.getUserFlowcharts.useQuery()
    const { data: currentUser, error: userError } = trpc.users.getCurrentUserWithTeam.useQuery()

    // Combine personal and team flowcharts
    const allFlowcharts = userFlowcharts 
        ? [...(userFlowcharts.personal || []), ...(userFlowcharts.team || [])]
        : []

    // Get recent flowcharts
    const recentFlowcharts = Array.isArray(allFlowcharts)
        ? allFlowcharts
            .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
            .slice(0, 3)
            .map((fc) => ({
                id: fc.id,
                title: fc.name,
                updated: formatDate(fc.updated_at || fc.created_at),
                collaborators: fc.collaborators?.length || 0,
            }))
        : []

    // Dynamic stats based on real data
    const stats = [
        {
            title: 'Total Flowcharts',
            value: allFlowcharts.length.toString(),
            icon: Workflow,
            color: 'bg-blue-500/10',
            textColor: 'text-blue-600',
        },
        {
            title: 'Team Members',
            value: currentUser?.teamId ? '1' : '0',
            icon: Zap,
            color: 'bg-purple-500/10',
            textColor: 'text-purple-600',
        },
        {
            title: 'Total Collaborators',
            value: allFlowcharts
                .reduce((total, fc) => total + (fc.collaborators?.length || 0), 0)
                .toString(),
            icon: Zap,
            color: 'bg-amber-500/10',
            textColor: 'text-amber-600',
        },
    ]

    return {
        userFlowcharts: allFlowcharts,
        isLoadingFlowcharts,
        currentUser,
        recentFlowcharts,
        stats,
    }
}