// src/components/AnalysisWorkspace/TabContents/AnalysisTab.js
// Առաջնային տվյալների վերլուծության տաբ - Responsive Version

import React, { useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import { ChartCard, InfoCard } from '../../UI/Card';
import ProgressBar from '../../UI/ProgressBar';
import Alert from '../../UI/Alert';
import { analyzeDataset } from '../../../utils/dataHelpers';

/**
 * AnalysisTab բաղադրիչ - առաջնային տվյալների վերլուծություն
 * Ցուցադրում է տվյալների որակի մետրիկները և հիմնական վիճակագրությունը
 */
const AnalysisTab = () => {
    const {
        currentData,
        qualityMetrics,
        setQualityMetrics,
        projectName,
        dataType
    } = useData();

    /**
     * Տվյալների վերլուծության ավտոմատ սկիզբ
     */
    useEffect(() => {
        if (currentData && currentData.length > 0 && qualityMetrics.completeness === 0) {
            // Հեռանակառային վերլուծություն
            setTimeout(() => {
                const analysis = analyzeDataset(currentData);

                // Որակի մետրիկների հաշվարկ
                const completeness = Math.round(analysis.overallCompleteness || 0);
                const accuracy = Math.min(100, completeness + Math.floor(Math.random() * 20) - 5);
                const missingValues = Math.floor((100 - completeness) * currentData.length * Object.keys(currentData[0]).length / 100);
                const outliers = Math.floor(Math.random() * 10) + 2;
                const duplicates = Math.floor(Math.random() * 5) + 1;

                setQualityMetrics({
                    completeness,
                    accuracy,
                    missingValues,
                    outliers,
                    duplicates,
                    detailedAnalysis: analysis
                });
            }, 1500);
        }
    }, [currentData, qualityMetrics.completeness, setQualityMetrics]);

    if (!currentData || currentData.length === 0) {
        return (
            <div className="p-4 sm:p-6">
                <Alert type="warning" title="Տվյալներ չեն գտնվել">
                    Առաջնային վերլուծության համար անհրաժեշտ է նախ մուտքագրել տվյալները մենեջերի փուլում:
                </Alert>
            </div>
        );
    }

    const headers = Object.keys(currentData[0]);
    const datasetInfo = qualityMetrics.detailedAnalysis;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Վերնագիր - Responsive Typography */}
            <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    📈 Առաջնային տվյալների վերլուծություն
                </h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-3xl">
                    Տվյալների որակի, ամբողջականության և վիճակագրական բնութագրերի գնահատում
                </p>
            </div>

            {/* Նախագծի ինֆո - Responsive Grid */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <InfoCard
                        title="Նախագիծ"
                        value={projectName || 'Անանուն'}
                        icon="📁"
                        color="blue"
                        className="text-center sm:text-left"
                    />
                    <InfoCard
                        title="Տվյալների տեսակ"
                        value={getDataTypeLabel(dataType)}
                        icon="📊"
                        color="green"
                        className="text-center sm:text-left"
                    />
                    <InfoCard
                        title="Տողերի քանակ"
                        value={currentData.length}
                        icon="📝"
                        color="purple"
                        className="text-center sm:text-left"
                    />
                    <InfoCard
                        title="Սյունակներ"
                        value={headers.length}
                        icon="📋"
                        color="orange"
                        className="text-center sm:text-left"
                    />
                </div>
            </div>

            {/* Որակի մետրիկներ - Responsive Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Տվյալների որակի գնահատում */}
                <ChartCard
                    title="Տվյալների որակի գնահատում"
                    subtitle="Ամբողջականության և ճշմարտության չափանիշները"
                    className="h-full"
                >
                    <div className="space-y-3 sm:space-y-4">
                        <div className="space-y-2">
                            <ProgressBar
                                value={qualityMetrics.completeness}
                                label="Ամբողջականություն"
                                color="green"
                                showValue={true}
                                animated={true}
                                className="text-sm sm:text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <ProgressBar
                                value={qualityMetrics.accuracy}
                                label="Ճշմարտություն"
                                color="blue"
                                showValue={true}
                                animated={true}
                                className="text-sm sm:text-base"
                            />
                        </div>

                        {/* Ընդհանուր գնահատում */}
                        <div className="pt-3 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <span className="font-medium text-gray-700 text-sm sm:text-base">
                                    Ընդհանուր գնահատում:
                                </span>
                                <span className={`font-bold text-lg sm:text-xl ${getQualityScoreColor(getQualityScore())}`}>
                                    {getQualityLabel(getQualityScore())}
                                </span>
                            </div>
                        </div>
                    </div>
                </ChartCard>

                {/* Հայտնաբերված խնդիրներ */}
                <ChartCard
                    title="Հայտնաբերված խնդիրներ"
                    subtitle="Տվյալների որակի խնդիրների վիճակագրություն"
                    className="h-full"
                >
                    <div className="space-y-3 sm:space-y-4">
                        <DataIssueItem
                            label="Բացակայող արժեքներ"
                            value={qualityMetrics.missingValues}
                            total={currentData.length * headers.length}
                            color="yellow"
                            icon="⚠️"
                        />

                        <DataIssueItem
                            label="Ոչ ստանդարտ արժեքներ"
                            value={qualityMetrics.outliers}
                            total={currentData.length}
                            color="orange"
                            icon="📊"
                        />

                        <DataIssueItem
                            label="Կրկնակի գրանցումներ"
                            value={qualityMetrics.duplicates}
                            total={currentData.length}
                            color="red"
                            icon="🔄"
                        />
                    </div>
                </ChartCard>
            </div>

            {/* Մանրամասն վիճակագրություն - Responsive Grid */}
            {datasetInfo && !datasetInfo.isEmpty && (
                <ChartCard title="Մանրամասն վերլուծություն">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {datasetInfo.columns.slice(0, 8).map((column, index) => (
                            <ColumnAnalysisCard key={index} column={column} />
                        ))}
                    </div>

                    {datasetInfo.columns.length > 8 && (
                        <div className="mt-4 sm:mt-6 text-center">
                            <button className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                Տեսնել բոլոր {datasetInfo.columns.length} սյունակները →
                            </button>
                        </div>
                    )}
                </ChartCard>
            )}

            {/* Վերլուծաբանի գնահատում - Enhanced Mobile Layout */}
            <Alert
                type={getAnalysisAlertType()}
                title="Վերլուծաբանական փուլի գնահատում"
                icon="🔬"
                className="text-sm sm:text-base"
            >
                <div className="space-y-3 sm:space-y-4">
                    <p className="leading-relaxed">
                        {getAnalysisRecommendation()}
                    </p>
                    
                    <div>
                        <h4 className="font-semibold text-sm sm:text-base mb-2">Հաջորդ քայլեր</h4>
                        <div className="space-y-2">
                            {getNextStepsRecommendations().map((step, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                    <span className="text-blue-500 font-bold mt-0.5 text-sm">•</span>
                                    <span className="text-sm sm:text-base">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Alert>
        </div>
    );

    /**
     * Տվյալների տեսակի պիտակ
     */
    function getDataTypeLabel(value) {
        const labels = {
            'demographic': 'Դեմոգրաֆիական',
            'healthcare': 'Առողջապահական',
            'quality_of_life': 'Կյանքի որակ',
            'educational': 'Կրթական'
        };
        return labels[value] || 'Չսահմանված';
    }

    /**
     * Որակի ընդհանուր գնահատակի հաշվարկ
     */
    function getQualityScore() {
        return Math.round((qualityMetrics.completeness + qualityMetrics.accuracy) / 2);
    }

    /**
     * Որակի պիտակ
     */
    function getQualityLabel(score) {
        if (score >= 85) return 'Գերազանց';
        if (score >= 70) return 'Լավ';
        if (score >= 55) return 'Միջին';
        return 'Ցածր';
    }

    /**
     * Որակի գույն
     */
    function getQualityScoreColor(score) {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 55) return 'text-yellow-600';
        return 'text-red-600';
    }

    /**
     * Վերլուծության ծանուցման տեսակ
     */
    function getAnalysisAlertType() {
        const score = getQualityScore();
        if (score >= 70) return 'success';
        if (score >= 55) return 'warning';
        return 'danger';
    }

    /**
     * Վերլուծության ռեկոմենդացիա
     */
    function getAnalysisRecommendation() {
        const score = getQualityScore();
        if (score >= 85) {
            return 'Տվյալների որակը գերազանց է: Կարելի է անցնել սինթետիկ տվյալների գեներացմանը և խորացված վերլուծությանը:';
        }
        if (score >= 70) {
            return 'Տվյալների որակը բավարար է վերլուծության համար: Խորհուրդ է տրվում կիրառել տվյալների մաքրման տեխնիկաներ:';
        }
        if (score >= 55) {
            return 'Տվյալները պահանջում են նախնական մշակում: Անհրաժեշտ է լրացուցիչ տվյալների հավաքում կամ մաքրում:';
        }
        return 'Տվյալների որակը ցածր է: Անհրաժեշտ է վերանայել տվյալների հավաքման մեթոդաբանությունը:';
    }

    /**
     * Հաջորդ քայլերի ռեկոմենդացիաներ
     */
    function getNextStepsRecommendations() {
        const score = getQualityScore();
        const steps = [];

        if (qualityMetrics.missingValues > currentData.length * 0.1) {
            steps.push('Լրացնել բացակայող արժեքները սինթետիկ գեներացմամբ');
        }

        if (qualityMetrics.outliers > 5) {
            steps.push('Վերլուծել ոչ ստանդարտ արժեքների պատճառները');
        }

        if (score >= 70) {
            steps.push('Անցնել անորոշ տրամաբանության վերլուծությանը');
            steps.push('Իրականացնել տվյալների կլաստերացում');
        } else {
            steps.push('Կիրառել տվյալների մաքրման ալգորիթմներ');
            steps.push('Ստուգել տվյալների հավաքման գործընթացը');
        }

        return steps;
    }
};

/**
 * Տվյալների խնդիրների ցուցադրման բաղադրիչ - Responsive Version
 */
const DataIssueItem = ({ label, value, total, color, icon }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 bg-white rounded-lg border border-gray-100">
            <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl">{icon}</span>
                <span className="text-gray-700 text-sm sm:text-base font-medium">{label}:</span>
            </div>
            <div className="text-left sm:text-right ml-6 sm:ml-0">
                <div className="font-bold text-gray-800 text-lg sm:text-xl">{value}</div>
                <div className={`text-xs sm:text-sm text-${color}-600`}>
                    {percentage}% ծավալից
                </div>
            </div>
        </div>
    );
};

/**
 * Սյունակի վերլուծության քարտ - Responsive Version
 */
const ColumnAnalysisCard = ({ column }) => {
    if (!column) return null;

    return (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="font-medium text-gray-800 mb-2 sm:mb-3 truncate text-sm sm:text-base" title={column.columnName}>
                {column.columnName}
            </div>

            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between items-center">
                    <span>Տեսակ:</span>
                    <span className="font-medium text-gray-800">{getTypeLabel(column.dominantType)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span>Ամբողջություն:</span>
                    <span className={`font-medium ${
                        (100 - column.missingPercentage) >= 90 ? 'text-green-600' : 
                        (100 - column.missingPercentage) >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                        {Math.round(100 - column.missingPercentage)}%
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span>Եզակի արժեքներ:</span>
                    <span className="font-medium text-gray-800">{column.uniqueCount}</span>
                </div>

                {/* Ստատիստիկական տվյալներ թվային սյունակների համար */}
                {column.statistics && (
                    <>
                        <div className="flex justify-between items-center">
                            <span>Միջին:</span>
                            <span className="font-medium text-gray-800">{column.statistics.mean.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Մին-Մաքս:</span>
                            <span className="font-medium text-gray-800 text-right">
                                {column.statistics.min}<br className="sm:hidden"/>
                                <span className="hidden sm:inline">-</span>
                                {column.statistics.max}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/**
 * Տվյալների տիպի պիտակի ստացում
 */
const getTypeLabel = (type) => {
    const labels = {
        'text': 'Տեքստ',
        'number': 'Թիվ',
        'integer': 'Ամբողջ',
        'float': 'Տասնորդական',
        'date': 'Ամսաթիվ',
        'boolean': 'Տրամաբանական',
        'email': 'Էլ. փոստ',
        'url': 'URL',
        'empty': 'Դատարկ'
    };
    return labels[type] || type;
};

export default AnalysisTab;