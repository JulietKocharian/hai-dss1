// src/components/UI/ProgressBar.js
// Առաջընթացի գոտու բաղադրիչ

import React from 'react';

/**
 * ProgressBar բաղադրիչ - առաջընթացի վիզուալ ցուցադրում
 * @param {Object} props - Բաղադրիչի պրոպսեր
 * @param {number} props.value - Առաջընթացի արժեքը (0-100)
 * @param {string} props.label - Առաջընթացի պիտակը
 * @param {string} props.color - Գույնի տեսակը (blue, green, red, yellow, purple)
 * @param {string} props.size - Գոտու բարձրությունը (sm, md, lg)
 * @param {boolean} props.showValue - Արժեքի ցուցադրում
 * @param {boolean} props.animated - Անիմացիոն էֆեկտ
 * @param {string} props.className - Լրացուցիչ CSS դասեր
 */
const ProgressBar = ({
    value = 0,
    label = '',
    color = 'blue',
    size = 'md',
    showValue = true,
    animated = true,
    className = ''
}) => {

    // Արժեքը սահմանափակել 0-100 միջակայքում
    const normalizedValue = Math.min(Math.max(value, 0), 100);

    // Գույնների դասեր
    const colors = {
        blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
        green: 'bg-gradient-to-r from-green-400 to-green-600',
        red: 'bg-gradient-to-r from-red-400 to-red-600',
        yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
        purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
        orange: 'bg-gradient-to-r from-orange-400 to-orange-600'
    };

    // Չափերի դասեր
    const sizes = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Պիտակ և արժեք */}
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm font-medium text-gray-700">
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span className="text-sm font-bold text-gray-600">
                            {normalizedValue.toFixed(0)}%
                        </span>
                    )}
                </div>
            )}

            {/* Առաջընթացի գոտի */}
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
                <div
                    className={`
            ${colors[color]} 
            ${sizes[size]} 
            rounded-full 
            transition-all duration-1000 ease-out
            ${animated ? 'transform-gpu' : ''}
          `}
                    style={{ width: `${normalizedValue}%` }}
                >
                    {/* Շողացող էֆեկտ (ընթացիկ առաջընթացի ժամանակ) */}
                    {animated && normalizedValue > 0 && normalizedValue < 100 && (
                        <div className="h-full bg-white opacity-30 animate-pulse rounded-full"></div>
                    )}
                </div>
            </div>

            {/* Լրացուցիչ տեղեկություններ ցածր արժեքների համար */}
            {normalizedValue < 10 && normalizedValue > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                    Գործընթացը սկսվել է...
                </div>
            )}
        </div>
    );
};

/**
 * Մի քանի առաջընթացի գոտիների բաղադրիչ
 * @param {Object} props - Բաղադրիչի պրոպսեր
 * @param {Array} props.items - Առաջընթացի տարրերի զանգված
 */
export const MultiProgressBar = ({ items = [], className = '' }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {items.map((item, index) => (
                <ProgressBar
                    key={index}
                    value={item.value}
                    label={item.label}
                    color={item.color}
                    size={item.size}
                    showValue={item.showValue}
                    animated={item.animated}
                />
            ))}
        </div>
    );
};

/**
 * Շրջանակային առաջընթացի բաղադրիչ
 * @param {Object} props - Բաղադրիչի պրոպսեր
 * @param {number} props.value - Առաջընթացի արժեքը (0-100)
 * @param {number} props.size - Շրջանակի չափը պիքսելներով
 * @param {string} props.color - Գույնի տեսակը
 */
export const CircularProgress = ({
    value = 0,
    size = 120,
    color = 'blue',
    children
}) => {
    const normalizedValue = Math.min(Math.max(value, 0), 100);
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

    const colors = {
        blue: '#3B82F6',
        green: '#10B981',
        red: '#EF4444',
        yellow: '#F59E0B',
        purple: '#8B5CF6'
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Հետնային շրջանակ */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                />
                {/* Առաջընթացի շրջանակ */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors[color]}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Կենտրոնական բովանդակություն */}
            <div className="absolute inset-0 flex items-center justify-center">
                {children || (
                    <span className="text-lg font-bold text-gray-700">
                        {normalizedValue.toFixed(0)}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default ProgressBar;