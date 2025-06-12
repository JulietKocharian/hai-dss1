// src/components/AnalysisWorkspace/AnalysisWorkspace.js
// Հիմնական վերլուծական տարածք - տաբերով ինտերֆեյս

import React from 'react';
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
const AnalysisWorkspace = () => {
    const {
        analysisWorkspace,
        activeTab,
        setActiveTab
    } = useData();

    // Եթե վերլուծական տարածքը ցուցադրված չէ, ոչինչ չվերադարձնել
    if (!analysisWorkspace) {
        return null;
    }

    /**
     * Տաբի պայմանական ցուցադրում
     * @param {string} tabName - Տաբի անվանում
     * @returns {JSX.Element|null} Տաբի բովանդակություն
     */
    const renderTabContent = (tabName) => {
        switch (tabName) {
            case 'analysis':
                return <AnalysisTab />;
            case 'synthetic':
                return <SyntheticTab />;
            case 'fuzzy':
                return <FuzzyTab />;
            case 'clustering':
                return <ClusteringTab />;
            case 'scenarios':
                return <ScenariosTab />;
            case 'results':
                return <ResultsTab />;
            default:
                return <AnalysisTab />;
        }
    };

    /**
     * Ընդհանուր առաջընթացի հաշվարկ
     * @returns {number} Առաջընթացի տոկոս
     */
    const getOverallProgress = () => {
        // Սա կախված է ակտիվ տաբից և ամբողջական գործընթացից
        const tabProgress = {
            'analysis': 20,
            'synthetic': 40,
            'fuzzy': 60,
            'clustering': 80,
            'scenarios': 90,
            'results': 100
        };

        return tabProgress[activeTab] || 0;
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl mt-8 w-full">
            {/* Վերլուծական տարածքի վերնագիր */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    🔬 Վերլուծական աշխատանք
                </h2>
                <p className="text-gray-600">
                    Ինտերակտիվ վերլուծության հարթակ բոլոր մեթոդաբանական գործիքներով
                </p>
            </div>

            {/* Տաբերի նավիգացիա */}
            <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Տաբի բովանդակություն */}
            <div className="mt-6">
                <div className="tab-content-container">
                    {renderTabContent(activeTab)}
                </div>
            </div>

            {/* Վերլուծական գործընթացի կարգավիճակ */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-gray-700">📊 Վերլուծական գործընթացի կարգավիճակ</h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Ընթացիկ փուլ: {getTabLabel(activeTab)}
                        </p>
                    </div>

                    {/* Առաջընթացի ինդիկատոր */}
                    <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-700">
                            Ընդհանուր առաջընթաց:
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${getOverallProgress()}%` }}
                            ></div>
                        </div>
                        <div className="text-sm font-bold text-gray-700">
                            {getOverallProgress()}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Քավի ծանուցումներ */}
            <AnalysisAlerts />
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
 * Վերլուծական ծանուցումների բաղադրիչ
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
        <div className="mt-4 space-y-2">
            {alerts.map((alert, index) => (
                <div
                    key={index}
                    className={`flex items-center p-2 rounded-lg text-sm ${getAlertClasses(alert.type)}`}
                >
                    <span className="mr-2">{getAlertIcon(alert.type)}</span>
                    <span>{alert.message}</span>
                </div>
            ))}
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
            return 'bg-green-100 text-green-800 border border-green-200';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'info':
            return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'error':
            return 'bg-red-100 text-red-800 border border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border border-gray-200';
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