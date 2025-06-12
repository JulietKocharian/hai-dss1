import React from 'react';
import { useData } from '../../context/DataContext';
import { PhaseCard } from '../UI/Card';
import Button from '../UI/Button';
import Alert from '../UI/Alert';

/**
 * DecisionLevelPhase բաղադրիչ - որոշումների ընդունման փուլ
 * Պատասխանատու է ռազմավարական որոշումների, գնահատման և 
 * կայացման գործընթացների համար
 */
const DecisionLevelPhase = () => {
    const {
        decisionActive,
        currentData,
        fuzzyResults,
        clusterData,
        scenarios,
        projectName,
        dataType,
        setDecisionResults,
        setFinalRecommendations
    } = useData();

    /**
     * Որոշումների վերլուծության մեկնարկ
     * Ներառում է բոլոր որոշումային մեթոդները
     */
    const startDecisionAnalysis = () => {
        if (!currentData || currentData.length === 0) {
            alert('Տվյալները բացակայում են որոշումների վերլուծության համար');
            return;
        }

        // Որոշումային մատրիցի ստեղծում
        setTimeout(() => {
            const decisionMatrix = generateDecisionMatrix(currentData, dataType);
            setDecisionResults(decisionMatrix);
            console.log('Որոշումային մատրից:', decisionMatrix);

            // Առաջարկությունների գեներացիա
            setTimeout(() => {
                const recommendations = generateRecommendations(decisionMatrix, fuzzyResults, scenarios);
                setFinalRecommendations(recommendations);
                console.log('Վերջնական առաջարկություններ:', recommendations);
            }, 2000);
        }, 1000);
    };

    /**
     * Որոշումային մատրիցի ստեղծում
     */
    const generateDecisionMatrix = (data, type) => {
        // Մոկ իմպլեմենտացիա
        return {
            alternatives: ['Ալտերնատիվ A', 'Ալտերնատիվ B', 'Ալտերնատիվ C'],
            criteria: ['Ծախսեր', 'Ժամանակ', 'Որակ', 'Ռիսկ'],
            scores: [[8, 6, 9, 7], [7, 8, 8, 6], [9, 7, 7, 8]]
        };
    };

    /**
     * Առաջարկությունների գեներացիա
     */
    const generateRecommendations = (matrix, fuzzy, scenarios) => {
        return {
            primary: 'Առաջնային ռազմավարություն',
            secondary: 'Երկրորդական ապահովագրություն',
            risks: ['Ռիսկ 1', 'Ռիսկ 2'],
            timeline: '3-6 ամիս'
        };
    };

    /**
     * Որոշումների փուլի ամփոփում
     */
    const getDecisionSummary = () => {
        const datasetSize = currentData?.length || 0;
        const criteriaCount = Array.isArray(dataType) ? dataType.length : 1;
        const complexityLevel = getDecisionComplexity(datasetSize, criteriaCount);

        return {
            dataPoints: datasetSize,
            criteriaCount,
            complexityLevel,
            estimatedTime: getDecisionTime(datasetSize),
            confidenceLevel: getConfidenceLevel(datasetSize)
        };
    };

    /**
     * Որոշումների բարդության գնահատում
     */
    const getDecisionComplexity = (size, criteria) => {
        const complexityScore = size * criteria;
        if (complexityScore < 500) return 'Պարզ';
        if (complexityScore < 2000) return 'Միջին';
        if (complexityScore < 10000) return 'Բարդ';
        return 'Շատ բարդ';
    };

    /**
     * Որոշման ժամանակի գնահատում
     */
    const getDecisionTime = (size) => {
        const baseTime = Math.ceil(size / 200) * 3;
        return `${baseTime}-${baseTime + 3} վայրկյան`;
    };

    /**
     * Վստահության մակարդակի գնահատում
     */
    const getConfidenceLevel = (size) => {
        if (size < 100) return '75%';
        if (size < 500) return '85%';
        if (size < 1000) return '92%';
        return '96%';
    };

    // Որոշումների փուլի պայմանական ռենդերինգ
    if (!decisionActive) {
        return (
            <PhaseCard
                title="Որոշումների ընդունման փուլ"
                icon="⚖️"
                phase="decision"
            >
                <Alert type="info" icon="ℹ️" title="Փորձագետի վերլուծությունը սպասվում է...">
                    <div>
                        Փորձագետը պետք է ավարտի խորացված վերլուծությունը
                    </div>
                    <div className="mt-2 text-sm">
                        <strong>Որոշումների մեթոդաբանություն</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>⚖️ Բազմակրիտերիալ որոշումների վերլուծություն</li>
                            <li>📊 Ռիսկերի գնահատում և կառավարում</li>
                            <li>🎯 Ռազմավարական ծրագրավորում</li>
                            <li>📈 Արդյունավետության գնահատում</li>
                            <li>📋 Գործողությունների պլանավորում</li>
                        </ul>
                    </div>
                </Alert>
            </PhaseCard>
        );
    }

    const summary = getDecisionSummary();

    return (
        <PhaseCard
            title="Որոշումների ընդունման փուլ"
            icon="⚖️"
            phase="decision"
            active={true}
        >
            <div className="space-y-4">
                {/* Փորձագետի տվյալների ստացում */}
                <Alert type="success" icon="✅" title="Փորձագետի վերլուծությունը ավարտված է">
                    <div>
                        Պատրաստ է որոշումների ընդունման համար
                    </div>
                    <div className="mt-2 text-sm space-y-1">
                        <div><strong>Նախագիծ:</strong> {projectName}</div>
                        <div><strong>Տվյալների կետեր:</strong> {summary.dataPoints} հատ</div>
                        <div><strong>Չափանիշներ:</strong> {summary.criteriaCount} հատ</div>
                        <div><strong>Վստահություն:</strong> {summary.confidenceLevel}</div>
                    </div>
                </Alert>

                {/* Որոշումների գործիքակազմ */}
                <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-amber-800 mb-2">⚖️ Որոշումների գործիքակազմ</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white rounded p-2 shadow-sm">
                            <div className="font-bold text-amber-700">📊 AHP Method</div>
                            <div className="text-amber-600">Աղյուսակավոր հիերարխիա</div>
                        </div>
                        <div className="bg-white rounded p-2 shadow-sm">
                            <div className="font-bold text-amber-700">⚖️ TOPSIS</div>
                            <div className="text-amber-600">Օպտիմալ լուծումների ընտրություն</div>
                        </div>
                        <div className="bg-white rounded p-2 shadow-sm">
                            <div className="font-bold text-amber-700">🎯 Risk Assessment</div>
                            <div className="text-amber-600">Ռիսկերի գնահատում</div>
                        </div>
                        <div className="bg-white rounded p-2 shadow-sm">
                            <div className="font-bold text-amber-700">📈 ROI Analysis</div>
                            <div className="text-amber-600">Ներդրումների արդյունավետություն</div>
                        </div>
                    </div>
                </div>

                {/* Որոշումների կանխատեսում */}
                <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-green-800 mb-2">🎯 Որոշումների կանխատեսում</h4>
                    <div className="text-xs text-green-700 space-y-1">
                        <div>• Վերլուծված տվյալներ: {summary.dataPoints} կետ</div>
                        <div>• Գնահատման չափանիշներ: {summary.criteriaCount} հատ</div>
                        <div>• Մշակման ժամանակ: {summary.estimatedTime}</div>
                        <div>• Որոշման բարդություն: {summary.complexityLevel}</div>
                        <div>• Վստահության մակարդակ: {summary.confidenceLevel}</div>
                    </div>
                </div>

                {/* Մեթոդաբանական նկարագրություն */}
                <details className="bg-gray-50 rounded-lg p-3">
                    <summary className="font-bold text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                        🎓 Կիրառվող որոշումային մեթոդներ
                    </summary>
                    <div className="mt-3 text-xs text-gray-600 space-y-2">
                        <div>
                            <strong>1. Բազմակրիտերիալ վերլուծություն (MCDM):</strong>
                            <br />Գնահատում է տարբեր չափանիշների ազդեցությունը որոշումների վրա:
                        </div>
                        <div>
                            <strong>2. Ռիսկերի գնահատում:</strong>
                            <br />Վերլուծում է հնարավոր ռիսկերը և դրանց ազդեցությունը:
                        </div>
                        <div>
                            <strong>3. Ռազմավարական պլանավորում:</strong>
                            <br />Ստեղծում է գործողությունների համապարփակ ծրագիր:
                        </div>
                    </div>
                </details>

                {/* Որոշումների վերլուծության մեկնարկ */}
                <div className="pt-4 border-t border-gray-200">
                    <Button
                        onClick={startDecisionAnalysis}
                        variant="decision"
                        size="md"
                        className="w-full"
                    >
                        ⚖️ Սկսել որոշումների վերլուծությունը
                    </Button>

                    <div className="mt-3 text-xs text-gray-500">
                        🎯 <strong>Վերլուծության արդյունք:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Որոշումային մատրիցի ստեղծում</li>
                            <li>Ալտերնատիվների գնահատում և դասակարգում</li>
                            <li>Ռիսկերի վերլուծություն և կառավարման ծրագիր</li>
                            <li>Մենեջերի համար գործողությունների ծրագիր</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PhaseCard>
    );
};

export default DecisionLevelPhase;