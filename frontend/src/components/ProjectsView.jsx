import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import Dialog from './Dialog';
import EditIcon from './EditIcon';
import Input from './Input';
import Label from './Label';
import Select from './Select';
import TrashIcon from './TrashIcon';
import { CURRENCIES } from '../utils/formatCurrency';

const ProjectsView = ({ projects, setProjects, clients, teamMembers, currencySettings, setViewingProject, isLoading }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const [formState, setFormState] = useState({
        name: '',
        client: clients.length > 0 ? clients[0].name : '',
        status: 'Planning',
        assignedTo: teamMembers.length > 0 ? teamMembers[0].id : null,
        billingType: 'Hourly',
        billingRate: 100,
        budget: 5000,
        currency: currencySettings.default,
    });

    const teamMemberMap = teamMembers.reduce((acc, member) => {
        acc[member.id] = member.name;
        return acc;
    }, {});

    const openAddDialog = () => {
        setEditingProject(null);
        setFormState({
            name: '',
            client: clients.length > 0 ? clients[0].name : '',
            status: 'Planning',
            assignedTo: teamMembers.length > 0 ? teamMembers[0].id : null,
            billingType: 'Hourly',
            billingRate: 100,
            budget: 5000,
            currency: currencySettings.default,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (project) => {
        setEditingProject(project);
        setFormState({
            name: project.name,
            client: project.client,
            status: project.status,
            assignedTo: project.assignedTo,
            billingType: project.billing.type,
            billingRate: project.billing.rate || 100,
            budget: project.budget || 5000,
            currency: project.currency,
        });
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingProject(null);
    };

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setFormState(prev => ({...prev, [id]: value}));
    };

    const handleSaveProject = (e) => {
        e.preventDefault();
        if (formState.name.trim() && formState.client) {
            const projectData = {
                name: formState.name,
                client: formState.client,
                status: formState.status,
                assignedTo: formState.assignedTo ? parseInt(formState.assignedTo) : null,
                currency: formState.currency,
                billing: {
                    type: formState.billingType,
                    rate: formState.billingType === 'Hourly' ? parseFloat(formState.billingRate) : undefined,
                },
                budget: formState.billingType === 'Fixed Price' ? parseFloat(formState.budget) : null,
            };

            if (editingProject) {
                setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...projectData } : p));
            } else {
                 const newProject = {
                    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
                    ...projectData,
                    tracked: 0,
                    tasks: [],
                };
                setProjects([newProject, ...projects]);
            }
            closeDialog();
        }
    };

    const handleDeleteProject = () => {
        if (projectToDelete) {
            setProjects(projects.filter(p => p.id !== projectToDelete.id));
            setProjectToDelete(null);
        }
    };

    const statusOptions = ["Planning", "In Progress", "Completed", "On Hold"];

    const statusColors = {
        "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        "Planning": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        "On Hold": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Projects</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your projects here.</p>
                </div>
                <Button onClick={openAddDialog}>Create New Project</Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Project Name</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Client</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Assigned To</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Hours Tracked</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-8">
                                    <p className="text-gray-500">Loading projects...</p>
                                </td>
                            </tr>
                        ) : projects.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-8">
                                    <p className="text-gray-500">No projects found.</p>
                                    <Button className="mt-4" onClick={openAddDialog}>Create Your First Project</Button>
                                </td>
                            </tr>
                        ) : (
                            projects.map(project => (
                                 <tr key={project.id}>
                                    <td className="p-4 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => setViewingProject(project)}>
                                        {project.name}
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{project.client}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{teamMemberMap[project.assignedTo] || 'Unassigned'}</td>
                                    <td className="p-4">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-mono">{project.tracked.toFixed(2)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" className="px-2" onClick={() => openEditDialog(project)}>
                                                <EditIcon className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" className="px-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => setProjectToDelete(project)}>
                                                <TrashIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>

            <Dialog isOpen={isDialogOpen} onClose={closeDialog} title={editingProject ? "Edit Project" : "Create New Project"}>
                <form onSubmit={handleSaveProject} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Project Name</Label>
                        <Input id="name" type="text" value={formState.name} onChange={handleFormChange} required />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <Label htmlFor="client">Client</Label>
                           <Select id="client" value={formState.client} onChange={handleFormChange}>
                               {clients.map(client => (
                                   <option key={client.id} value={client.name}>{client.name}</option>
                               ))}
                           </Select>
                       </div>
                       <div>
                           <Label htmlFor="assignedTo">Assigned To</Label>
                           <Select id="assignedTo" value={formState.assignedTo || ''} onChange={handleFormChange}>
                               <option value="">Unassigned</option>
                               {teamMembers.map(member => (
                                   <option key={member.id} value={member.id}>{member.name}</option>
                               ))}
                           </Select>
                       </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="billingType">Billing Method</Label>
                            <Select id="billingType" value={formState.billingType} onChange={handleFormChange}>
                               <option>Hourly</option>
                               <option>Fixed Price</option>
                            </Select>
                         </div>
                         {formState.billingType === 'Hourly' ? (
                             <div>
                                <Label htmlFor="billingRate">Hourly Rate</Label>
                                <div className="relative">
                                     <Input id="billingRate" type="number" value={formState.billingRate} onChange={handleFormChange} className="pl-8"/>
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{CURRENCIES.find(c=>c.code === formState.currency)?.symbol || '$'}</span>
                                </div>
                             </div>
                         ) : (
                             <div>
                                <Label htmlFor="budget">Project Budget</Label>
                                 <div className="relative">
                                    <Input id="budget" type="number" value={formState.budget} onChange={handleFormChange} className="pl-8"/>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{CURRENCIES.find(c=>c.code === formState.currency)?.symbol || '$'}</span>
                                 </div>
                             </div>
                         )}
                     </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select id="currency" value={formState.currency} onChange={handleFormChange}>
                               {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                            </Select>
                         </div>
                         <div>
                            <Label htmlFor="status">Status</Label>
                            <Select id="status" value={formState.status} onChange={handleFormChange}>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button type="button" variant="secondary" onClick={closeDialog}>Cancel</Button>
                        <Button type="submit">{editingProject ? "Save Changes" : "Create Project"}</Button>
                    </div>
                </form>
            </Dialog>

            <Dialog isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} title="Delete Project">
                <p>Are you sure you want to delete the project "{projectToDelete?.name}"? This will not delete its associated time entries but may affect reporting.</p>
                 <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setProjectToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteProject}>Delete</Button>
                </div>
            </Dialog>
        </div>
    );
};

export default ProjectsView;
