import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Shield, Users, Target, BarChart3, Lightbulb, ArrowRight, CheckCircle, AlertTriangle, Activity, Zap, Play, Star, Award } from 'lucide-react';

// SVG Components
const AINetworkSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        {/* Network nodes */}
        {[...Array(12)].map((_, i) => (
            <circle
                key={i}
                cx={50 + (i % 4) * 80}
                cy={50 + Math.floor(i / 4) * 80}
                r="8"
                fill="url(#aiGradient)"
                filter="url(#glow)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
            />
        ))}
        {/* Connecting lines */}
        {[...Array(8)].map((_, i) => (
            <line
                key={i}
                x1={50 + (i % 4) * 80}
                y1={50 + Math.floor(i / 4) * 80}
                x2={130 + (i % 3) * 80}
                y2={130 + Math.floor(i / 3) * 80}
                stroke="url(#aiGradient)"
                strokeWidth="2"
                opacity="0.6"
            />
        ))}
    </svg>
);

const DataVisualizationSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        {/* Chart bars */}
        {[40, 80, 60, 120, 90, 150, 110].map((height, i) => (
            <rect
                key={i}
                x={40 + i * 45}
                y={200 - height}
                width="30"
                height={height}
                fill="url(#chartGradient)"
                opacity="0.8"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
            />
        ))}
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
            <line
                key={i}
                x1="30"
                y1={50 + i * 40}
                x2="350"
                y2={50 + i * 40}
                stroke="#64748B"
                strokeWidth="1"
                opacity="0.3"
            />
        ))}
    </svg>
);

const SecuritySVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="shieldGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        {/* Shield shape */}
        <path
            d="M200 50 L250 80 L250 180 L200 220 L150 180 L150 80 Z"
            fill="url(#shieldGradient)"
            opacity="0.8"
            className="animate-pulse"
        />
        {/* Security rings */}
        {[0, 1, 2].map((i) => (
            <circle
                key={i}
                cx="200"
                cy="135"
                r={60 + i * 30}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2"
                opacity={0.6 - i * 0.2}
                className="animate-ping"
                style={{ animationDelay: `${i * 1}s` }}
            />
        ))}
        {/* Lock icon */}
        <rect x="185" y="120" width="30" height="20" fill="white" rx="3" />
        <path d="M190 120 L190 110 Q190 105 195 105 L205 105 Q210 105 210 110 L210 120"
            fill="none" stroke="white" strokeWidth="3" />
    </svg>
);

const TargetingSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        {/* Target circles */}
        {[30, 50, 70, 90].map((r, i) => (
            <circle
                key={i}
                cx="200"
                cy="150"
                r={r}
                fill="none"
                stroke="url(#targetGradient)"
                strokeWidth="3"
                opacity={1 - i * 0.2}
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
            />
        ))}
        {/* Center dot */}
        <circle cx="200" cy="150" r="8" fill="url(#targetGradient)" className="animate-ping" />
        {/* Crosshairs */}
        <line x1="120" y1="150" x2="280" y2="150" stroke="url(#targetGradient)" strokeWidth="2" opacity="0.7" />
        <line x1="200" y1="70" x2="200" y2="230" stroke="url(#targetGradient)" strokeWidth="2" opacity="0.7" />
    </svg>
);

const ActivitySVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="activityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        {/* Activity line */}
        <path
            d="M50 150 L80 120 L110 180 L140 100 L170 160 L200 80 L230 140 L260 200 L290 120 L320 170 L350 130"
            fill="none"
            stroke="url(#activityGradient)"
            strokeWidth="4"
            className="animate-pulse"
        />
        {/* Data points */}
        {[80, 110, 140, 170, 200, 230, 260, 290, 320].map((x, i) => (
            <circle
                key={i}
                cx={x}
                cy={[120, 180, 100, 160, 80, 140, 200, 120, 170][i]}
                r="6"
                fill="url(#activityGradient)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
    </svg>
);

const TeamSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="teamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        {/* Team members */}
        {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
                <circle
                    cx={120 + i * 40}
                    cy={120}
                    r="25"
                    fill="url(#teamGradient)"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                />
                <circle
                    cx={120 + i * 40}
                    cy={110}
                    r="12"
                    fill="white"
                    opacity="0.9"
                />
                <path
                    d={`M${108 + i * 40} 130 Q${120 + i * 40} 140 ${132 + i * 40} 130`}
                    fill="white"
                    opacity="0.9"
                />
            </g>
        ))}
        {/* Connection lines */}
        {[0, 1, 2, 3].map((i) => (
            <line
                key={i}
                x1={145 + i * 40}
                y1="120"
                x2={175 + i * 40}
                y2="120"
                stroke="url(#teamGradient)"
                strokeWidth="3"
                opacity="0.6"
            />
        ))}
    </svg>
);

