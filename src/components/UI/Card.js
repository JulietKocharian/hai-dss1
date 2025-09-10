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
                <h3 className="text-xl font-bold text-white-800" style={{ color: "#fff" }}>{title}</h3>
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
    id,
    title = '',
    description = '',
    priority = 'medium',
    priorityText = '',
    preconditions = [],
    risks = [],
    actions = [],
    expectedOutcomes = [],
    className = ''
}) => {

    const priorityConfig = {
        high: 'bg-red-200 text-red-800',
        medium: 'bg-yellow-200 text-yellow-800',
        low: 'bg-green-200 text-green-800'
    };

    const priorityConfigTexts = {
        high: 'Բարձր առաջնահերթության',
        medium: 'Միջին առաջնահերթության',
        low: 'Ցածր առաջնահերթության'
    };
    
        const _priority = {
        high: 'Բարձր',
        medium: 'Միջին',
        low: 'Ցածր'
    };

    return (
        <div className={`
            bg-gradient-to-r from-blue-50 to-blue-100 
            border-l-4 border-blue-500 rounded-xl p-6 mb-6
            hover:shadow-lg transition-all duration-300
            ${className}
        `}>
            {/* Առաջնահերթություն */}
            <div className={`
                inline-block px-3 py-1 rounded-full text-xs font-bold mb-3
                ${priorityConfig[risks[0].impact]}
            `}>
                {priorityConfigTexts[risks[0].impact]}
            </div>

            {/* Վերնագիր */}
            <div className="font-bold text-blue-900 text-lg mb-3">{title}</div>

            {/* Նկարագրություն */}
            <div className="text-gray-700 mb-4">{description}</div>

            {/* Կանխադրույթներ */}
            {preconditions.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="font-bold text-blue-800 mb-2">🎯 Կանխադրույթներ:</div>
                    <ul className="list-disc list-inside space-y-1">
                        {preconditions.map((condition, index) => (
                            <li key={index} className="text-sm text-blue-700">{condition}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Ռիսկեր */}
            {risks.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                    <div className="font-bold text-red-800 mb-3">⚠️ Ռիսկեր:</div>
                    {risks.map((risk, index) => (
                        <div key={index} className="border-b border-red-200 last:border-b-0 pb-3 last:pb-0 mb-3 last:mb-0">
                            <div className="font-semibold text-red-700 mb-1">{risk.title}</div>
                            <div className="text-sm text-red-600 mb-2">
                                <span className="font-medium">Ազդեցություն:</span> {_priority[risk.impact]} |
                                <span className="font-medium ml-2">Հավանականություն:</span> {(risk.probability * 100).toFixed(0)}%
                            </div>
                            <div className="text-sm text-red-600 mb-2">
                                <span className="font-medium">Լուծում:</span> {risk.response}
                            </div>
                            {risk.mitigationSteps?.length > 0 && (
                                <div>
                                    <div className="font-medium text-red-700 text-sm mb-1">Մեղմացման քայլեր:</div>
                                    <ul className="list-disc list-inside text-xs text-red-600 ml-4">
                                        {risk.mitigationSteps.map((step, stepIndex) => (
                                            <li key={stepIndex}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Գործողություններ */}
            {actions.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="font-bold text-green-800 mb-3">✅ Առաջարկվող գործողություններ:</div>
                    {actions.map((action, index) => (
                        <div key={index} className="border-b border-green-200 last:border-b-0 pb-3 last:pb-0 mb-3 last:mb-0">
                            <div className="font-semibold text-green-700 mb-1">{action.step}</div>
                            <div className="text-sm text-green-600 mb-1">
                                <span className="font-medium">Պատասխանատու:</span> {action.responsible}
                            </div>
                            <div className="text-sm text-green-600">
                                <span className="font-medium">Ժամկետ:</span> {action.deadline}
                            </div>
                            {action.justification && (
                                <div className="text-sm text-green-600 mt-1">
                                    <span className="font-medium">Հիմնավորում:</span> {action.justification}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Սպասվող արդյունքներ */}
            {expectedOutcomes.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                    <div className="font-bold text-purple-800 mb-2">🎯 Սպասվող արդյունքներ:</div>
                    <ul className="list-disc list-inside space-y-1">
                        {expectedOutcomes.map((outcome, index) => (
                            <li key={index} className="text-sm text-purple-700">{outcome}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ID ցուցադրման համար debug */}
            <div className="text-xs text-gray-400 mt-4">ID: {id}</div>
        </div>
    );
};
export default Card;