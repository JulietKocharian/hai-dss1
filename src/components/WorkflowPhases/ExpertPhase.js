// src/components/WorkflowPhases/ExpertPhase.js
// Փորձագետի փուլի բաղադրիչ - խորացված վերլուծություն և սցենարային մոդելավորում

import React from 'react';
import { useData } from '../../context/DataContext';
import { PhaseCard } from '../UI/Card';
import Button from '../UI/Button';
import Alert from '../UI/Alert';
import { applyFuzzyLogic } from '../../utils/fuzzyLogic';
import { performClustering } from '../../utils/clustering';
import { generateScenarios } from '../../utils/scenarios';

/**
 * ExpertPhase բաղադրիչ - փորձագետի աշխատանքային փուլ
 * Պատասխանատու է խորացված վերլուծության, անորոշ տրամաբանության, 
 * կլաստերիզացիայի և սցենարային մոդելավորման համար
 */
const ExpertPhase = () => {
    const {
        expertActive,
        currentData,
        syntheticData,
        projectName,
        dataType,
        setFuzzyResults,
        setClusterData,
        setScenarios
    } = useData();

    /**
     * Փորձագետի վերլուծության մեկնարկ
     * Ներառում է բոլոր խորացված վերլուծական մեթոդները
     */
    const startExpertAnalysis = () => {
        if (!currentData || currentData.length === 0) {
            alert('Տվյալները բացակայում են փորձագետի վերլուծության համար');
            return;
        }

        // Անորոշ տրամաբանության կիրառում
        setTimeout(() => {
            const fuzzyAnalysis = applyFuzzyLogic(currentData, dataType);
            setFuzzyResults(fuzzyAnalysis);
            console.log('Անորոշ տրամաբանության վերլուծություն:', fuzzyAnalysis);

            // Կլաստերիզացիա
            setTimeout(() => {
                const clusters = performClustering(currentData, dataType);
                setClusterData(clusters);
                console.log('Կլաստերիզացիայի արդյունք:', clusters);

                // Սցենարների գեներացիա
                setTimeout(() => {
                    const generatedScenarios = generateScenarios(dataType, fuzzyAnalysis, clusters);
                    setScenarios(generatedScenarios);
                    console.log('Սցենարների գեներացիա:', generatedScenarios);
                }, 2000);
            }, 2000);
        }, 1000);
    };

    /**
     * Փորձագետի վիճակագրական ամփոփում
     */
    const getExpertSummary = () => {
        const datasetSize = currentData?.length || 0;
        const syntheticSize = syntheticData?.length || 0;
        const totalProcessed = datasetSize + syntheticSize;

        return {
            originalDataset: datasetSize,
            syntheticDataset: syntheticSize,
            totalProcessed,
            analysisComplexity: getAnalysisComplexity(datasetSize),
            estimatedTime: getEstimatedProcessingTime(totalProcessed)
        };
    };

    /**
     * Վերլուծության բարդության գնահատում
     */
    const getAnalysisComplexity = (size) => {
        if (size < 100) return 'Պարզ';
        if (size < 1000) return 'Միջին';
        if (size < 10000) return 'Բարդ';
        return 'Շատ բարդ';
    };

    /**
     * Մշակման ժամանակի գնահատում
     */
    const getEstimatedProcessingTime = (size) => {
        const baseTime = Math.ceil(size / 100) * 2; // 2 վայրկյան ամեն 100 տողի համար
        return `${baseTime}-${baseTime + 5} վայրկյան`;
    };

    // Փորձագետի փուլի պայմանական ռենդերինգ
    if (!expertActive) {
        return (
            <PhaseCard
                title="Փորձագետի փուլ"
                icon="🧠"
                phase="expert"
            >
                <Alert type="info" icon="ℹ️" title="Վերլուծությունը մշակվում է...">
                    <div>
                        Վերլուծաբանը պետք է ավարտի տվյալների մշակումը
                    </div>
                    <div className="mt-2 text-sm">
                        <strong>Փորձագետի մեթոդաբանություն</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>🔮 Անորոշ տրամաբանության կիրառում</li>
                            <li>🎯 Խելացի կլաստերացում</li>
                            <li>📊 Գծապատկերային վերլուծություն</li>
                            <li>🎲 Կանխատեսման մոդելներ</li>
                            <li>📋 Որոշումների սցենարների գեներացում</li>
                        </ul>
                    </div>
                </Alert>
            </PhaseCard>
        );
    }

    const summary = getExpertSummary();

    return (
        <PhaseCard
            title="Փորձագետի փուլ"
            icon="🧠"
            phase="expert"
            active={true}
        >
            <div className="space-y-4">
                {/* Ստացված վերլուծության ինֆորմացիա */}
                <Alert type="success" icon="✅" title="Վերլուծաբանի տվյալները պատրաստ են">
                    <div>
                        Պատրաստ է փորձագետի խորացված վերլուծության համար
                    </div>
                    <div className="mt-2 text-sm space-y-1">
                        <div><strong>Նախագիծ:</strong> {projectName}</div>
                        <div><strong>Տվյալների ծավալ:</strong> {summary.totalProcessed} տող</div>
                        <div><strong>Բարդություն:</strong> {summary.analysisComplexity}</div>
                    </div>
                </Alert>

                {/* Փորձագետի վերլուծական գործիքակազմ */}
                <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-purple-800 mb-2">🧠 Փորձագետի գործիքակազմ</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white rounded p-2 shadow-sm">
                            <div className="font-bold text-purple-700">🔮 Fuzzy Logic</div>
                            <div className="text-purple-600">Անորոշության մոդելավորում</div>
                        </div>
                        <div className="bg-white rounded p-2 shadow-sm">
                            <div className="font-bold text-purple-700">🎯 K-Means++</div>
                            <div className="text-purple-600">Օպտիմալ կլաստերիզացիա</div>
                        </div>
                        <div className="bg-white rounded p-2 shadow-sm">
                            <div className="font-bold text-purple-700">📊 Statistical Analysis</div>
                            <div className="text-purple-600">Խորացված ստատիստիկա</div>
                        </div>
                        <div className="bg-white rounded p-2 shadow-sm">
                            <div className="font-bold text-purple-700">📋 Scenario Planning</div>
                            <div className="text-purple-600">Ռազմավարական սցենարներ</div>
                        </div>
                    </div>
                </div>

                {/* Մշակման կանխատեսում */}
                <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-indigo-800 mb-2">⏱️ Մշակման կանխատեսում</h4>
                    <div className="text-xs text-indigo-700 space-y-1">
                        <div>• Բնօրինակ տվյալներ: {summary.originalDataset} տող</div>
                        <div>• Սինթետիկ տվյալներ: {summary.syntheticDataset} տող</div>
                        <div>• Գնահատված ժամանակ: {summary.estimatedTime}</div>
                        <div>• Վերլուծության բարդություն: {summary.analysisComplexity}</div>
                    </div>
                </div>

                {/* Մեթոդաբանական նկարագրություն */}
                <details className="bg-gray-50 rounded-lg p-3">
                    <summary className="font-bold text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                        📚 Կիրառվող մեթոդաբանություն
                    </summary>
                    <div className="mt-3 text-xs text-gray-600 space-y-2">
                        <div>
                            <strong>1. Անորոշ տրամաբանություն (Fuzzy Logic):</strong>
                            <br />Մշակում է տվյալների անորոշությունը և վստահության մակարդակները:
                        </div>
                        <div>
                            <strong>2. Կլաստերիզացիա (K-Means++):</strong>
                            <br />Բացահայտում է թաքնված օրինաչափությունները և խմբավորումները:
                        </div>
                        <div>
                            <strong>3. Սցենարային մոդելավորում:</strong>
                            <br />Ստեղծում է գործնական որոշումային սցենարներ մենեջերի համար:
                        </div>
                    </div>
                </details>

                {/* Փորձագետի վերլուծության մեկնարկ */}
                <div className="pt-4 border-t border-gray-200">
                    <Button
                        onClick={startExpertAnalysis}
                        variant="expert"
                        size="md"
                        className="w-full"
                    >
                        🧠 Սկսել փորձագետի վերլուծությունը
                    </Button>

                    <div className="mt-3 text-xs text-gray-500">
                        🎯 <strong>Վերլուծության արդյունք:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Անորոշության մակարդակների գնահատում</li>
                            <li>Տվյալների խմբավորման օպտիմիզացիա</li>
                            <li>Որոշումային սցենարների ավտոմատ գեներացիա</li>
                            <li>Մենեջերի համար գործնական առաջարկություններ</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PhaseCard>
    );
};

export default ExpertPhase;