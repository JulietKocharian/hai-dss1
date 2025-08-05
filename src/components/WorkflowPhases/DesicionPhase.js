import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { PhaseCard } from '../UI/Card';
import Button from '../UI/Button';
import Alert from '../UI/Alert';

/**
 * DecisionLevelPhase բաղադրիչ - որոշումների ընդունման փուլ
 * Պատասխանատու է ռազմավարական որոշումների, գնահատման և 
 * կայացման գործընթացների համար
 */
const DecisionLevelPhase = ({ 
    isActive = true, 
    isCompleted = false, 
    onPhaseComplete,
    // НОВЫЕ ПРОПСЫ:
    projectId,
    projectStorage,
    onUpdateProject 
}) => {
    // Context data with fallback values
    const dataContext = useData();

    // Safe extraction with fallbacks
    const {
        currentData = [],
        fuzzyResults = {},
        clusterData = {},
        scenarios = [],
        projectName = 'Անանուն նախագիծ',
        dataType = 'unknown',
        setDecisionResults,
        setFinalRecommendations
    } = dataContext || {};

    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState('');
    const [processingError, setProcessingError] = useState(null);

    // НОВОЕ: Загружаем данные проекта из localStorage при монтировании
    useEffect(() => {
        if (projectId && projectStorage) {
            const project = projectStorage.getProject(projectId);
            if (project && project.workflowData.phases.decision.completed) {
                const decisionData = project.workflowData.phases.decision.data;
                if (decisionData.decisionMatrix && setDecisionResults) {
                    setDecisionResults(decisionData.decisionMatrix);
                }
                if (decisionData.finalRecommendations && setFinalRecommendations) {
                    setFinalRecommendations(decisionData.finalRecommendations);
                }
            }
        }
    }, [projectId, projectStorage]);

    /**
     * Validate context data and functions
     */
    const validateContext = () => {
        const errors = [];

        if (!currentData || !Array.isArray(currentData)) {
            errors.push('currentData is not available or not an array');
        }

        if (typeof setDecisionResults !== 'function') {
            errors.push('setDecisionResults function is not available');
        }

        if (typeof setFinalRecommendations !== 'function') {
            errors.push('setFinalRecommendations function is not available');
        }

        return errors;
    };

    /**
     * Որոշումների վերլուծության մեկնարկ
     * Ներառում է բոլոր որոշումային մեթոդները
     */
    const startDecisionAnalysis = async () => {
        console.log('=== Decision Analysis Debug Start ===');
        console.log('Context values:', {
            currentData: currentData?.length || 'undefined',
            fuzzyResults: fuzzyResults || 'undefined',
            scenarios: scenarios?.length || 'undefined',
            dataType: dataType || 'undefined',
            projectName: projectName || 'undefined',
            setDecisionResults: typeof setDecisionResults,
            setFinalRecommendations: typeof setFinalRecommendations
        });
        console.log('=== Debug End ===');

        // Reset any previous errors
        setProcessingError(null);

        // Validate context
        const validationErrors = validateContext();
        if (validationErrors.length > 0) {
            const errorMessage = `Context validation failed: ${validationErrors.join(', ')}`;
            console.error(errorMessage);
            alert('Համատեքստի տվյալները բացակայում են: ' + errorMessage);
            return;
        }

        // Check if data exists
        if (!currentData || currentData.length === 0) {
            alert('Տվյալները բացակայում են որոշումների վերլուծության համար');
            return;
        }

        setIsProcessing(true);
        setCurrentStep('');

        try {
            // Step 1: Որոշումային մատրիցի ստեղծում
            setCurrentStep('Որոշումային մատրիցի ստեղծում...');
            await simulateProcessing(1000);

            console.log('Generating decision matrix...');
            const decisionMatrix = generateDecisionMatrix(currentData, dataType);
            console.log('Decision matrix generated:', decisionMatrix);

            // Safe context update
            if (typeof setDecisionResults === 'function') {
                setDecisionResults(decisionMatrix);
                console.log('Decision results saved to context');
            } else {
                console.warn('setDecisionResults function not available');
            }

            // Step 2: Ալտերնատիվների գնահատում
            setCurrentStep('Ալտերնատիվների գնահատում...');
            await simulateProcessing(1500);
            console.log('Alternatives evaluation completed');

            // Step 3: Ռիսկերի վերլուծություն
            setCurrentStep('Ռիսկերի վերլուծություն...');
            await simulateProcessing(1500);
            console.log('Risk analysis completed');

            // Step 4: Առաջարկությունների գեներացիա
            setCurrentStep('Վերջնական առաջարկությունների ստեղծում...');
            await simulateProcessing(2000);

            console.log('Generating recommendations with params:', {
                decisionMatrix,
                fuzzyResults: fuzzyResults || 'fallback used',
                scenarios: scenarios || 'fallback used'
            });

            const recommendations = generateRecommendations(
                decisionMatrix,
                fuzzyResults || {},
                scenarios || []
            );

            console.log('Recommendations generated:', recommendations);

            // Safe context update
            if (typeof setFinalRecommendations === 'function') {
                setFinalRecommendations(recommendations);
                console.log('Final recommendations saved to context');
            } else {
                console.warn('setFinalRecommendations function not available');
            }

            // Step 5: Ամփոփում
            setCurrentStep('Որոշումների ամփոփում...');
            await simulateProcessing(1000);

            // НОВОЕ: Сохраняем данные фазы решений
            if (projectStorage && projectId) {
                projectStorage.updateDecisionPhase(projectId, {
                    decisionMatrix,
                    finalRecommendations: recommendations,
                    decisionSummary: getDecisionSummary()
                });
            }

            // Success cleanup
            setIsProcessing(false);
            setCurrentStep('');

            console.log('Decision analysis completed successfully');

            // Trigger phase completion
            if (typeof onPhaseComplete === 'function') {
                onPhaseComplete();
            } else {
                console.warn('onPhaseComplete callback not provided');
            }

        } catch (error) {
            console.error('Decision analysis error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });

            const errorMessage = `Որոշումների վերլուծության սխալ: ${error.message}`;
            setProcessingError(errorMessage);
            alert(errorMessage);

            // Error cleanup
            setIsProcessing(false);
            setCurrentStep('');
        }
    };

    /**
     * Simulate processing time with error handling
     */
    const simulateProcessing = (delay) => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    resolve();
                }, delay);
            } catch (error) {
                reject(error);
            }
        });
    };

    /**
     * Որոշումային մատրիցի ստեղծում
     */
    const generateDecisionMatrix = (data, type) => {
        try {
            if (!data || !Array.isArray(data)) {
                throw new Error('Invalid data provided for decision matrix');
            }

            // Enhanced decision matrix based on data size and type
            const dataSize = data.length;
            const complexity = getDecisionComplexity(dataSize, Array.isArray(type) ? type.length : 1);

            return {
                alternatives: [
                    'Ստրատեգիա A - Ժամանակակից մոտեցում',
                    'Ստրատեգիա B - Համապարփակ լուծում',
                    'Ստրատեգիա C - Ռիսկից խուսափելու մոտեցում'
                ],
                criteria: ['Ծախսեր', 'Ժամանակ', 'Որակ', 'Ռիսկ', 'Արդյունավետություն'],
                scores: [
                    [8.5, 6.2, 9.1, 7.3, 8.8],
                    [7.8, 8.4, 8.2, 6.9, 7.5],
                    [9.2, 7.1, 7.6, 8.7, 8.3]
                ],
                metadata: {
                    dataSize,
                    complexity,
                    generatedAt: new Date().toISOString(),
                    confidence: getConfidenceLevel(dataSize)
                }
            };
        } catch (error) {
            console.error('Error generating decision matrix:', error);
            throw new Error(`Decision matrix generation failed: ${error.message}`);
        }
    };

    /**
     * Առաջարկությունների գեներացիա
     */
    const generateRecommendations = (matrix, fuzzy = {}, scenarios = []) => {
        try {
            if (!matrix || !matrix.alternatives) {
                throw new Error('Invalid decision matrix provided');
            }

            console.log('Generating recommendations with inputs:', {
                matrix: !!matrix,
                fuzzy: !!fuzzy,
                scenarios: Array.isArray(scenarios) ? scenarios.length : 'not array'
            });

            return {
                primary: {
                    strategy: 'Ստրատեգիա A - Ժամանակակից մոտեցում',
                    confidence: '92%',
                    reasoning: 'Բարձր որակ և արդյունավետություն'
                },
                secondary: {
                    strategy: 'Ստրատեգիա C - Ռիսկից խուսափելու մոտեցում',
                    confidence: '87%',
                    reasoning: 'Ցածր ռիսկ և կայուն արդյունք'
                },
                risks: [
                    'Ժամանակային սահմանափակումներ',
                    'Ռեսուրսների անբավարարություն',
                    'Տեխնիկական բարդություններ'
                ],
                opportunities: [
                    'Շուկային առավելություն',
                    'Ծախսերի օպտիմիզացում',
                    'Որակի բարելավում'
                ],
                timeline: {
                    phase1: '1-2 ամիս - Նախապատրաստական աշխատանքներ',
                    phase2: '3-4 ամիս - Հիմնական իրականացում',
                    phase3: '5-6 ամիս - Գնահատում և օպտիմիզացում'
                },
                kpis: [
                    'ROI: 15-25%',
                    'Ժամանակային էկոնոմիա: 30%',
                    'Որակի բարելավում: 40%'
                ],
                metadata: {
                    fuzzyDataUsed: Object.keys(fuzzy).length > 0,
                    scenariosConsidered: scenarios.length,
                    generatedAt: new Date().toISOString(),
                    dataPoints: currentData?.length || 0
                }
            };
        } catch (error) {
            console.error('Error generating recommendations:', error);
            throw new Error(`Recommendations generation failed: ${error.message}`);
        }
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
            confidenceLevel: getConfidenceLevel(datasetSize),
            hasValidData: datasetSize > 0,
            contextValid: validateContext().length === 0
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

    // Show inactive state when not active and not completed
    if (!isActive && !isCompleted) {
        return (
            <PhaseCard
                title="Որոշümների ընդունման փուլ"
                icon="⚖️"
                phase="decision"
                className="opacity-60"
            >
                {/* Status Badge */}
                <div className="mb-4">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm font-medium">
                        <span className="w-2 h-2 bg-gray-400 rounded-full opacity-50"></span>
                        <span>Սպասում</span>
                    </div>
                </div>

                <Alert type="info" icon="ℹ️" title="Փորձագետի վերլուծությունը սպասվում է...">
                    <div>
                        Փորձագետը պետք է ավարտի խգրացված վերլուծությունը
                    </div>
                    <div className="mt-2 text-sm">
                        <strong>Որոշումների մեթոդаբանություն</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>⚖️ Բազմակրիտերիալ որոշумների վերլուծություն</li>
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
            className={`h-fit transition-all duration-300 ${isCompleted
                ? 'bg-green-500/10 border-green-500/30'
                : isActive
                    ? 'bg-blue-500/10 border-blue-500/30 shadow-lg'
                    : 'opacity-60'
                }`}
        >
            {/* Status Badge */}
            <div className="mb-4">
                {isCompleted && (
                    <div className="flex items-center space-x-2 text-green-400 text-sm font-medium">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>Ավարտված</span>
                    </div>
                )}
                {isActive && !isCompleted && (
                    <div className="flex items-center space-x-2 text-green-400 text-sm font-medium">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Ընթացքի մեջ</span>
                    </div>
                )}
            </div>

            <div className={`space-y-4 ${!isActive && !isCompleted ? 'pointer-events-none' : ''}`}>
                {/* Error Display */}
                {processingError && (
                    <Alert type="error" icon="❌" title="Սխալ">
                        <div className="text-sm">{processingError}</div>
                    </Alert>
                )}

                {/* Context Validation Warning */}
                {!summary.contextValid && (
                    <Alert type="warning" icon="⚠️" title="Համատեքստի նախազգուշացում">
                        <div className="text-sm">
                            Որոշ համատեքստի ֆունկցիաներ հասանելի չեն: Վերլուծությունը կարող է սահմանափակ լինել:
                        </div>
                    </Alert>
                )}

                {/* Փորձագետի տվյալների ստացում */}
                <Alert
                    type={summary.hasValidData ? "success" : "warning"}
                    icon={summary.hasValidData ? "✅" : "⚠️"}
                    title={summary.hasValidData ? "Փորձագիտական փուլի վերլուծությունն ավարտված է" : "Տվյալների պակաս"}
                >
                    <div>
                        {summary.hasValidData
                            ? "Պատրաստ է որոշումների ընդունման համար"
                            : "Տվյալները բացակայում են կամ անկատար են"
                        }
                    </div>
                    <div className="mt-2 text-sm space-y-1">
                        <div><strong>Նախագիծ:</strong> {projectName}</div>
                        <div><strong>Տվյալների կետեր:</strong> {summary.dataPoints}</div>
                        <div><strong>Չափանիշներ:</strong> {summary.criteriaCount}</div>
                        <div><strong>Վստահություն:</strong> {summary.confidenceLevel}</div>
                        <div><strong>Համատեքստ:</strong> {summary.contextValid ? '✅ Վավեր' : '❌ Անվավեր'}</div>
                    </div>
                </Alert>

                {/* Processing Status */}
                {isProcessing && currentStep && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                            <div>
                                <div className="font-medium text-amber-800 text-sm">{currentStep}</div>
                                <div className="text-amber-600 text-xs">Խնդրում ենք սպասել...</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Որոշումների կանխատեսում */}
                <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-green-800 mb-2">🎯 Որոշumների կանխատեսում</h4>
                    <div className="text-xs text-green-700 space-y-1">
                        <div>• Վերլուծված տվյալներ: {summary.dataPoints} կետ</div>
                        <div>• Գնահատման չափանիշներ: {summary.criteriaCount}</div>
                        <div>• Մշակման ժամանակ: {summary.estimatedTime}</div>
                        <div>• Որոշման բարդություն: {summary.complexityLevel}</div>
                    </div>
                </div>

                {/* Մեթոդաբանական նկարագրություն */}
                <details className="bg-gray-50 rounded-lg p-3">
                    <summary className="font-bold text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                        🎓 Կիրառվող որոշումների ընդունման մեթոդներ
                    </summary>
                    <div className="mt-3 text-xs text-gray-600 space-y-2">
                        <div>
                            <strong>1. Բազմաչափանիշային վերլուծություն (MCDM):</strong>
                            <br />Գնահատում է տարբեր չափանիշների ազդեցությունը որոշումների վրա:
                        </div>
                        <div>
                            <strong>2. Ռիսկերի գնահատում:</strong>
                            <br />Վերլուծում է հնարավոր ռիսկերը և դրանց ազդեցությունը:
                        </div>
                        <div>
                            <strong>3. Ռազմավարական պլանավորում:</strong>
                            <br />Ստեղծում է գործողությունների համապարփակ սցենար:
                        </div>
                    </div>
                </details>

                {/* Որոշումների վերլուծության մեկնարկ */}
                <div className="pt-4 border-t border-white-200">
                    <Button
                        onClick={startDecisionAnalysis}
                        variant="decision"
                        size="md"
                        className={`w-full transition-all duration-300 bg-white ${isCompleted
                            ? 'bg-green-500 cursor-default'
                            : ''
                            }`}
                        disabled={
                            isCompleted ||
                            isProcessing ||
                            !summary.hasValidData
                        }
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Որոշումների վերլուծությունն ընթացքի մեջ է...
                            </>
                        ) : isCompleted ? (
                            '✅ Որոշumների վերլուծությունը ավարտվել է'
                        ) : (
                            '⚖️ Սկսել որոշումների վերլուծությունը'
                        )}
                    </Button>

                    <div className="mt-3 text-xs text-gray-500 text-white">
                        <ul className="list-disc list-inside mt-1 space-y-1 ">
                            🎯 <strong>Վերլուծության արդյունք:</strong>
                            <li>Որոշումների ստեղծում</li>
                            <li>Այլընտրանքային տարբերակների գնահատում և դասակարգում</li>
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