// src/components/AnalysisWorkspace/TabContents/FuzzyTab.js
// Անորոշ տրամաբանության վերլուծության տաբ

import React from 'react';
import { useData } from '../../../context/DataContext';
import { ChartCard, InfoCard } from '../../UI/Card';
import Button from '../../UI/Button';
import ProgressBar, { CircularProgress } from '../../UI/ProgressBar';
import Alert from '../../UI/Alert';
import { applyFuzzyLogic } from '../../../utils/fuzzyLogic';

/**
 * FuzzyTab բաղադրիչ - անորոշ տրամաբանության վերլուծության ինտերֆեյս
 * Ցուցադրում է տվյալների վստահության մակարդակները և անորոշության գնահատումը
 */
const FuzzyTab = () => {
    const {
        currentData,
        fuzzyResults,
        setFuzzyResults,
        dataType
    } = useData();

    /**
     * Անորոշ տրամաբանության կիրառում
     */
    const applyFuzzyAnalysis = async () => {
        if (!currentData || currentData.length === 0) {
            alert('Տվյալները բացակայում են անորոշ տրամաբանության վերլուծության համար');
            return;
        }

        try {
            // Սիմուլյացիայի հետաձգում UI-ի համար
            const results = await new Promise((resolve) => {
                setTimeout(() => {
                    const fuzzyAnalysis = applyFuzzyLogic(currentData, dataType);
                    resolve(fuzzyAnalysis);
                }, 1500);
            });

            setFuzzyResults(results);
            console.log('Անորոշ տրամաբանության արդյունք:', results);

        } catch (error) {
            console.error('Անորոշ տրամաբանության սխալ:', error);
            alert('Վերլուծության ժամանակ սխալ առաջացավ');
        }
    };

    if (!currentData || currentData.length === 0) {
        return (
            <Alert type="warning" title="Տվյալներ չեն գտնվել">
                Անորոշ տրամաբանության վերլուծության համար անհրաժեշտ է նախ մուտքագրել տվյալները:
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Վերնագիր */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    🔮 Անորոշ տրամաբանության կիրառում
                </h3>
                <p className="text-gray-600">
                    Տվյալների վստահության մակարդակի գնահատում և անորոշության գործոնների վերլուծություն
                </p>
            </div>

            {/* Մեթոդաբանական տեղեկություններ */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">🧠 Անորոշ տրամաբանության մասին</h4>
                <div className="text-sm text-purple-700 space-y-2">
                    <p>
                        <strong>Fuzzy Logic</strong>-ը թույլ է տալիս գնահատել տվյալների որակը 0-ից 1 պարամետրերով,
                        որտեղ յուրաքանչյուր տվյալ ունի վստահության աստիճան:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="bg-white rounded p-3 border">
                            <div className="font-bold text-red-600">Ցածր վստահություն (0-40%)</div>
                            <div className="text-xs text-gray-600 mt-1">Բացակայող կամ անվստահելի տվյալներ</div>
                        </div>
                        <div className="bg-white rounded p-3 border">
                            <div className="font-bold text-yellow-600">Միջին վստահություն (40-70%)</div>
                            <div className="text-xs text-gray-600 mt-1">Մասամբ վստահելի, պահանջում է ստուգում</div>
                        </div>
                        <div className="bg-white rounded p-3 border">
                            <div className="font-bold text-green-600">Բարձր վստահություն (70-100%)</div>
                            <div className="text-xs text-gray-600 mt-1">Վստահելի և ճշգրիտ տվյալներ</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Վերլուծության կոճակ */}
            {!fuzzyResults && (
                <div className="text-center">
                    <Button
                        onClick={applyFuzzyAnalysis}
                        variant="expert"
                        size="lg"
                        className="px-8"
                    >
                        🔮 Կիրառել անորոշ տրամաբանություն
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                        Վերլուծությունը կտևի 1-2 վայրկյան
                    </p>
                </div>
            )}

            {/* Վերլուծության արդյունքներ */}
            {fuzzyResults && (
                <>
                    {/* Վստահության բաշխում */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Շրջանակային գծապատկեր */}
                        <ChartCard
                            title="Վստահության բաշխում"
                            subtitle="Տվյալների վստահության մակարդակների տարանջատում"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <CircularProgress
                                        value={fuzzyResults.high}
                                        size={160}
                                        color="green"
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {fuzzyResults.high}%
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Բարձր վստահություն
                                            </div>
                                        </div>
                                    </CircularProgress>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <ConfidenceBar
                                    label="Ցածր վստահություն"
                                    value={fuzzyResults.low}
                                    color="red"
                                    icon="⚠️"
                                />
                                <ConfidenceBar
                                    label="Միջին վստահություն"
                                    value={fuzzyResults.medium}
                                    color="yellow"
                                    icon="⚡"
                                />
                                <ConfidenceBar
                                    label="Բարձր վստահություն"
                                    value={fuzzyResults.high}
                                    color="green"
                                    icon="✅"
                                />
                            </div>
                        </ChartCard>

                        {/* Վերլուծության ամփոփում */}
                        <ChartCard
                            title="Անորոշության վերլուծություն"
                            subtitle="Փորձագետի գնահատում և առաջարկություններ"
                        >
                            <div className="space-y-4">
                                {/* Հիմնական գնահատում */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h5 className="font-bold text-gray-800 mb-2">📋 Ընդհանուր գնահատում</h5>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {fuzzyResults.analysis}
                                    </p>
                                </div>

                                {/* Հայտնաբերված օրինակները */}
                                {fuzzyResults.patterns && fuzzyResults.patterns.length > 0 && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h5 className="font-bold text-blue-800 mb-2">🔍 Հայտնաբերված օրինակներ</h5>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            {fuzzyResults.patterns.map((pattern, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-blue-500 mr-2">•</span>
                                                    <span>{pattern}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Անորոշության գործոններ */}
                                {fuzzyResults.uncertaintyFactors && fuzzyResults.uncertaintyFactors.length > 0 && (
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <h5 className="font-bold text-orange-800 mb-2">⚠️ Անորոշության գործոններ</h5>
                                        <ul className="text-sm text-orange-700 space-y-1">
                                            {fuzzyResults.uncertaintyFactors.map((factor, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-orange-500 mr-2">•</span>
                                                    <span>{factor}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Գործողությունների ինդիկատոր */}
                                <div className="text-center pt-2">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConfidenceIndicatorClass(fuzzyResults.high)}`}>
                                        {getConfidenceIndicatorIcon(fuzzyResults.high)}
                                        <span className="ml-2">{getConfidenceLabel(fuzzyResults.high)}</span>
                                    </div>
                                </div>
                            </div>
                        </ChartCard>
                    </div>

                    {/* Մանրամասն վիճակագրություն */}
                    <ChartCard title="Մանրամասն վստահության վիճակագրություն">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InfoCard
                                title="Ընդհանուր տողեր"
                                value={currentData.length}
                                icon="📊"
                                color="blue"
                            />
                            <InfoCard
                                title="Վստահելի տվյալներ"
                                value={Math.round(currentData.length * (fuzzyResults.high / 100))}
                                icon="✅"
                                color="green"
                            />
                            <InfoCard
                                title="Անորոշ տվյալներ"
                                value={Math.round(currentData.length * (fuzzyResults.medium / 100))}
                                icon="⚡"
                                color="yellow"
                            />
                            <InfoCard
                                title="Խնդրային տվյալներ"
                                value={Math.round(currentData.length * (fuzzyResults.low / 100))}
                                icon="⚠️"
                                color="red"
                            />
                        </div>
                    </ChartCard>

                    {/* Առաջարկություններ */}
                    {fuzzyResults.recommendations && fuzzyResults.recommendations.length > 0 && (
                        <Alert
                            type={getRecommendationAlertType(fuzzyResults.high)}
                            title="🔮 Փորձագետի առաջարկություններ"
                        >
                            <div className="space-y-3">
                                {fuzzyResults.recommendations.map((rec, index) => (
                                    <div key={index} className="border-l-2 border-gray-300 pl-3">
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityClass(rec.priority)}`}>
                                                {rec.priority.toUpperCase()}
                                            </span>
                                            <span className="font-medium">{rec.action}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded">
                                <div className="text-sm">
                                    <strong>💡 Հաջորդ քայլեր:</strong>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                        <li>Անցնել կլաստերացման փուլին</li>
                                        <li>Կիրառել տվյալների մաքրման տեխնիկաներ</li>
                                        <li>Ստեղծել նպատակային սցենարներ</li>
                                    </ul>
                                </div>
                            </div>
                        </Alert>
                    )}

                    {/* Վերահարցում կոճակ */}
                    <div className="text-center">
                        <Button
                            onClick={applyFuzzyAnalysis}
                            variant="secondary"
                            size="md"
                        >
                            🔄 Վերահարցման վերլուծություն
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

/**
 * Վստահության գոտու բաղադրիչ
 */
const ConfidenceBar = ({ label, value, color, icon }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <span>{icon}</span>
                <span className="text-sm font-medium text-gray-700">{label}:</span>
            </div>
            <div className="flex items-center space-x-3 flex-1 ml-4">
                <div className="flex-1">
                    <ProgressBar
                        value={value}
                        color={color}
                        size="sm"
                        showValue={false}
                        animated={true}
                    />
                </div>
                <span className="text-sm font-bold text-gray-800 w-10 text-right">
                    {value}%
                </span>
            </div>
        </div>
    );
};

/**
 * Վստահության ինդիկատորի CSS դասի ստացում
 */
const getConfidenceIndicatorClass = (highConfidence) => {
    if (highConfidence >= 80) {
        return 'bg-green-100 text-green-800';
    } else if (highConfidence >= 60) {
        return 'bg-yellow-100 text-yellow-800';
    } else {
        return 'bg-red-100 text-red-800';
    }
};

/**
 * Վստահության ինդիկատորի նշանի ստացում
 */
const getConfidenceIndicatorIcon = (highConfidence) => {
    if (highConfidence >= 80) {
        return '🟢';
    } else if (highConfidence >= 60) {
        return '🟡';
    } else {
        return '🔴';
    }
};

/**
 * Վստահության պիտակի ստացում
 */
const getConfidenceLabel = (highConfidence) => {
    if (highConfidence >= 80) {
        return 'Բարձր վստահություն';
    } else if (highConfidence >= 60) {
        return 'Միջին վստահություն';
    } else {
        return 'Ցածր վստահություն';
    }
};

/**
 * Առաջարկությունների ծանուցման տեսակի ստացում
 */
const getRecommendationAlertType = (highConfidence) => {
    if (highConfidence >= 80) {
        return 'success';
    } else if (highConfidence >= 60) {
        return 'warning';
    } else {
        return 'danger';
    }
};

/**
 * Առաջնահերթության CSS դասի ստացում
 */
const getPriorityClass = (priority) => {
    switch (priority) {
        case 'high':
            return 'bg-red-200 text-red-800';
        case 'medium':
            return 'bg-yellow-200 text-yellow-800';
        case 'low':
            return 'bg-green-200 text-green-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
};

export default FuzzyTab;