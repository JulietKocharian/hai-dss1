// src/components/WorkflowPhases/AnalystPhase.js
// Վերլուծաբանի փուլի բաղադրիչ - տվյալների մշակում և վերլուծություն

import React from 'react';
import { useData } from '../../context/DataContext';
import { PhaseCard } from '../UI/Card';
import Button from '../UI/Button';
import Alert from '../UI/Alert';
import { getDataTypeLabel } from '../../utils/dataHelpers';

/**
 * AnalystPhase բաղադրիչ - վերլուծաբանի աշխատանքային փուլ
 * Պատասխանատու է տվյալների որակի գնահատման և առաջնային վերլուծության համար
 */
const AnalystPhase = () => {
    const {
        analystActive,
        currentData,
        projectName,
        dataType,
        setAnalysisWorkspace,
        setQualityMetrics
    } = useData();

    /**
     * Տվյալների վերլուծության սկիզբ
     * Որակի մետրիկների հաշվարկ և վերլուծական տարածքի ակտիվացում
     */
    const startAnalysis = () => {
        if (!currentData || currentData.length === 0) {
            alert('Տվյալները բացակայում են վերլուծության համար');
            return;
        }

        // Վերլուծական տարածքի ցուցադրում
        setAnalysisWorkspace(true);

        // Տվյալների որակի գնահատման սիմուլյացիա
        setTimeout(() => {
            const qualityAnalysis = analyzeDataQuality(currentData);
            setQualityMetrics(qualityAnalysis);

            console.log('Տվյալների որակի վերլուծություն ավարտված:', qualityAnalysis);
        }, 1000);
    };

    /**
     * Տվյալների որակի գնահատման ալգորիթմ
     * @param {Array} data - Վերլուծելիք տվյալներ
     * @returns {Object} Որակի մետրիկներ
     */
    const analyzeDataQuality = (data) => {
        if (!data || data.length === 0) {
            return {
                completeness: 0,
                accuracy: 0,
                missingValues: 0,
                outliers: 0,
                duplicates: 0
            };
        }

        const headers = Object.keys(data[0]);
        let totalCells = 0;
        let missingCells = 0;
        let duplicateRows = 0;
        let outlierCount = 0;

        // Բացակայող արժեքների հաշվարկ
        data.forEach(row => {
            headers.forEach(header => {
                totalCells++;
                const value = row[header];
                if (value === null || value === undefined || value === '' || value === 'null') {
                    missingCells++;
                }
            });
        });

        // Կրկնակի տողերի գտնում
        const seen = new Set();
        data.forEach(row => {
            const rowString = JSON.stringify(row);
            if (seen.has(rowString)) {
                duplicateRows++;
            } else {
                seen.add(rowString);
            }
        });

        // Նմանակման ալգորիթմ ոչ ստանդարտ արժեքների համար
        const numericColumns = headers.filter(header => {
            return data.some(row => {
                const value = row[header];
                return value !== null && !isNaN(parseFloat(value));
            });
        });

        numericColumns.forEach(header => {
            const values = data
                .map(row => parseFloat(row[header]))
                .filter(val => !isNaN(val));

            if (values.length > 0) {
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
                const stdDev = Math.sqrt(variance);

                // Z-score մեթոդով ոչ ստանդարտ արժեքների գտնում
                values.forEach(val => {
                    const zScore = Math.abs((val - mean) / stdDev);
                    if (zScore > 2.5) { // 2.5 ստանդարտ շեղման սահման
                        outlierCount++;
                    }
                });
            }
        });

        // Որակի մետրիկների հաշվարկ
        const completeness = Math.max(0, Math.min(100, ((totalCells - missingCells) / totalCells) * 100));
        const accuracy = Math.max(0, Math.min(100,
            ((totalCells - missingCells - outlierCount) / totalCells) * 100
        ));

        return {
            completeness: Math.round(completeness),
            accuracy: Math.round(accuracy),
            missingValues: missingCells,
            outliers: outlierCount,
            duplicates: duplicateRows
        };
    };

    // Վերլուծաբանի փուլի պայմանական ռենդերինգ
    if (!analystActive) {
        return (
            <PhaseCard
                title="Վերլուծաբանի փուլ"
                icon="🔬"
                phase="analyst"
            >
                <Alert type="info" icon="ℹ️" title="Տվյալները բեռնվում են...">
                    <div>
                        Մենեջերը պետք է մուտքագրի վերլուծության համար անհրաժեշտ տվյալները
                    </div>
                    <div className="mt-2 text-sm">
                        <strong>Վերլուծաբանի գործառույթները</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Տվյալների որակի գնահատում</li>
                            <li>Բացակայող արժեքների հայտնաբերում</li>
                            <li>Ոչ ստանդարտ արժեքների բացահայտում</li>
                            <li>Տվյալների մաքրում</li>
                        </ul>
                    </div>
                </Alert>
            </PhaseCard>
        );
    }

    return (
        <PhaseCard
            title="Վերլուծաբանի փուլ"
            icon="🔬"
            phase="analyst"
            active={true}
        >
            <div className="space-y-4">
                {/* Ստացված տվյալների ինֆորմացիա */}
                <Alert type="success" icon="✅" title="Տվյալները պատրաստ են">
                    <div className="space-y-2">
                        <div><strong>Նախագիծ:</strong> {projectName}</div>
                        <div><strong>Տեսակ:</strong> {getDataTypeLabel(dataType)}</div>
                        <div><strong>Տողերի քանակ:</strong> {currentData?.length || 0}</div>
                        <div><strong>Սյունակների քանակ:</strong> {currentData?.length > 0 ? Object.keys(currentData[0]).length : 0}</div>
                    </div>
                </Alert>

                {/* Տվյալների նախադիտում */}
                {currentData && currentData.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-bold text-sm text-gray-700 mb-2">📋 Մուտքագրված տվյալներ</h4>
                        <div className="text-xs font-mono bg-white p-2 rounded border max-h-32 overflow-auto">
                            <div className="font-bold text-blue-600">
                                {Object.keys(currentData[0]).join(' | ')}
                            </div>
                            {currentData.slice(0, 3).map((row, index) => (
                                <div key={index} className="text-gray-600">
                                    {Object.values(row).map(val => val || 'NULL').join(' | ')}
                                </div>
                            ))}
                            {currentData.length > 3 && (
                                <div className="text-gray-400 italic">
                                    ... եւ {currentData.length - 3} այլ տող
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Վերլուծության տեխնիկական մանրամասներ */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-blue-800 mb-2">🔍 Վերլուծական գործընթացներ</h4>
                    <div className="text-xs text-blue-700 space-y-1">
                        <div>• Տվյալների ամբողջականության ստուգում</div>
                        <div>• Ոչ ստանդարտ արժեքների հայտնաբերում</div>
                        <div>• Պակաս տվյալների դեպքում՝ սինթետիկ տվյալների գեներացում</div>
                    </div>
                </div>

                {/* Վերլուծության մեկնարկ */}
                <div className="pt-4 border-t border-gray-200">
                    <Button
                        onClick={startAnalysis}
                        variant="analyst"
                        size="md"
                        className="w-full"
                    >
                        🔬 Սկսել վերլուծությունը
                    </Button>

                    {/* <div className="mt-3 text-xs text-gray-500">
                        💡 <strong>Վերլուծության պրոցեսը ներառում է:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Ինտերակտիվ վերլուծական տարածքի բացում</li>
                            <li>Տվյալների որակի մետրիկների հաշվարկ</li>
                            <li>Վիզուալ ռեպորտների ստեղծում</li>
                            <li>Փորձագետի փուլի նախապատրաստում</li>
                        </ul>
                    </div> */}
                </div>
            </div>
        </PhaseCard>
    );
};

export default AnalystPhase;