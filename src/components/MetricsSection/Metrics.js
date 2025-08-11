import React, { useState, useRef, useEffect } from 'react';

const MetricsSection = ({ metrics }) => {
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState('above');
    const containerRefs = useRef({});

    const handleMouseEnter = (index, event) => {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();
        const tooltipHeight = 120; // примерная высота tooltip
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;

        // Определяем позицию для tooltip
        const showAbove = spaceAbove > tooltipHeight && spaceAbove > spaceBelow;

        setTooltipPosition(showAbove ? 'above' : 'below');
        setActiveTooltip(index);
    };

    const handleMouseLeave = () => {
        setActiveTooltip(null);
    };

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className="text-center group relative"
                            ref={el => containerRefs.current[index] = el}
                            onMouseEnter={(e) => handleMouseEnter(index, e)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Main metric display */}
                            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] bg-clip-text text-transparent mb-1 sm:mb-2 hover:scale-110 transition-transform duration-300 text-white cursor-pointer">
                                {metric.value}
                            </div>
                            <div className="text-white font-medium text-xs sm:text-sm lg:text-base leading-tight mb-1 cursor-pointer">
                                {metric.label}
                            </div>

                            {/* Tooltip popup - показывается только для активного элемента */}
                            {activeTooltip === index && (
                                <div
                                    className={`absolute left-1/2 transform -translate-x-1/2 px-6 py-4 bg-white border border-gray-200 text-gray-800 text-sm rounded-xl shadow-2xl transition-all duration-200 ease-in-out z-50 w-80 max-w-sm whitespace-normal ${tooltipPosition === 'above'
                                            ? 'bottom-full mb-3'
                                            : 'top-full mt-3'
                                        }`}
                                >
                                    <div className="text-center font-medium leading-relaxed">
                                        {metric.description}
                                    </div>
                                    {/* Arrow */}
                                    <div className={`absolute left-1/2 transform -translate-x-1/2 ${tooltipPosition === 'above'
                                            ? 'top-full'
                                            : 'bottom-full'
                                        }`}>
                                        <div className={`border-8 border-transparent ${tooltipPosition === 'above'
                                                ? 'border-t-white'
                                                : 'border-b-white'
                                            }`}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MetricsSection;