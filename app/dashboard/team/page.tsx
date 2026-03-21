'use client'

import { useState } from 'react'
import { Plus, Users, Settings, Trash2, Mail, Copy, Check, Key, Loader2 } from 'lucide-react'
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
            <div className="flex-1 space-y-8 p-6 md:p-8">
                {/* Header */}
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                        Team Management
                    </h2>
                    <p className="text-muted-foreground">
                        Create and manage your teams, invite members, and collaborate.
                    </p>
                </div>

                {/* Join Team Section - Show when user has no team */}
                {!hasTeam && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Join a Team</h3>
                        <Card className="p-6 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Have a team invite code? Join an existing team to collaborate.
                                </p>
                                <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
                                    <Button
                                        onClick={() => setIsJoinOpen(true)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Key className="h-4 w-4 mr-2" />
                                        Join Team with Code
                                    </Button>
                                    <DialogContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">Join Team</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Enter the team invite code to join
                                                </p>
                                            </div>

                                            <form onSubmit={handleJoinTeam} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="join-code">Team Code</Label>
                                                    <Input
                                                        id="join-code"
                                                        placeholder="Enter 16-character code"
                                                        value={joinCode}
                                                        onChange={(e) =>
                                                            setJoinCode(e.target.value.toUpperCase())
                                                        }
                                                        maxLength={16}
                                                        disabled={joinTeamMutation.isPending}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Get the code from your team owner
                                                    </p>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        joinCode.length !== 16 || joinTeamMutation.isPending
                                                    }
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                >
                                                    {joinTeamMutation.isPending ? (
                                                        'Joining...'
                                                    ) : (
                                                        <>
                                                            <Key className="h-4 w-4 mr-2" />
                                                            Join Team
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Current Team Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Team</h3>

                    {hasTeam ? (
                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3 flex-1">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Team Name</p>
                                        <p className="text-xl font-semibold">{teamName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Owner</p>
                                        <p className="text-sm">{username}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
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
                        <Card className="p-6 border-dashed">
                            <div className="text-center space-y-4">
                                <Users className="h-8 w-8 text-muted-foreground mx-auto" />
                                <div>
                                    <p className="font-medium">No team yet</p>
                                    <p className="text-sm text-muted-foreground">
                                        Create your first team to start collaborating
                                    </p>
                                </div>
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <Button
                                        onClick={() => setIsOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Team
                                    </Button>
                                    <DialogContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">Create a New Team</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Create your team to start collaborating with others
                                                </p>
                                            </div>

                                            <form onSubmit={handleCreateTeam} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="team-name">Team Name</Label>
                                                    <Input
                                                        id="team-name"
                                                        placeholder="Enter team name"
                                                        value={teamFormData.name}
                                                        onChange={(e) =>
                                                            setTeamFormData({ name: e.target.value })
                                                        }
                                                        disabled={createTeamMutation.isPending}
                                                        maxLength={50}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Max 50 characters
                                                    </p>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        createTeamMutation.isPending || !teamFormData.name.trim()
                                                    }
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

                {/* Share Team Code Section */}
                {hasTeam && teamCodeData && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Share Team Access</h3>
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                        Team Invite Code
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            value={teamCodeData.inviteCode}
                                            readOnly
                                            className="font-mono text-center tracking-wider"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={copyToClipboard}
                                            type="button"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Share this code with others to let them join your team
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Team Members Section */}
                {hasTeam && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Team Members ({teamMembers?.length || 0})</h3>
                            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsInviteOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Invite Member
                                </Button>
                                <DialogContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">Invite Team Member</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Send an invitation to join your team
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
                                                    onChange={(e) =>
                                                        setInviteFormData({ email: e.target.value })
                                                    }
                                                    disabled={inviteMemberMutation.isPending}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    We'll send them an invitation to join your team
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

                        <Card>
                            <div className="divide-y">
                                {isLoadingMembers ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                                        Loading members...
                                    </div>
                                ) : teamMembers && teamMembers.length > 0 ? (
                                    teamMembers.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                                                    <span className="text-xs font-bold text-white">
                                                        {member.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{member.username}</p>
                                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                                </div>
                                            </div>
                                            <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                                                {member.role === 'owner' ? '👑 Owner' : 'Member'}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        Invite members to your team to start collaborating
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Team Info Card */}
                {hasTeam && (
                    <Card className="p-6 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                                Team Limit
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                You can create a maximum of 1 team. To create another team, you'll need to delete this one first.
                            </p>
                        </div>
                    </Card>
                )}

                {/* Delete Team Alert Dialog */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Delete Team</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Are you sure you want to delete "{teamName}"? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteTeam}
                                    disabled={deleteTeamMutation.isPending}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {deleteTeamMutation.isPending ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </SidebarInset>
    )
}