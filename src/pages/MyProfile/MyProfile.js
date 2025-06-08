import React, { useState, useEffect } from 'react';
import {
    Brain,
    User,
    Mail,
    Phone,
    Building,
    Calendar,
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
    Play,
    Clock,
    TrendingUp,
    Target,
    MoreVertical,
    FileText,
    ArrowRight
} from 'lucide-react';

import ManagerPhase from '../../components/WorkflowPhases/ManagerPhase';
import AnalystPhase from '../../components/WorkflowPhases/AnalystPhase';
import ExpertPhase from '../../components/WorkflowPhases/ExpertPhase';
import AnalysisWorkspace from '../../components/AnalysisWorkspace/AnalysisWorkspace';
// Animated Background SVG
const ProfileBackgroundSVG = () => (
    <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
        <defs>
            <radialGradient id="profileGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.05" />
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
                stroke="#8B5CF6"
                strokeWidth="1"
                opacity="0.08"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </svg>
);

// Profile Stats SVG
const ProfileStatsSVG = () => (
    <svg viewBox="0 0 300 200" className="w-full h-full">
        <defs>
            <linearGradient id="statsGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        {/* Bar chart */}
        {[0, 1, 2, 3, 4].map((i) => (
            <rect
                key={i}
                x={50 + i * 40}
                y={150 - (20 + Math.random() * 80)}
                width="25"
                height={20 + Math.random() * 80}
                fill="url(#statsGradient)"
                opacity="0.7"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
        {/* Activity rings */}
        {[0, 1, 2].map((i) => (
            <circle
                key={i}
                cx="150"
                cy="100"
                r={30 + i * 20}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2"
                opacity={0.3 - i * 0.08}
                className="animate-ping"
                style={{ animationDelay: `${i * 0.6}s` }}
            />
        ))}
    </svg>
);

const MyProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'Նարեկ',
        lastName: 'Հովհաննիսյան',
        email: 'narek.hovhannisyan@example.com',
        phone: '+374 77 123 456',
        company: 'TechCorp Armenia',
        position: 'Senior Developer',
        location: 'Yerevan, Armenia',
        bio: 'Փորձառու մշակող, որը մասնագիտանում է արհեստական բանականության և մեքենական ուսուցման բնագավառում:',
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

    // Sample projects data
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'Շուկայի Վերլուծություն 2024',
            description: 'Տեխնոլոգիական ընկերությունների շուկայի ռիսկերի վերլուծություն',
            status: 'completed',
            createdAt: '2024-11-15',
            lastModified: '2024-12-10',
            accuracy: 94.2,
            decisions: 15,
            type: 'market-analysis'
        },
        {
            id: 2,
            name: 'Ներդրումային Ռազմավարություն',
            description: 'Նոր ծրագրային ապահովման ներդրման ռիսկերի գնահատում',
            status: 'in-progress',
            createdAt: '2024-12-01',
            lastModified: '2024-12-15',
            accuracy: 87.5,
            decisions: 8,
            type: 'investment'
        },
        {
            id: 3,
            name: 'Մրցակցային Վերլուծություն',
            description: 'Հիմնական մրցակիցների ռազմավարությունների ուսումնասիրություն',
            status: 'draft',
            createdAt: '2024-12-05',
            lastModified: '2024-12-14',
            accuracy: 0,
            decisions: 0,
            type: 'competitive'
        },
        {
            id: 4,
            name: 'Ֆինանսական Կանխատեսում',
            description: 'Հաջորդ տարվա բյուջետի պլանավորման վերլուծություն',
            status: 'completed',
            createdAt: '2024-10-20',
            lastModified: '2024-11-30',
            accuracy: 96.8,
            decisions: 23,
            type: 'financial'
        }
    ]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
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

        // Success notification
        alert('Տվյալները հաջողությամբ պահպանվեցին');
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);

        // Clear password fields
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
                color: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
                label: 'Ընթացքում',
                icon: Clock
            },
            'draft': {
                color: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
                label: 'Նախագիծ',
                icon: FileText
            }
        };
        return statusConfig[status] || statusConfig.draft;
    };

    const getProjectTypeColor = (type) => {
        const typeColors = {
            'market-analysis': 'from-purple-500 to-pink-500',
            'investment': 'from-blue-500 to-cyan-500',
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

    const handleNewProject = async () => {
        setIsNavigating(true);

        // Optional: delay for visual feedback or loading indicator
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to the analysis page
        // window.location.href = '/analysis';
        // <Home />
    };

    const tabs = [
        { id: 'profile', label: 'Անձնական տվյալներ', icon: User },
        { id: 'projects', label: 'Իմ նախագծերը', icon: FolderOpen },
        { id: 'new-project', label: 'Նոր նախագիծ', icon: Plus },
        { id: 'security', label: 'Անվտանգություն', icon: Shield },
        { id: 'notifications', label: 'Ծանուցումներ', icon: Bell },
        { id: 'preferences', label: 'Նախընտրություններ', icon: Settings }
    ];

    const stats = [
        { label: 'Ընդհանուր որոշումներ', value: '1,247', icon: BarChart3, color: 'from-purple-500 to-blue-500' },
        { label: 'Հաջող վերլուծություններ', value: '98.2%', icon: CheckCircle, color: 'from-green-500 to-teal-500' },
        { label: 'Ակտիվ օրեր', value: '156', icon: Activity, color: 'from-orange-500 to-red-500' },
        { label: 'Ձեռքբերումներ', value: '24', icon: Award, color: 'from-pink-500 to-violet-500' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4" style={{ paddingTop: 80 }}>
            {/* Background */}
            <ProfileBackgroundSVG />

            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className={`relative  mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Իմ պրոֆիլը
                                </h1>
                                <p className="text-gray-400">Կառավարեք ձեր հաշվի տվյալները և նախընտրությունները</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sticky top-4">

                            {/* Profile Card */}
                            <div className="text-center mb-8">
                                <div className="relative inline-block mb-4">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                                        {profileData.avatar ? (
                                            <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-white" />
                                        )}

                                        {/* Projects Tab */}
                                        {activeTab === 'projects' && (
                                            <div className="space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-2xl font-bold text-white">Իմ նախագծերը</h2>
                                                    <button
                                                        onClick={handleNewProject}
                                                        disabled={isNavigating}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {projects.map((project) => {
                                                        const statusBadge = getProjectStatusBadge(project.status);
                                                        const StatusIcon = statusBadge.icon;

                                                        return (
                                                            <div key={project.id} className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group cursor-pointer">
                                                                <div className="flex items-start justify-between mb-4">
                                                                    <div className={`w-12 h-12 bg-gradient-to-r ${getProjectTypeColor(project.type)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                                        <BarChart3 className="w-6 h-6 text-white" />
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`} >
                                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                                            {statusBadge.label}
                                                                        </span>
                                                                        <button className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors">
                                                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                                                                    {project.name}
                                                                </h3>
                                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                                    {project.description}
                                                                </p>

                                                                {/* Project Stats */}
                                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                                    <div className="text-center">
                                                                        <div className="text-lg font-bold text-white">
                                                                            {project.accuracy > 0 ? `${project.accuracy}%` : '--'}
                                                                        </div>
                                                                        <div className="text-xs text-gray-400">Ճշգրտություն</div>
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <div className="text-lg font-bold text-white">{project.decisions}</div>
                                                                        <div className="text-xs text-gray-400">Որոշումներ</div>
                                                                    </div>
                                                                </div>

                                                                {/* Project Footer */}
                                                                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                                                    <div className="text-xs text-gray-500">
                                                                        Ստեղծվել է՝ {formatDate(project.createdAt)}
                                                                    </div>
                                                                    <div className="flex items-center space-x-1 text-purple-400 text-sm group-hover:text-purple-300">
                                                                        <span>Բացել</span>
                                                                        <ArrowRight className="w-3 h-3" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Empty State */}
                                                {projects.length === 0 && (
                                                    <div className="text-center py-16">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <FolderOpen className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <h3 className="text-lg font-medium text-white mb-2">Դեռ նախագծեր չկան</h3>
                                                        <p className="text-gray-400 mb-6">Սկսեք ձեր առաջին վերլուծական նախագիծը</p>
                                                        <button
                                                            onClick={handleNewProject}
                                                            disabled={isNavigating}
                                                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

                                        {/* New Project Tab */}
                                        {activeTab === 'new-project' && (
                                            <div className="space-y-8">
                                                <div className="text-center">
                                                    <h2 className="text-2xl font-bold text-white mb-4">Նոր նախագիծ ստեղծել</h2>
                                                    <p className="text-gray-400 max-w-2xl mx-auto">
                                                        Սկսեք նոր վերլուծական նախագիծ AI-ի օգնությամբ: Ընտրեք նախագծի տեսակը և մուտքագրեք անհրաժեշտ տվյալները:
                                                    </p>
                                                </div>

                                                {/* Project Types */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {[
                                                        {
                                                            type: 'market-analysis',
                                                            title: 'Շուկայի Վերլուծություն',
                                                            description: 'Շուկայի միտումների և մրցակցության վերլուծություն',
                                                            icon: TrendingUp,
                                                            color: 'from-purple-500 to-pink-500'
                                                        },
                                                        {
                                                            type: 'investment',
                                                            title: 'Ներդրումային Վերլուծություն',
                                                            description: 'Ռիսկերի գնահատում և ներդրումային հնարավորություններ',
                                                            icon: Target,
                                                            color: 'from-blue-500 to-cyan-500'
                                                        },
                                                        {
                                                            type: 'competitive',
                                                            title: 'Մրցակցային Վերլուծություն',
                                                            description: 'Մրցակիցների ռազմավարությունների ուսումնասիրություն',
                                                            icon: Activity,
                                                            color: 'from-orange-500 to-red-500'
                                                        },
                                                        {
                                                            type: 'financial',
                                                            title: 'Ֆինանսական Վերլուծություն',
                                                            description: 'Բյուջետի պլանավորում և ֆինանսական կանխատեսում',
                                                            icon: BarChart3,
                                                            color: 'from-green-500 to-teal-500'
                                                        }
                                                    ].map((projectType, index) => (
                                                        <div key={index} className={`bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group cursor-pointer ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            onClick={!isNavigating ? handleNewProject : undefined}
                                                        >
                                                            <div className={`w-12 h-12 bg-gradient-to-r ${projectType.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                                <projectType.icon className="w-6 h-6 text-white" />
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                                                                {projectType.title}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm mb-4">
                                                                {projectType.description}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-gray-500">Սկսել</span>
                                                                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Quick Start Section */}
                                                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-500/20">
                                                    <div className="text-center">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <Brain className="w-8 h-8 text-white" />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-white mb-4">Արագ սկսել AI-ի հետ</h3>
                                                        <p className="text-gray-300 mb-6 max-w-md mx-auto">
                                                            Սկսեք ձեր վերլուծությունը մեր AI օգնականի հետ, որը կուղղորդի ամբողջ գործընթացի ընթացքում:
                                                        </p>
                                                        <button
                                                            onClick={handleNewProject}
                                                            disabled={isNavigating}
                                                            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                                        >
                                                            {isNavigating ? (
                                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <Play className="w-5 h-5" />
                                                            )}
                                                            <span>{isNavigating ? 'Բաց եղավ...' : 'Սկսել վերլուծությունը'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
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
                                <p className="text-gray-400 text-sm mb-2">{profileData.position}</p>
                                <p className="text-gray-500 text-xs">{profileData.company}</p>

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
                                        onClick={() => {
                                            // if (tab.id === 'new-project') {
                                            //     handleNewProject();
                                            // } else {
                                            setActiveTab(tab.id);
                                            // }
                                        }}
                                        disabled={isNavigating && tab.id === 'new-project'}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
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

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-white">Անձնական տվյալներ</h2>
                                        <button
                                            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                            disabled={isLoading}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Անուն</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={profileData.firstName}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                        } ${errors.firstName ? 'border-red-500' : 'border-slate-600/50 focus:border-purple-500'}`}
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
                                            <label className="text-sm font-medium text-gray-300">Ազգանուն</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={profileData.lastName}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                        } ${errors.lastName ? 'border-red-500' : 'border-slate-600/50 focus:border-purple-500'}`}
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
                                            <label className="text-sm font-medium text-gray-300">Էլ․ հասցե</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                        } ${errors.email ? 'border-red-500' : 'border-slate-600/50 focus:border-purple-500'}`}
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
                                            <label className="text-sm font-medium text-gray-300">Հեռախոս</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={profileData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Company */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Ընկերություն</label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={profileData.company}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Position */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Պաշտոն</label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="position"
                                                    value={profileData.position}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Գտնվելու վայր</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="location"
                                                value={profileData.location}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Ինքնանկարագրություն</label>
                                        <textarea
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            rows="4"
                                            className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 resize-none ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                }`}
                                            placeholder="Գրեք ձեր մասին..."
                                        />
                                    </div>

                                    {isEditing && (
                                        <div className="flex items-center space-x-4 pt-4">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isLoading}
                                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>Պահպանել</span>
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex items-center space-x-2 px-6 py-3 border border-slate-600 text-gray-300 rounded-xl hover:bg-slate-700/50 transition-all duration-300"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>Չեղարկել</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Անվտանգություն</h2>

                                    {/* Change Password */}
                                    <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                            <Key className="w-5 h-5 mr-2" />
                                            Գաղտնաբառի փոփոխություն
                                        </h3>

                                        <div className="space-y-4">
                                            {/* Current Password */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Ներկա գաղտնաբառ</label>
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${errors.currentPassword ? 'border-red-500' : 'border-slate-600/50 focus:border-purple-500'
                                                            }`}
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                                                <label className="text-sm font-medium text-gray-300">Նոր գաղտնաբառ</label>
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${errors.newPassword ? 'border-red-500' : 'border-slate-600/50 focus:border-purple-500'
                                                            }`}
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                                                <label className="text-sm font-medium text-gray-300">Կրկնել գաղտնաբառը</label>
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-white placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-600/50 focus:border-purple-500'
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
                                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
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
                                    <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                            <Activity className="w-5 h-5 mr-2" />
                                            Մուտքի պատմություն
                                        </h3>

                                        <div className="space-y-3">
                                            {[
                                                { device: 'MacBook Pro', location: 'Yerevan, Armenia', time: '2 րոպե առաջ', current: true },
                                                { device: 'iPhone 14', location: 'Yerevan, Armenia', time: '1 ժամ առաջ', current: false },
                                                { device: 'Chrome Browser', location: 'Yerevan, Armenia', time: '3 ժամ առաջ', current: false }
                                            ].map((session, index) => (
                                                <div key={index} className="flex items-center justify-between py-3 px-4 bg-slate-700/30 rounded-xl">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                        <div>
                                                            <p className="text-white text-sm font-medium">{session.device}</p>
                                                            <p className="text-gray-400 text-xs">{session.location} • {session.time}</p>
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
                            {/* aa */}
                            {activeTab === 'new-project' && (
                                <>
                                    <div className="max-w-7xl mx-auto">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                            <ManagerPhase />
                                            <AnalystPhase />
                                            <ExpertPhase />
                                        </div>
                                        <AnalysisWorkspace />
                                    </div>
                                </>
                            )}
                            {/* ds */}
                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Ծանուցումներ</h2>

                                    <div className="space-y-6">
                                        {/* Email Notifications */}
                                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="w-5 h-5 text-purple-400" />
                                                    <div>
                                                        <h3 className="text-white font-medium">Էլ․ նամակներ</h3>
                                                        <p className="text-gray-400 text-sm">Ստանալ ծանուցումներ էլ․ նամակով</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={profileData.notifications.email}
                                                        onChange={() => handleNotificationChange('email')}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Push Notifications */}
                                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Bell className="w-5 h-5 text-blue-400" />
                                                    <div>
                                                        <h3 className="text-white font-medium">Push ծանուցումներ</h3>
                                                        <p className="text-gray-400 text-sm">Ստանալ ակնթարթային ծանուցումներ</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={profileData.notifications.push}
                                                        onChange={() => handleNotificationChange('push')}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Marketing Notifications */}
                                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Globe className="w-5 h-5 text-green-400" />
                                                    <div>
                                                        <h3 className="text-white font-medium">Մարքեթինգային ծանուցումներ</h3>
                                                        <p className="text-gray-400 text-sm">Ստանալ նորություններ և առաջարկություններ</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={profileData.notifications.marketing}
                                                        onChange={() => handleNotificationChange('marketing')}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Նախընտրություններ</h2>

                                    <div className="space-y-6">
                                        {/* Theme Selection */}
                                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                <Moon className="w-5 h-5 mr-2" />
                                                Թեմա
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${profileData.theme === 'dark'
                                                    ? 'border-purple-500 bg-purple-600/10'
                                                    : 'border-slate-600 hover:border-slate-500'
                                                    }`}
                                                    onClick={() => setProfileData(prev => ({ ...prev, theme: 'dark' }))}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <Moon className="w-6 h-6 text-purple-400" />
                                                        <div>
                                                            <h4 className="text-white font-medium">Մուգ թեմա</h4>
                                                            <p className="text-gray-400 text-sm">Ակտիվ</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${profileData.theme === 'light'
                                                    ? 'border-purple-500 bg-purple-600/10'
                                                    : 'border-slate-600 hover:border-slate-500'
                                                    }`}
                                                    onClick={() => setProfileData(prev => ({ ...prev, theme: 'light' }))}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <Sun className="w-6 h-6 text-yellow-400" />
                                                        <div>
                                                            <h4 className="text-white font-medium">Բաց թեմա</h4>
                                                            <p className="text-gray-400 text-sm">Անհասանելի</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Language Selection */}
                                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                <Globe className="w-5 h-5 mr-2" />
                                                Լեզու
                                            </h3>
                                            <select
                                                name="language"
                                                value={profileData.language}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white"
                                            >
                                                <option value="hy">Հայերեն</option>
                                                <option value="en">English</option>
                                                <option value="ru">Русский</option>
                                            </select>
                                        </div>

                                        {/* Account Actions */}
                                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                <Settings className="w-5 h-5 mr-2" />
                                                Հաշվի գործողություններ
                                            </h3>
                                            <div className="space-y-3">
                                                <button className="w-full flex items-center justify-between py-3 px-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 text-left">
                                                    <div className="flex items-center space-x-3">
                                                        <Upload className="w-5 h-5 text-blue-400" />
                                                        <div>
                                                            <p className="text-white text-sm font-medium">Արտահանել տվյալները</p>
                                                            <p className="text-gray-400 text-xs">Ստանալ բոլոր տվյալները</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
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
            </div>
        </div>
    );
};

export default MyProfile;