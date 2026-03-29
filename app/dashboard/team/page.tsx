'use client'

import { useState } from 'react'
import { Plus, Users, Settings, Trash2, Mail, Copy, Check, Key, Loader2, Shield, LogIn } from 'lucide-react'
import { Badge } from '@/components/ui'
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
} from '@/components/ui'
import { useAccountInfo } from '../_ts/account'
import { useCreateTeam, useDeleteTeam, useInviteMember, useJoinTeamByCode, useGetTeamInviteCode, useGetTeamMembers } from '../_ts/team'
import { SidebarInset } from '@/packages/shadcn-v1/sidebar'

export default function TeamPage() {
    const { username, teamName, teamId } = useAccountInfo()
    const [isOpen, setIsOpen] = useState(false)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [isJoinOpen, setIsJoinOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [teamFormData, setTeamFormData] = useState({ name: '' })
    const [inviteFormData, setInviteFormData] = useState({ email: '' })
    const [joinCode, setJoinCode] = useState('')
    const [copied, setCopied] = useState(false)

    const createTeamMutation = useCreateTeam()
    const deleteTeamMutation = useDeleteTeam()
    const inviteMemberMutation = useInviteMember()
    const joinTeamMutation = useJoinTeamByCode()
    const { data: teamCodeData } = useGetTeamInviteCode(!!teamId && !!teamName && teamName !== 'Personal')
    const { data: teamMembers, isLoading: isLoadingMembers } = useGetTeamMembers(!!teamId && !!teamName && teamName !== 'Personal')

    const hasTeam = teamName && teamName !== 'Personal'

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!teamFormData.name.trim()) return
        await createTeamMutation.mutateAsync({ name: teamFormData.name })
        setTeamFormData({ name: '' })
        setIsOpen(false)
    }

    const handleDeleteTeam = async () => {
        if (!hasTeam || !teamId) return
        await deleteTeamMutation.mutateAsync()
        setIsDeleteOpen(false)
    }

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteFormData.email.trim()) return
        await inviteMemberMutation.mutateAsync({ email: inviteFormData.email })
        setInviteFormData({ email: '' })
        setIsInviteOpen(false)
    }

    const handleJoinTeam = async (e: React.FormEvent) => {
        e.preventDefault()
        if (joinCode.length < 16) return
        await joinTeamMutation.mutateAsync({ code: joinCode })
        setJoinCode('')
        setIsJoinOpen(false)
    }

    const copyToClipboard = () => {
        if (teamCodeData?.inviteCode) {
            navigator.clipboard.writeText(teamCodeData.inviteCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <SidebarInset>
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="flex-1 space-y-8 p-6 md:p-8 mx-auto">
                    {/* Enhanced Header */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                                    Team Management
                                </h1>
                                <p className="text-muted-foreground text-sm mt-1">Organize your team and collaborate efficiently</p>
                            </div>
                        </div>
                    </div>

                    {/* Join Team Section - Enhanced */}
                    {!hasTeam && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <LogIn className="h-5 w-5 text-blue-600" />
                                Join a Team
                            </h2>
                            <Card className="p-6 border-blue-200/50 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Have an invite code? Join an existing team to start collaborating with your colleagues.
                                    </p>
                                    <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
                                        <Button
                                            onClick={() => setIsJoinOpen(true)}
                                            variant="outline"
                                            className="w-full border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                        >
                                            <Key className="h-4 w-4 mr-2" />
                                            Join Team with Code
                                        </Button>
                                        <DialogContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">Join Team</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Enter the team invite code provided by your team owner
                                                    </p>
                                                </div>
                                                <form onSubmit={handleJoinTeam} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="join-code">Team Invite Code</Label>
                                                        <Input
                                                            id="join-code"
                                                            placeholder="e.g., ABCD1234EFGH5678"
                                                            value={joinCode}
                                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                                            maxLength={16}
                                                            disabled={joinTeamMutation.isPending}
                                                            className="font-mono tracking-widest text-center"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Get this code from your team owner
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        disabled={joinCode.length !== 16 || joinTeamMutation.isPending}
                                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        {joinTeamMutation.isPending ? 'Joining...' : 'Join Team'}
                                                    </Button>
                                                </form>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Current Team Section - Enhanced */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Your Team
                        </h2>

                        {hasTeam ? (
                            <Card className="p-6 border-blue-200/50 dark:border-blue-900/30 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Team Name</p>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{teamName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-2">Team Owner</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                                                    <span className="text-xs font-bold text-white">{username.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <span className="text-sm font-medium">{username}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" size="sm">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setIsDeleteOpen(true)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-8 border-dashed border-2 hover:border-solid transition-all hover:shadow-md">
                                <div className="text-center space-y-4">
                                    <div className="flex justify-center">
                                        <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-950/30">
                                            <Users className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">No Team Yet</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Create your first team to start collaborating with others
                                        </p>
                                    </div>
                                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                        <Button
                                            onClick={() => setIsOpen(true)}
                                            className="bg-blue-600 hover:bg-blue-700 mx-auto"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Team
                                        </Button>
                                        <DialogContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">Create a New Team</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Give your team a name and start collaborating
                                                    </p>
                                                </div>
                                                <form onSubmit={handleCreateTeam} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="team-name">Team Name</Label>
                                                        <Input
                                                            id="team-name"
                                                            placeholder="e.g., Design Team, Engineering"
                                                            value={teamFormData.name}
                                                            onChange={(e) => setTeamFormData({ name: e.target.value })}
                                                            disabled={createTeamMutation.isPending}
                                                            maxLength={50}
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Maximum 50 characters
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        disabled={createTeamMutation.isPending || !teamFormData.name.trim()}
                                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
                                                    </Button>
                                                </form>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Share Team Code Section - Enhanced */}
                    {hasTeam && teamCodeData && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Key className="h-5 w-5 text-blue-600" />
                                Share Team Access
                            </h2>
                            <Card className="p-6 border-blue-200/50 dark:border-blue-900/30">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-3">
                                            Team Invite Code
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                value={teamCodeData.inviteCode}
                                                readOnly
                                                className="font-mono text-center tracking-widest py-5 font-bold"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={copyToClipboard}
                                                type="button"
                                                className="hover:bg-blue-50 py-5 px-5 dark:hover:bg-blue-950/30"
                                            >
                                                {copied ? (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            📋 Share this code with team members to let them join
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Team Members Section - Enhanced */}
                    {hasTeam && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Team Members
                                    <Badge variant="outline" className="ml-2">{teamMembers?.length || 0}</Badge>
                                </h2>
                                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsInviteOpen(true)}
                                        className="border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Invite Member
                                    </Button>
                                    <DialogContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">Invite Team Member</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Send an invitation to collaborate with your team
                                                </p>
                                            </div>
                                            <form onSubmit={handleInviteMember} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="invite-email">Email Address</Label>
                                                    <Input
                                                        id="invite-email"
                                                        type="email"
                                                        placeholder="colleague@example.com"
                                                        value={inviteFormData.email}
                                                        onChange={(e) => setInviteFormData({ email: e.target.value })}
                                                        disabled={inviteMemberMutation.isPending}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        They'll receive an invitation to join your team
                                                    </p>
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={!inviteFormData.email.trim() || inviteMemberMutation.isPending}
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    {inviteMemberMutation.isPending ? 'Sending...' : 'Send Invitation'}
                                                </Button>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card className="overflow-hidden">
                                <div className="divide-y">
                                    {isLoadingMembers ? (
                                        <div className="p-8 text-center">
                                            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-blue-600" />
                                            <p className="text-sm text-muted-foreground">Loading team members...</p>
                                        </div>
                                    ) : teamMembers && teamMembers.length > 0 ? (
                                        teamMembers.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0">
                                                        <span className="text-xs font-bold text-white">{member.username.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-sm">{member.username}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={member.role === 'owner' ? 'default' : 'secondary'} className="ml-2">
                                                    {member.role === 'owner' ? '👑 Owner' : 'Member'}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                            <p className="text-sm text-muted-foreground">No members yet</p>
                                            <p className="text-xs text-muted-foreground mt-1">Invite team members to start collaborating</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Info Card - Enhanced */}
                    {hasTeam && (
                        <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/30">
                            <div className="flex gap-3">
                                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                                        Team Limits
                                    </h4>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        You can create and manage <strong>1 team</strong>. To create another team, delete this one first.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Delete Team Alert Dialog */}
                    <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <AlertDialogContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-red-600">Delete Team</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Are you sure you want to delete <strong>"{teamName}"</strong>? This action cannot be undone. All team members will lose access.
                                    </p>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteTeam}
                                        disabled={deleteTeamMutation.isPending}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {deleteTeamMutation.isPending ? 'Deleting...' : 'Delete Team'}
                                    </AlertDialogAction>
                                </div>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </SidebarInset>
    )
}