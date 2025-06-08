// src/components/AnalysisWorkspace/TabContents/ScenariosTab.js
// Սցենարների գեներացման տաբ

import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { ChartCard, ScenarioCard } from '../../UI/Card';
import Button, { ButtonGroup } from '../../UI/Button';
import Alert from '../../UI/Alert';
import { generateScenarios } from '../../../utils/scenarios';

/**
 * ScenariosTab բաղադրիչ - որոշումային սցենարների գեներացման ինտերֆեյս
 * Ստեղծում է գործնական գործողությունների սցենարներ մենեջերների համար
 */
const ScenariosTab = () => {
    const {
        currentData,
        fuzzyResults,
        clusterData,
        scenarios,
        setScenarios,
        dataType,
        projectName
    } = useData();

    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [filterPriority, setFilterPriority] = useState('all');

    /**
     * Սցենարների գեներացիայի մեկնարկ
     */
    const startScenarioGeneration = async () => {
        if (!fuzzyResults && !clusterData) {
            alert('Սցենարների գեներացման համար անհրաժեշտ է նախ կատարել անորոշ տրամաբանության և կլաստերիզացիայի վերլուծություն');
            return;
        }

        setIsGenerating(true);

        try {
            // Սիմուլյացիայի հետաձգում
            await new Promise(resolve => setTimeout(resolve, 2500));

            const generatedScenarios = generateScenarios(dataType, fuzzyResults, clusterData);
            setScenarios(generatedScenarios);

            console.log('Գեներացված սցենարներ:', generatedScenarios);

        } catch (error) {
            console.error('Սցենարների գեներացիայի սխալ:', error);
            alert('Սցենարների գեներացման ժամանակ սխալ առաջացավ');
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * Սցենարների ֆիլտրավորում առաջնահերթության հիման վրա
     */
    const filteredScenarios = scenarios?.filter(scenario => {
        if (filterPriority === 'all') return true;
        return scenario.priority === filterPriority;
    }) || [];

    /**
     * Սցենարի մանրամասների ցուցադրում
     */
    const showScenarioDetails = (scenario) => {
        setSelectedScenario(scenario);
    };

    /**
     * Սցենարի արտահանում
     */
    const exportScenario = (scenario) => {
        const content = generateScenarioReport(scenario);
        // Կօգտագործվի useFileDownload hook
        console.log('Արտահանում սցենարը:', scenario.title);
        alert(`Սցենարը "${scenario.title}" արտահանվել է`);
    };

    if (!currentData || currentData.length === 0) {
        return (
            <Alert type="warning" title="Տվյալներ չեն գտնվել">
                Սցենարների գեներացման համար անհրաժեշտ է նախ մուտքագրել տվյալները:
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Վերնագիր */}
            <div>
                <h3 className="text-2xl font-bold text-white-800 mb-2">
                    📋 Սցենարների գեներացում մենեջերի համար
                </h3>
                <p className="text-gray-600">
                    Որոշումների աջակցության գործնական սցենարների ինտելիգենտ ստեղծում վերլուծության հիման վրա
                </p>
            </div>

            {/* Նախագծի ինֆո և նախապայմաններ */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">📁 Նախագծի համատեքստ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-green-600">Նախագիծ:</span>
                        <span className="font-bold ml-2">{projectName || 'Անանուն'}</span>
                    </div>
                    <div>
                        <span className="text-green-600">Ոլորտ:</span>
                        <span className="font-bold ml-2">{getDataTypeLabel(dataType)}</span>
                    </div>
                    <div>
                        <span className="text-green-600">Վերլուծություն:</span>
                        <span className="font-bold ml-2">{fuzzyResults ? '✅' : '❌'}</span>
                    </div>
                    <div>
                        <span className="text-green-600">Կլաստերներ:</span>
                        <span className="font-bold ml-2">{clusterData?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* Սցենարների գեներացման կոճակ */}
            {(!scenarios || scenarios.length === 0) && (
                <div className="text-center py-8">
                    <div className="bg-blue-50 rounded-lg p-6 max-w-lg mx-auto">
                        <h4 className="font-bold text-blue-800 mb-3">🤖 Ինտելիգենտ սցենարային մոդելավորում</h4>
                        <p className="text-sm text-blue-700 mb-4">
                            Համակարգը կվերլուծի վերլուծության արդյունքները և կստեղծի նպատակային
                            գործողությունների սցենարներ ձեր տվյալների համար:
                        </p>

                        {/* Պատրաստության ստուգում */}
                        <div className="space-y-2 mb-4">
                            <ReadinessCheck
                                label="Տվյալների վերլուծություն"
                                ready={currentData && currentData.length > 0}
                            />
                            <ReadinessCheck
                                label="Անորոշ տրամաբանություն"
                                ready={fuzzyResults !== null}
                            />
                            <ReadinessCheck
                                label="Կլաստերացում"
                                ready={clusterData && clusterData.length > 0}
                            />
                        </div>

                        <Button
                            onClick={startScenarioGeneration}
                            variant="success"
                            size="lg"
                            className="px-8"
                            disabled={isGenerating || (!fuzzyResults && !clusterData)}
                            loading={isGenerating}
                        >
                            {isGenerating ? '🔄 Գեներացում...' : '📋 Գեներացնել սցենարներ'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Սցենարների ցուցադրում */}
            {scenarios && scenarios.length > 0 && (
                <>
                    {/* Ֆիլտրավորում և վիճակագրություն */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-700">Ֆիլտր:</span>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="all">Բոլոր սցենարները ({scenarios.length})</option>
                                <option value="high">Բարձր առաջնահերթություն ({scenarios.filter(s => s.priority === 'high').length})</option>
                                <option value="medium">Միջին առաջնահերթություն ({scenarios.filter(s => s.priority === 'medium').length})</option>
                                <option value="low">Ցածր առաջնահերթություն ({scenarios.filter(s => s.priority === 'low').length})</option>
                            </select>
                        </div>

                        <ButtonGroup>
                            <Button
                                onClick={() => exportAllScenarios()}
                                variant="secondary"
                                size="sm"
                            >
                                📄 Արտահանել բոլորը
                            </Button>
                            <Button
                                onClick={startScenarioGeneration}
                                variant="success"
                                size="sm"
                            >
                                🔄 Վերագեներացում
                            </Button>
                        </ButtonGroup>
                    </div>

                    {/* Սցենարների ցուցակ */}
                    <div className="space-y-4">
                        {filteredScenarios.map((scenario, index) => (
                            <div key={index} className="group">
                                <ScenarioCard
                                    title={scenario.title}
                                    description={scenario.description}
                                    priority={scenario.priority}
                                    priorityText={scenario.priorityText}
                                    actions={scenario.actions}
                                    className="transition-all duration-300 hover:shadow-lg cursor-pointer"
                                    onClick={() => showScenarioDetails(scenario)}
                                />

                                {/* Սցենարի գործողությունների կոճակներ */}
                                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ButtonGroup>
                                        <Button
                                            onClick={() => exportScenario(scenario)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            📊 Մանրամասն տեղեկագիր
                                        </Button>
                                        <Button
                                            onClick={() => implementScenario(scenario)}
                                            variant="primary"
                                            size="sm"
                                        >
                                            🚀 Կիրառման պլան
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Սցենարների ամփոփ վիճակագրություն */}
                    <ChartCard title="Սցենարների վիճակագրություն">
                        <ScenarioStatistics scenarios={scenarios} />
                    </ChartCard>
                </>
            )}

            {/* Սցենարի մանրամասներ (մոդալ) */}
            {selectedScenario && (
                <ScenarioDetailsModal
                    scenario={selectedScenario}
                    onClose={() => setSelectedScenario(null)}
                    onExport={() => exportScenario(selectedScenario)}
                />
            )}

            {/* Սցենարների ավարտի ծանուցում */}
            {scenarios && scenarios.length > 0 && (
                <Alert type="success" title="📋 Սցենարային մոդելավորումը հաջողությամբ ավարտվել է">
                    <div className="space-y-2 text-sm">
                        <p>
                            Գեներացվել է <strong>{scenarios.length} սցենար</strong>, որոնցից
                            <strong> {scenarios.filter(s => s.priority === 'high').length}</strong> բարձր առաջնահերթություն ունեն:
                        </p>
                        <div>
                            <strong>Գլխավոր ուղղություններ:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                {getMainDirections(scenarios).map((direction, index) => (
                                    <li key={index}>{direction}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Alert>
            )}
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
     * Բոլոր սցենարների արտահանում
     */
    function exportAllScenarios() {
        console.log('Արտահանում բոլոր սցենարները...', scenarios);
        alert(`${scenarios.length} սցենար արտահանվել է`);
    }

    /**
     * Սցենարի իրականացման պլան
     */
    function implementScenario(scenario) {
        console.log('Սցենարի իրականացման պլան:', scenario.title);
        alert(`Կիրառման պլանը պատրաստ է "${scenario.title}" սցենարի համար`);
    }

    /**
     * Սցենարի տեղեկագիր
     */
    function generateScenarioReport(scenario) {
        return `
Սցենարի անվանում: ${scenario.title}
Առաջնահերթություն: ${scenario.priorityText}
Նկարագրություն: ${scenario.description}

Գործողություններ:
${scenario.actions.map((action, index) => `${index + 1}. ${action}`).join('\n')}

Գեներացման ամսաթիվ: ${new Date().toLocaleDateString('hy-AM')}
Նախագիծ: ${projectName}
    `.trim();
    }

    /**
     * Գլխավոր ուղղությունների ստացում
     */
    function getMainDirections(scenarios) {
        const directions = scenarios.slice(0, 3).map(s => s.title);
        return directions;
    }
};

/**
 * Պատրաստության ստուգման բաղադրիչ
 */
const ReadinessCheck = ({ label, ready }) => {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">{label}:</span>
            <span className={`font-bold ${ready ? 'text-green-600' : 'text-red-600'}`}>
                {ready ? '✅ Պատրաստ' : '❌ Բացակայում է'}
            </span>
        </div>
    );
};

/**
 * Սցենարների վիճակագրության բաղադրիչ
 */
const ScenarioStatistics = ({ scenarios }) => {
    const priorityCounts = scenarios.reduce((acc, scenario) => {
        acc[scenario.priority] = (acc[scenario.priority] || 0) + 1;
        return acc;
    }, {});

    const totalActions = scenarios.reduce((sum, scenario) => sum + scenario.actions.length, 0);
    const avgActionsPerScenario = (totalActions / scenarios.length).toFixed(1);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{priorityCounts.high || 0}</div>
                <div className="text-sm text-red-700">Բարձր առաջնահերթություն</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{priorityCounts.medium || 0}</div>
                <div className="text-sm text-yellow-700">Միջին առաջնահերթություն</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{priorityCounts.low || 0}</div>
                <div className="text-sm text-green-700">Ցածր առաջնահերթություն</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{avgActionsPerScenario}</div>
                <div className="text-sm text-blue-700">Միջին գործողություններ</div>
            </div>
        </div>
    );
};

/**
 * Սցենարի մանրամասների մոդալ
 */
const ScenarioDetailsModal = ({ scenario, onClose, onExport }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Վերնագիր */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white-800">{scenario.title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Առաջնահերթություն */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${scenario.priority === 'high' ? 'bg-red-200 text-red-800' :
                        scenario.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                    }`}>
                    {scenario.priorityText}
                </div>

                {/* Նկարագրություն */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-2">📋 Նկարագրություն</h4>
                    <p className="text-gray-600 leading-relaxed">{scenario.description}</p>
                </div>

                {/* Գործողություններ */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-2">🎯 Առաջարկվող գործողություններ</h4>
                    <ol className="list-decimal list-inside space-y-2">
                        {scenario.actions.map((action, index) => (
                            <li key={index} className="text-gray-600">{action}</li>
                        ))}
                    </ol>
                </div>

                {/* Մետադատարներ */}
                {scenario.metadata && (
                    <div className="mb-6 bg-gray-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-700 mb-2">🔍 Լրացուցիչ տեղեկություններ</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>Գեներացման ամսաթիվ: {new Date(scenario.metadata.generatedAt).toLocaleDateString('hy-AM')}</div>
                            <div>Տվյալների տեսակ: {scenario.metadata.dataType}</div>
                            {scenario.metadata.adaptive && <div>Ադապտիվ սցենար: Այո</div>}
                        </div>
                    </div>
                )}

                {/* Գործողությունների կոճակներ */}
                <div className="flex gap-3">
                    <Button
                        onClick={onExport}
                        variant="success"
                        size="md"
                        className="flex-1"
                    >
                        📊 Արտահանել տեղեկագիր
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        size="md"
                    >
                        Փակել
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ScenariosTab;