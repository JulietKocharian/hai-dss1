import React, { useState, useEffect } from 'react';
import { Brain, Menu, X, Users, LogIn, Info, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-purple-500/10'
                : 'bg-transparent'
                }`}>
                <div className=" mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                    <Zap className="w-2 h-2 text-white" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <Link to="/">
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        HAI-DSS
                                    </h1>
                                    {/* <p className="text-xs text-purple-300/80">Որոշումների Համակարգ</p> */}
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="/" className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
                                <Info className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                                <span className="relative">
                                    Մեր մասին
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                                </span>
                            </a>
                            <a href="/" className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
                                <Users className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                                <span className="relative">
                                    Ծառայություններ
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                                </span>
                            </a>
                            <Link to="/sign-in" className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
                                <LogIn className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                                <span className="relative">
                                    Մուտք
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                                </span>
                            </Link>
                            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                                Սկսել
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/20 flex items-center justify-center hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300"
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
            <nav className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-800 backdrop-blur-xl border-l border-purple-500/20 z-50 transform transition-transform duration-500 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="p-6">
                    {/* Mobile Header */}
                    {/* <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">DecisionAI</h2>
                                <p className="text-xs text-purple-300">Որոշումների Համակարգ</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div> */}

                    {/* Mobile Menu Items */}
                    <div className="space-y-4">
                        <a
                            href="/"
                            onClick={toggleMenu}
                            className="group flex items-center space-x-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/30"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all duration-300">
                                <Info className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-white font-medium">Մեր մասին</div>
                                <div className="text-xs text-gray-400">Ծանոթանալ համակարգին</div>
                            </div>
                        </a>

                        <a
                            href="/"
                            onClick={toggleMenu}
                            className="group flex items-center space-x-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/30"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all duration-300">
                                <Users className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-white font-medium">Ծառայություններ</div>
                                <div className="text-xs text-gray-400">Մեր առաջարկությունները</div>
                            </div>
                        </a>

                        <a
                            href="/"
                            onClick={toggleMenu}
                            className="group flex items-center space-x-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/30"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all duration-300">
                                <LogIn className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-white font-medium">Մուտք</div>
                                <div className="text-xs text-gray-400">Անձնական հաշիվ</div>
                            </div>
                        </a>

                        {/* CTA Button */}
                        <div className="pt-6">
                            <button
                                onClick={toggleMenu}
                                className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                            >
                                Անվճար Փորձարկում
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="pt-6 border-t border-slate-700/50">
                            <div className="text-center text-sm text-gray-400">
                                <p className="mb-2">24/7 Աջակցություն</p>
                                <p className="text-purple-300">support@decisionai.am</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            </nav>
        </>
    );
};

export default Header;