import React, { useState, useEffect, useRef } from 'react';
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
    ArrowRight,
    File,
    Download,
    Database
} from 'lucide-react';

import ManagerPhase from '../../components/WorkflowPhases/ManagerPhase';
import AnalystPhase from '../../components/WorkflowPhases/AnalystPhase';
import ExpertPhase from '../../components/WorkflowPhases/ExpertPhase';
import AnalysisWorkspace from '../../components/AnalysisWorkspace/AnalysisWorkspace';
import EnhancedPhaseContainerr from '../../components/WorkflowPhases/PhaseContainer';
import DecisionLevelPhase from '../../components/WorkflowPhases/DesicionPhase';

// CSV Uploader Component
const CSVUploader = ({ onFileUpload, maxSize = 10 }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setError('');
        if (!file.name.toLowerCase().endsWith('.csv')) {
            setError('Խնդրում ենք ընտրել CSV ֆայլ');
            return;
        }
        if (file.size > maxSize * 1024 * 1024) {
            setError(`Ֆայլի չափը չպետք է գերազանցի ${maxSize}MB`);
            return;
        }
        setUploadedFile(file);
    };

    const handleUpload = async () => {
        if (!uploadedFile) return;
        setUploading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (onFileUpload) {
                onFileUpload(uploadedFile);
            }
            setUploading(false);
        } catch (err) {
            setError('Ֆայլի վերբեռնումը ձախողվեց');
            setUploading(false);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                        ? 'border-[#1c92d2] bg-[#1c92d2]/10'
                        : uploadedFile
                            ? 'border-green-400 bg-green-400/10'
                            : error
                                ? 'border-red-400 bg-red-400/10'
                                : 'border-[#1c92d2]/50 hover:border-[#1c92d2] hover:bg-[#1c92d2]/5'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {!uploadedFile ? (
                    <>
                        <div className="space-y-4">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${error ? 'bg-red-400/20' : 'bg-[#1c92d2]/20'
                                }`}>
                                {error ? (
                                    <AlertCircle className="w-8 h-8 text-red-400" />
                                ) : (
                                    <Upload className="w-8 h-8 text-[#1c92d2]" />
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Վերբեռնել CSV ֆայլ
                                </h3>
                                <p className="text-white mb-4">
                                    Քաշեք և թողեք ֆայլը այստեղ կամ սեղմեք ընտրելու համար
                                </p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 transform hover:scale-105"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Ընտրել ֆայլ
                                </button>
                            </div>

                            <div className="text-sm text-white/60">
                                Ճանդառատ չափը: {maxSize}MB, Ֆայլի տեսակ: CSV
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-400/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Ֆայլը պատրաստ է վերբեռնման
                            </h3>
                            <p className="text-green-400">
                                {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
                            </p>
                        </div>

                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                ) : (
                                    <Upload className="w-4 h-4 mr-2" />
                                )}
                                {uploading ? 'Վերբեռնում...' : 'Վերբեռնել'}
                            </button>

                            <button
                                onClick={removeFile}
                                className="inline-flex items-center px-4 py-3 border border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Հեռացնել
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-900/20 border border-red-800/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-400">{error}</span>
                </div>
            )}

            <div className="bg-[#1c92d2]/10 border border-[#1c92d2]/30 rounded-xl p-4">
                <h4 className="text-white font-medium mb-2 flex items-center">
                    <File className="w-4 h-4 mr-2 text-[#1c92d2]" />
                    CSV ֆորմատի պահանջներ
                </h4>
                <ul className="text-sm text-white space-y-1">
                    <li>• Առաջին տողը պետք է պարունակի վերնագրեր</li>
                    <li>• Տվյալները բաժանված լինեն ստորակետով (,)</li>
                    <li>• UTF-8 կոդավորում</li>
                    <li>• Ֆայլի չափը ≤ {maxSize}MB</li>
                </ul>

                <button className="mt-3 inline-flex items-center text-sm text-[#1c92d2] hover:text-[#0ea5e9] transition-colors">
                    <Download className="w-4 h-4 mr-1" />
                    Ներբեռնել օրինակ
                </button>
            </div>
        </div>
    );
};

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
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [uploadedCSV, setUploadedCSV] = useState(null);

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

    const handleCSVUpload = (file) => {
        setUploadedCSV(file);
        console.log('CSV файл загружен:', file.name);
    };

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
                label: 'Ընթացքում',
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

    const handleNewProject = async () => {
        setIsNavigating(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setActiveTab('new-project');
        setIsNavigating(false);
    };

    const tabs = [
        { id: 'profile', label: 'Անձնական տվյալներ', icon: User },
        { id: 'projects', label: 'Իմ նախագծերը', icon: FolderOpen },
        { id: 'new-project', label: 'Նոր նախագիծ', icon: Plus },
        { id: 'security', label: 'Անվտանգություն', icon: Shield },
        { id: 'notifications', label: 'Ծանուցումներ', icon: Bell },
        { id: 'preferences', label: 'Կարգավորումներ', icon: Settings }
    ];

    const stats = [
        { label: 'Ընդհանուր որոշումներ', value: '1,247', icon: BarChart3, color: 'from-[#1c92d2] to-[#0ea5e9]' },
        { label: 'Հաջող վերլուծություններ', value: '98.2%', icon: CheckCircle, color: 'from-green-500 to-teal-500' },
        { label: 'Ակտիվ օրեր', value: '156', icon: Activity, color: 'from-orange-500 to-red-500' },
        { label: 'Ձեռքբերումներ', value: '24', icon: Award, color: 'from-pink-500 to-violet-500' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1c92d2] to-[#f2fcfe] p-4" style={{ paddingTop: 80 }}>
            {/* Background */}
            <ProfileBackgroundSVG />

            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1c92d2]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className={`relative mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Special layout for new-project tab */}
                {activeTab === 'new-project' ? (
                    <div className="w-full">
                        {/* Horizontal Profile Info - Full Width */}
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 mb-8 w-full">
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
                                <div className="flex items-center space-x-1 bg-slate-800/60 backdrop-blur-xl rounded-xl p-2 border border-white/20">
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
                            </div>
                        </div>

                        {/* Stats Cards - Centered with max width */}
                        <div className="mb-8 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 hover:border-white/50 transition-all duration-300 group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-white">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Workflow Phases - Full Width */}
                        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 mb-8 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <ManagerPhase />
                                <AnalystPhase />
                                <ExpertPhase />
                                <DecisionLevelPhase />
                            </div>
                            {/* <EnhancedPhaseContainerr /> */}

                        </div>

                        {/* Analysis Workspace - Centered with max width */}
                        <div className="w-full mx-auto">
                            <AnalysisWorkspace />
                        </div>
                    </div>
                ) : (
                    /* Regular sidebar layout for other tabs */
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">
                                            Իմ հաշիվը
                                        </h1>
                                        <p className="text-white">Կառավարեք ձեր հաշվի տվյալները և կարգավորումները</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 hover:border-white/50 transition-all duration-300 group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-white">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 sticky top-4">
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

                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-8">

                                    {/* Profile Tab */}
                                    {activeTab === 'profile' && (
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-2xl font-bold text-white">Անձնական տվյալներ</h2>
                                                <button
                                                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                                    disabled={isLoading}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50"
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
                                                    <label className="text-sm font-medium text-white">Անուն</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            value={profileData.firstName}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
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
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
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
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
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
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
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
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
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
                                                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location */}
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
                                                        className={`w-full pl-12 pr-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Bio */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-white">Ինքնանկարագրություն</label>
                                                <textarea
                                                    name="bio"
                                                    value={profileData.bio}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    rows="4"
                                                    className={`w-full px-4 py-3 bg-white/10 border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 resize-none ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                                        }`}
                                                    placeholder="Գրեք ձեր մասին..."
                                                />
                                            </div>

                                            {isEditing && (
                                                <div className="flex items-center space-x-4 pt-4">
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={isLoading}
                                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        <span>Պահպանել</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="flex items-center space-x-2 px-6 py-3 border border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span>Չեղարկել</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Projects Tab */}
                                    {activeTab === 'projects' && (
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-2xl font-bold text-white">Իմ նախագծերը</h2>
                                                <button
                                                    onClick={handleNewProject}
                                                    disabled={isNavigating}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                        <div key={project.id} className="bg-white/20 rounded-2xl p-6 border border-white hover:border-white/50 transition-all duration-300 group cursor-pointer">
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className={`w-12 h-12 bg-gradient-to-r ${getProjectTypeColor(project.type)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                                    <BarChart3 className="w-6 h-6 text-white" />
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`} >
                                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                                        {statusBadge.label}
                                                                    </span>
                                                                    <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                                                        <MoreVertical className="w-4 h-4 text-white" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#1c92d2] transition-colors">
                                                                {project.name}
                                                            </h3>
                                                            <p className="text-white text-sm mb-4 line-clamp-2">
                                                                {project.description}
                                                            </p>

                                                            {/* Project Stats */}
                                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                                <div className="text-center">
                                                                    <div className="text-lg font-bold text-white">
                                                                        {project.accuracy > 0 ? `${project.accuracy}%` : '--'}
                                                                    </div>
                                                                    <div className="text-xs text-white/60">Ճշգրտություն</div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="text-lg font-bold text-white">{project.decisions}</div>
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

                                            {/* Empty State */}
                                            {projects.length === 0 && (
                                                <div className="text-center py-16">
                                                    <div className="w-16 h-16 bg-gradient-to-r from-[#1c92d2]/20 to-[#0ea5e9]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <FolderOpen className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-white mb-2">Դեռ նախագծեր չկան</h3>
                                                    <p className="text-white/60 mb-6">Սկսեք ձեր առաջին վերլուծական նախագիծը</p>
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
                                        <div className="space-y-8">
                                            <h2 className="text-2xl font-bold text-white mb-6">Անվտանգություն</h2>

                                            {/* Change Password */}
                                            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
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
                                                                className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${errors.currentPassword ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'
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
                                                                className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${errors.newPassword ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'
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
                                                                className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-white focus:border-[#1c92d2]'
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
                                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 disabled:opacity-50"
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
                                            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
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
                                        <div className="space-y-8">
                                            <h2 className="text-2xl font-bold text-white mb-6">Ծանուցումներ</h2>

                                            <div className="space-y-6">
                                                {/* Email Notifications */}
                                                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Mail className="w-5 h-5 text-[#1c92d2]" />
                                                            <div>
                                                                <h3 className="text-white font-medium">Էլ․ նամակներ</h3>
                                                                <p className="text-white/60 text-sm">Ստանալ ծանուցումներ էլ․ նամակով</p>
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
                                                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Bell className="w-5 h-5 text-[#0ea5e9]" />
                                                            <div>
                                                                <h3 className="text-white font-medium">Push ծանուցումներ</h3>
                                                                <p className="text-white/60 text-sm">Ստանալ ակնթարթային ծանուցումներ</p>
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
                                                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Globe className="w-5 h-5 text-green-400" />
                                                            <div>
                                                                <h3 className="text-white font-medium">Մարքեթինգային ծանուցումներ</h3>
                                                                <p className="text-white/60 text-sm">Ստանալ նորություններ և առաջարկություններ</p>
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
                                        <div className="space-y-8">
                                            <h2 className="text-2xl font-bold text-white mb-6">Կարգավորումներ</h2>

                                            <div className="space-y-6">
                                                {/* Theme Selection */}
                                                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
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
                                                                    <h4 className="text-white font-medium">Գիշերային ռեժիմ</h4>
                                                                    <p className="text-white/60 text-sm">Ակտիվ</p>
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
                                                                    <h4 className="text-white font-medium">Ցերեկեային ռեժիմ</h4>
                                                                    <p className="text-white/60 text-sm">Անհասանելի</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Language Selection */}
                                                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                        <Globe className="w-5 h-5 mr-2" />
                                                        Լեզու
                                                    </h3>
                                                    <select
                                                        name="language"
                                                        value={profileData.language}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white"
                                                    >
                                                        <option value="hy">Հայերեն</option>
                                                        <option value="en">English</option>
                                                        <option value="ru">Русский</option>
                                                    </select>
                                                </div>

                                                {/* Account Actions */}
                                                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                        <Settings className="w-5 h-5 mr-2" />
                                                        Հաշվի գործողություններ
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <button className="w-full flex items-center justify-between py-3 px-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 text-left">
                                                            <div className="flex items-center space-x-3">
                                                                <Upload className="w-5 h-5 text-[#0ea5e9]" />
                                                                <div>
                                                                    <p className="text-white text-sm font-medium">Արտահանել տվյալները</p>
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