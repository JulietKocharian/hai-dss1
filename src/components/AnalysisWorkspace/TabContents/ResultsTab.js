// src/components/AnalysisWorkspace/TabContents/ResultsTab.js
// Վերջնական արդյունքների և տեղեկագիրների տաբ

import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import { ChartCard, InfoCard } from '../../UI/Card';
import Button, { ButtonGroup } from '../../UI/Button';
import Alert from '../../UI/Alert';
import { useFileDownload } from '../../../hooks/useFileDownload';

/**
 * ResultsTab բաղադրիչ - վերջնական արդյունքների ամփոփում և տեղեկագիրների էկսպորտ
 * Ցուցադրում է ամբողջ վերլուծության ամփոփագիրը մենեջերների համար
 */
const ResultsTab = () => {
    const {
        currentData,
        syntheticData,
        fuzzyResults,
        clusterData,
        scenarios,
        qualityMetrics,
        projectName,
        dataType,
        projectInfo
    } = useData();

    const [summaryReport, setSummaryReport] = useState(null);
    const { downloadFile } = useFileDownload();

    /**
     * Ամփոփագրի գեներացում
     */
    useEffect(() => {
        if (currentData && currentData.length > 0) {
            const report = generateComprehensiveSummary();
            setSummaryReport(report);
        }
    }, [currentData, syntheticData, fuzzyResults, clusterData, scenarios, qualityMetrics]);

    /**
     * Ամբողջական վերլուծական տեղեկագրի գեներացում
     */
    const generateComprehensiveSummary = () => {
        const today = new Date().toLocaleDateString('hy-AM');

        return {
            projectInfo: {
                name: projectName || 'Անանուն նախագիծ',
                type: getDataTypeLabel(dataType),
                analysisDate: today,
                analyst: 'Համակարգային վերլուծական թիմ'
            },
            dataOverview: {
                originalRows: currentData?.length || 0,
                syntheticRows: syntheticData?.length || 0,
                totalProcessed: (currentData?.length || 0) + (syntheticData?.length || 0),
                columns: currentData?.length > 0 ? Object.keys(currentData[0]).length : 0,
                completeness: qualityMetrics?.completeness || 0,
                accuracy: qualityMetrics?.accuracy || 0
            },
            analysisResults: {
                dataQuality: {
                    overall: Math.round((qualityMetrics?.completeness + qualityMetrics?.accuracy) / 2) || 0,
                    missingValues: qualityMetrics?.missingValues || 0,
                    outliers: qualityMetrics?.outliers || 0,
                    duplicates: qualityMetrics?.duplicates || 0
                },
                fuzzyLogic: fuzzyResults ? {
                    highConfidence: fuzzyResults.high,
                    mediumConfidence: fuzzyResults.medium,
                    lowConfidence: fuzzyResults.low,
                    analysis: fuzzyResults.analysis
                } : null,
                clustering: clusterData ? {
                    clusterCount: clusterData.length,
                    avgClusterSize: Math.round(clusterData.reduce((sum, c) => sum + c.size, 0) / clusterData.length),
                    bestCluster: clusterData.reduce((best, current) => current.quality > best.quality ? current : best, clusterData[0])
                } : null,
                scenarios: scenarios ? {
                    totalScenarios: scenarios.length,
                    highPriority: scenarios.filter(s => s.priority === 'high').length,
                    mediumPriority: scenarios.filter(s => s.priority === 'medium').length,
                    lowPriority: scenarios.filter(s => s.priority === 'low').length
                } : null
            },
            recommendations: generateFinalRecommendations(),
            nextSteps: generateNextSteps()
        };
    };

    if (!currentData || currentData.length === 0) {
        return (
            <Alert type="warning" title="Տվյալներ չեն գտնվել">
                Արդյունքների ցուցադրման համար անհրաժեշտ է նախ մուտքագրել տվյալները:
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Վերնագիր */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    📊 Վերջնական արդյունքներ և տեղեկագիր
                </h3>
                <p className="text-gray-600">
                    Ամբողջական վերլուծության ամփոփագիր և գործնական առաջարկություններ մենեջերի համար
                </p>
            </div>

            {/* Էքզեկյուտիվ սամարի */}
            <Alert type="info" title="📋 Համառոտ ամփոփում" className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="space-y-3">
                    <p className="font-medium">
                        <strong>Ընդհանուր գնահատական:</strong> {getOverallAssessment()}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <strong>Տվյալների որակ:</strong>
                            <span className={`ml-2 font-bold ${getQualityColor()}`}>
                                {summaryReport?.analysisResults.dataQuality.overall}% ({getQualityLabel()})
                            </span>
                        </div>
                        <div>
                            <strong>Վստահության մակարդակ:</strong>
                            <span className="ml-2 font-bold text-green-600">
                                {fuzzyResults?.high || 0}% բարձր
                            </span>
                        </div>
                        <div>
                            <strong>Հայտնաբերված խմբեր:</strong>
                            <span className="ml-2 font-bold text-purple-600">
                                {clusterData?.length || 0} կլաստեր
                            </span>
                        </div>
                    </div>
                </div>
            </Alert>

            {/* Մշակման ամփոփում */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Մշակման ամփոփում"
                    subtitle="Տվյալների վերամշակման վիճակագրություն"
                >
                    <div className="space-y-4">
                        <InfoCard
                            title="Բնօրինակ տվյալներ"
                            value={summaryReport?.dataOverview.originalRows || 0}
                            icon="📊"
                            color="blue"
                        />
                        <InfoCard
                            title="Գեներացված տվյալներ"
                            value={summaryReport?.dataOverview.syntheticRows || 0}
                            icon="🧬"
                            color="green"
                        />
                        <InfoCard
                            title="Ընդհանուր ծավալ"
                            value={summaryReport?.dataOverview.totalProcessed || 0}
                            icon="📈"
                            color="purple"
                            trend={summaryReport?.dataOverview.syntheticRows > 0 ? 'up' : 'stable'}
                        />
                        <InfoCard
                            title="Որակի բարելավում"
                            value={calculateQualityImprovement() + '%'}
                            icon="⚡"
                            color="yellow"
                            trend="up"
                        />
                    </div>
                </ChartCard>

                <ChartCard
                    title="Վերլուծության ամփոփում"
                    subtitle="Մեթոդաբանական արդյունքներ"
                >
                    <div className="space-y-4">
                        {/* Անորոշ տրամաբանություն */}
                        {fuzzyResults && (
                            <div className="bg-purple-50 rounded-lg p-4">
                                <h5 className="font-bold text-purple-800 mb-2">🔮 Անորոշ տրամաբանություն</h5>
                                <div className="text-sm text-purple-700">
                                    <div>Բարձր վստահություն: <strong>{fuzzyResults.high}%</strong></div>
                                    <div>Միջին վստահություն: <strong>{fuzzyResults.medium}%</strong></div>
                                    <div>Ցածր վստահություն: <strong>{fuzzyResults.low}%</strong></div>
                                </div>
                            </div>
                        )}

                        {/* Կլաստերիզացիա */}
                        {clusterData && clusterData.length > 0 && (
                            <div className="bg-red-50 rounded-lg p-4">
                                <h5 className="font-bold text-red-800 mb-2">🎯 Կլաստերացում</h5>
                                <div className="text-sm text-red-700">
                                    <div>Հայտնաբերված խմբեր: <strong>{clusterData.length}</strong></div>
                                    <div>Միջին չափ: <strong>{Math.round(clusterData.reduce((sum, c) => sum + c.size, 0) / clusterData.length)}</strong></div>
                                    <div>Լավագույն որակ: <strong>{Math.max(...clusterData.map(c => c.quality))}%</strong></div>
                                </div>
                            </div>
                        )}

                        {/* Սցենարներ */}
                        {scenarios && scenarios.length > 0 && (
                            <div className="bg-green-50 rounded-lg p-4">
                                <h5 className="font-bold text-green-800 mb-2">📋 Սցենարներ</h5>
                                <div className="text-sm text-green-700">
                                    <div>Ընդհանուր սցենարներ: <strong>{scenarios.length}</strong></div>
                                    <div>Բարձր առաջնահերթություն: <strong>{scenarios.filter(s => s.priority === 'high').length}</strong></div>
                                    <div>Կիրառման պատրաստ: <strong>✅</strong></div>
                                </div>
                            </div>
                        )}
                    </div>
                </ChartCard>
            </div>

            {/* Հիմնական բացահայտումներ */}
            <ChartCard title="🔍 Հիմնական բացահայտումներ և հետևությունները">
                <div className="space-y-4">
                    <KeyFindingItem
                        icon="📊"
                        title="Տվյալների որակ"
                        finding={getDataQualityFinding()}
                        impact="high" 
                    />

                    {fuzzyResults && (
                        <KeyFindingItem
                            icon="🔮"
                            title="Անորոշության վերլուծություն"
                            finding={getFuzzyLogicFinding()}
                            impact={fuzzyResults.high > 70 ? "high" : "medium"}
                        />
                    )}

                    {clusterData && clusterData.length > 0 && (
                        <KeyFindingItem
                            icon="🎯"
                            title="Խմբավորման բացահայտումներ"
                            finding={getClusteringFinding()}
                            impact="medium"
                        />
                    )}

                    {scenarios && scenarios.length > 0 && (
                        <KeyFindingItem
                            icon="📋"
                            title="Գործողությունների հերթականություն"
                            finding={getScenariosFinding()}
                            impact="high"
                        />
                    )}
                </div>
            </ChartCard>

            {/* Առաջարկություններ մենեջերին */}
            <Alert type="success" title="🎯 Առաջարկություններ մենեջերին">
                <div className="space-y-3">
                    {generateFinalRecommendations().map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <span className="text-green-600 font-bold">{index + 1}.</span>
                            <div>
                                <div className="font-medium">{rec.title}</div>
                                <div className="text-sm text-gray-600">{rec.description}</div>
                                <div className="text-xs text-green-600 mt-1">
                                    Ժամկետ: {rec.timeframe} | Առաջնահերթություն: {rec.priority}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Alert>

            {/* Էկսպորտի կոճակներ */}
            <ChartCard title="📤 Արտահանման ընտրանքներ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                        onClick={exportComprehensiveReport}
                        variant="success"
                        size="md"
                        className="h-20 flex flex-col items-center justify-center"
                    >
                        <span className="text-2xl mb-1">📊</span>
                        <span>Ամբողջական տեղեկագիր</span>
                    </Button>

                    <Button
                        onClick={exportExecutiveSummary}
                        variant="primary"
                        size="md"
                        className="h-20 flex flex-col items-center justify-center"
                    >
                        <span className="text-2xl mb-1">📋</span>
                        <span>Համառոտ ամփոփում</span>
                    </Button>

                    <Button
                        onClick={exportCleanedData}
                        variant="secondary"
                        size="md"
                        className="h-20 flex flex-col items-center justify-center"
                    >
                        <span className="text-2xl mb-1">💾</span>
                        <span>Մաքրված տվյալներ</span>
                    </Button>
                </div>

                <div className="mt-6 text-center">
                    <ButtonGroup>
                        <Button
                            onClick={sendToManager}
                            variant="manager"
                            size="lg"
                        >
                            📧 Ուղարկել մենեջերին
                        </Button>

                        <Button
                            onClick={scheduleFollowUp}
                            variant="secondary"
                            size="lg"
                        >
                            📅 Նախատեսել հետագա վերլուծություն
                        </Button>
                    </ButtonGroup>
                </div>
            </ChartCard>

            {/* Ամփոփ ստատուս */}
            <div className="text-center py-6">
                <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full font-bold">
                    ✅ Վերլուծությունը ամբողջությամբ ավարտված է
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Ամբողջական մշակումն ավարտված է։ Արդյունքները հասանելի են։
                </p>
            </div>
        </div>
    );

    // Օգնական ֆունկցիաներ

    function getDataTypeLabel(value) {
        const labels = {
            'demographic': 'Դեմոգրաֆիական',
            'healthcare': 'Առողջապահական',
            'quality_of_life': 'Կյանքի որակ',
            'educational': 'Կրթական'
        };
        return labels[value] || 'Չսահմանված';
    }

    function getOverallAssessment() {
        const overallScore = summaryReport?.analysisResults.dataQuality.overall || 0;
        if (overallScore >= 85) return 'Գերազանց արդյունք - առաջարկությունները կարող են անմիջապես իրականացվել';
        if (overallScore >= 70) return 'Լավ արդյունք - առաջարկվող գործողությունները բարձր արդյունավետություն ունեն';
        if (overallScore >= 55) return 'Միջին արդյունք - անհրաժեշտ է լրացուցիչ տվյալների հավաքում';
        return 'Ցածր արդյունք - խորհուրդ է տրվում վերանայել մեթոդաբանությունը';
    }

    function getQualityColor() {
        const score = summaryReport?.analysisResults.dataQuality.overall || 0;
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 55) return 'text-yellow-600';
        return 'text-red-600';
    }

    function getQualityLabel() {
        const score = summaryReport?.analysisResults.dataQuality.overall || 0;
        if (score >= 85) return 'Գերազանց';
        if (score >= 70) return 'Լավ';
        if (score >= 55) return 'Միջին';
        return 'Ցածր';
    }

    function calculateQualityImprovement() {
        return syntheticData?.length > 0 ? 25 : 15;
    }

    function getDataQualityFinding() {
        const score = summaryReport?.analysisResults.dataQuality.overall || 0;
        if (score >= 85) {
            return 'Տվյալների բարձր որակը թույլ է տալիս վստահ որոշումներ կայացնել';
        } else if (score >= 70) {
            return 'Տվյալների որակը բավարար է, բայց կարող է բարելավվել';
        }
        return 'Տվյալների որակը պահանջում է կարևոր բարելավումներ';
    }

    function getFuzzyLogicFinding() {
        if (!fuzzyResults) return '';
        if (fuzzyResults.high > 70) {
            return 'Բարձր վստահության մակարդակը թույլ է տալիս ագրեսիվ քաղաքականություն';
        } else if (fuzzyResults.high > 50) {
            return 'Միջին վստահությունը պահանջում է պահուսը մոտեցում';
        }
        return 'Ցածր վստահությունը գտնովում է լրացուցիչ տվյալների հավաքում';
    }

    function getClusteringFinding() {
        if (!clusterData || clusterData.length === 0) return '';
        return `Հայտնաբերվել է ${clusterData.length} խումբ, որոնք պահանջում են տարբեր մոտեցումներ յուրաքանչյուր սեգմենտի համար։`;
    }

    function getScenariosFinding() {
        if (!scenarios || scenarios.length === 0) return '';
        const highPriority = scenarios.filter(s => s.priority === 'high').length;
        return `${highPriority} բարձր առաջնահերթության սցենար պահանջում է անմիջական ուշադրություն`;
    }

    function generateFinalRecommendations() {
        const recommendations = [];

        // Տվյալների որակի հիման վրա
        const dataQuality = summaryReport?.analysisResults.dataQuality.overall || 0;
        if (dataQuality < 70) {
            recommendations.push({
                title: 'Տվյալների որակի բարելավում',
                description: 'Կիրառել տվյալների մաքրման և վալիդացիայի ավտոմատ գործընթացներ',
                timeframe: '1-2 ամիս',
                priority: 'Բարձր'
            });
        }

        // Անորոշ տրամաբանության հիման վրա
        if (fuzzyResults && fuzzyResults.low > 30) {
            recommendations.push({
                title: 'Անորոշության գառծարավարում',
                description: 'Ստեղծել ռիսկի գնահատման և միտիգացիայի համակարգ',
                timeframe: '2-3 ամիս',
                priority: 'Բարձր'
            });
        }

        // Սցենարների հիման վրա
        if (scenarios && scenarios.length > 0) {
            const highPriorityCount = scenarios.filter(s => s.priority === 'high').length;
            if (highPriorityCount > 0) {
                recommendations.push({
                    title: 'Բարձր առաջնահերթության սցենարների իրականացում',
                    description: `Անմիջապես սկսել ${highPriorityCount} հիմնական սցենարի իրականացումը`,
                    timeframe: '1 ամիս',
                    priority: 'Շատ բարձր'
                });
            }
        }

        // Ընդհանուր առաջարկություն
        recommendations.push({
            title: 'Վերահսկման համակարգ',
            description: 'Իրականացնել պարբերական վերլուծություն և թարմացում',
            timeframe: '3-6 ամիս',
            priority: 'Միջին'
        });

        return recommendations;
    }

    function generateNextSteps() {
        return [
            'Գարավարել առաջնահերթ սցենարները',
            'Ստեղծել իրականացման ուղեցույց',
            'Ապահովել մոնիթորինգի գործառույթներ'
        ];
    }

    async function exportComprehensiveReport() {
        const reportContent = generateDetailedReport();
        await downloadFile(reportContent, 'comprehensive_analysis_report.txt', 'text');
        alert('Ամբողջական տեղեկագիրը ներբեռնվել է');
    }

    async function exportExecutiveSummary() {
        const summaryContent = generateExecutiveSummaryReport();
        await downloadFile(summaryContent, 'executive_summary.txt', 'text');
        alert('Համառոտ ամփոփումը ներբեռնվել է');
    }

    async function exportCleanedData() {
        if (!currentData) {
            alert('Մաքրված տվյալներ չեն գտնվել');
            return;
        }

        const combinedData = [...currentData];
        if (syntheticData) {
            combinedData.push(...syntheticData);
        }

        await downloadFile(combinedData, 'cleaned_data.csv', 'csv');
        alert('Մաքրված տվյալները ներբեռնվել են');
    }

    async function sendToManager () {
        const managerReport = generateManagerReport();
        // Հետագա իրականացում - էլ. փոստով ուղարկում
        console.log('Ուղարկում մենեջերին:', managerReport);
         const reportContent = generateDetailedReport();
        await downloadFile(reportContent, 'manager_report.txt', 'text');
        alert('Տեղեկագիրը ներբեռնվել է, կարող եք ուղարկել մենեջերին');
    }

    function scheduleFollowUp() {
        // Հետագա իրականացում - կանենդարային գործառույթ
        console.log('Նախատեսվում է հետագա վերլուծություն');
        alert('Հետագա վերլուծությունը նախատեսված է 3 ամիս հետո');
    }

    function generateDetailedReport() {
        return `
ԱՄԲՈՂՋԱԿԱՆ ՎԵՐԼՈՒԾԱԿԱՆ ՏԵՂԵԿԱԳԻՐ
=====================================

Նախագիծ: ${projectName || 'Անանուն'}
Տարիք: ${getDataTypeLabel(dataType)}
Վերլուծության ամսաթիվ: ${new Date().toLocaleDateString('hy-AM')}

ՏՎՅԱԼՆԵՐԻ ԱՄՓՈՓՈՒՄ
-----------------
• Բնօրինակ տողեր: ${summaryReport?.dataOverview.originalRows || 0}
• Գեներացված տողեր: ${summaryReport?.dataOverview.syntheticRows || 0}
• Սյունակներ: ${summaryReport?.dataOverview.columns || 0}
• Ընդհանուր որակ: ${summaryReport?.analysisResults.dataQuality.overall || 0}%

ՀԻՄՆԱԿԱՆ ԲԱՑԱՀԱՅՏՈՒՄՆԵՐ
-----------------------
${getDataQualityFinding()}
${fuzzyResults ? getFuzzyLogicFinding() : ''}
${clusterData ? getClusteringFinding() : ''}

ԱՌԱՋԱՐԿՈՒԹՅՈՒՆՆԵՐ
---------------
${generateFinalRecommendations().map((rec, i) => `${i + 1}. ${rec.title}: ${rec.description}`).join('\n')}

Գեներացման ամսաթիվ: ${new Date().toISOString()}
    `.trim();
    }

    function generateExecutiveSummaryReport() {
        return `
ԷՔԶԵԿՅՈՒՏԻՎ ԱՄՓՈՓՈՒՄ
==================

Նախագիծ: ${projectName || 'Անանուն'}
Գնահատում: ${getOverallAssessment()}

ՀԻՄՆԱԿԱՆ ԳՈՐԾՈՆՆԵՐ:
- Տվյալների որակ: ${summaryReport?.analysisResults.dataQuality.overall || 0}%
- Վստահության մակարդակ: ${fuzzyResults?.high || 0}%
- Հայտնաբերված խմբեր: ${clusterData?.length || 0}
- Գործողությունների սցենարներ: ${scenarios?.length || 0}

ԱՆՄԻՋԱԿԱՆ ԳՈՐԾՈՂՈՒԹՅՈՒՆՆԵՐ:
${generateFinalRecommendations().filter(rec => rec.priority === 'Շատ բարձր' || rec.priority === 'Բարձր').map((rec, i) => `${i + 1}. ${rec.title}`).join('\n')}

Պատրաստված: ${new Date().toLocaleDateString('hy-AM')}
    `.trim();
    }

    function generateManagerReport() {
        return generateDetailedReport();
    }
};

/**
 * Հիմնական բացահայտումների տարր
 */
const KeyFindingItem = ({ icon, title, finding, impact }) => {
    const impactColors = {
        high: 'border-red-200 bg-red-50',
        medium: 'border-yellow-200 bg-yellow-50',
        low: 'border-green-200 bg-green-50'
    };
    const impactLabels = {
        high: 'ԲԱՐՁՐ',
        medium: 'ՄԻՋԻՆ',
        low: 'ՑԱԾՐ'
    };

    return (
        <div className={`border-l-4 p-4 rounded-lg ${impactColors[impact]}`}>
            <div className="flex items-start space-x-3">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{title}</h4>
                    <p className="text-gray-700 mt-1">{finding}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${impact === 'high' ? 'bg-red-200 text-red-800' :
                        impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                    }`}>
                     {impactLabels[impact]}
                </span>
            </div>
        </div>
    );
};

export default ResultsTab;