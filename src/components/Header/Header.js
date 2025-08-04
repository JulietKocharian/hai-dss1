import React, { useState, useEffect } from 'react';
import { Brain, Menu, X, Users, LogIn, LogOut, Info, Zap, User, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Check authentication status
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
            const userDataString = localStorage.getItem('userData');

            setIsLoggedIn(!!token);

            if (userDataString) {
                try {
                    setUserData(JSON.parse(userDataString));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
        };

        // Check on component mount
        checkAuthStatus();

        // Listen for storage changes (in case user logs in/out in another tab)
        window.addEventListener('storage', checkAuthStatus);

        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle navigation for About and Services links
    const handleSectionNavigation = (sectionId) => {
        setMenuOpen(false);

        // If not on home page, navigate to home with hash
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`);
        } else {
            // If already on home page, just scroll to section
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Handle profile navigation
    const handleProfileClick = () => {
        setMenuOpen(false);
        navigate('/my-profile');
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setUserData(null);
        setMenuOpen(false);
        navigate('/'); // Redirect to home page after logout
    };

    // Handle auth action (login or logout)

    // Handle auth action (login or logout)
    const handleAuthAction = () => {
        if (isLoggedIn) {
            handleLogout();
        } else {
            navigate('/sign-in');
        }
        setMenuOpen(false);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-bg-slate-900/95'
                : 'bg-transparent'
                }`}>
                <div className=" mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="relative">
                                <div
                                    style={{
                                        background: "linear-gradient(to bottom right, #1c92d2, #f2fcfe)",
                                    }}
                                    className="w-12 h-12 bg-gradient-to-br from-[#1c92d2] to-[#0ea5e9] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                    <Zap className="w-2 h-2 text-white" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <Link to="/">
                                    <h1 className="text-s font-bold text-left bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent max-w-xl mx-auto leading-snug">
                                        ԱՆՈՐՈՇՈՒԹՅԱՆ ՊԱՅՄԱՆՆԵՐՈՒՄ ՄԵՆԵՋԵՐԻ ՈՐՈՇՈՒՄՆԵՐԻ <br /> ԸՆԴՈՒՆՄԱՆՆ ԱՋԱԿՑՈՂ ՀԱՄԱԿԱՐԳ
                                    </h1>
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => handleSectionNavigation('about')}
                                className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                <Info className="w-4 h-4 text-white group-hover:text-[#1c92d2] transition-colors" />
                                <span className="relative text-white">
                                    Մեր մասին
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-[#0ea5e9] group-hover:w-full transition-all duration-300"></span>
                                </span>
                            </button>
                            <button
                                onClick={() => handleSectionNavigation('services')}
                                className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                <Users className="w-4 h-4 text-white group-hover:text-[#1c92d2] transition-colors" />
                                <span className="relative text-white">
                                    Ծառայություններ
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-[#0ea5e9] group-hover:w-full transition-all duration-300"></span>
                                </span>
                            </button>

                            {/* Profile Button - Only when logged in */}
                            {isLoggedIn && (
                                <button
                                    onClick={handleProfileClick}
                                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    <User className="w-4 h-4 text-white group-hover:text-[#1c92d2] transition-colors" />
                                    <span className="relative text-white">
                                        {userData?.name || userData?.email || 'Պրոֆիլ'}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </button>
                            )}

                            {/* Dynamic Login/Logout Button */}
                            <button
                                onClick={handleAuthAction}
                                className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                {isLoggedIn ? (
                                    <LogOut className="w-4 h-4 text-white group-hover:text-[#1c92d2] transition-colors" />
                                ) : (
                                    <LogIn className="w-4 h-4 text-white group-hover:text-[#1c92d2] transition-colors" />
                                )}
                                <span className="relative text-white">
                                    {isLoggedIn ? 'Ելք' : 'Մուտք'}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] group-hover:w-full transition-all duration-300"></span>
                                </span>
                            </button>

                            {!isLoggedIn && (
                                <button className="px-6 py-2 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-full font-medium hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#1c92d2]/25">
                                    Սկսել
                                </button>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c92d2]/20 to-[#0ea5e9]/20 backdrop-blur-sm border border-[#1c92d2]/20 flex items-center justify-center hover:from-[#1c92d2]/30 hover:to-[#0ea5e9]/30 transition-all duration-300"
                        >
                            <div className="relative w-6 h-6">
                                <span className={`absolute top-1.5 left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''
                                    }`}></span>
                                <span className={`absolute top-3 left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''
                                    }`}></span>
                                <span className={`absolute top-4.5 left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''
                                    }`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}

            {/* Mobile Menu */}
            <nav className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-slate-900 via-[#1c92d2]/50 to-slate-800 backdrop-blur-xl border-l border-[#1c92d2]/20 z-50 transform transition-transform duration-500 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="p-6">
                    {/* Mobile Menu Items */}
                    <div className="space-y-4">
                        <button
                            onClick={() => handleSectionNavigation('about')}
                            className="w-full group flex items-center space-x-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-[#1c92d2]/30"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c92d2]/20 to-[#0ea5e9]/20 flex items-center justify-center group-hover:from-[#1c92d2]/30 group-hover:to-[#0ea5e9]/30 transition-all duration-300">
                                <Info className="w-5 h-5 text-[#1c92d2]" />
                            </div>
                            <div className="text-left">
                                <div className="text-white font-medium">Մեր մասին</div>
                                <div className="text-xs text-gray-400">Ծանոթանալ համակարգին</div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleSectionNavigation('services')}
                            className="w-full group flex items-center space-x-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-[#1c92d2]/30"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c92d2]/20 to-[#0ea5e9]/20 flex items-center justify-center group-hover:from-[#1c92d2]/30 group-hover:to-[#0ea5e9]/30 transition-all duration-300">
                                <Users className="w-5 h-5 text-[#1c92d2]" />
                            </div>
                            <div className="text-left">
                                <div className="text-white font-medium">Ծառայություններ</div>
                                <div className="text-xs text-gray-400">Մեր առաջարկությունները</div>
                            </div>
                        </button>

                        {/* Profile Option - Only when logged in */}
                        {isLoggedIn && (
                            <button
                                onClick={handleProfileClick}
                                className="w-full group flex items-center space-x-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-[#1c92d2]/30"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c92d2]/20 to-[#0ea5e9]/20 flex items-center justify-center group-hover:from-[#1c92d2]/30 group-hover:to-[#0ea5e9]/30 transition-all duration-300">
                                    <User className="w-5 h-5 text-[#1c92d2]" />
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-medium">
                                        {userData?.name || 'Պրոֆիլ'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {userData?.email || 'Անձնական տվյալներ'}
                                    </div>
                                </div>
                            </button>
                        )}

                        {/* Dynamic Mobile Login/Logout */}
                        <button
                            onClick={handleAuthAction}
                            className="w-full group flex items-center space-x-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-[#1c92d2]/30"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c92d2]/20 to-[#0ea5e9]/20 flex items-center justify-center group-hover:from-[#1c92d2]/30 group-hover:to-[#0ea5e9]/30 transition-all duration-300">
                                {isLoggedIn ? (
                                    <LogOut className="w-5 h-5 text-[#1c92d2]" />
                                ) : (
                                    <LogIn className="w-5 h-5 text-[#1c92d2]" />
                                )}
                            </div>
                            <div className="text-left">
                                <div className="text-white font-medium">
                                    {isLoggedIn ? 'Ելք' : 'Մուտք'}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {isLoggedIn ? 'Դուրս գալ համակարգից' : 'Անձնական հաշիվ'}
                                </div>
                            </div>
                        </button>

                        {/* Additional Info */}
                        <div className="pt-6 border-t border-slate-700/50">
                            <div className="text-center text-sm text-gray-400">
                                <p className="mb-2">24/7 Աջակցություն</p>
                                <p className="text-[#1c92d2]">support@decisionai.am</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#1c92d2]/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-[#0ea5e9]/5 rounded-full blur-2xl"></div>
            </nav>
        </>
    );
};

export default Header;