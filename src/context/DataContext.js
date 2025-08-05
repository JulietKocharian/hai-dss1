// src/context/DataContext.js
// Տվյալների գլոբալ վիճակի կառավարում React Context-ի միջոցով

import React, { createContext, useContext, useState } from 'react';

/**
 * Տվյալների համատեքստ - գլոբալ վիճակի կառավարման համար
 */
const DataContext = createContext();

/**
 * Hook տվյալների համատեքստին մուտք գործելու համար
 * @returns {Object} Տվյալների վիճակ և ֆունկցիաներ
 */
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData պետք է օգտագործվի DataProvider-ի ներսում');
    }
    return context;
};

/**
 * Տվյալների պրովայդեր բաղադրիչ
 * @param {Object} props - Բաղադրիչի պրոպսեր
 * @param {React.ReactNode} props.children - Երեխա բաղադրիչներ
 */
export const DataProvider = ({ children }) => {
    // Հիմնական տվյալներ
    const [currentData, setCurrentData] = useState(null);
    const [syntheticData, setSyntheticData] = useState(null);
    const [cleanedData, setCleanedData] = useState(null);
    const [clusterData, setClusterData] = useState(null);
    const [fuzzyResults, setFuzzyResults] = useState(null);
    const [scenarios, setScenarios] = useState([]);

    // MISSING FUNCTIONS - ADD THESE 2 LINES
    const [decisionResults, setDecisionResults] = useState(null);
    const [finalRecommendations, setFinalRecommendations] = useState(null);

    // UI վիճակներ
    const [activeTab, setActiveTab] = useState('analysis');
    const [analysisWorkspace, setAnalysisWorkspace] = useState(false);
    const [analystActive, setAnalystActive] = useState(false);
    const [expertActive, setExpertActive] = useState(false);

    // Ֆորմի տվյալներ
    const [projectName, setProjectName] = useState('');
    const [dataType, setDataType] = useState('');
    const [dataSource, setDataSource] = useState('');
    const [rawData, setRawData] = useState('');

    // Վերլուծության արդյունքներ
    const [qualityMetrics, setQualityMetrics] = useState({
        completeness: 0,
        accuracy: 0,
        missingValues: 0,
        outliers: 0,
        duplicates: 0
    });

    // Սինթետիկ տվյալների վիճակ
    const [syntheticStatus, setSyntheticStatus] = useState('Նախապատրաստում...');
    const [syntheticProgress, setSyntheticProgress] = useState(0);

    // Մաքրման կարգավորումներ
    const [cleaningIntensity, setCleaningIntensity] = useState(5);

    /**
     * Վիճակը զրոյացնելու ֆունկցիա
     */
    const resetData = () => {
        setCurrentData(null);
        setSyntheticData(null);
        setCleanedData(null);
        setClusterData(null);
        setFuzzyResults(null);
        setScenarios([]);
        setDecisionResults(null);           // RESET DECISION RESULTS
        setFinalRecommendations(null);      // RESET FINAL RECOMMENDATIONS
        setAnalysisWorkspace(false);
        setAnalystActive(false);
        setExpertActive(false);
        setActiveTab('analysis');
        setSyntheticProgress(0);
        setSyntheticStatus('Նախապատրաստում...');
    };

    /**
     * Նախագծի ամբողջական տվյալներ
     */
    const projectInfo = {
        name: projectName,
        type: dataType,
        source: dataSource,
        analysisDate: new Date().toLocaleDateString('hy-AM')
    };

    // Context-ի արժեքը
    const value = {
        // Տվյալների վիճակներ
        currentData,
        setCurrentData,
        syntheticData,
        setSyntheticData,
        cleanedData,
        setCleanedData,
        clusterData,
        setClusterData,
        fuzzyResults,
        setFuzzyResults,
        scenarios,
        setScenarios,

        // MISSING FUNCTIONS - ADD THESE 4 LINES TO EXPORTS
        decisionResults,
        setDecisionResults,
        finalRecommendations,
        setFinalRecommendations,

        // UI վիճակներ
        activeTab,
        setActiveTab,
        analysisWorkspace,
        setAnalysisWorkspace,
        analystActive,
        setAnalystActive,
        expertActive,
        setExpertActive,

        // Ֆորմի տվյալներ
        projectName,
        setProjectName,
        dataType,
        setDataType,
        dataSource,
        setDataSource,
        rawData,
        setRawData,

        // Վերլուծության արդյունքներ
        qualityMetrics,
        setQualityMetrics,
        syntheticStatus,
        setSyntheticStatus,
        syntheticProgress,
        setSyntheticProgress,
        cleaningIntensity,
        setCleaningIntensity,

        // Օգնական ֆունկցիաներ
        resetData,
        projectInfo,
        decisionResults,
        setDecisionResults,
        finalRecommendations,
        setFinalRecommendations,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};