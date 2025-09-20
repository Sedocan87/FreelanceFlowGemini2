import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Label from './Label';
import Select from './Select';
import Textarea from './Textarea';
import { useAuth } from '../contexts/AuthContext';
import { getTimeEntries, addTimeEntry } from '../api';

const TimeTrackingView = ({ projects, setProjects, user }) => {
    const { idToken } = useAuth();
    const [timeEntries, setTimeEntries] = useState([]);
    const [selectedProject, setSelectedProject] = useState(projects.length > 0 ? projects[0].id : '');
    const [hours, setHours] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerStartTime, setTimerStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerProjectId, setTimerProjectId] = useState(projects.length > 0 ? projects[0].id : null);

    useEffect(() => {
        const fetchTimeEntries = async () => {
            if (idToken) {
                try {
                    const data = await getTimeEntries(idToken);
                    setTimeEntries(data);
                } catch (error) {
                    console.error('Error fetching time entries:', error);
                }
            }
        };
        fetchTimeEntries();
    }, [idToken]);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - timerStartTime) / 1000));
            }, 1000);
        } else if (!isTimerRunning && elapsedTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerStartTime]);

    const handleStartTimer = () => {
        if (!timerProjectId) {
            alert("Please select a project to track.");
            return;
        }
        setIsTimerRunning(true);
        setTimerStartTime(Date.now());
        setElapsedTime(0);
    };

    const handleStopTimer = () => {
        setIsTimerRunning(false);
        const finalElapsedTimeInHours = (elapsedTime / 3600).toFixed(2);

        setSelectedProject(timerProjectId);
        setHours(finalElapsedTimeInHours);
        setDate(new Date().toISOString().split('T')[0]);
        setDescription(`Real-time tracked entry for ${new Date().toLocaleTimeString()}`);

        setTimerStartTime(null);
        setElapsedTime(0);
    };

    const handleAddTimeEntry = async (e) => {
        e.preventDefault();
        const hoursNum = parseFloat(hours);
        if (!selectedProject || !hours || isNaN(hoursNum) || hoursNum <= 0) {
            console.error("Invalid input");
            return;
        }
        const newEntry = {
            projectId: parseInt(selectedProject),
            hours: hoursNum,
            date,
            description,
            memberId: user.id,
            isBilled: false,
        };

        try {
            const addedEntry = await addTimeEntry(newEntry, idToken);
            setTimeEntries([addedEntry, ...timeEntries]);
            setProjects(projects.map(p => p.id === parseInt(selectedProject) ? { ...p, tracked: p.tracked + hoursNum } : p));
            setHours('');
            setDescription('');
        } catch (error) {
            console.error('Error adding time entry:', error);
        }
    };

    const projectMap = projects.reduce((acc, proj) => {
        acc[proj.id] = proj.name;
        return acc;
    }, {});

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const timerProjectName = timerProjectId ? projectMap[timerProjectId] : 'No project selected';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Time Tracking</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Log your work hours or use the real-time tracker.</p>

            <Card className="my-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex-1 min-w-[200px]">
                         <Label htmlFor="timerProject">Track Project</Label>
                         <Select id="timerProject" value={timerProjectId || ''} onChange={(e) => setTimerProjectId(e.target.value)} disabled={isTimerRunning}>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Select>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{isTimerRunning ? `Tracking: ${timerProjectName}` : 'Timer is stopped'}</p>
                        <p className="text-4xl font-bold font-mono text-gray-800 dark:text-white">{formatTime(elapsedTime)}</p>
                    </div>
                    <div>
                        {isTimerRunning ? (
                            <Button variant="destructive" onClick={handleStopTimer} className="w-32">Stop Timer</Button>
                        ) : (
                            <Button onClick={handleStartTimer} className="w-32">Start Timer</Button>
                        )}
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Log Time Manually</h3>
                        <form onSubmit={handleAddTimeEntry} className="space-y-4">
                             <div>
                                <Label htmlFor="logProject">Project</Label>
                                <Select id="logProject" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="hours">Hours</Label>
                                <Input id="hours" type="number" step="0.01" value={hours} onChange={e => setHours(e.target.value)} required />
                            </div>
                             <div>
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>
                             <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full">Log Time</Button>
                        </form>
                    </Card>
                </div>
                 <div className="lg:col-span-2">
                     <Card className="overflow-x-auto">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Entries</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Project</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Hours</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {timeEntries.slice(0, 5).map(entry => (
                                    <tr key={entry.id}>
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-100">{projectMap[entry.projectId]}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400 text-right font-mono">{entry.hours.toFixed(2)}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{entry.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TimeTrackingView;
