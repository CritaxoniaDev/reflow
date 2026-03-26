'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Clock, Workflow, Users } from 'lucide-react'
import {
    Button,
    Card,
    Input,
    Label,
    Dialog,
    DialogContent,
    AlertDialog,
    AlertDialogContent,
    AlertDialogAction,
    AlertDialogCancel,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui'
import { SidebarInset } from '@/packages/shadcn-v1/sidebar'
import { useRouter } from 'next/navigation'
import { useGetFlowcharts, useCreateFlowchart, useDeleteFlowchart } from '../_ts/flowcharts'
import { useAccountInfo } from '../_ts/account'

export default function MyFlowchartsPage() {
    const router = useRouter()
    const { teamName } = useAccountInfo()
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: '', isTeam: false })

    const { data: flowchartsData, isLoading } = useGetFlowcharts()
    const createMutation = useCreateFlowchart()
    const deleteMutation = useDeleteFlowchart()

    const personalFlowcharts = flowchartsData?.personal || []
    const teamFlowcharts = flowchartsData?.team || []
    const hasTeam = Boolean(teamName && teamName !== 'Personal')

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) return

        await createMutation.mutateAsync({
            name: formData.name,
            isTeam: formData.isTeam && hasTeam,
        })
        setFormData({ name: '', isTeam: false })
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedId) return
        await deleteMutation.mutateAsync({ id: selectedId })
        setIsDeleteOpen(false)
        setSelectedId(null)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const FlowchartCard = ({ flowchart, isTeam = false }: any) => (
        <Card
            key={flowchart.id}
            className="p-4 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all"
        >
            <div
                onClick={() => router.push(`/dashboard/my/${flowchart.id}`)}
                className="space-y-3"
            >
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold line-clamp-2 flex-1">{flowchart.name}</h3>
                    {isTeam && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded ml-2 whitespace-nowrap">
                            Team
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Updated {formatDate(flowchart.updated_at)}
                </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/my/${flowchart.id}`)}
                >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setSelectedId(flowchart.id)
                        setIsDeleteOpen(true)
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    )

    return (
        <SidebarInset>
            <div className="flex-1 space-y-8 p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                            My Flowcharts
                        </h2>
                        <p className="text-muted-foreground">
                            Create and manage your flowcharts
                        </p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Flowchart
                        </Button>
                        <DialogContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Create a New Flowchart</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Start creating your flowchart by giving it a name
                                    </p>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="flowchart-name">Flowchart Name</Label>
                                        <Input
                                            id="flowchart-name"
                                            placeholder="Enter flowchart name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={createMutation.isPending}
                                            maxLength={100}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Max 100 characters
                                        </p>
                                    </div>

                                    {hasTeam && (
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isTeam}
                                                    onChange={(e) => setFormData({ ...formData, isTeam: e.target.checked })}
                                                    className="rounded"
                                                />
                                                <span>Create for team</span>
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Team members can view and collaborate on this flowchart
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending || !formData.name.trim()}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        {createMutation.isPending ? 'Creating...' : 'Create Flowchart'}
                                    </Button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Flowcharts Content */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading your flowcharts...</p>
                    </div>
                ) : personalFlowcharts.length === 0 && teamFlowcharts.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <Card className="p-12 border-dashed max-w-md w-full">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <Workflow className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">No flowcharts yet</p>
                                    <p className="text-sm text-muted-foreground">
                                        Create your first flowchart to get started
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList>
                            <TabsTrigger value="personal">
                                My Flowcharts ({personalFlowcharts.length})
                            </TabsTrigger>
                            {hasTeam && (
                                <TabsTrigger value="team">
                                    <Users className="h-4 w-4 mr-2" />
                                    Team Flowcharts ({teamFlowcharts.length})
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="personal" className="mt-6">
                            {personalFlowcharts.length === 0 ? (
                                <Card className="p-8 border-dashed text-center">
                                    <p className="text-muted-foreground">No personal flowcharts yet</p>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {personalFlowcharts.map((fc: any) => (
                                        <FlowchartCard key={fc.id} flowchart={fc} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {hasTeam && (
                            <TabsContent value="team" className="mt-6">
                                {teamFlowcharts.length === 0 ? (
                                    <Card className="p-8 border-dashed text-center">
                                        <p className="text-muted-foreground">No team flowcharts yet</p>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {teamFlowcharts.map((fc: any) => (
                                            <FlowchartCard key={fc.id} flowchart={fc} isTeam />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        )}
                    </Tabs>
                )}

                {/* Delete Alert */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Delete Flowchart</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Are you sure you want to delete this flowchart? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={deleteMutation.isPending}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </SidebarInset>
    )
}