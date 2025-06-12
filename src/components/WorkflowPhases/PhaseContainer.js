// Enhanced parent component that wraps your existing structure
import React, { useState, useEffect } from 'react';
import ManagerPhase from './ManagerPhase'; // Your existing component
import AnalystPhase from './AnalystPhase'; // Your existing component  
import ExpertPhase from './ExpertPhase'; // Your existing component
import DecisionLevelPhase from './DesicionPhase';

const EnhancedPhaseContainerr = () => {
    const [activePhase, setActivePhase] = useState(0); // 0: Manager, 1: Analyst, 2: Expert, 3: Decision
    const [isProgressing, setIsProgressing] = useState(false);
    const [completedPhases, setCompletedPhases] = useState([]);

    // Handle automatic progression with timing
    useEffect(() => {
        if (!isProgressing) return;

        const timer = setTimeout(() => {
            setActivePhase(prev => {
                // Mark previous phase as completed
                setCompletedPhases(current => [...current, prev]);
                
                if (prev < 3) {
                    return prev + 1;
                } else {
                    setIsProgressing(false);
                    setCompletedPhases(current => [...current, 3]); // Mark final phase as completed
                    return prev;
                }
            });
        }, 3000); // 3 seconds delay between each phase

        return () => clearTimeout(timer);
    }, [activePhase, isProgressing]);

    // Function to start the progression (call this from ManagerPhase button)
    const startProgression = () => {
        setCompletedPhases([0]); // Mark manager phase as completed
        setActivePhase(1); // Move to Analyst phase
        setIsProgressing(true);
    };

    // Handle individual phase completion
    const handlePhaseComplete = (phaseIndex) => {
        setCompletedPhases(current => [...current, phaseIndex]);
        
        // Auto-progress to next phase
        if (phaseIndex < 3) {
            setTimeout(() => {
                setActivePhase(phaseIndex + 1);
            }, 1000);
        } else {
            setIsProgressing(false);
        }
    };

    const phases = [
        { name: 'Մենեջեր', icon: '👨‍💼' },
        { name: 'Վերլուծաբան', icon: '📊' },
        { name: 'Մասնագետ', icon: '🔬' },
        { name: 'Որոշում', icon: '⚖️' }
    ];

    return (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white rounded-2xl p-6 mb-8 w-full">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
                <div className="flex space-x-4 bg-white/10 rounded-xl p-2">
                    {phases.map((phase, index) => (
                        <div
                            key={index}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                activePhase === index
                                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                                    : completedPhases.includes(index)
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-white/5 text-white/60'
                            }`}
                        >
                            <span className="text-lg">{phase.icon}</span>
                            <span className="font-medium">{phase.name}</span>
                            {completedPhases.includes(index) && (
                                <span className="text-green-400">✓</span>
                            )}
                            {activePhase === index && isProgressing && (
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${((activePhase + 1) / 4) * 100}%` }}
                ></div>
            </div>

            {/* Your Original Content Structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`transition-all duration-500 ${
                    activePhase === 0
                        ? 'scale-105 opacity-100  ring-opacity-50'
                        : completedPhases.includes(0)
                        ? 'scale-95 opacity-75'
                        : 'scale-90 opacity-50'
                }`}>
                    <ManagerPhase 
                        isActive={activePhase === 0}
                        isCompleted={completedPhases.includes(0)}
                        onStartProgression={startProgression}
                        onComplete={() => handlePhaseComplete(0)}
                    />
                </div>

                <div className={`transition-all duration-500 ${
                    activePhase === 1
                        ? 'scale-105 opacity-100  ring-opacity-50'
                        : completedPhases.includes(1)
                        ? 'scale-95 opacity-75'
                        : 'scale-90 opacity-50'
                }`}>
                    <AnalystPhase 
                        isActive={activePhase === 1}
                        isCompleted={completedPhases.includes(1)}
                        onComplete={() => handlePhaseComplete(1)}
                    />
                </div>

                <div className={`transition-all duration-500 ${
                    activePhase === 2
                        ? 'scale-105 opacity-100  ring-opacity-50'
                        : completedPhases.includes(2)
                        ? 'scale-95 opacity-75'
                        : 'scale-90 opacity-50'
                }`}>
                    <ExpertPhase 
                        isActive={activePhase === 2}
                        isCompleted={completedPhases.includes(2)}
                        onComplete={() => handlePhaseComplete(2)}
                    />
                </div>

                <div className={`transition-all duration-500 ${
                    activePhase === 3
                        ? 'scale-105 opacity-100  ring-opacity-50'
                        : completedPhases.includes(3)
                        ? 'scale-95 opacity-75'
                        : 'scale-90 opacity-50'
                }`}>
                    <DecisionLevelPhase
                        isActive={activePhase === 3}
                        isCompleted={completedPhases.includes(3)}
                        onComplete={() => handlePhaseComplete(3)}
                    />
                </div>
            </div>

            {/* Status Information */}
            <div className="mt-6 text-center">
                <div className="text-white/80 text-sm">
                    {isProgressing ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                            <span>Տվյալները մշակվում են... ({phases[activePhase].name})</span>
                        </div>
                    ) : (
                        <span>
                            Ընթացիկ փուլ: {phases[activePhase].name}
                            {activePhase === 3 && completedPhases.includes(3) && ' (Ավարտված)'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnhancedPhaseContainerr;