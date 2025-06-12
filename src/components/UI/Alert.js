// src/components/UI/Alert.js
// Ցուցանակների (alerts) բաղադրիչ

import React from 'react';

/**
 * Alert բաղադրիչ - տեղեկատվական ցուցանակներ
 * @param {Object} props - Բաղադրիչի պրոպսեր
 * @param {React.ReactNode} props.children - Ցուցանակի բովանդակություն
 * @param {string} props.type - Ցուցանակի տեսակը (info, success, warning, danger)
 * @param {string} props.title - Ցուցանակի վերնագիր
 * @param {string} props.icon - Ցուցանակի նշան (emoji)
 * @param {boolean} props.dismissible - Փակելու հնարավորություն
 * @param {Function} props.onDismiss - Փակելու ֆունկցիա
 * @param {string} props.className - Լրացուցիչ CSS դասեր
 */
const Alert = ({
    children,
    type = 'info',
    title = '',
    icon = '',
    dismissible = false,
    onDismiss,
    className = ''
}) => {

    // Տարբեր տեսակների համար կարգավորումներ
    const alertTypes = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200 border-l-blue-500',
            text: 'text-blue-800',
            icon: icon || 'ℹ️'
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200 border-l-green-500',
            text: 'text-green-800',
            icon: icon || '✅'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200 border-l-yellow-500',
            text: 'text-yellow-800',
            icon: icon || '⚠️'
        },
        danger: {
            bg: 'bg-red-50',
            border: 'border-red-200 border-l-red-500',
            text: 'text-red-800',
            icon: icon || '❌'
        },
        processing: {
            bg: 'bg-purple-50',
            border: 'border-purple-200 border-l-purple-500',
            text: 'text-purple-800',
            icon: icon || '🔄'
        }
    };

    const config = alertTypes[type] || alertTypes.info;

    return (
        <div className={`
      ${config.bg} 
      ${config.border} 
      border-l-4 border 
      rounded-lg p-4 mb-4 
      shadow-sm
      ${className}
    `}>
            <div className="flex items-start">
                {/* Նշան */}
                <div className="flex-shrink-0">
                    <span className="text-xl mr-3">{config.icon}</span>
                </div>

                {/* Բովանդակություն */}
                <div className="flex-1">
                    {/* Վերնագիր */}
                    {title && (
                        <h4 className={`font-bold ${config.text} mb-1`}>
                            {title}
                        </h4>
                    )}

                    {/* Հիմնական բովանդակություն */}
                    <div className={`${config.text} ${title ? 'text-sm' : ''}`}>
                        {children}
                    </div>
                </div>

                {/* Փակելու կոճակ */}
                {dismissible && (
                    <div className="flex-shrink-0 ml-4">
                        <button
                            onClick={onDismiss}
                            className={`
                ${config.text} 
                hover:opacity-75 
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-2 
                focus:ring-blue-500
                rounded-full p-1
              `}
                        >
                            <span className="text-lg">×</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Բարդ ցուցանակ` գործողությունների կոճակներով
 * @param {Object} props - Բաղադրիչի պրոպսեր
 */
export const ActionAlert = ({
    children,
    type = 'info',
    title = '',
    icon = '',
    actions = [],
    className = ''
}) => {
    const config = {
        info: { bg: 'bg-blue-50', border: 'border-blue-200 border-l-blue-500', text: 'text-blue-800' },
        success: { bg: 'bg-green-50', border: 'border-green-200 border-l-green-500', text: 'text-green-800' },
        warning: { bg: 'bg-yellow-50', border: 'border-yellow-200 border-l-yellow-500', text: 'text-yellow-800' },
        danger: { bg: 'bg-red-50', border: 'border-red-200 border-l-red-500', text: 'text-red-800' }
    }[type] || { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' };

    return (
        <div className={`
      ${config.bg} 
      ${config.border} 
      border-l-4 border 
      rounded-lg p-4 mb-4 
      shadow-sm
      ${className}
    `}>
            <div className="flex items-start">
                {/* Նշան */}
                {icon && (
                    <div className="flex-shrink-0">
                        <span className="text-xl mr-3">{icon}</span>
                    </div>
                )}

                {/* Բովանդակություն */}
                <div className="flex-1">
                    {/* Վերնագիր */}
                    {title && (
                        <h4 className={`font-bold ${config.text} mb-2`}>
                            {title}
                        </h4>
                    )}

                    {/* Հիմնական բովանդակություն */}
                    <div className={`${config.text} mb-3`}>
                        {children}
                    </div>

                    {/* Գործողությունների կոճակներ */}
                    {actions.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className={`
                    px-3 py-1 rounded-md text-sm font-medium
                    ${action.primary
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }
                    transition-colors duration-200
                  `}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Կարգավիճակի ցուցանակ անիմացիաով
 */
export const StatusAlert = ({
    status = 'pending',
    message = '',
    className = ''
}) => {
    const statusConfig = {
        pending: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: '⏳',
            dot: 'bg-yellow-500'
        },
        processing: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: '⚙️',
            dot: 'bg-blue-500 animate-pulse'
        },
        complete: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: '✅',
            dot: 'bg-green-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: '❌',
            dot: 'bg-red-500'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <div className={`
      ${config.bg} 
      ${config.border} 
      border rounded-lg p-3 
      flex items-center
      ${className}
    `}>
            {/* Կարգավիճակի մանրակետ */}
            <div className={`w-3 h-3 rounded-full ${config.dot} mr-3`}></div>

            {/* Նշան */}
            <span className="text-lg mr-2">{config.icon}</span>

            {/* Հաղորդագրություն */}
            <span className={`${config.text} font-medium`}>
                {message}
            </span>
        </div>
    );
};

export default Alert;