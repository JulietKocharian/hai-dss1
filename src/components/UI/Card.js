// src/components/UI/Card.js
// Քարտերի բաղադրիչ

import React from 'react';

/**
 * Card բաղադրիչ - հիմնական քարտ կոնտեյներ
 * @param {Object} props - Բաղադրիչի պրոպսեր
 * @param {React.ReactNode} props.children - Քարտի բովանդակություն
 * @param {string} props.title - Քարտի վերնագիր
 * @param {string} props.icon - Վերնագրի նշան
 * @param {boolean} props.active - Ակտիվ վիճակ
 * @param {boolean} props.hover - Hover էֆեկտ
 * @param {string} props.gradient - Գրադիենտի տեսակ
 * @param {string} props.className - Լրացուցիչ CSS դասեր
 */
const Card = ({
    children,
    title = '',
    icon = '',
    active = false,
    hover = true,
    gradient = '',
    className = ''
}) => {

    const baseClasses = `
     backdrop-blur-sm rounded-2xl p-6 shadow-xl
    transition-all duration-300
    ${active ? 'ring-4 ring-blue-300 scale-102' : ''}
    ${hover ? 'hover:shadow-2xl hover:scale-105' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <div className={baseClasses}>
            {/* Վերնագիր */}
            {title && (
                <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-200">
                    {icon && (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl mr-4 ${gradient || 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
                            {icon}
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-white-800">{title}</h3>
                </div>
            )}

            {/* Բովանդակություն */}
            <div className="text-gray-700">
                {children}
            </div>
        </div>
    );
};

/**
 * PhaseCard բաղադրիչ - աշխատանքային փուլերի համար
 */
export const PhaseCard = ({
    children,
    title = '',
    icon = '',
    phase = 'manager', // manager, analyst, expert
    active = false,
    className = ''
}) => {

    const phaseConfig = {
        manager: {
            gradient: 'bg-gradient-to-r from-blue-500 to-green-500',
            activeRing: 'ring-blue-300'
        },
        analyst: {
            gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
            activeRing: 'ring-red-300'
        },
        expert: {
            gradient: 'bg-gradient-to-r from-purple-500 to-orange-500',
            activeRing: 'ring-purple-300'
        }
    };

    const config = phaseConfig[phase] || phaseConfig.manager;

    return (
        <div className={`
       backdrop-blur-sm rounded-2xl p-6 shadow-xl
      transition-all duration-300 hover:shadow-2xl
      ${active ? `ring-4 ${config.activeRing} scale-102` : ''}
      ${className}
    `}>
            {/* Փուլի վերնագիր */}
            <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-200">
                <div className={`w-12 h-12 ${config.gradient} rounded-full flex items-center justify-center text-white text-2xl mr-4`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white-800" style={{color: "#fff"}}>{title}</h3>
            </div>

            {/* Փուլի բովանդակություն */}
            <div>
                {children}
            </div>
        </div>
    );
};

/**
 * InfoCard բաղադրիչ - տեղեկատվական քարտ
 */
export const InfoCard = ({
    title = '',
    value = '',
    icon = '',
    color = 'blue',
    trend = null, // 'up', 'down', 'stable'
    className = ''
}) => {

    const colorConfig = {
        blue: 'from-blue-400 to-blue-600',
        green: 'from-green-400 to-green-600',
        red: 'from-red-400 to-red-600',
        yellow: 'from-yellow-400 to-yellow-600',
        purple: 'from-purple-400 to-purple-600'
    };

    const trendConfig = {
        up: { icon: '📈', color: 'text-green-600' },
        down: { icon: '📉', color: 'text-red-600' },
        stable: { icon: '➡️', color: 'text-gray-600' }
    };

    return (
        <div className={`
      bg-white rounded-xl p-6 shadow-lg border border-gray-200
      hover:shadow-xl transition-all duration-300
      ${className}
    `}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
                    <div className="flex items-center">
                        <span className="text-1xl font-bold text-gray-900 mr-2">{value}</span>
                        {trend && (
                            <span className={`text-sm ${trendConfig[trend].color}`}>
                                {trendConfig[trend].icon}
                            </span>
                        )}
                    </div>
                </div>

                {icon && (
                    <div className={`w-12 h-12 bg-gradient-to-r ${colorConfig[color]} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-xl">{icon}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * ChartCard բաղադրիչ - գծապատկերների համար
 */
export const ChartCard = ({
    children,
    title = '',
    subtitle = '',
    className = ''
}) => {
    return (
        <div className={`
      bg-gray-50 rounded-xl p-6 border-2 border-gray-200
      hover:border-gray-300 transition-all duration-300
      ${className}
    `}>
            {/* Գծապատկերի վերնագիր */}
            {title && (
                <div className="mb-4">
                    <h4 className="font-bold text-lg text-gray-700">{title}</h4>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
            )}

            {/* Գծապատկերի բովանդակություն */}
            <div>
                {children}
            </div>
        </div>
    );
};

/**
 * ClusterCard բաղադրիչ - կլաստերների ցուցադրման համար
 */
export const ClusterCard = ({
    id = 1,
    label = '',
    size = 0,
    avgValue = 0,
    quality = 0,
    className = ''
}) => {
    return (
        <div className={`
      bg-gradient-to-br from-gray-100 to-gray-200 
      rounded-xl p-4 border-2 border-gray-300 
      text-center hover:shadow-lg
      transition-all duration-300
      ${className}
    `}>
            <div className="font-bold text-gray-700 mb-2">
                Խումբ {id}: {label}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
                <div>Չափ: <span className="font-medium">{size}</span> տարր</div>
                <div>Միջին արժեք: <span className="font-medium">{avgValue}</span></div>
                <div>Որակ: <span className="font-medium">{quality}%</span></div>
            </div>
        </div>
    );
};

/**
 * ScenarioCard բաղադրիչ - սցենարների ցուցադրման համար
 */
export const ScenarioCard = ({
    title = '',
    description = '',
    priority = 'medium',
    priorityText = '',
    actions = [],
    className = ''
}) => {

    const priorityConfig = {
        high: 'bg-red-200 text-red-800',
        medium: 'bg-yellow-200 text-yellow-800',
        low: 'bg-green-200 text-green-800'
    };

    return (
        <div className={`
      bg-gradient-to-r from-blue-50 to-blue-100 
      border-l-4 border-blue-500 rounded-xl p-6
      hover:shadow-lg transition-all duration-300
      ${className}
    `}>
            {/* Առաջնահերթություն */}
            <div className={`
        inline-block px-3 py-1 rounded-full text-xs font-bold mb-3
        ${priorityConfig[priority]}
      `}>
                {priorityText}
            </div>

            {/* Վերնագիր */}
            <div className="font-bold text-blue-900 text-lg mb-2">{title}</div>

            {/* Նկարագրություն */}
            <div className="text-gray-700 mb-4">{description}</div>

            {/* Գործողություններ */}
            {actions.length > 0 && (
                <div className="bg-gray-100 rounded-lg p-4">
                    <div className="font-bold mb-2">Առաջարկվող գործողություններ:</div>
                    <ul className="list-disc list-inside space-y-1">
                        {actions.map((action, index) => (
                            <li key={index} className="text-sm">{action}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Card;