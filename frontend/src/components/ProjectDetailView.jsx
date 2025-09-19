import React, { useState, useMemo } from 'react';
import Button from './Button';
import Dialog from './Dialog';
import Input from './Input';
import Label from './Label';
import Select from './Select';
import Textarea from './Textarea';

const ProjectDetailView = ({ project, setProjects, teamMembers, onBack }) => {
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [formState, setFormState] = useState({ title: '', description: '', assignedTo: '' });

    const teamMemberMap = useMemo(() => teamMembers.reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
    }, {}), [teamMembers]);

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, newStatus) => {
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === project.id) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
                };
            }
            return p;
        }));
    };

    const openAddDialog = () => {
        setEditingTask(null);
        setFormState({ title: '', description: '', assignedTo: teamMembers.length > 0 ? teamMembers[0].id : '' });
        setIsTaskDialogOpen(true);
    };

    const openEditDialog = (task) => {
        setEditingTask(task);
        setFormState({ title: task.title, description: task.description, assignedTo: task.assignedTo });
        setIsTaskDialogOpen(true);
    };

    const handleDeleteTask = () => {
        if (taskToDelete) {
            setProjects(prevProjects => prevProjects.map(p => {
                if (p.id === project.id) {
                    return { ...p, tasks: p.tasks.filter(t => t.id !== taskToDelete.id) };
                }
                return p;
            }));
            setTaskToDelete(null);
        }
    };

    const handleSaveTask = (e) => {
        e.preventDefault();
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === project.id) {
                let newTasks;
                if (editingTask) {
                    // Update existing task
                    newTasks = p.tasks.map(t => t.id === editingTask.id ? { ...t, ...formState, assignedTo: parseInt(formState.assignedTo) } : t);
                } else {
                    // Add new task
                    const newTask = {
                        id: Date.now(),
                        status: 'To Do',
                        ...formState,
                        assignedTo: parseInt(formState.assignedTo),
                    };
                    newTasks = [...p.tasks, newTask];
                }
                return { ...p, tasks: newTasks };
            }
            return p;
        }));
        setIsTaskDialogOpen(false);
    };

    const TaskCard = ({ task }) => (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDoubleClick={() => openEditDialog(task)}
            className="group bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border dark:border-gray-600 cursor-grab"
        >
            <p className="font-medium text-sm text-gray-800 dark:text-gray-100 pr-2">{task.title}</p>
            {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>}
            {task.assignedTo && teamMemberMap[task.assignedTo] && (
                <div className="flex items-center mt-3">
                    <img
                        src={`https://placehold.co/24x24/E2E8F0/4A5568?text=${teamMemberMap[task.assignedTo].name.charAt(0)}`}
                        alt={teamMemberMap[task.assignedTo].name}
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{teamMemberMap[task.assignedTo].name}</span>
                </div>
            )}
        </div>
    );

    const KanbanColumn = ({ title, status, tasks }) => (
        <div
            className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 flex-1 min-h-[200px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
        >
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 px-1">{title} ({tasks.length})</h3>
            <div className="space-y-3">
                {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
        </div>
    );

    return (
        <div>
            <Button variant="secondary" onClick={onBack} className="mb-4">&larr; Back to Projects</Button>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{project.name}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{project.client}</p>
                </div>
                <Button onClick={openAddDialog}>Add New Task</Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <KanbanColumn title="To Do" status="To Do" tasks={project.tasks.filter(t => t.status === 'To Do')} />
                <KanbanColumn title="In Progress" status="In Progress" tasks={project.tasks.filter(t => t.status === 'In Progress')} />
                <KanbanColumn title="Done" status="Done" tasks={project.tasks.filter(t => t.status === 'Done')} />
            </div>

            <Dialog isOpen={isTaskDialogOpen} onClose={() => setIsTaskDialogOpen(false)} title={editingTask ? "Edit Task" : "Add New Task"}>
                <form onSubmit={handleSaveTask} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Task Title</Label>
                        <Input id="title" type="text" value={formState.title} onChange={(e) => setFormState(s => ({...s, title: e.target.value}))} required />
                    </div>
                     <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formState.description} onChange={(e) => setFormState(s => ({...s, description: e.target.value}))} />
                    </div>
                    <div>
                        <Label htmlFor="assignedTo">Assign To</Label>
                        <Select id="assignedTo" value={formState.assignedTo} onChange={(e) => setFormState(s => ({...s, assignedTo: e.target.value}))}>
                            {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </Select>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div>
                             {editingTask && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        setIsTaskDialogOpen(false);
                                        setTaskToDelete(editingTask);
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingTask ? "Save Changes" : "Add Task"}</Button>
                        </div>
                    </div>
                </form>
            </Dialog>

             <Dialog isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} title="Delete Task">
                <p>Are you sure you want to delete this task: "{taskToDelete?.title}"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setTaskToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteTask}>Delete</Button>
                </div>
            </Dialog>
        </div>
    );
};

export default ProjectDetailView;
