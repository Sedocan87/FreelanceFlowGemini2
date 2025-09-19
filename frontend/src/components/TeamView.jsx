import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import Dialog from './Dialog';
import EditIcon from './EditIcon';
import Input from './Input';
import Label from './Label';
import TrashIcon from './TrashIcon';
import { formatCurrency } from '../utils/formatCurrency';

const TeamView = ({ teamMembers, setTeamMembers, projects, setProjects }) => {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [memberToDelete, setMemberToDelete] = useState(null);

    const [formState, setFormState] = useState({email: '', rate: 50});

    const handleInvite = (e) => {
        e.preventDefault();
        if (formState.email) {
            const newMember = {
                id: teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1,
                name: 'Pending Invitation',
                email: formState.email,
                role: 'Member',
                rate: parseFloat(formState.rate),
            };
            setTeamMembers([...teamMembers, newMember]);
            setIsInviteOpen(false);
            setFormState({email: '', rate: 50});
        }
    };

    const handleUpdateRate = (e) => {
        e.preventDefault();
        if (editingMember) {
            setTeamMembers(teamMembers.map(m => m.id === editingMember.id ? {...m, rate: parseFloat(formState.rate)} : m));
            setEditingMember(null);
        }
    };

    const handleDeleteMember = () => {
        if (memberToDelete) {
            setTeamMembers(teamMembers.filter(m => m.id !== memberToDelete.id));
            setProjects(projects.map(p =>
                p.assignedTo === memberToDelete.id ? { ...p, assignedTo: null } : p
            ));
            setMemberToDelete(null);
        }
    };

    const openEditDialog = (member) => {
        setEditingMember(member);
        setFormState({email: member.email, rate: member.rate});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Team Management</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Invite and manage your team members.</p>
                </div>
                <Button onClick={() => setIsInviteOpen(true)}>Invite Member</Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Internal Rate ($/hr)</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {teamMembers.map(member => (
                            <tr key={member.id}>
                                <td className="p-4 font-medium text-gray-800 dark:text-gray-100 flex items-center gap-3">
                                    <img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${member.name.charAt(0)}`} alt="Avatar" className="w-8 h-8 rounded-full" />
                                    {member.name}
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{member.email}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{member.role}</td>
                                <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-mono">{formatCurrency(member.rate, 'USD')}</td>
                                <td className="p-4 text-right">
                                     <div className="flex justify-end gap-2">
                                        <Button variant="ghost" className="px-2" onClick={() => openEditDialog(member)} disabled={member.role === 'Admin'}>
                                            <EditIcon className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" className="px-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => setMemberToDelete(member)} disabled={member.role === 'Admin'}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Dialog isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite New Team Member">
                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <Label htmlFor="inviteEmail">Email Address</Label>
                        <Input id="inviteEmail" type="email" value={formState.email} onChange={(e) => setFormState(p => ({...p, email: e.target.value}))} required placeholder="teammate@example.com" />
                    </div>
                     <div>
                        <Label htmlFor="inviteRate">Internal Hourly Rate ($)</Label>
                        <Input id="inviteRate" type="number" value={formState.rate} onChange={(e) => setFormState(p => ({...p, rate: e.target.value}))} required />
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                        <Button type="submit">Send Invitation</Button>
                    </div>
                </form>
            </Dialog>

             <Dialog isOpen={!!editingMember} onClose={() => setEditingMember(null)} title={`Update Rate for ${editingMember?.name}`}>
                <form onSubmit={handleUpdateRate} className="space-y-4">
                    <div>
                        <Label htmlFor="editRate">Internal Hourly Rate ($)</Label>
                        <Input id="editRate" type="number" value={formState.rate} onChange={(e) => setFormState(p => ({...p, rate: e.target.value}))} required />
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setEditingMember(null)}>Cancel</Button>
                        <Button type="submit">Update Rate</Button>
                    </div>
                </form>
            </Dialog>

            <Dialog isOpen={!!memberToDelete} onClose={() => setMemberToDelete(null)} title="Delete Team Member">
                <p>Are you sure you want to delete {memberToDelete?.name}? They will be unassigned from all projects.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setMemberToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteMember}>Delete Member</Button>
                </div>
            </Dialog>
        </div>
    );
};

export default TeamView;
