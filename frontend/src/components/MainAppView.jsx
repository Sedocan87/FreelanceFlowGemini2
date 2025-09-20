import React, { useState, useEffect, useCallback } from 'react';
import HomeIcon from './HomeIcon';
import BriefcaseIcon from './BriefcaseIcon';
import UsersIcon from './UsersIcon';
import FileTextIcon from './FileTextIcon';
import ClockIcon from './ClockIcon';
import ChartBarIcon from './ChartBarIcon';
import DollarSignIcon from './DollarSignIcon';
import SettingsIcon from './SettingsIcon';
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';
import MenuIcon from './MenuIcon';
import TeamIcon from './TeamIcon';
import ProjectDetailView from './ProjectDetailView';
import DashboardView from './DashboardView';
import ProjectsView from './ProjectsView';
import ClientsView from './ClientsView';
import InvoicesView from './InvoicesView';
import TimeTrackingView from './TimeTrackingView';
import ReportingView from './ReportingView';
import ExpensesView from './ExpensesView';
import TeamView from './TeamView';
import SettingsView from './SettingsView';
import { useAuth } from '../contexts/AuthContext';

const MainAppView = ({ user, onLogout }) => {
    const { idToken } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [viewingProject, setViewingProject] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [invoices, setInvoices] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [pdfLibrariesLoaded, setPdfLibrariesLoaded] = useState(false);

    const fetchData = useCallback(async (endpoint, setter) => {
        if (!idToken) return;
        try {
            const response = await fetch(`/api/${endpoint}`, {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error(`Failed to fetch ${endpoint}:`, error);
        }
    }, [idToken]);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchData('projects', setProjects),
                fetchData('clients', setClients),
                fetchData('invoices', setInvoices),
            ]);
            setIsLoading(false);
        };
        fetchAllData();
    }, [fetchData]);

    useEffect(() => {
        // Initialize team members with the current user as Admin
        if (user && teamMembers.length > 0) {
            const userInTeam = teamMembers.find(member => member.uid === user.uid);
            if (!userInTeam) {
                setTeamMembers(prev => [...prev, { ...user, role: 'Admin' }]);
            }
        } else if (user) {
            setTeamMembers([{ ...user, role: 'Admin' }]);
        }
    }, [user, teamMembers]);

    useEffect(() => {
        if (viewingProject) {
            const updatedProject = projects.find(p => p.id === viewingProject.id);
            if (updatedProject) {
                setViewingProject(updatedProject);
            } else {
                setViewingProject(null);
                setActiveView('projects');
            }
        }
    }, [projects]);


    useEffect(() => {
        let scriptsLoaded = 0;
        const totalScripts = 2;

        const onScriptLoad = () => {
            scriptsLoaded++;
            if (scriptsLoaded === totalScripts) {
                setPdfLibrariesLoaded(true);
            }
        };

        // Load PDF generation scripts
        const jspdfScript = document.createElement('script');
        jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        jspdfScript.async = true;
        jspdfScript.onload = onScriptLoad;
        document.body.appendChild(jspdfScript);

        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        html2canvasScript.async = true;
        html2canvasScript.onload = onScriptLoad;
        document.body.appendChild(html2canvasScript);

        return () => {
            if (document.body.contains(jspdfScript)) {
                document.body.removeChild(jspdfScript);
            }
            if (document.body.contains(html2canvasScript)) {
                document.body.removeChild(html2canvasScript);
            }
        }
    }, []);

     useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleSetViewingProject = (project) => {
        setActiveView('project-detail');
        setViewingProject(project);
    };

    const handleBackToProjects = () => {
        setActiveView('projects');
        setViewingProject(null);
    };

    const NavLink = ({ view, icon, children }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setActiveView(view);
                setViewingProject(null);
                setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                activeView === view
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            {React.cloneElement(icon, { className: "w-5 h-5 mr-3" })}
            <span className="font-medium">{children}</span>
        </a>
    );

    const renderView = () => {
        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (activeView === 'project-detail' && viewingProject) {
            return <ProjectDetailView project={viewingProject} setProjects={setProjects} teamMembers={teamMembers} onBack={handleBackToProjects} />;
        }

        switch (activeView) {
            case 'dashboard': return <DashboardView projects={projects} clients={clients} invoices={invoices} />;
            case 'projects': return <ProjectsView projects={projects} setProjects={setProjects} clients={clients} setViewingProject={handleSetViewingProject} isLoading={isLoading} />;
            case 'clients': return <ClientsView clients={clients} setClients={setClients} />;
            case 'invoices': return <InvoicesView projects={projects} clients={clients} invoices={invoices} setInvoices={setInvoices} pdfLibrariesLoaded={pdfLibrariesLoaded} />;
            case 'timetracking': return <TimeTrackingView projects={projects} setProjects={setProjects} user={user} />;
            case 'reporting': return <ReportingView projects={projects} clients={clients} />;
            case 'expenses': return <ExpensesView projects={projects} />;
            case 'team': return <TeamView projects={projects} setProjects={setProjects} />;
            case 'settings': return <SettingsView user={user} onLogout={onLogout} />;
            default: return <DashboardView projects={projects} clients={clients} />;
        }
    };

    const sidebarContent = (
         <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">FreelanceFlow</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink view="dashboard" icon={<HomeIcon />}>Dashboard</NavLink>
                <NavLink view="projects" icon={<BriefcaseIcon />}>Projects</NavLink>
                <NavLink view="clients" icon={<UsersIcon />}>Clients</NavLink>
                <NavLink view="timetracking" icon={<ClockIcon />}>Time Tracking</NavLink>
                <NavLink view="invoices" icon={<FileTextIcon />}>Invoices</NavLink>
                <NavLink view="expenses" icon={<DollarSignIcon />}>Expenses</NavLink>
                <NavLink view="reporting" icon={<ChartBarIcon />}>Reporting</NavLink>
                <NavLink view="team" icon={<TeamIcon />}>Team</NavLink>
            </nav>
            <div className="p-4 border-t dark:border-gray-700 space-y-2">
                 <NavLink view="settings" icon={<SettingsIcon />}>Settings</NavLink>
                <div className="flex justify-between items-center p-2">
                    <div className="flex items-center">
                        <img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${user.name.charAt(0)}`} alt="User Avatar" className="w-10 h-10 rounded-full" />
                        <div className="ml-3">
                            <p className="font-semibold text-sm text-gray-800 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                     <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        {isDarkMode ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                {sidebarContent}
            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* Desktop Sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                {sidebarContent}
            </div>

            <main className="md:pl-64 flex flex-col flex-1">
                {/* Header for mobile */}
                <header className="md:hidden sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between z-20">
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <MenuIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500">FreelanceFlow</h1>
                    <div className="w-6"></div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

export default MainAppView;
