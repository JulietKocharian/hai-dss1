// src/components/AnalysisWorkspace/AnalysisWorkspace.js
// Հիմնական վերլուծական տարածք - տաբերով ինտերֆեյս (Fully Responsive)

import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import TabNavigation from './TabNavigation';
import AnalysisTab from './TabContents/AnalysisTab';
import SyntheticTab from './TabContents/SyntheticTab';
import FuzzyTab from './TabContents/FuzzyTab';
import ClusteringTab from './TabContents/ClusteringTab';
import ScenariosTab from './TabContents/ScenariosTab';
import ResultsTab from './TabContents/ResultsTab';

/**
 * AnalysisWorkspace բաղադրիչ - վերլուծական աշխատատարածք
 * Ցուցադրում է վերլուծության բոլոր փուլերը տաբերի միջոցով
 */
const AnalysisWorkspace = ({
    projectId,
    projectStorage,
    onUpdateProject
}) => {
    const {
        analysisWorkspace,
        activeTab,
        setActiveTab,
        currentData,
        syntheticData,
        fuzzyResults,
        clusterData,
        scenarios
    } = useData();

    const [projectData, setProjectData] = useState(null);

    // Load project data if available
    useEffect(() => {
        if (projectStorage && projectId) {
            try {
                const data = projectStorage.getProject(projectId);
                setProjectData(data);
            } catch (error) {
                console.error('Error loading project data:', error);
            }
        }
    }, [projectStorage, projectId]);

    // Если не хватает данных для анализа, показываем заглушку
    if (!analysisWorkspace && !currentData && !projectData) {
        return null;
    }

    // Функция смены табов с сохранением в localStorage
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);

        // Сохраняем активный таб в localStorage
        if (projectStorage && projectId) {
            projectStorage.updateAnalysisWorkspace(projectId, tabName, {
                timestamp: new Date().toISOString(),
                tabSwitched: true
            });
        }
    };

    /**
     * Տաբի պայմանական ցուցադրում
     * @param {string} tabName - Տաբի անվանում
     * @returns {JSX.Element|null} Տաբի բովանդակություն
     */
    const renderTabContent = (tabName) => {
        // Ավելացնում ենք responsive wrapper-ը յուրաքանչյուր տաբի համար
        const TabWrapper = ({ children }) => (
            <div className="w-full max-w-full overflow-hidden">
                <div className="responsive-tab-content">
                    {children}
                </div>
            </div>
        );

        // Компоненты табов с передачей пропсов
        const tabProps = {
            projectId,
            projectStorage,
            onUpdateProject,
            projectData
        };

        switch (tabName) {
            case 'analysis':
                return (
                    <TabWrapper>
                        <AnalysisTab {...tabProps} />
                    </TabWrapper>
                );
            case 'synthetic':
                return (
                    <TabWrapper>
                        <SyntheticTab {...tabProps} />
                    </TabWrapper>
                );
            case 'fuzzy':
                return (
                    <TabWrapper>
                        <FuzzyTab {...tabProps} />
                    </TabWrapper>
                );
            case 'clustering':
                return (
                    <TabWrapper>
                        <ClusteringTab {...tabProps} />
                    </TabWrapper>
                );
            case 'scenarios':
                return (
                    <TabWrapper>
                        <ScenariosTab {...tabProps} />
                    </TabWrapper>
                );
            case 'results':
                return (
                    <TabWrapper>
                        <ResultsTab {...tabProps} />
                    </TabWrapper>
                );
            default:
                return (
                    <TabWrapper>
                        <AnalysisTab {...tabProps} />
                    </TabWrapper>
                );
        }
    };

    /**
     * Ընդհանուր առաջնագացի հաշվարկ
     * @returns {number} Առաջնագացի տոկոս
     */
    const getOverallProgress = () => {
        // Improved progress calculation based on actual data
        let progress = 0;

        if (currentData && currentData.length > 0) progress += 20;
        if (syntheticData && syntheticData.length > 0) progress += 20;
        if (fuzzyResults) progress += 20;
        if (clusterData && clusterData.length > 0) progress += 20;
        if (scenarios && scenarios.length > 0) progress += 20;

        return Math.min(progress, 100);
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl mt-4 lg:mt-8 w-full max-w-full overflow-hidden">

            {/* Տաբերի նավիգացիա - Բարելավված responsive */}
            <div className="mb-4 lg:mb-6 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                </div>
            </div>

            {/* Տաբի բովանդակություն - Բարելավված responsive */}
            <div className="mb-6 lg:mb-8 w-full">
                <div className="tab-content-container min-h-[250px] sm:min-h-[350px] lg:min-h-[400px] w-full max-w-full overflow-hidden relative">
                    {/* Ավելացնում ենք fade-in անիմացիա */}
                    <div className="tab-content-wrapper w-full h-full animate-fadeIn">
                        {renderTabContent(activeTab)}
                    </div>
                </div>
            </div>

            {/* Վերլուծական գործընթացի կարգավիճակ - Բարելավված responsive */}
            <div className="p-3 sm:p-4 lg:p-5 bg-gray-50 rounded-lg border-l-4 border-blue-500 mb-4 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-700 text-sm sm:text-base lg:text-lg truncate">
                            📊 Վերլուծաբանական գործընթացի կարգավիճակ
                        </h4>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 leading-relaxed break-words">
                            Ընթացիկ փուլ: <span className="font-medium">{getTabLabel(activeTab)}</span>
                        </p>
                    </div>

                    {/* Առաջընթացի ինդիկատոր - Բարելավված responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                        <div className="text-xs sm:text-sm lg:text-base font-medium text-gray-700 whitespace-nowrap">
                            Ընդհանուր առաջընթաց:
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-24 sm:w-28 lg:w-32 bg-gray-200 rounded-full h-2 lg:h-3 flex-shrink-0">
                                <div
                                    className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 lg:h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${getOverallProgress()}%` }}
                                ></div>
                            </div>
                            <div className="text-xs sm:text-sm lg:text-base font-bold text-gray-700 min-w-[2.5rem] text-right">
                                {getOverallProgress()}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ծանուցումների բաղադրիչ */}
            <AnalysisAlerts />

            {/* Ավելացնում ենք CSS կանոններ responsive բաղադրիչների համար */}
            <style jsx>{`
                .responsive-tab-content {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: auto;
                    overflow-y: visible;
                }

                .responsive-tab-content > * {
                    max-width: 100%;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                }

                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Հատուկ responsive կանոններ սցենարների համար */
                .responsive-tab-content .scenario-container {
                    display: grid;
                    gap: 1rem;
                    grid-template-columns: 1fr;
                }

                @media (min-width: 640px) {
                    .responsive-tab-content .scenario-container {
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    }
                }

                @media (min-width: 1024px) {
                    .responsive-tab-content .scenario-container {
                        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    }
                }

                /* Հատուկ responsive կանոններ աղյուսակների համար */
                .responsive-tab-content table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                }

                @media (max-width: 640px) {
                    .responsive-tab-content table {
                        font-size: 0.75rem;
                    }
                    
                    .responsive-tab-content table th,
                    .responsive-tab-content table td {
                        padding: 0.5rem 0.25rem;
                        word-break: break-word;
                    }
                }

                /* Հատուկ responsive կանոններ չարտերի համար */
                .responsive-tab-content .chart-container {
                    width: 100%;
                    height: auto;
                    min-height: 250px;
                    overflow: hidden;
                }

                @media (max-width: 640px) {
                    .responsive-tab-content .chart-container {
                        min-height: 200px;
                    }
                }

                /* Հատուկ responsive կանոններ form-երի համար */
                .responsive-tab-content .form-container {
                    display: grid;
                    gap: 1rem;
                    grid-template-columns: 1fr;
                }

                @media (min-width: 768px) {
                    .responsive-tab-content .form-container {
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

/**
 * Տաբի պիտակի ստացում
 * @param {string} tabName - Տաբի անվանում
 * @returns {string} Տաբի հայերեն պիտակ
 */
const getTabLabel = (tabName) => {
    const labels = {
        'analysis': 'Առաջնային վերլուծություն',
        'synthetic': 'Սինթետիկ տվյալներ',
        'fuzzy': 'Անորոշ տրամաբանություն',
        'clustering': 'Կլաստերացում',
        'scenarios': 'Սցենարներ',
        'results': 'Արդյունքներ'
    };
    return labels[tabName] || tabName;
};

/**
 * Վերլուծական ծանուցումների բաղադրիչ - Բարելավված responsive
 */
const AnalysisAlerts = () => {
    const {
        currentData,
        syntheticData,
        fuzzyResults,
        clusterData,
        scenarios
    } = useData();

    const alerts = [];

    // Տվյալների վիճակի ստուգում
    if (!currentData || currentData.length === 0) {
        alerts.push({
            type: 'warning',
            message: 'Բնօրինակ տվյալները բացակայում են'
        });
    }

    // Սինթետիկ տվյալների ստուգում
    if (syntheticData && syntheticData.length > 0) {
        alerts.push({
            type: 'success',
            message: `Գեներացվել է ${syntheticData.length} սինթետիկ տող`
        });
    }

    // Անորոշ տրամաբանության ստուգում
    if (fuzzyResults && fuzzyResults.low > 40) {
        alerts.push({
            type: 'warning',
            message: `Ցածր վստահության մակարդակ: ${fuzzyResults.low}%`
        });
    }

    // Կլաստերիզացիայի ստուգում
    if (clusterData && clusterData.length > 0) {
        alerts.push({
            type: 'info',
            message: `Հայտնաբերվել է ${clusterData.length} տարբեր խումբ`
        });
    }

    // Սցենարների ստուգում
    if (scenarios && scenarios.length > 0) {
        const highPriorityCount = scenarios.filter(s => s.priority === 'high').length;
        if (highPriorityCount > 0) {
            alerts.push({
                type: 'warning',
                message: `${highPriorityCount} բարձր առաջնահերթության սցենար`
            });
        }
    }

    if (alerts.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2 overflow-hidden">
            <h5 className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 lg:mb-3">
                Ծանուցումներ:
            </h5>
            <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {alerts.map((alert, index) => (
                    <div
                        key={index}
                        className={`flex items-start p-2 sm:p-3 lg:p-4 rounded-lg text-xs sm:text-sm lg:text-base ${getAlertClasses(alert.type)} break-words w-full max-w-full overflow-hidden`}
                    >
                        <span className="mr-2 sm:mr-3 flex-shrink-0 mt-0.5 text-sm sm:text-base lg:text-lg">
                            {getAlertIcon(alert.type)}
                        </span>
                        <span className="leading-relaxed flex-1 min-w-0 break-words">
                            {alert.message}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Ծանուցման CSS դասերի ստացում
 * @param {string} type - Ծանուցման տեսակ
 * @returns {string} CSS դասեր
 */
const getAlertClasses = (type) => {
    switch (type) {
        case 'success':
            return 'bg-green-50 lg:bg-green-100 text-green-700 lg:text-green-800 border border-green-200 lg:border-green-300';
        case 'warning':
            return 'bg-yellow-50 lg:bg-yellow-100 text-yellow-700 lg:text-yellow-800 border border-yellow-200 lg:border-yellow-300';
        case 'info':
            return 'bg-blue-50 lg:bg-blue-100 text-blue-700 lg:text-blue-800 border border-blue-200 lg:border-blue-300';
        case 'error':
            return 'bg-red-50 lg:bg-red-100 text-red-700 lg:text-red-800 border border-red-200 lg:border-red-300';
        default:
            return 'bg-gray-50 lg:bg-gray-100 text-gray-700 lg:text-gray-800 border border-gray-200 lg:border-gray-300';
    }
};

/**
 * Ծանուցման նշանի ստացում
 * @param {string} type - Ծանուցման տեսակ
 * @returns {string} Emoji նշան
 */
const getAlertIcon = (type) => {
    switch (type) {
        case 'success':
            return '✅';
        case 'warning':
            return '⚠️';
        case 'info':
            return 'ℹ️';
        case 'error':
            return '❌';
        default:
            return '📋';
    }
};

export default AnalysisWorkspace;