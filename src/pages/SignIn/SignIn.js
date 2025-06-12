import React, { useState, useEffect } from 'react';
import { Brain, Eye, EyeOff, Mail, Lock, User, Building, Phone, ArrowRight, Shield, Zap, CheckCircle, AlertCircle, Github, Twitter, Chrome } from 'lucide-react';
import { Link } from 'react-router-dom';
// Animated Background SVG
const AuthBackgroundSVG = () => (
    <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
        <defs>
            <radialGradient id="authGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#1c92d2" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.05" />
                <stop offset="100%" stopColor="transparent" />
            </radialGradient>
        </defs>
        {/* Floating circles */}
        {[...Array(15)].map((_, i) => (
            <circle
                key={i}
                cx={200 + (i % 5) * 200}
                cy={150 + Math.floor(i / 5) * 150}
                r={3 + Math.random() * 8}
                fill="url(#authGradient)"
                className="animate-pulse"
                style={{
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                }}
            />
        ))}
        {/* Connecting lines */}
        {[...Array(20)].map((_, i) => (
            <line
                key={i}
                x1={Math.random() * 1200}
                y1={Math.random() * 800}
                x2={Math.random() * 1200}
                y2={Math.random() * 800}
                stroke="#1c92d2"
                strokeWidth="1"
                opacity="0.1"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
    </svg>
);

// Security Icon Animation
const SecurityIconSVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
            <linearGradient id="securityGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1c92d2" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
        {/* Shield */}
        <path
            d="M100 40 L130 55 L130 130 L100 160 L70 130 L70 55 Z"
            fill="url(#securityGradient)"
            opacity="0.8"
            className="animate-pulse"
        />
        {/* Lock */}
        <rect x="85" y="90" width="30" height="25" fill="white" rx="3" />
        <path
            d="M90 90 L90 80 Q90 75 95 75 L105 75 Q110 75 110 80 L110 90"
            fill="none"
            stroke="white"
            strokeWidth="3"
        />
        {/* Security rings */}
        {[0, 1, 2].map((i) => (
            <circle
                key={i}
                cx="100"
                cy="100"
                r={50 + i * 25}
                fill="none"
                stroke="#1c92d2"
                strokeWidth="2"
                opacity={0.4 - i * 0.1}
                className="animate-ping"
                style={{ animationDelay: `${i * 0.5}s` }}
            />
        ))}
    </svg>
);

const SignIn = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        rememberMe: false,
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Էլ․ հասցեն պարտադիր է';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Էլ․ հասցեն ճիշտ չէ';
        }

        if (!formData.password) {
            newErrors.password = 'Գաղտնաբառը պարտադիր է';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ';
        }

        if (activeTab === 'signup') {
            if (!formData.firstName) {
                newErrors.firstName = 'Անունը պարտադիր է';
            }
            if (!formData.lastName) {
                newErrors.lastName = 'Ազգանունը պարտադիր է';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Գաղտնաբառերը չեն համընկնում';
            }
            if (!formData.acceptTerms) {
                newErrors.acceptTerms = 'Պայմանների ընդունումը պարտադիր է';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);

        // Success message simulation
        alert(activeTab === 'login' ? 'Բարեգալուստ!' : 'Գրանցումը հաջողվեց!');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit();
        }
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        setErrors({});
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            company: '',
            phone: '',
            rememberMe: false,
            acceptTerms: false
        });
    };

    const socialLogins = [
        { icon: Chrome, name: 'Google', color: 'from-red-500 to-orange-500' },
        { icon: Github, name: 'GitHub', color: 'from-gray-600 to-gray-800' },
        // { icon: Twitter, name: 'Twitter', color: 'from-blue-400 to-blue-600' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1c92d2] to-[#f2fcfe] flex items-center justify-center p-4">
            {/* Background */}
            <AuthBackgroundSVG />

            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1c92d2]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className={`relative w-full max-w-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* Left Side - Branding */}
                    <div className="text-center lg:text-left space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-4xl lg:text-5xl font-bold">
                                <span className="text-white">
                                    Բարի գալուստ
                                </span>
                                <br />
                            </h2>
                        </div>

                        {/* Security illustration */}
                        <div className="hidden lg:block w-64 h-64 mx-auto lg:mx-0">
                            <SecurityIconSVG />
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            {[
                                { icon: Shield, text: 'Բարձր մակարդակի անվտանգություն' },
                                { icon: Zap, text: 'Ակնթարթային վերլուծություն' },
                                { icon: CheckCircle, text: '24/7 հասանելիություն' }
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3 text-gray-300">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#1c92d2]/20 to-[#0ea5e9]/20 rounded-lg flex items-center justify-center">
                                        <feature.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-white">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Auth Form */}
                    <div className="relative">
                        <div className="mt-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">

                            {/* Tab Switcher */}
                            <div className="flex bg-slate-800/50 rounded-2xl p-1 mb-8">
                                <button
                                    onClick={() => switchTab('login')}
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'login'
                                        ? 'bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white shadow-lg'
                                        : 'text-[#f2fcfe] hover:text-white'
                                        }`}
                                >
                                    Մուտք
                                </button>
                                <button
                                    onClick={() => switchTab('signup')}
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'signup'
                                        ? 'bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Գրանցում
                                </button>
                            </div>

                            {/* Social Login */}
                            <div className="space-y-3 mb-8">
                                {socialLogins.map((social, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl transition-all duration-300 group"
                                    >
                                        <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                        <span className="text-[#f2fcfe] group-hover:text-white">
                                            {activeTab === 'login' ? 'Մուտք' : 'Գրանցում'} {social.name}-ով
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="flex items-center mb-8">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                                <span className="px-4 text-white text-sm">կամ</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                            </div>

                            <div className="space-y-6" onKeyPress={handleKeyPress}>
                                {activeTab === 'signup' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* First Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white">Անուն *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${errors.firstName ? 'border-red-500' : 'border-slate-600/50 focus:border-[#1c92d2]'
                                                        }`}
                                                    placeholder="Ձեր անունը"
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
                                            <label className="text-sm font-medium text-white">Ազգանուն *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${errors.lastName ? 'border-red-500' : 'border-slate-600/50 focus:border-[#1c92d2]'
                                                        }`}
                                                    placeholder="Ձեր ազգանունը"
                                                />
                                            </div>
                                            {errors.lastName && (
                                                <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{errors.lastName}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Էլ․ հասցե *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-slate-600/50 focus:border-[#1c92d2]'
                                                }`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="flex items-center space-x-2 text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.email}</span>
                                        </div>
                                    )}
                                </div>

                                {activeTab === 'signup' && (
                                    <>
                                        {/* Company */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white">Ընկերություն</label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400"
                                                    placeholder="Ձեր ընկերությունը"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white">Հեռախոս</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:border-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400"
                                                    placeholder="+374 XX XXX XXX"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Գաղտնաբառ *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-slate-600/50 focus:border-[#1c92d2]'
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
                                    {errors.password && (
                                        <div className="flex items-center space-x-2 text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.password}</span>
                                        </div>
                                    )}
                                </div>

                                {activeTab === 'signup' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Կրկնել գաղտնաբառը *</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c92d2] transition-all duration-300 text-white placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-600/50 focus:border-[#1c92d2]'
                                                    }`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>{errors.confirmPassword}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Remember Me / Accept Terms */}
                                <div className="space-y-4">
                                    {activeTab === 'login' ? (
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="rememberMe"
                                                    checked={formData.rememberMe}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-[#1c92d2] bg-slate-800 border-slate-600 rounded focus:ring-[#1c92d2] focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-300">Հիշել</span>
                                            </label>
                                            <button className="text-sm text-white hover:text-[#0ea5e9] transition-colors">
                                                Մոռացե՞լ եք գաղտնաբառը
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="flex items-start space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="acceptTerms"
                                                    checked={formData.acceptTerms}
                                                    onChange={handleInputChange}
                                                    className={`w-4 h-4 text-[#1c92d2] bg-slate-800 border-slate-600 rounded focus:ring-[#1c92d2] focus:ring-2 mt-0.5 ${errors.acceptTerms ? 'border-red-500' : ''
                                                        }`}
                                                />
                                                <span className="text-sm text-white">
                                                    Ես համաձայն եմ{' '}
                                                    <button type="button" className="text-[#9ac4db] hover:text-[#b3cddb] underline">
                                                        Ծառայության պայմանների
                                                    </button>{' '}
                                                    և{' '}
                                                    <button type="button" className="text-[#9ac4db] hover:text-[#b3cddb] underline">
                                                        Գաղտնիության քաղաքականության
                                                    </button>{' '}
                                                    հետ
                                                </span>
                                            </label>
                                            {errors.acceptTerms && (
                                                <div className="flex items-center space-x-2 text-red-400 text-sm">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{errors.acceptTerms}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Link to="/my-profile"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-xl font-semibold text-lg hover:from-[#0f7fb5] hover:to-[#0369a1] focus:outline-none focus:ring-2 focus:ring-[#1c92d2] focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>{activeTab === 'login' ? 'Մուտք գործել' : 'Գրանցվել'}</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Link>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-[#9ac4db]">
                                    {activeTab === 'login' ? 'Չունե՞ք հաշիվ' : 'Արդեն ունե՞ք հաշիվ'}{' '}
                                    <button
                                        onClick={() => switchTab(activeTab === 'login' ? 'signup' : 'login')}
                                        className="text-[#f2fcfe] hover:text-[#0ea5e9] font-medium transition-colors"
                                    >
                                        {activeTab === 'login' ? 'Գրանցվել' : 'Մուտք գործել'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;