const HeroBackgroundSVG = () => (
    <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
        <defs>
            <radialGradient id="heroGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.05" />
                <stop offset="100%" stopColor="transparent" />
            </radialGradient>
        </defs>
        {/* Floating geometric shapes */}
        {[...Array(20)].map((_, i) => (
            <g key={i}>
                <circle
                    cx={Math.random() * 1200}
                    cy={Math.random() * 800}
                    r={5 + Math.random() * 15}
                    fill="url(#heroGradient)"
                    className="animate-pulse"
                    style={{
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                    }}
                />
            </g>
        ))}
        {/* Neural network pattern */}
        <g opacity="0.1">
            {[...Array(50)].map((_, i) => (
                <line
                    key={i}
                    x1={Math.random() * 1200}
                    y1={Math.random() * 800}
                    x2={Math.random() * 1200}
                    y2={Math.random() * 800}
                    stroke="#8B5CF6"
                    strokeWidth="1"
                />
            ))}
        </g>
    </svg>
);

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const heroSlides = [
        {
            title: "Անորոշության Պայմաններում",
            subtitle: "Հուսալի Որոշումներ",
            description: "Արհեստական բանականությամբ աջակցվող համակարգ բիզնես լիդերների համար"
        },
        {
            title: "Տվյալների Հիման Վրա",
            subtitle: "Ռազմավարական Մոտեցում",
            description: "Վերլուծություն և կանխատեսում բարդ իրավիճակներում"
        },
        {
            title: "Ռիսկերի Կառավարում",
            subtitle: "Գիտական Մեթոդներով",
            description: "Հավանականության տեսության և մաշինային ուսուցման կիրառում"
        }
    ];

    const features = [
        {
            icon: Brain,
            title: "Արհեստական Բանականություն",
            description: "Խորը ուսուցում և նեյրոցանցեր անորոշ իրավիճակների վերլուծության համար",
            SVGComponent: AINetworkSVG
        },
        {
            icon: BarChart3,
            title: "Տվյալների Վիզուալիզացիա",
            description: "Ինտերակտիվ գրաֆիկներ և աղյուսակներ որոշումների համար",
            SVGComponent: DataVisualizationSVG
        },
        {
            icon: Shield,
            title: "Ռիսկերի Գնահատում",
            description: "Բազմաչափանի ռիսկերի վերլուծություն և մեղմացման ռազմավարություններ",
            SVGComponent: SecuritySVG
        },
        {
            icon: Target,
            title: "Սցենարային Պլանավորում",
            description: "Տարբեր սցենարների մոդելավորում և հետևանքների կանխատեսում",
            SVGComponent: TargetingSVG
        },
        {
            icon: Activity,
            title: "Իրական Ժամանակ",
            description: "Ուղիղ մոնիտորինգ և ադապտիվ որոշումների ընդունում",
            SVGComponent: ActivitySVG
        },
        {
            icon: Users,
            title: "Թիմային Համագործակցություն",
            description: "Կոլեկտիվ որոշումների ընդունման գործիքներ",
            SVGComponent: TeamSVG
        }
    ];

    const metrics = [
        { value: "95%", label: "Կանխատեսման Ճշգրտություն" },
        { value: "40%", label: "Ռիսկերի Կրճատում" },
        { value: "60%", label: "Արագություն" },
        { value: "24/7", label: "Հասանելիություն" }
    ];

    const testimonials = [
        {
            name: "Արմեն Մարտիրոսյան",
            role: "Գլխավոր Տնօրեն",
            company: "TechStart Armenia",
            content: "Այս համակարգը փոխեց մեր ընկերության որոշումների ընդունման գործընթացը։",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
            rating: 5
        },
        {
            name: "Նարինե Ավետիսյան",
            role: "Ռիսկերի Մենեջեր",
            company: "Bank Armenia",
            content: "Ռիսկերի գնահատման ճշգրտությունը զարմանալի է։",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&auto=format",
            rating: 5
        }
    ];

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-screen flex items-center">
                <HeroBackgroundSVG />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>

                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-20">
                    <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-sm font-medium backdrop-blur-sm border border-purple-500/20">
                                <Zap className="w-4 h-4 mr-2" />
                                Նորարարական Լուծում
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                                {heroSlides[currentSlide].title}
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                {heroSlides[currentSlide].subtitle}
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            {heroSlides[currentSlide].description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                                Սկսել Վերլուծությունը
                                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="group px-8 py-4 border-2 border-purple-400/50 text-purple-300 rounded-full font-semibold text-lg hover:bg-purple-600/10 transition-all duration-300 backdrop-blur-sm flex items-center">
                                <Play className="w-5 h-5 mr-2" />
                                Ծանոթանալ Համակարգին
                            </button>
                        </div>

                        {/* Slide indicators */}
                        <div className="flex justify-center mt-12 space-x-2">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-purple-400 scale-125'
                                        : 'bg-gray-600 hover:bg-gray-500'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-20 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {metrics.map((metric, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {metric.value}
                                </div>
                                <div className="text-gray-300 font-medium">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                            Համակարգի Հնարավորություններ
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Ժամանակակից տեխնոլոգիաների միության արդյունքում ստեղծված առաջադեմ գործիքներ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden"
                            >
                                <div className="relative mb-6 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                                    <feature.SVGComponent />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/80 to-blue-600/80 backdrop-blur-sm flex items-center justify-center">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Video Section */}
            <section className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                        Տեսեք Ինչպես Է Աշխատում
                    </h2>
                    <p className="text-xl text-gray-400 mb-12">
                        3 րոպեանոց դեմո վիդեո՝ համակարգի հիմնական հնարավորությունների մասին
                    </p>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format"
                            alt="Demo Video Thumbnail"
                            className="w-full h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                            <button className="group w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
                                <Play className="w-8 h-8 text-white ml-1" />
                            </button>
                        </div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-xl font-bold mb-2">Համակարգի Ցուցադրություն</h3>
                            <p className="text-sm opacity-80">3:24 րոպե</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                            Մեր Հաճախորդները
                        </h2>
                        <p className="text-xl text-gray-400">
                            Ինչ են ասում մեր համակարգն օգտագործող ընկերությունները
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50">
                                <div className="flex items-center mb-6">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                                        <p className="text-gray-400">{testimonial.role}</p>
                                        <p className="text-purple-400 text-sm">{testimonial.company}</p>
                                    </div>
                                </div>

                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                <p className="text-gray-300 leading-relaxed italic">
                                    "{testimonial.content}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                            Աշխատանքի Գործընթաց
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Տվյալների Հավաքում",
                                desc: "Ներքին և արտաքին աղբյուրներից տվյալների ստացում",
                                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&auto=format"
                            },
                            {
                                step: "02",
                                title: "Վերլուծություն",
                                desc: "AI ալգորիթմներով իրավիճակի գնահատում",
                                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop&auto=format"
                            },
                            {
                                step: "03",
                                title: "Սցենարների Մշակում",
                                desc: "Հնարավոր տարբերակների ստեղծում",
                                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format"
                            },
                            {
                                step: "04",
                                title: "Որոշման Ընդունում",
                                desc: "Օպտիմալ լուծման ընտրություն",
                                image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop&auto=format"
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center group relative">
                                <div className="mb-6">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-40 object-cover rounded-2xl opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                                    />
                                    <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                                {index < 3 && (
                                    <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-purple-600/50 to-transparent transform translate-x-4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Awards Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-12">
                        Ճանաչում և Պարգևներ
                    </h2>
                    <div className="flex justify-center items-center space-x-12 opacity-60">
                        <div className="flex items-center space-x-3">
                            <Award className="w-8 h-8 text-yellow-400" />
                            <span className="text-gray-300">AI Innovation Award 2024</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Award className="w-8 h-8 text-yellow-400" />
                            <span className="text-gray-300">Best Business Solution</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Award className="w-8 h-8 text-yellow-400" />
                            <span className="text-gray-300">Top Rated Platform</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="relative p-12 rounded-3xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-purple-500/20 overflow-hidden">
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&auto=format"
                                alt="CTA Background"
                                className="w-full h-full object-cover opacity-5"
                            />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                                Պատրա՞ստ եք սկսելու
                            </h2>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Միացե՛ք հազարավոր մենեջերների, ովքեր արդեն օգտագործում են մեր համակարգը
                                ավելի խելացի որոշումներ կայացնելու համար
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                                    Անվճար Փորձարկում
                                </button>
                                <button className="px-8 py-4 border-2 border-purple-400/50 text-purple-300 rounded-full font-semibold text-lg hover:bg-purple-600/10 transition-all duration-300">
                                    Դեմո Դիտել
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;