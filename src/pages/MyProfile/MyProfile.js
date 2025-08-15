import React, { useState, useEffect, useRef } from 'react';
import {
    User,
    Mail,
    Phone,
    Building,
    MapPin,
    Edit3,
    Save,
    X,
    Camera,
    Shield,
    Bell,
    Key,
    Globe,
    Moon,
    Sun,
    Eye,
    EyeOff,
    ChevronRight,
    Settings,
    Activity,
    Award,
    BarChart3,
    CheckCircle,
    AlertCircle,
    Upload,
    Trash2,
    FolderOpen,
    Plus,
    Clock,
    MoreVertical,
    FileText,
    ArrowRight,
    Menu,
    ChevronDown,
    ChevronLeft
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';
import ManagerPhase from '../../components/WorkflowPhases/ManagerPhase';
import AnalystPhase from '../../components/WorkflowPhases/AnalystPhase';
import ExpertPhase from '../../components/WorkflowPhases/ExpertPhase';
import AnalysisWorkspace from '../../components/AnalysisWorkspace/AnalysisWorkspace';
import DecisionLevelPhase from '../../components/WorkflowPhases/DesicionPhase';
import { DataProvider } from '../../context/DataContext';
import { useProjectStorage } from '../../store/ProjectStorageManager'
import { Pagination } from './components/Pagination';
import { STATIC_PROJECTS } from './constants';

// Animated Background SVG
const ProfileBackgroundSVG = () => (
    <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
        <defs>
            <radialGradient id="profileGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#1c92d2" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.05" />
                <stop offset="100%" stopColor="transparent" />
            </radialGradient>
        </defs>
        {/* Floating circles */}
        {[...Array(12)].map((_, i) => (
            <circle
                key={i}
                cx={150 + (i % 4) * 250}
                cy={100 + Math.floor(i / 4) * 200}
                r={4 + Math.random() * 6}
                fill="url(#profileGradient)"
                className="animate-pulse"
                style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                }}
            />
        ))}
        {/* Connecting lines */}
        {[...Array(15)].map((_, i) => (
            <line
                key={i}
                x1={Math.random() * 1200}
                y1={Math.random() * 800}
                x2={Math.random() * 1200}
                y2={Math.random() * 800}
                stroke="#1c92d2"
                strokeWidth="1"
                opacity="0.08"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </svg>
);

const MyProfile = () => {
    const projectStorage = useProjectStorage();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedCSV, setUploadedCSV] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const location = useLocation();
    const fromPath = location.state?.from;

    useEffect(() => {
        if (fromPath && fromPath == '/') {
            setActiveTab('new-project');
        }
    }, [fromPath])


    const [currentPage, setCurrentPage] = useState(1);
    const [isNavigating, setIsNavigating] = useState(false);
    const projectsPerPage = 4;

    // UPDATED: Projects state - теперь из localStorage
    const [projects, setProjects] = useState(STATIC_PROJECTS);

    // ADDED: Current project tracking
    const [currentProjectId, setCurrentProjectId] = useState(null);

    // useEffect(() => {
    //     const token = localStorage.getItem('accessToken');

    //     if (!token) {
    //         navigate('/sign-in', { replace: true });
    //     }
    // }, [navigate]);

    const [profileData, setProfileData] = useState({
        firstName: 'Նարեկ',
        lastName: 'Հովհաննիսյան',
        email: 'narek.hovhannisyan@example.com',
        phone: '+374 77 123 456',
        company: 'TechCorp Armenia',
        position: 'Senior Developer',
        location: 'Yerevan, Armenia',
        bio: 'Փորձառու ծրագրավորող, որը մասնագիտանում է արհեստական բանականության և մեքենայական ուսուցման ոլորտում:',
        avatar: null,
        joinDate: '2023-01-15',
        lastActive: '2024-12-15',
        theme: 'dark',
        language: 'hy',
        notifications: {
            email: true,
            push: true,
            marketing: false
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    // UPDATED: Sequential workflow state - now synced with localStorage
    const [currentPhase, setCurrentPhase] = useState(0);
    const [completedPhases, setCompletedPhases] = useState(new Set());
    const [allPhasesCompleted, setAllPhasesCompleted] = useState(false);

    const phases = ['manager', 'analyst', 'expert', 'decision'];

    // ADDED: Load projects from localStorage on component mount
    useEffect(() => {
        const loadProjects = () => {
            const storedProjects = projectStorage.getAllProjects();
            setProjects((prev) => [
                ...storedProjects,
                ...prev
            ]);
        };

        loadProjects();
    }, []);

    // ADDED: Sync workflow state with current project
    useEffect(() => {
        if (currentProjectId) {
            const project = projectStorage.getProject(currentProjectId);
            if (project) {
                setCurrentPhase(project.workflowData.currentPhase);
                setCompletedPhases(new Set(project.workflowData.completedPhases));
                setAllPhasesCompleted(project.workflowData.allPhasesCompleted);
            }
        }
    }, [currentProjectId]);

    // ADDED: Auto-create project when entering new-project tab
    useEffect(() => {
        if (activeTab === 'new-project' && !currentProjectId) {
            const newProject = projectStorage.createProject({
                name: 'Նոր նախագիծ',
                type: 'market-analysis'
            });
            setCurrentProjectId(newProject.id);
            setCurrentPhase(0);
            setCompletedPhases(new Set());
            setAllPhasesCompleted(false);

            // Update projects list
            const updatedProjects = projectStorage.getAllProjects();
            setProjects(updatedProjects);
        }
    }, [activeTab]);

    // UPDATED: Phase completion handler with localStorage integration
    const handlePhaseComplete = (phaseIndex) => {
        if (!currentProjectId) {
            const newProject = projectStorage.createProject();
            setCurrentProjectId(newProject.id);
        }

        const newCompleted = new Set(completedPhases);
        newCompleted.add(phaseIndex);
        setCompletedPhases(newCompleted);

        // Save to localStorage
        if (currentProjectId) {
            const currentProject = projectStorage.getProject(currentProjectId);
            const updatedWorkflowData = {
                ...currentProject.workflowData,
                currentPhase: phaseIndex < phases.length - 1 ? phaseIndex + 1 : phaseIndex,
                completedPhases: Array.from(newCompleted),
                allPhasesCompleted: phaseIndex === phases.length - 1
            };

            projectStorage.updateProject(currentProjectId, {
                workflowData: updatedWorkflowData,
                status: phaseIndex === phases.length - 1 ? 'completed' : 'in-progress'
            });

            // Update projects list
            const updatedProjects = projectStorage.getAllProjects();
            setProjects(updatedProjects);
        }

        // Move to next phase if not the last one
        if (phaseIndex < phases.length - 1) {
            setTimeout(() => {
                setCurrentPhase(phaseIndex + 1);
            }, 1000);
        } else {
            // All phases completed, show AnalysisWorkspace
            setTimeout(() => {
                setAllPhasesCompleted(true);
            }, 1500);
        }
    };

    // Phase status checker
    const getPhaseStatus = (phaseIndex) => ({
        isActive: currentPhase === phaseIndex,
        isCompleted: completedPhases.has(phaseIndex)
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNotificationChange = (key) => {
        setProfileData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const validateProfile = () => {
        const newErrors = {};

        if (!profileData.firstName) {
            newErrors.firstName = 'Անունը պարտադիր է';
        }
        if (!profileData.lastName) {
            newErrors.lastName = 'Ազգանունը պարտադիր է';
        }
        if (!profileData.email) {
            newErrors.email = 'Էլ․ հասցեն պարտադիր է';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'Էլ․ հասցեն ճիշտ չէ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Ներկա գաղտնաբառը պարտադիր է';
        }
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'Նոր գաղտնաբառը պարտադիր է';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ';
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Գաղտնաբառերը չեն համընկնում';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateProfile()) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsEditing(false);

        alert('Տվյալները հաջողությամբ պահպանվեցին');
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);

        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });

        alert('Գաղտնաբառը հաջողությամբ փոխվեց');
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const getProjectStatusBadge = (status) => {
        const statusConfig = {
            'completed': {
                color: 'bg-green-600/20 text-green-400 border-green-600/30',
                label: 'Ավարտված',
                icon: CheckCircle
            },
            'in-progress': {
                color: 'bg-[#1c92d2]/20 text-[#1c92d2] border-[#1c92d2]/30',
                label: 'Ընթացքի մեջ',
                icon: Clock
            },
            'draft': {
                color: 'bg-gray-600/20 text-white border-gray-600/30',
                label: 'Նախագիծ',
                icon: FileText
            }
        };
        return statusConfig[status] || statusConfig.draft;
    };

    const getProjectTypeColor = (type) => {
        const typeColors = {
            'market-analysis': 'from-[#1c92d2] to-pink-500',
            'investment': 'from-[#0ea5e9] to-cyan-500',
            'competitive': 'from-orange-500 to-red-500',
            'financial': 'from-green-500 to-teal-500'
        };
        return typeColors[type] || 'from-gray-500 to-slate-500';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('hy-AM', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // UPDATED: New project handler with localStorage integration
    const handleNewProject = async () => {
        setIsNavigating(true);

        // Create new project in localStorage
        const newProject = projectStorage.createProject({
            name: 'Նոր նախագիծ',
            type: 'market-analysis'
        });

        // Set as current project
        setCurrentProjectId(newProject.id);
        setCurrentPhase(0);
        setCompletedPhases(new Set());
        setAllPhasesCompleted(false);

        // Update projects list
        const updatedProjects = projectStorage.getAllProjects();
        setProjects(updatedProjects);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setActiveTab('new-project');
        setIsNavigating(false);
        setIsMobileMenuOpen(false);
    };

    // ADDED: Project management functions
    const handleOpenProject = (projectId) => {
        setCurrentProjectId(projectId);
        const project = projectStorage.getProject(projectId);

        if (project) {
            setCurrentPhase(project.workflowData.currentPhase);
            setCompletedPhases(new Set(project.workflowData.completedPhases));
            setAllPhasesCompleted(project.workflowData.allPhasesCompleted);
            setActiveTab('new-project');
        }
    };


    const handleDeleteProject = (projectId, e) => {
        e.stopPropagation();

        if (window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս նախագիծը:')) {
            projectStorage.deleteProject(projectId);
            const updatedProjects = projectStorage.getAllProjects();
            setProjects(updatedProjects);

            // If deleted project was current, clear state
            if (currentProjectId === projectId) {
                setCurrentProjectId(null);
                setCurrentPhase(0);
                setCompletedPhases(new Set());
                setAllPhasesCompleted(false);
            }
        }
    };

    const tabs = [
        { id: 'profile', label: 'Անձնական տվյալներ', icon: User },
        { id: 'projects', label: 'Իմ նախագծերը', icon: FolderOpen },
        { id: 'new-project', label: 'Նոր նախագիծ', icon: Plus },
        { id: 'security', label: 'Անվտանգություն', icon: Shield },
        { id: 'notifications', label: 'Ծանուցումներ', icon: Bell },
        { id: 'preferences', label: 'Կարգավորումներ', icon: Settings }
    ];

    // UPDATED: Stats calculation from real projects data
    const stats = [
        {
            label: 'Ընդհանուր որոշումներ',
            value: projects.reduce((sum, project) => sum + project.decisions, 0).toString(),
            icon: BarChart3,
            color: 'from-[#1c92d2] to-[#0ea5e9]'
        },
        {
            label: 'Հաջող վերլուծություններ',
            value: `${projects.length > 0 ? Math.round(projects.reduce((sum, project) => sum + project.accuracy, 0) / projects.length) : 0}%`,
            icon: CheckCircle,
            color: 'from-green-500 to-teal-500'
        },
        {
            label: 'Ակտիվ նախագծեր',
            value: projects.filter(p => p.status === 'in-progress').length.toString(),
            icon: Activity,
            color: 'from-orange-500 to-red-500'
        },
        {
            label: 'Ավարտված նախագծեր',
            value: projects.filter(p => p.status === 'completed').length.toString(),
            icon: Award,
            color: 'from-pink-500 to-violet-500'
        }
    ];

    // UPDATED: Render current phase with proper props for localStorage integration
    const renderCurrentPhase = () => {
        const commonProps = {
            onPhaseComplete: () => handlePhaseComplete(currentPhase),
            isActive: true,
            projectId: currentProjectId,
            projectStorage: projectStorage
        };

        switch (currentPhase) {
            case 0:
                return <ManagerPhase {...commonProps} />;
            case 1:
                return <AnalystPhase {...commonProps} />;
            case 2:
                return <ExpertPhase {...commonProps} />;
            case 3:
                return <DecisionLevelPhase {...commonProps} />;
            default:
                return <ManagerPhase {...commonProps} />;
        }
    };

    // Get current phase name for display
    const getCurrentPhaseName = () => {
        const phaseNames = {
            0: 'Մենեջերի փուլ',
            1: 'Վերլուծաբանական փուլ',
            2: 'Փորձագիտական փուլ',
            3: 'Որոշումների փուլ'
        };
        return phaseNames[currentPhase] || 'Մենեջերի փուլ';
    };

    const handlePhaseNext = () => {
        if (currentPhase < phases.length - 1) {
            setCompletedPhases(prev => new Set(prev).add(currentPhase));
            setCurrentPhase(currentPhase + 1);
            setAllPhasesCompleted(true);
        }
    };

    const handlePhasePrevious = () => {
        if (currentPhase > 0) {
            setCurrentPhase(currentPhase - 1);
            setAllPhasesCompleted(true);
        }
    };

    const totalPages = Math.ceil(projects.length / projectsPerPage);
    const startIndex = (currentPage - 1) * projectsPerPage;
    const paginatedProjects = projects.slice(startIndex, startIndex + projectsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1c92d2] to-[#f2fcfe] p-2 sm:p-4" style={{ paddingTop: '5rem' }}>
            {/* Background */}
            <ProfileBackgroundSVG />

            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#1c92d2]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className={`relative mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Special layout for new-project tab */}
                {activeTab === 'new-project' ? (
                    <div className="w-full mx-auto">
                        {/* Mobile Profile Header */}
                        <div className="lg:hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#1c92d2] to-[#0ea5e9] rounded-full flex items-center justify-center overflow-hidden">
                                        {profileData.avatar ? (
                                            <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {profileData.firstName} {profileData.lastName}
                                        </h3>
                                        <p className="text-white/80 text-sm">{profileData.position}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Mobile Navigation Menu */}
                            {isMobileMenuOpen && (
                                <div className="border-t border-white/20 pt-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white'
                                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                <tab.icon className="w-4 h-4" />
                                                <span className="truncate">{tab.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Desktop Horizontal Profile Info */}
                        <div className="hidden lg:block bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 mb-8 w-full">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    {/* Profile Avatar */}
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#1c92d2] to-[#0ea5e9] rounded-full flex items-center justify-center overflow-hidden">
                                            {profileData.avatar ? (
                                                <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-8 h-8 text-white" />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                    </div>

                                    {/* Profile Details */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {profileData.firstName} {profileData.lastName}
                                        </h3>
                                        <p className="text-white/80 text-sm">{profileData.position} • {profileData.company}</p>
                                        <p className="text-white/60 text-xs">{profileData.location}</p>
                                    </div>
                                </div>

                                {/* Navigation Tabs */}
                                <div className="hidden xl:flex items-center space-x-1 bg-slate-800/60 backdrop-blur-xl rounded-xl p-2 border border-white/20">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex flex-col items-center justify-center space-y-1 px-4 py-3 rounded-lg transition-all duration-300 min-w-[80px] ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white shadow-lg transform scale-105'
                                                : 'text-white/60 hover:text-white hover:bg-white/10 hover:scale-105'
                                                }`}
                                        >
                                            <tab.icon className="w-5 h-5" />
                                            <span className="text-xs font-medium text-center leading-tight">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Large screen dropdown for navigation */}
                                <div className="xl:hidden relative">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-slate-800/60 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span className="text-sm">Նավիգացիա</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {isMobileMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/90 backdrop-blur-xl border border-white/20 rounded-xl p-2 z-50">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => {
                                                        setActiveTab(tab.id);
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 text-left ${activeTab === tab.id
                                                        ? 'bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white'
                                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    <tab.icon className="w-4 h-4" />
                                                    <span className="text-sm">{tab.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sequential Workflow Progress Bar */}
                        <div className="mb-6 lg:mb-8">
                            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
                                    Աշխատանքային գործընթացի կարգավիճակ
                                </h3>
                                {/* Progress Indicators - Responsive */}
                                <div className="flex justify-center items-center space-x-2 sm:space-x-8 mb-4 sm:mb-6 overflow-x-auto">
                                    {phases.map((phase, index) => (
                                        <div key={phase} className="flex items-center">
                                            <div className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-500 ${completedPhases.has(index)
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : currentPhase === index
                                                    ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                                                    : 'border-gray-600 text-gray-600'
                                                }`}>
                                                {completedPhases.has(index) ? (
                                                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                                                ) : (
                                                    <span className="font-bold text-xs sm:text-base">{index + 1}</span>
                                                )}
                                            </div>
                                            {index < phases.length - 1 && (
                                                <div className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 transition-all duration-500 ${completedPhases.has(index) ? 'bg-green-500' : 'bg-gray-600'
                                                    }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Current Phase Status */}
                                <div className="text-center">
                                    {allPhasesCompleted ? (
                                        <></>
                                    ) : (
                                        <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg sm:rounded-xl text-blue-300 text-xs sm:text-sm">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                                            <span className="text-center">
                                                {currentPhase === 0 && 'Մենեջերի փուլը պատրաստ է մեկնարկի համար'}
                                                {currentPhase === 1 && 'Վերլուծաբանական փուլն ակտիվ է'}
                                                {currentPhase === 2 && 'Փորձագիտական փուլն ակտիվ է'}
                                                {currentPhase === 3 && 'Որոշումների փուլն ակտիվ է'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Workflow Phases - Responsive Grid */}
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-6 lg:mb-8 w-full">
                            {/* Phase Header */}
                            <div className="mb-4 sm:mb-6">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 text-center">
                                    Ընթացիկ փուլ: {getCurrentPhaseName()}
                                </h3>
                                <div className="text-center">
                                    {allPhasesCompleted ? (
                                        <></>
                                    ) : (
                                        <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg sm:rounded-xl text-blue-300 text-xs sm:text-sm">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                                            <span>Փուլ {currentPhase + 1} / 4</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Two Column Layout: Current Phase + Analysis Workspace */}
                            <div className="space-y-6">
                                {/* Phase Navigation Header - Moved to top */}
                                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                            {/* Mobile-friendly button layout */}
                                            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                                                {/* Previous Button */}
                                                <button
                                                    onClick={handlePhasePrevious}
                                                    disabled={currentPhase === 0}
                                                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${currentPhase === 0
                                                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 hover:shadow-lg'
                                                        }`}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Նախորդ</span>
                                                </button>

                                                {/* Phase Indicators - Centered */}
                                                <div className="flex space-x-2">
                                                    {phases.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                if (index <= currentPhase || completedPhases.has(index)) {
                                                                    setCurrentPhase(index);
                                                                }
                                                            }}
                                                            disabled={index > currentPhase && !completedPhases.has(index)}
                                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-300 flex items-center justify-center text-xs font-bold ${index === currentPhase
                                                                ? 'bg-blue-500 text-white ring-2 ring-blue-400/50 scale-110 shadow-lg'
                                                                : completedPhases.has(index)
                                                                    ? 'bg-green-500 text-white hover:scale-110 cursor-pointer shadow-md'
                                                                    : index < currentPhase
                                                                        ? 'bg-blue-400 text-white cursor-pointer hover:scale-105'
                                                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                                                }`}
                                                            title={`Փուլ ${index + 1}`}
                                                        >
                                                            {completedPhases.has(index) ? '✓' : index + 1}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Next Button */}
                                                <button
                                                    onClick={handlePhaseNext}
                                                    disabled={currentPhase === phases.length - 1}
                                                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${currentPhase === phases.length - 1
                                                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white hover:from-[#0f7fb5] hover:to-[#0369a1] hover:shadow-lg'
                                                        }`}
                                                >
                                                    <span className="hidden sm:inline">Հաջորդ</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">{getCurrentPhaseName()}</h4>
                                                <p className="text-white/60 text-sm text-end">Փուլ {currentPhase + 1} / 4</p>
                                            </div>
                                            <div className="w-10 h-10 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold">{currentPhase + 1}</span>
                                            </div>
                                        </div>

                                        {/* Navigation Controls - Responsive */}

                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-600/30 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] h-2 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Current Active Phase (1/3 width) */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-white/10 rounded-xl p-4 border border-white/20 h-fit">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-6 h-6 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] rounded flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">{currentPhase + 1}</span>
                                                </div>
                                                <h4 className="text-base font-semibold text-white">{getCurrentPhaseName()}</h4>
                                            </div>
                                            {renderCurrentPhase()}
                                        </div>
                                    </div>

                                    {/* Right Column - Analysis Workspace (2/3 width) */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                <BarChart3 className="w-5 h-5 mr-2" />
                                                Աշխատանքային տիրույթ
                                            </h4>
                                            <AnalysisWorkspace
                                                projectId={currentProjectId}
                                                projectStorage={projectStorage}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Stack Layout for smaller screens */}
                            {/* <div className="lg:hidden mt-6">
                                <div className="space-y-4">
                                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                                            <BarChart3 className="w-5 h-5 mr-2" />
                                            Աշխատանքային տիրույթ
                                        </h4>
                                        <AnalysisWorkspace
                                            projectId={currentProjectId}
                                            projectStorage={projectStorage}
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                ) : (
                    /* Regular sidebar layout for other tabs - Responsive */
                    <>
                        {/* Header - Mobile Responsive */}
                        <div className="mb-6 sm:mb-8 max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                                            Իմ հաշիվը
                                        </h1>
                                        <p className="text-white text-sm sm:text-base">Կառավարեք ձեր հաշվի տվյալները և կարգավորումները</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards - Responsive */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-0 mb-6 sm:mb-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:border-white/50 transition-all duration-300 group">
                                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                                            <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-lg sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-xs sm:text-sm text-white leading-tight">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 max-w-7xl mx-auto px-2 sm:px-0">
                            {/* Sidebar - Responsive */}
                            <div className="lg:col-span-1">
                                {/* Mobile Navigation Dropdown */}
                                <div className="lg:hidden mb-4">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-xl text-white"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Menu className="w-5 h-5" />
                                            <span>Նավիգացիա</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isMobileMenuOpen && (
                                        <div className="mt-2 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-xl p-2">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => {
                                                        setActiveTab(tab.id);
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    disabled={isNavigating && tab.id === 'new-project'}
                                                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 ${activeTab === tab.id
                                                        ? 'bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white shadow-lg'
                                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                                        } ${isNavigating && tab.id === 'new-project' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {isNavigating && tab.id === 'new-project' ? (
                                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <tab.icon className="w-5 h-5" />
                                                    )}
                                                    <span className="font-medium text-sm">{tab.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Sidebar */}
                                <div className="hidden lg:block bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 sticky top-4">
                                    {/* Profile Card */}
                                    <div className="text-center mb-8">
                                        <div className="relative inline-block mb-4">
                                            <div className="w-24 h-24 bg-gradient-to-br from-[#1c92d2] to-[#0ea5e9] rounded-full flex items-center justify-center overflow-hidden">
                                                {profileData.avatar ? (
                                                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-12 h-12 text-white" />
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#1c92d2] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0ea5e9] transition-colors">
                                                <Camera className="w-4 h-4 text-white" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-1">
                                            {profileData.firstName} {profileData.lastName}
                                        </h3>
                                        <p className="text-white/80 text-sm mb-2">{profileData.position}</p>
                                        <p className="text-white/60 text-xs">{profileData.company}</p>

                                        {/* Status */}
                                        <div className="flex items-center justify-center space-x-2 mt-4 text-green-400">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-sm">Ակտիվ</span>
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="space-y-2">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                disabled={isNavigating && tab.id === 'new-project'}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white shadow-lg'
                                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                                    } ${isNavigating && tab.id === 'new-project' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isNavigating && tab.id === 'new-project' ? (
                                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <tab.icon className="w-5 h-5" />
                                                )}
                                                <span className="font-medium" style={{ fontSize: 14 }}>{tab.label}</span>
                                                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === tab.id ? 'rotate-90' : ''
                                                    }`} />
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content - Responsive */}
                            <div className="lg:col-span-3">
                                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-xl sm:rounded-2xl p-4 sm:p-8">

                                    {/* Profile Tab */}
                                    {activeTab === 'profile' && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <h2 className="text-xl sm:text-2xl font-bold text-white">Անձնական տվյալներ</h2>
                                                <button
                                                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                                    disabled={isLoading}
                                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50 w-full sm:w-auto"
                                                >
                                                    {isLoading ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : isEditing ? (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            <span>Պահպանել</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Edit3 className="w-4 h-4" />
                                                            <span>Խմբագրել</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                {/* First Name */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-white">Անուն</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            value={profileData.firstName}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                                } ${errors.firstName ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'}`}
                                                        />
                                                    </div>
                                                    {errors.firstName && (
                                                        <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span>{errors.firstName}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Last Name */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-white">Ազգանուն</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            value={profileData.lastName}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                                } ${errors.lastName ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'}`}
                                                        />
                                                    </div>
                                                    {errors.lastName && (
                                                        <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span>{errors.lastName}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Email */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-white">Էլ․ հասցե</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={profileData.email}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                                } ${errors.email ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'}`}
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span>{errors.email}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Phone */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-white">Հեռախոս</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={profileData.phone}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                                }`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Company */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-white">Ընկերություն</label>
                                                    <div className="relative">
                                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                        <input
                                                            type="text"
                                                            name="company"
                                                            value={profileData.company}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                                }`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Position */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-white">Պաշտոն</label>
                                                    <div className="relative">
                                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                        <input
                                                            type="text"
                                                            name="position"
                                                            value={profileData.position}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location - Full Width */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-white">Գտնվելու վայր</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={profileData.location}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Bio - Full Width */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-white">Ինքնանկարագրություն</label>
                                                <textarea
                                                    name="bio"
                                                    value={profileData.bio}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    rows="4"
                                                    className={`w-full px-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 resize-none text-sm sm:text-base ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                        }`}
                                                    placeholder="Գրեք ձեր մասին..."
                                                />
                                            </div>

                                            {isEditing && (
                                                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={isLoading}
                                                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        <span>Պահպանել</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 border border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span>Չեղարկել</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Projects Tab - UPDATED with localStorage integration */}
                                    {activeTab === 'projects' && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <h2 className="text-xl sm:text-2xl font-bold text-white">Իմ նախագծերը</h2>
                                                <button
                                                    onClick={handleNewProject}
                                                    disabled={isNavigating}
                                                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isNavigating ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Plus className="w-4 h-4" />
                                                    )}
                                                    <span>{isNavigating ? 'Բաց եղավ...' : 'Նոր նախագիծ'}</span>
                                                </button>
                                            </div>

                                            {/* Projects Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                {paginatedProjects.map((project) => {
                                                    const statusBadge = getProjectStatusBadge(project.status);
                                                    const StatusIcon = statusBadge.icon;

                                                    return (
                                                        <div
                                                            key={project.id}
                                                            className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white hover:border-white/50 transition-all duration-300 group cursor-pointer"
                                                            onClick={() => handleOpenProject(project.id)}
                                                        >
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${getProjectTypeColor(project.type)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                                        {statusBadge.label}
                                                                    </span>
                                                                    <button
                                                                        onClick={(e) => handleDeleteProject(project.id, e)}
                                                                        className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                                                                        title="Ջնջել նախագիծը"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-[#1c92d2] transition-colors line-clamp-2">
                                                                {project.name}
                                                            </h3>

                                                            {/* Project Stats */}
                                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                                <div className="text-center">
                                                                    <div className="text-base sm:text-lg font-bold text-white">
                                                                        {project.accuracy > 0 ? `${project.accuracy}%` : '--'}
                                                                    </div>
                                                                    <div className="text-xs text-white/60">Ճշգրտություն</div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="text-base sm:text-lg font-bold text-white">{project.decisions}</div>
                                                                    <div className="text-xs text-white/60">Որոշումներ</div>
                                                                </div>
                                                            </div>

                                                            {/* Project Footer */}
                                                            <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                                                <div className="text-xs text-white/50">
                                                                    Ստեղծվել է՝ {formatDate(project.createdAt)}
                                                                </div>
                                                                <div className="flex items-center space-x-1 text-[#1c92d2] text-sm group-hover:text-[#0ea5e9]">
                                                                    <span>Բացել</span>
                                                                    <ArrowRight className="w-3 h-3" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Your Pagination Component */}
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={setCurrentPage}
                                                itemsPerPage={projectsPerPage}
                                                totalItems={projects.length}
                                            />

                                            {/* Empty State */}
                                            {projects.length === 0 && (
                                                <div className="text-center py-12 sm:py-16">
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#1c92d2]/20 to-[#0ea5e9]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-medium text-white mb-2">Դեռ նախագծեր չկան</h3>
                                                    <p className="text-white/60 mb-6 text-sm sm:text-base">Սկսեք ձեր առաջին վերլուծական նախագիծը</p>
                                                    <button
                                                        onClick={handleNewProject}
                                                        disabled={isNavigating}
                                                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isNavigating ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Plus className="w-4 h-4" />
                                                        )}
                                                        <span>{isNavigating ? 'Բաց եղավ...' : 'Ստեղծել նախագիծ'}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Security Tab */}
                                    {activeTab === 'security' && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Անվտանգություն</h2>

                                            {/* Change Password */}
                                            <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                                                <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
                                                    <Key className="w-5 h-5 mr-2" />
                                                    Գաղտնաբառի փոփոխություն
                                                </h3>

                                                <div className="space-y-4">
                                                    {/* Current Password */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-white">Ներկա գաղտնաբառ</label>
                                                        <div className="relative">
                                                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                name="currentPassword"
                                                                value={passwordData.currentPassword}
                                                                onChange={handlePasswordChange}
                                                                className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${errors.currentPassword ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'
                                                                    }`}
                                                                placeholder="••••••••"
                                                            />
                                                            <button
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white transition-colors"
                                                            >
                                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                        {errors.currentPassword && (
                                                            <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                                <AlertCircle className="w-4 h-4" />
                                                                <span>{errors.currentPassword}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* New Password */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-white">Նոր գաղտնաբառ</label>
                                                        <div className="relative">
                                                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                            <input
                                                                type={showNewPassword ? 'text' : 'password'}
                                                                name="newPassword"
                                                                value={passwordData.newPassword}
                                                                onChange={handlePasswordChange}
                                                                className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${errors.newPassword ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'
                                                                    }`}
                                                                placeholder="••••••••"
                                                            />
                                                            <button
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white transition-colors"
                                                            >
                                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                        {errors.newPassword && (
                                                            <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                                <AlertCircle className="w-4 h-4" />
                                                                <span>{errors.newPassword}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Confirm Password */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-white">Կրկնել գաղտնաբառը</label>
                                                        <div className="relative">
                                                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                value={passwordData.confirmPassword}
                                                                onChange={handlePasswordChange}
                                                                className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base ${errors.confirmPassword ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'
                                                                    }`}
                                                                placeholder="••••••••"
                                                            />
                                                        </div>
                                                        {errors.confirmPassword && (
                                                            <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                                <AlertCircle className="w-4 h-4" />
                                                                <span>{errors.confirmPassword}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={handleChangePassword}
                                                        disabled={isLoading}
                                                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50"
                                                    >
                                                        {isLoading ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4" />
                                                                <span>Փոխել գաղտնաբառը</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Login History */}
                                            <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                                                <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
                                                    <Activity className="w-5 h-5 mr-2" />
                                                    Մուտքի պատմություն
                                                </h3>

                                                <div className="space-y-3">
                                                    {[
                                                        { device: 'MacBook Pro', location: 'Yerevan, Armenia', time: '2 րոպե առաջ', current: true },
                                                        { device: 'iPhone 14', location: 'Yerevan, Armenia', time: '1 ժամ առաջ', current: false },
                                                        { device: 'Chrome Browser', location: 'Yerevan, Armenia', time: '3 ժամ առաջ', current: false }
                                                    ].map((session, index) => (
                                                        <div key={index} className="flex items-center justify-between py-3 px-4 bg-white/10 rounded-xl">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                                <div>
                                                                    <p className="text-white text-sm font-medium">{session.device}</p>
                                                                    <p className="text-white/60 text-xs">{session.location} • {session.time}</p>
                                                                </div>
                                                            </div>
                                                            {session.current && (
                                                                <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                                                                    Ընթացիկ
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notifications Tab */}
                                    {activeTab === 'notifications' && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Ծանուցումներ</h2>

                                            <div className="space-y-4 sm:space-y-6">
                                                {/* Email Notifications */}
                                                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Mail className="w-5 h-5 text-[#1c92d2]" />
                                                            <div>
                                                                <h3 className="text-white font-medium text-sm sm:text-base">Էլ․ նամակներ</h3>
                                                                <p className="text-white/60 text-xs sm:text-sm">Ստանալ ծանուցումներ էլ․ նամակով</p>
                                                            </div>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={profileData.notifications.email}
                                                                onChange={() => handleNotificationChange('email')}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1c92d2]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c92d2]"></div>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Push Notifications */}
                                                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Bell className="w-5 h-5 text-[#0ea5e9]" />
                                                            <div>
                                                                <h3 className="text-white font-medium text-sm sm:text-base">Push ծանուցումներ</h3>
                                                                <p className="text-white/60 text-xs sm:text-sm">Ստանալ ակնթարթային ծանուցումներ</p>
                                                            </div>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={profileData.notifications.push}
                                                                onChange={() => handleNotificationChange('push')}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1c92d2]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c92d2]"></div>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Marketing Notifications */}
                                                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Globe className="w-5 h-5 text-green-400" />
                                                            <div>
                                                                <h3 className="text-white font-medium text-sm sm:text-base">Մարքեթինգային ծանուցումներ</h3>
                                                                <p className="text-white/60 text-xs sm:text-sm">Ստանալ նորություններ և առաջարկություններ</p>
                                                            </div>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={profileData.notifications.marketing}
                                                                onChange={() => handleNotificationChange('marketing')}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1c92d2]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c92d2]"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Preferences Tab */}
                                    {activeTab === 'preferences' && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Կարգավորումներ</h2>

                                            <div className="space-y-4 sm:space-y-6">
                                                {/* Theme Selection */}
                                                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                                                    <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
                                                        <Moon className="w-5 h-5 mr-2" />
                                                        Ռեժիմ
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${profileData.theme === 'dark'
                                                            ? 'border-[#1c92d2] bg-[#1c92d2]/10'
                                                            : 'border-white hover:border-white/50'
                                                            }`}
                                                            onClick={() => setProfileData(prev => ({ ...prev, theme: 'dark' }))}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Moon className="w-6 h-6 text-[#1c92d2]" />
                                                                <div>
                                                                    <h4 className="text-white font-medium text-sm sm:text-base">Գիշերային ռեժիմ</h4>
                                                                    <p className="text-white/60 text-xs sm:text-sm">Ակտիվ</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${profileData.theme === 'light'
                                                            ? 'border-[#1c92d2] bg-[#1c92d2]/10'
                                                            : 'border-white/30 hover:border-white/50'
                                                            }`}
                                                            onClick={() => setProfileData(prev => ({ ...prev, theme: 'light' }))}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Sun className="w-6 h-6 text-yellow-400" />
                                                                <div>
                                                                    <h4 className="text-white font-medium text-sm sm:text-base">Ցերեկեային ռեժիմ</h4>
                                                                    <p className="text-white/60 text-xs sm:text-sm">Անհասանելի</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Language Selection */}
                                                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                                                    <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
                                                        <Globe className="w-5 h-5 mr-2" />
                                                        Լեզու
                                                    </h3>
                                                    <select
                                                        name="language"
                                                        value={profileData.language}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white text-sm sm:text-base"
                                                    >
                                                        <option value="hy">Հայերեն</option>
                                                        <option value="en">English</option>
                                                        <option value="ru">Русский</option>
                                                    </select>
                                                </div>

                                                {/* Account Actions */}
                                                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                                                    <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
                                                        <Settings className="w-5 h-5 mr-2" />
                                                        Հաշվի գործողություններ
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <button className="w-full flex items-center justify-between py-3 px-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 text-left">
                                                            <div className="flex items-center space-x-3">
                                                                <Upload className="w-5 h-5 text-[#0ea5e9]" />
                                                                <div>
                                                                    <p className="text-white text-sm font-medium">Ներբեռնել տվյալները</p>
                                                                    <p className="text-white/60 text-xs">Ստանալ բոլոր տվյալները</p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-white" />
                                                        </button>

                                                        <button className="w-full flex items-center justify-between py-3 px-4 bg-red-900/20 border border-red-800/30 rounded-xl hover:bg-red-900/30 transition-all duration-300 text-left">
                                                            <div className="flex items-center space-x-3">
                                                                <Trash2 className="w-5 h-5 text-red-400" />
                                                                <div>
                                                                    <p className="text-red-400 text-sm font-medium">Ջնջել հաշիվը</p>
                                                                    <p className="text-red-500 text-xs">Այս գործողությունը անվերադարձ է</p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-red-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};





export default MyProfile;