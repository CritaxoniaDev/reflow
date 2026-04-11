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

// Color & Style Registry
const TOOL_STYLES = {
    pink: { color: 'bg-pink-500/10', textColor: 'text-pink-600' },
    purple: { color: 'bg-purple-500/10', textColor: 'text-purple-600' },
    blue: { color: 'bg-blue-500/10', textColor: 'text-blue-600' },
    indigo: { color: 'bg-indigo-500/10', textColor: 'text-indigo-600' },
    cyan: { color: 'bg-cyan-500/10', textColor: 'text-cyan-600' },
    teal: { color: 'bg-teal-500/10', textColor: 'text-teal-600' },
    green: { color: 'bg-green-500/10', textColor: 'text-green-600' },
    orange: { color: 'bg-orange-500/10', textColor: 'text-orange-600' },
    red: { color: 'bg-red-500/10', textColor: 'text-red-600' },
    yellow: { color: 'bg-yellow-500/10', textColor: 'text-yellow-600' },
    violet: { color: 'bg-violet-500/10', textColor: 'text-violet-600' },
    emerald: { color: 'bg-emerald-500/10', textColor: 'text-emerald-600' },
    lime: { color: 'bg-lime-500/10', textColor: 'text-lime-600' },
    rose: { color: 'bg-rose-500/10', textColor: 'text-rose-600' },
    amber: { color: 'bg-amber-500/10', textColor: 'text-amber-600' },
    slate: { color: 'bg-slate-500/10', textColor: 'text-slate-600' },
    zinc: { color: 'bg-zinc-500/10', textColor: 'text-zinc-600' },
}

// Route encoder - harder to trace
const routeMap = (id: string) => {
    const routes: Record<string, string> = {
        'color-palette': '/dashboard/tools/color-studio',
        'gradient-generator': '/dashboard/tools/color-studio',
        'css-converter': '/dashboard/tools/css-framework-converter',
        'uml-diagram': '/dashboard/tools/uml-diagram',
        'er-diagram': '/dashboard/tools/er-diagram',
        'architecture-diagram': '/dashboard/tools/architecture-diagram',
        'process-diagram': '/dashboard/tools/process-diagram',
        'api-testing': '/dashboard/tools/api-testing',
        'load-testing': '/dashboard/tools/load-testing',
        'json-generator': '/dashboard/tools/json-generator',
        'sql-generator': '/dashboard/tools/sql-generator',
        'regex-generator': '/dashboard/tools/regex-generator',
        'code-snippet': '/dashboard/tools/code-snippet',
        'mock-data': '/dashboard/tools/mock-data',
        'json-formatter': '/dashboard/tools/json-formatter',
        'xml-formatter': '/dashboard/tools/xml-formatter',
        'db-migration': '/dashboard/tools/db-migration',
        'password-generator': '/dashboard/tools/password-generator',
        'uuid-generator': '/dashboard/tools/uuid-generator',
        'base64-encoder': '/dashboard/tools/base64-encoder',
        'hash-generator': '/dashboard/tools/hash-generator',
        'timestamp-converter': '/dashboard/tools/timestamp-converter',
        'url-encoder': '/dashboard/tools/url-encoder',
        'jwt-decoder': '/dashboard/tools/jwt-decoder',
        'qr-code': '/dashboard/tools/qr-code',
        'file-encryptor/decryptor': '/dashboard/tools/file-encryptor-decryptor',
    }
    return routes[id] || '/'
}

// Tool Factory
interface ToolConfig {
    id: string
    name: string
    category: 'design' | 'diagram' | 'testing' | 'generation' | 'formatting' | 'database' | 'conversion'
    icon: any
    description: string
    styleKey: keyof typeof TOOL_STYLES
}

const createTool = (config: ToolConfig) => ({
    id: config.id,
    name: config.name,
    category: config.category,
    icon: config.icon,
    description: config.description,
    ...TOOL_STYLES[config.styleKey],
    route: routeMap(config.id),
})

