// src/components/UI/Button.js
// Կրկնօգտագործվող կոճակների բաղադրիչ

import React from 'react';

/**
 * Button բաղադրիչ - կրկնօգտագործվող կոճակ
 * @param {Object} props - Բաղադրիչի պրոպսեր
 * @param {React.ReactNode} props.children - Կոճակի բովանդակություն
 * @param {Function} props.onClick - Click իրադարձության մշակիչ
 * @param {string} props.variant - Կոճակի տեսակը (primary, secondary, success, warning, danger)
 * @param {string} props.size - Կոճակի չափը (sm, md, lg)
 * @param {boolean} props.disabled - Անջատված վիճակ
 * @param {boolean} props.loading - Բեռնման վիճակ
 * @param {string} props.className - Լրացուցիչ CSS դասեր
 */
const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {

    // Տարբեր տեսակների համար CSS դասեր
    const variants = {
        primary: 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white',
        secondary: 'bg-gradient-to-r from-zinc-400 to-slate-600 hover:from-zinc-500 hover:to-slate-700 text-white',
        success: 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white',
        warning: 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white',
        danger: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white',
        manager: 'bg-gradient-to-r from-[#1c92d2] to-[#f2fcfe] hover:from-[#1875d1] hover:to-[#e6f8fd] text-white',
        analyst: 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white',
        expert: 'bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white'
    };


    // Չափերի համար CSS դասեր
    const sizes = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-8 text-lg'
    };

    // Հիմնական CSS դասեր
    const baseClasses = `
    font-bold rounded-lg transition-all duration-300 transform
    focus:outline-none focus:ring-4 focus:ring-blue-300
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading
            ? 'opacity-60 cursor-not-allowed transform-none'
            : 'hover:scale-105 hover:shadow-lg active:scale-95'
        }
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <button
            className={baseClasses}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {/* Բեռնման սպիներ */}
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}

            {/* Կոճակի բովանդակություն */}
            {children}
        </button>
    );
};

/**
 * Կոճակի խմբի բաղադրիչ - մի քանի կոճակների համարժակեցման համար
 */
export const ButtonGroup = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {children}
        </div>
    );
};

export default Button;