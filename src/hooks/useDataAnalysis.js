// src/hooks/useDataAnalysis.js
// Տվյալների վերլուծության համապարփակ React hook

import { useState, useCallback, useEffect } from 'react';
import { analyzeDataset, formatAnalysisFeedback } from '../utils/dataHelpers';
import { applyFuzzyLogic } from '../utils/fuzzyLogic';
import { performClustering } from '../utils/clustering';
import { generateScenarios } from '../utils/scenarios';
import { generateSyntheticDataset } from '../utils/dataGenerator';

/**
 * Տվյալների վերլուծության hook
 * Ինտեգրված վերլուծական գործառույթներ բոլոր մեթոդների համար
 */
export const useDataAnalysis = (initialData = null, dataType = null) => {
    // Հիմնական վիճակներ
    const [originalData, setOriginalData] = useState(initialData);
    const [currentDataType, setCurrentDataType] = useState(dataType);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);

    // Վերլուծության արդյունքներ
    const [datasetAnalysis, setDatasetAnalysis] = useState(null);
    const [syntheticData, setSyntheticData] = useState(null);
    const [fuzzyResults, setFuzzyResults] = useState(null);
    const [clusterResults, setClusterResults] = useState(null);
    const [scenarios, setScenarios] = useState(null);

    // Մշակման վիճակներ
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState('');
    const [completedSteps, setCompletedSteps] = useState(new Set());

    /**
     * Տվյալների սկզբնական վերլուծություն
     */
    const analyzeDataQuality = useCallback(async (data = originalData) => {
        if (!data || data.length === 0) {
            throw new Error('Վերլուծելու համար տվյալներ չեն գտնվել');
        }

        setCurrentStep('Տվյալների որակի գնահատում...');
        setAnalysisError(null);

        try {
            const analysis = analyzeDataset(data);
            setDatasetAnalysis(analysis);
            setCompletedSteps(prev => new Set([...prev, 'dataQuality']));

            return analysis;
        } catch (error) {
            const errorMessage = `Տվյալների վերլուծության սխալ: ${error.message}`;
            setAnalysisError(errorMessage);
            throw new Error(errorMessage);
        }
    }, [originalData]);

    /**
     * Սինթետիկ տվյալների գեներացիա
     */
    const generateSynthetic = useCallback(async (settings = {}, data = originalData) => {
        if (!data || data.length === 0) {
            throw new Error('Սինթետիկ գեներացման համար տվյալներ չեն գտնվել');
        }

        setCurrentStep('Սինթետիկ տվյալների գեներացում...');

        try {
            const synthetic = await generateSyntheticDataset(data, settings);
            setSyntheticData(synthetic);
            setCompletedSteps(prev => new Set([...prev, 'synthetic']));

            return synthetic;
        } catch (error) {
            const errorMessage = `Սինթետիկ գեներացման սխալ: ${error.message}`;
            setAnalysisError(errorMessage);
            throw new Error(errorMessage);
        }
    }, [originalData]);

    /**
     * Անորոշ տրամաբանության կիրառում
     */
    const applyFuzzyAnalysis = useCallback(async (data = originalData) => {
        if (!data || data.length === 0) {
            throw new Error('Անորոշ տրամաբանության համար տվյալներ չեն գտնվել');
        }

        setCurrentStep('Անորոշ տրամաբանության վերլուծություն...');

        try {
            const fuzzy = applyFuzzyLogic(data, currentDataType);
            setFuzzyResults(fuzzy);
            setCompletedSteps(prev => new Set([...prev, 'fuzzy']));

            return fuzzy;
        } catch (error) {
            const errorMessage = `Անորոշ տրամաբանության սխալ: ${error.message}`;
            setAnalysisError(errorMessage);
            throw new Error(errorMessage);
        }
    }, [originalData, currentDataType]);

    /**
     * Կլաստերիզացիայի իրականացում
     */
    const performClusterAnalysis = useCallback(async (settings = {}, data = originalData) => {
        if (!data || data.length === 0) {
            throw new Error('Կլաստերիզացիայի համար տվյալներ չեն գտնվել');
        }

        setCurrentStep('Կլաստերիզացիայի իրականացում...');

        try {
            const clusters = await performClustering(data, currentDataType, settings);
            setClusterResults(clusters);
            setCompletedSteps(prev => new Set([...prev, 'clustering']));

            return clusters;
        } catch (error) {
            const errorMessage = `Կլաստերիզացիայի սխալ: ${error.message}`;
            setAnalysisError(errorMessage);
            throw new Error(errorMessage);
        }
    }, [originalData, currentDataType]);

    /**
     * Սցենարների գեներացիա
     */
    const generateAnalysisScenarios = useCallback(async () => {
        if (!fuzzyResults && !clusterResults) {
            throw new Error('Սցենարների գեներացման համար անհրաժեշտ է նախ կիրառել անորոշ տրամաբանություն կամ կլաստերիզացիա');
        }

        setCurrentStep('Սցենարների գեներացում...');

        try {
            const generatedScenarios = generateScenarios(currentDataType, fuzzyResults, clusterResults);
            setScenarios(generatedScenarios);
            setCompletedSteps(prev => new Set([...prev, 'scenarios']));

            return generatedScenarios;
        } catch (error) {
            const errorMessage = `Սցենարների գեներացման սխալ: ${error.message}`;
            setAnalysisError(errorMessage);
            throw new Error(errorMessage);
        }
    }, [currentDataType, fuzzyResults, clusterResults]);

    /**
     * Ամբողջական վերլուծության իրականացում
     */
    const runCompleteAnalysis = useCallback(async (analysisOptions = {}) => {
        const {
            includeSynthetic = true,
            syntheticSettings = {},
            includeFuzzy = true,
            includeClustering = true,
            clusteringSettings = {},
            includeScenarios = true,
            stepDelay = 1000 // մսվ ուշացում քայլերի միջև
        } = analysisOptions;

        if (!originalData || originalData.length === 0) {
            throw new Error('Ամբողջական վերլուծության համար տվյալներ չեն գտնվել');
        }

        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setAnalysisError(null);
        setCompletedSteps(new Set());

        try {
            const steps = [];

            // Քայլերի պլանավորում
            steps.push('dataQuality');
            if (includeSynthetic) steps.push('synthetic');
            if (includeFuzzy) steps.push('fuzzy');
            if (includeClustering) steps.push('clustering');
            if (includeScenarios) steps.push('scenarios');

            let completedCount = 0;

            // 1. Տվյալների որակի գնահատում
            setAnalysisProgress(20);
            await analyzeDataQuality();
            completedCount++;
            await delay(stepDelay);

            // 2. Սինթետիկ տվյալների գեներացիա
            if (includeSynthetic) {
                setAnalysisProgress(35);
                await generateSynthetic(syntheticSettings);
                completedCount++;
                await delay(stepDelay);
            }

            // 3. Անորոշ տրամաբանություն
            if (includeFuzzy) {
                setAnalysisProgress(55);
                await applyFuzzyAnalysis();
                completedCount++;
                await delay(stepDelay);
            }

            // 4. Կլաստերիզացիա
            if (includeClustering) {
                setAnalysisProgress(75);
                await performClusterAnalysis(clusteringSettings);
                completedCount++;
                await delay(stepDelay);
            }

            // 5. Սցենարների գեներացիա
            if (includeScenarios && (fuzzyResults || clusterResults)) {
                setAnalysisProgress(90);
                await generateAnalysisScenarios();
                completedCount++;
                await delay(stepDelay);
            }

            setAnalysisProgress(100);
            setCurrentStep('Վերլուծությունը ավարտված է');

            return {
                success: true,
                results: {
                    datasetAnalysis,
                    syntheticData,
                    fuzzyResults,
                    clusterResults,
                    scenarios
                },
                completedSteps: completedCount,
                totalSteps: steps.length
            };

        } catch (error) {
            setAnalysisError(error.message);
            throw error;
        } finally {
            setIsAnalyzing(false);
        }
    }, [
        originalData,
        analyzeDataQuality,
        generateSynthetic,
        applyFuzzyAnalysis,
        performClusterAnalysis,
        generateAnalysisScenarios,
        datasetAnalysis,
        syntheticData,
        fuzzyResults,
        clusterResults,
        scenarios
    ]);

    /**
     * Վերլուծության վիճակագրություն
     */
    const getAnalysisStatistics = useCallback(() => {
        const stats = {
            originalDataCount: originalData?.length || 0,
            syntheticDataCount: syntheticData?.length || 0,
            totalDataCount: (originalData?.length || 0) + (syntheticData?.length || 0),
            dataQuality: null,
            confidenceLevel: null,
            clusterCount: clusterResults?.length || 0,
            scenarioCount: scenarios?.length || 0,
            completedSteps: completedSteps.size,
            isComplete: completedSteps.has('dataQuality')
        };

        // Տվյալների որակ
        if (datasetAnalysis && !datasetAnalysis.isEmpty) {
            stats.dataQuality = Math.round(datasetAnalysis.overallQuality || 0);
        }

        // Վստահության մակարդակ
        if (fuzzyResults) {
            stats.confidenceLevel = fuzzyResults.high;
        }

        return stats;
    }, [originalData, syntheticData, datasetAnalysis, fuzzyResults, clusterResults, scenarios, completedSteps]);

    /**
     * Վերլուծության ամփոփում
     */
    const getAnalysisSummary = useCallback(() => {
        if (!datasetAnalysis) {
            return 'Վերլուծությունը դեռ չի սկսվել';
        }

        return formatAnalysisFeedback(datasetAnalysis);
    }, [datasetAnalysis]);

    /**
     * Տվյալների և դրա տեսակի թարմացում
     */
    const updateData = useCallback((newData, newDataType = null) => {
        setOriginalData(newData);
        if (newDataType) {
            setCurrentDataType(newDataType);
        }

        // Վիճակի զրոյացում
        setDatasetAnalysis(null);
        setSyntheticData(null);
        setFuzzyResults(null);
        setClusterResults(null);
        setScenarios(null);
        setCompletedSteps(new Set());
        setAnalysisProgress(0);
        setCurrentStep('');
        setAnalysisError(null);
    }, []);

    /**
     * Վիճակի վերականգնում
     */
    const resetAnalysis = useCallback(() => {
        setDatasetAnalysis(null);
        setSyntheticData(null);
        setFuzzyResults(null);
        setClusterResults(null);
        setScenarios(null);
        setCompletedSteps(new Set());
        setAnalysisProgress(0);
        setCurrentStep('');
        setAnalysisError(null);
        setIsAnalyzing(false);
    }, []);

    /**
     * Քայլի կարգավիճակի ստուգում
     */
    const isStepCompleted = useCallback((stepName) => {
        return completedSteps.has(stepName);
    }, [completedSteps]);

    /**
     * Քայլի ավարտման տոկոս
     */
    const getCompletionPercentage = useCallback(() => {
        const totalPossibleSteps = 5; // data quality, synthetic, fuzzy, clustering, scenarios
        return Math.round((completedSteps.size / totalPossibleSteps) * 100);
    }, [completedSteps]);

    // Տվյալների փոփոխության ժամանակ վերականգնում
    useEffect(() => {
        if (initialData !== originalData) {
            setOriginalData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        if (dataType !== currentDataType) {
            setCurrentDataType(dataType);
        }
    }, [dataType]);

    return {
        // Վիճակ
        originalData,
        currentDataType,
        isAnalyzing,
        analysisError,
        analysisProgress,
        currentStep,
        completedSteps,

        // Արդյունքներ
        datasetAnalysis,
        syntheticData,
        fuzzyResults,
        clusterResults,
        scenarios,

        // Գործողություններ
        analyzeDataQuality,
        generateSynthetic,
        applyFuzzyAnalysis,
        performClusterAnalysis,
        generateAnalysisScenarios,
        runCompleteAnalysis,
        updateData,
        resetAnalysis,

        // Օգնական ֆունկցիաներ
        getAnalysisStatistics,
        getAnalysisSummary,
        isStepCompleted,
        getCompletionPercentage
    };
};

/**
 * Օգնական ուշացման ֆունկցիա
 * @param {number} ms - Միլիվայրկյան
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));