// Tools Configuration
const toolsConfig: ToolConfig[] = [
    // Design
    { id: 'color-palette', name: 'Color Palette Generator', category: 'design', icon: Palette, description: 'Generate beautiful color schemes', styleKey: 'pink' },
    { id: 'css-converter', name: 'CSS Framework Converter', category: 'design', icon: Code, description: 'Convert CSS between frameworks', styleKey: 'blue' },
    // Diagrams
    { id: 'uml-diagram', name: 'UML Diagram Creator', category: 'diagram', icon: GitBranch, description: 'Create UML diagrams easily', styleKey: 'indigo' },
    { id: 'er-diagram', name: 'ER Diagram Creator', category: 'diagram', icon: Database, description: 'Design entity relationship diagrams', styleKey: 'cyan' },
    { id: 'architecture-diagram', name: 'System Architecture Tool', category: 'diagram', icon: GitBranch, description: 'Visualize system architecture', styleKey: 'teal' },
    { id: 'process-diagram', name: 'Process Diagram Tool', category: 'diagram', icon: Workflow, description: 'Create process flowcharts', styleKey: 'green' },
    // Testing
    { id: 'api-testing', name: 'API Testing Tool', category: 'testing', icon: Zap, description: 'Test APIs and endpoints', styleKey: 'orange' },
    { id: 'load-testing', name: 'Load Testing Tool', category: 'testing', icon: Gauge, description: 'Measure system performance', styleKey: 'red' },
    // Generation
    { id: 'json-generator', name: 'JSON Generator', category: 'generation', icon: FileJson, description: 'Generate JSON data structures', styleKey: 'yellow' },
    { id: 'sql-generator', name: 'SQL Query Generator', category: 'generation', icon: Database, description: 'Build SQL queries visually', styleKey: 'blue' },
    { id: 'regex-generator', name: 'Regex Generator', category: 'generation', icon: Type, description: 'Create regular expressions', styleKey: 'violet' },
    { id: 'code-snippet', name: 'Code Snippet Generator', category: 'generation', icon: Code, description: 'Generate code snippets', styleKey: 'emerald' },
    { id: 'mock-data', name: 'Mock Data Generator', category: 'generation', icon: FileJson, description: 'Create realistic test data', styleKey: 'lime' },
    // Formatting
    { id: 'json-formatter', name: 'JSON Formatter', category: 'formatting', icon: FileJson, description: 'Format and validate JSON', styleKey: 'cyan' },
    { id: 'xml-formatter', name: 'XML Formatter', category: 'formatting', icon: Code, description: 'Format and validate XML', styleKey: 'blue' },
    // Database
    { id: 'db-migration', name: 'Database Migration Tool', category: 'database', icon: Database, description: 'Manage database migrations', styleKey: 'green' },
    // Conversion
    { id: 'password-generator', name: 'Password Generator', category: 'conversion', icon: Lock, description: 'Generate secure passwords', styleKey: 'red' },
    { id: 'uuid-generator', name: 'UUID Generator', category: 'conversion', icon: Hash, description: 'Create UUIDs and GUIDs', styleKey: 'purple' },
    { id: 'base64-encoder', name: 'Base64 Encoder/Decoder', category: 'conversion', icon: Copy, description: 'Encode and decode Base64', styleKey: 'indigo' },
    { id: 'hash-generator', name: 'Hash Generator', category: 'conversion', icon: Hash, description: 'Generate MD5, SHA hashes', styleKey: 'slate' },
    { id: 'timestamp-converter', name: 'Timestamp Converter', category: 'conversion', icon: Clock, description: 'Convert timestamps', styleKey: 'orange' },
    { id: 'url-encoder', name: 'URL Encoder/Decoder', category: 'conversion', icon: Link, description: 'Encode and decode URLs', styleKey: 'amber' },
    { id: 'jwt-decoder', name: 'JWT Decoder', category: 'conversion', icon: Lock, description: 'Decode and verify JWT tokens', styleKey: 'rose' },
    { id: 'qr-code', name: 'QR Code Generator', category: 'conversion', icon: QrCode, description: 'Generate QR codes', styleKey: 'emerald' },
    { id: 'file-encryptor/decryptor', name: 'File Encryptor/Decryptor', category: 'conversion', icon: Lock, description: 'Encrypt and decrypt files securely', styleKey: 'zinc' },
]

// Export compiled tools
export const toolsData = toolsConfig.map(createTool)

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