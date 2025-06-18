// // src/components/AnalysisWorkspace/TabContents/ScenariosTab.js
// // Սցենարների գեներացման տաբ

// import React, { useState } from 'react';
// import { useData } from '../../../context/DataContext';
// import { ChartCard, ScenarioCard } from '../../UI/Card';
// import Button, { ButtonGroup } from '../../UI/Button';
// import Alert from '../../UI/Alert';
// import { generateScenarios } from '../../../utils/scenarios';

// /**
//  * ScenariosTab բաղադրիչ - որոշումային սցենարների գեներացման ինտերֆեյս
//  * Ստեղծում է գործնական գործողությունների սցենարներ մենեջերների համար
//  */
// const ScenariosTab = () => {
//     const {
//         currentData,
//         fuzzyResults,
//         clusterData,
//         scenarios,
//         setScenarios,
//         dataType,
//         projectName
//     } = useData();

//     const [isGenerating, setIsGenerating] = useState(false);
//     const [selectedScenario, setSelectedScenario] = useState(null);
//     const [filterPriority, setFilterPriority] = useState('all');

//     /**
//      * File download utility function
//      */
//     const downloadFile = (content, filename, mimeType = 'text/plain') => {
//         const blob = new Blob([content], { type: mimeType });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     };

//     /**
//      * Սցենարների գեներացիայի մեկնարկ
//      */
//     const startScenarioGeneration = async () => {
//         if (!fuzzyResults && !clusterData) {
//             alert('Սցենարների գեներացման համար անհրաժեշտ է նախ կատարել անորոշ տրամաբանության և կլաստերիզացիայի վերլուծություն');
//             return;
//         }

//         setIsGenerating(true);

//         try {
//             // Սիմուլյացիայի հետաձգում
//             await new Promise(resolve => setTimeout(resolve, 2500));

//             const generatedScenarios = generateScenarios(dataType, fuzzyResults, clusterData);
//             setScenarios(generatedScenarios);

//             console.log('Գեներացված սցենարներ:', generatedScenarios);

//         } catch (error) {
//             console.error('Սցենարների գեներացիայի սխալ:', error);
//             alert('Սցենարների գեներացման ժամանակ սխալ առաջացավ');
//         } finally {
//             setIsGenerating(false);
//         }
//     };

//     /**
//      * Սցենարների ֆիլտրավորում առաջնահերթության հիման վրա
//      */
//     const filteredScenarios = scenarios?.filter(scenario => {
//         if (filterPriority === 'all') return true;
//         return scenario.priority === filterPriority;
//     }) || [];

//     /**
//      * Սցենարի մանրամասների ցուցադրում
//      */
//     const showScenarioDetails = (scenario) => {
//         setSelectedScenario(scenario);
//     };

//     /**
//      * Սցենարի արտահանում
//      */
//     const exportScenario = (scenario) => {
//         const content = generateScenarioReport(scenario);
//         const filename = `scenario_${scenario.title.replace(/[^a-zA-Z0-9\u0531-\u0587]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
//         downloadFile(content, filename);
//         alert(`Սցենարը "${scenario.title}" արտահանվել է`);
//     };

//     /**
//      * Բոլոր սցենարների արտահանում
//      */
//     const exportAllScenarios = () => {
//         if (!scenarios || scenarios.length === 0) {
//             alert('Արտահանելու համար սցենարներ չեն գտնվել');
//             return;
//         }

//         const content = generateAllScenariosReport(scenarios);
//         const filename = `all_scenarios_${projectName?.replace(/[^a-zA-Z0-9\u0531-\u0587]/g, '_') || 'project'}_${new Date().toISOString().split('T')[0]}.txt`;
//         downloadFile(content, filename);
//         alert(`${scenarios.length} սցենար արտահանվել է`);
//     };

//     /**
//      * Սցենարի իրականացման պլանի արտահանում
//      */
//     const implementScenario = (scenario) => {
//         const implementationPlan = generateImplementationPlan(scenario);
//         const filename = `implementation_plan_${scenario.title.replace(/[^a-zA-Z0-9\u0531-\u0587]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
//         downloadFile(implementationPlan, filename);
//         alert(`Կիրառման պլանը պատրաստ է "${scenario.title}" սցենարի համար`);
//     };

//     if (!currentData || currentData.length === 0) {
//         return (
//             <Alert type="warning" title="Տվյալներ չեն գտնվել">
//                 Սցենարների գեներացման համար անհրաժեշտ է նախ մուտքագրել տվյալները:
//             </Alert>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Վերնագիր */}
//             <div>
//                 <h3 className="text-2xl font-bold text-white-800 mb-2">
//                     📋 Սցենարների գեներացում մենեջերի համար
//                 </h3>
//                 <p className="text-gray-600">
//                     Որոշումների աջակցության գործնական սցենարների ինտելիգենտ ստեղծում վերլուծության հիման վրա
//                 </p>
//             </div>

//             {/* Նախագծի ինֆո և նախապայմաններ */}
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                 <h4 className="font-bold text-green-800 mb-2">📁 Նախագծի համատեքստ</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
//                     <div>
//                         <span className="text-green-600">Նախագիծ:</span>
//                         <span className="font-bold ml-2">{projectName || 'Անանուն'}</span>
//                     </div>
//                     <div>
//                         <span className="text-green-600">Ոլորտ:</span>
//                         <span className="font-bold ml-2">{getDataTypeLabel(dataType)}</span>
//                     </div>
//                     <div>
//                         <span className="text-green-600">Վերլուծություն:</span>
//                         <span className="font-bold ml-2">{fuzzyResults ? '✅' : '❌'}</span>
//                     </div>
//                     <div>
//                         <span className="text-green-600">Կլաստերներ:</span>
//                         <span className="font-bold ml-2">{clusterData?.length || 0}</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Սցենարների գեներացման կոճակ */}
//             {(!scenarios || scenarios.length === 0) && (
//                 <div className="text-center py-8">
//                     <div className="bg-blue-50 rounded-lg p-6 max-w-lg mx-auto">
//                         <h4 className="font-bold text-blue-800 mb-3">🤖 Ինտելիգենտ սցենարային մոդելավորում</h4>
//                         <p className="text-sm text-blue-700 mb-4">
//                             Համակարգը կվերլուծի վերլուծության արդյունքները և կստեղծի նպատակային
//                             գործողությունների սցենարներ ձեր տվյալների համար:
//                         </p>

//                         {/* Պատրաստության ստուգում */}
//                         <div className="space-y-2 mb-4">
//                             <ReadinessCheck
//                                 label="Տվյալների վերլուծություն"
//                                 ready={currentData && currentData.length > 0}
//                             />
//                             <ReadinessCheck
//                                 label="Անորոշ տրամաբանություն"
//                                 ready={fuzzyResults !== null}
//                             />
//                             <ReadinessCheck
//                                 label="Կլաստերացում"
//                                 ready={clusterData && clusterData.length > 0}
//                             />
//                         </div>

//                         <Button
//                             onClick={startScenarioGeneration}
//                             variant="success"
//                             size="lg"
//                             className="px-8"
//                             disabled={isGenerating || (!fuzzyResults && !clusterData)}
//                             loading={isGenerating}
//                         >
//                             {isGenerating ? '🔄 Գեներացում...' : '📋 Գեներացնել սցենարներ'}
//                         </Button>
//                     </div>
//                 </div>
//             )}

//             {/* Սցենարների ցուցադրում */}
//             {scenarios && scenarios.length > 0 && (
//                 <>
//                     {/* Ֆիլտրավորում և վիճակագրություն */}
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                         <div className="flex items-center space-x-4">
//                             <span className="font-medium text-gray-700">Ֆիլտր:</span>
//                             <select
//                                 value={filterPriority}
//                                 onChange={(e) => setFilterPriority(e.target.value)}
//                                 className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
//                             >
//                                 <option value="all">Բոլոր սցենարները ({scenarios.length})</option>
//                                 <option value="high">Բարձր առաջնահերթություն ({scenarios.filter(s => s.priority === 'high').length})</option>
//                                 <option value="medium">Միջին առաջնահերթություն ({scenarios.filter(s => s.priority === 'medium').length})</option>
//                                 <option value="low">Ցածր առաջնահերթություն ({scenarios.filter(s => s.priority === 'low').length})</option>
//                             </select>
//                         </div>

//                         <ButtonGroup>
//                             <Button
//                                 onClick={exportAllScenarios}
//                                 variant="secondary"
//                                 size="sm"
//                             >
//                                 📄 Արտահանել բոլորը
//                             </Button>
//                             <Button
//                                 onClick={startScenarioGeneration}
//                                 variant="success"
//                                 size="sm"
//                             >
//                                 🔄 Վերագեներացում
//                             </Button>
//                         </ButtonGroup>
//                     </div>

//                     {/* Սցենարների ցուցակ */}
//                     <div className="space-y-4">
//                         {filteredScenarios.map((scenario, index) => (
//                             <div key={index} className="group">
//                                 <ScenarioCard
//                                     title={scenario.title}
//                                     description={scenario.description}
//                                     priority={scenario.priority}
//                                     priorityText={scenario.priorityText}
//                                     actions={scenario.actions}
//                                     className="transition-all duration-300 hover:shadow-lg cursor-pointer"
//                                     onClick={() => showScenarioDetails(scenario)}
//                                 />

//                                 {/* Սցենարի գործողությունների կոճակներ */}
//                                 <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                     <ButtonGroup>
//                                         <Button
//                                             onClick={() => exportScenario(scenario)}
//                                             variant="secondary"
//                                             size="sm"
//                                         >
//                                             📊 Մանրամասն տեղեկագիր
//                                         </Button>
//                                         <Button
//                                             onClick={() => implementScenario(scenario)}
//                                             variant="primary"
//                                             size="sm"
//                                         >
//                                             🚀 Կիրառման պլան
//                                         </Button>
//                                     </ButtonGroup>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Սցենարների ամփոփ վիճակագրություն */}
//                     <ChartCard title="Սցենարների վիճակագրություն">
//                         <ScenarioStatistics scenarios={scenarios} />
//                     </ChartCard>
//                 </>
//             )}

//             {/* Սցենարի մանրամասներ (մոդալ) */}
//             {selectedScenario && (
//                 <ScenarioDetailsModal
//                     scenario={selectedScenario}
//                     onClose={() => setSelectedScenario(null)}
//                     onExport={() => exportScenario(selectedScenario)}
//                 />
//             )}

//             {/* Սցենարների ավարտի ծանուցում */}
//             {scenarios && scenarios.length > 0 && (
//                 <Alert type="success" title="📋 Սցենարային մոդելավորումը հաջողությամբ ավարտվել է">
//                     <div className="space-y-2 text-sm">
//                         <p>
//                             Գեներացվել է <strong>{scenarios.length} սցենար</strong>, որոնցից
//                             <strong> {scenarios.filter(s => s.priority === 'high').length}</strong> բարձր առաջնահերթություն ունեն:
//                         </p>
//                         <div>
//                             <strong>Գլխավոր ուղղություններ:</strong>
//                             <ul className="list-disc list-inside mt-1 space-y-1">
//                                 {getMainDirections(scenarios).map((direction, index) => (
//                                     <li key={index}>{direction}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                 </Alert>
//             )}
//         </div>
//     );

//     /**
//      * Տվյալների տեսակի պիտակ
//      */
//     function getDataTypeLabel(value) {
//         const labels = {
//             'demographic': 'Դեմոգրաֆիական',
//             'healthcare': 'Առողջապահական',
//             'quality_of_life': 'Կյանքի որակ',
//             'educational': 'Կրթական'
//         };
//         return labels[value] || 'Չսահմանված';
//     }

//     /**
//      * Սցենարի տեղեկագիր
//      */
//     function generateScenarioReport(scenario) {
//         return `
// ՍՑԵՆԱՐԻ ՄԱՆՐԱՄԱՍՆ ՏԵՂԵԿԱԳԻՐ
// ===============================

// Սցենարի անվանում: ${scenario.title}
// Առաջնահերթություն: ${scenario.priorityText}
// Գեներացման ամսաթիվ: ${new Date().toLocaleDateString('hy-AM')}
// Նախագիծ: ${projectName || 'Անանուն'}
// Տվյալների տեսակ: ${getDataTypeLabel(dataType)}

// ՆԿԱՐԱԳՐՈՒԹՅՈՒՆ
// ==============
// ${scenario.description}

// ԱՌԱՋԱՐԿՎՈՂ ԳՈՐԾՈՂՈՒԹՅՈՒՆՆԵՐ
// ==========================
// ${scenario.actions.map((action, index) => `${index + 1}. ${action}`).join('\n')}

// ${scenario.metadata ? `
// ԼՐԱՑՈՒՑԻՉ ՏԵՂԵԿՈՒԹՅՈՒՆՆԵՐ
// ========================
// Գեներացման ամսաթիվ: ${new Date(scenario.metadata.generatedAt).toLocaleDateString('hy-AM')}
// Տվյալների տեսակ: ${scenario.metadata.dataType}
// ${scenario.metadata.adaptive ? 'Ադապտիվ սցենար: Այո' : ''}
// ` : ''}

// ---
// Տեղեկագիրը գեներացվել է ${new Date().toLocaleString('hy-AM')} ամսաթվին
//     `.trim();
//     }

//     /**
//      * Բոլոր սցենարների տեղեկագիր
//      */
//     function generateAllScenariosReport(scenarios) {
//         const priorityCounts = scenarios.reduce((acc, scenario) => {
//             acc[scenario.priority] = (acc[scenario.priority] || 0) + 1;
//             return acc;
//         }, {});

//         return `
// ՍՑԵՆԱՐՆԵՐԻ ԱՄԲՈՂՋԱԿԱՆ ՏԵՂԵԿԱԳԻՐ
// =================================

// Նախագիծ: ${projectName || 'Անանուն'}
// Տվյալների տեսակ: ${getDataTypeLabel(dataType)}
// Գեներացման ամսաթիվ: ${new Date().toLocaleDateString('hy-AM')}

// ԱՄՓՈՓ ՎԻՃԱԿԱԳՐՈՒԹՅՈՒՆ
// =====================
// Ընդհանուր սցենարներ: ${scenarios.length}
// Բարձր առաջնահերթություն: ${priorityCounts.high || 0}
// Միջին առաջնահերթություն: ${priorityCounts.medium || 0}
// Ցածր առաջնահերթություն: ${priorityCounts.low || 0}

// ՄԱՆՐԱՄԱՍՆ ՍՑԵՆԱՐՆԵՐ
// ===================

// ${scenarios.map((scenario, index) => `
// ${index + 1}. ${scenario.title}
// ${'-'.repeat(scenario.title.length + 3)}
// Առաջնահերթություն: ${scenario.priorityText}
// Նկարագրություն: ${scenario.description}

// Գործողություններ:
// ${scenario.actions.map((action, actionIndex) => `  ${actionIndex + 1}. ${action}`).join('\n')}
// `).join('\n')}

// ---
// Տեղեկագիրը գեներացվել է ${new Date().toLocaleString('hy-AM')} ամսաթվին
//     `.trim();
//     }

//     /**
//      * Կիրառման պլանի գեներացում
//      */
//     function generateImplementationPlan(scenario) {
//         return `
// ԿԻՐԱՌՄԱՆ ՊԼԱՆ
// =============

// Սցենարի անվանում: ${scenario.title}
// Առաջնահերթություն: ${scenario.priorityText}
// Նախագիծ: ${projectName || 'Անանուն'}

// ԻՐԱԿԱՆԱՑՄԱՆ ՔԱՅԼԵՐ
// ===================

// ${scenario.actions.map((action, index) => `
// Քայլ ${index + 1}: ${action}
//   □ Մեկնարկի ամսաթիվ: ___________
//   □ Ավարտի ամսաթիվ: ___________
//   □ Պատասխանատու: ___________
//   □ Ռեսուրսներ: ___________
//   □ Կարգավիճակ: □ Սկսված □ Ընթացքում □ Ավարտված
// `).join('\n')}

// ՄՈՆԻՏՈՐԻՆԳ ԵՎ ԳՆԱՀԱՏՈՒՄ
// ========================
// □ Հաջողության ցուցանիշներ սահմանված են
// □ Իրականացման ժամանակացույց պատրաստ է
// □ Ռիսկերի գնահատումը կատարված է
// □ Հետադարձ կապի մեխանիզմները կարգավորված են

// ԾԱՆՈԹԱԳՐՈՒԹՅՈՒՆՆԵՐ
// ==================
// _________________________________________________
// _________________________________________________
// _________________________________________________

// ---
// Պլանը կազմվել է ${new Date().toLocaleString('hy-AM')} ամսաթվին
//     `.trim();
//     }

//     /**
//      * Գլխավոր ուղղությունների ստացում
//      */
//     function getMainDirections(scenarios) {
//         const directions = scenarios.slice(0, 3).map(s => s.title);
//         return directions;
//     }
// };

// /**
//  * Պատրաստության ստուգման բաղադրիչ
//  */
// const ReadinessCheck = ({ label, ready }) => {
//     return (
//         <div className="flex items-center justify-between text-sm">
//             <span className="text-blue-700">{label}:</span>
//             <span className={`font-bold ${ready ? 'text-green-600' : 'text-red-600'}`}>
//                 {ready ? '✅ Պատրաստ' : '❌ Բացակայում է'}
//             </span>
//         </div>
//     );
// };

// /**
//  * Սցենարների վիճակագրության բաղադրիչ
//  */
// const ScenarioStatistics = ({ scenarios }) => {
//     const priorityCounts = scenarios.reduce((acc, scenario) => {
//         acc[scenario.priority] = (acc[scenario.priority] || 0) + 1;
//         return acc;
//     }, {});

//     const totalActions = scenarios.reduce((sum, scenario) => sum + scenario.actions.length, 0);
//     const avgActionsPerScenario = (totalActions / scenarios.length).toFixed(1);

//     return (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center p-4 bg-red-50 rounded-lg">
//                 <div className="text-2xl font-bold text-red-600">{priorityCounts.high || 0}</div>
//                 <div className="text-sm text-red-700">Բարձր առաջնահերթություն</div>
//             </div>

//             <div className="text-center p-4 bg-yellow-50 rounded-lg">
//                 <div className="text-2xl font-bold text-yellow-600">{priorityCounts.medium || 0}</div>
//                 <div className="text-sm text-yellow-700">Միջին առաջնահերթություն</div>
//             </div>

//             <div className="text-center p-4 bg-green-50 rounded-lg">
//                 <div className="text-2xl font-bold text-green-600">{priorityCounts.low || 0}</div>
//                 <div className="text-sm text-green-700">Ցածր առաջնահերթություն</div>
//             </div>

//             <div className="text-center p-4 bg-blue-50 rounded-lg">
//                 <div className="text-2xl font-bold text-blue-600">{avgActionsPerScenario}</div>
//                 <div className="text-sm text-blue-700">Միջին գործողություններ</div>
//             </div>
//         </div>
//     );
// };

// /**
//  * Սցենարի մանրամասների մոդալ
//  */
// const ScenarioDetailsModal = ({ scenario, onClose, onExport }) => {
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                 {/* Վերնագիր */}
//                 <div className="flex justify-between items-start mb-4">
//                     <h3 className="text-xl font-bold text-white-800">{scenario.title}</h3>
//                     <button
//                         onClick={onClose}
//                         className="text-gray-500 hover:text-gray-700 text-2xl"
//                     >
//                         ×
//                     </button>
//                 </div>

//                 {/* Առաջնահերթություն */}
//                 <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${scenario.priority === 'high' ? 'bg-red-200 text-red-800' :
//                         scenario.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
//                             'bg-green-200 text-green-800'
//                     }`}>
//                     {scenario.priorityText}
//                 </div>

//                 {/* Նկարագրություն */}
//                 <div className="mb-6">
//                     <h4 className="font-bold text-gray-700 mb-2">📋 Նկարագրություն</h4>
//                     <p className="text-gray-600 leading-relaxed">{scenario.description}</p>
//                 </div>

//                 {/* Գործողություններ */}
//                 <div className="mb-6">
//                     <h4 className="font-bold text-gray-700 mb-2">🎯 Առաջարկվող գործողություններ</h4>
//                     <ol className="list-decimal list-inside space-y-2">
//                         {scenario.actions.map((action, index) => (
//                             <li key={index} className="text-gray-600">{action}</li>
//                         ))}
//                     </ol>
//                 </div>

//                 {/* Մետադատարներ */}
//                 {scenario.metadata && (
//                     <div className="mb-6 bg-gray-50 rounded-lg p-4">
//                         <h4 className="font-bold text-gray-700 mb-2">🔍 Լրացուցիչ տեղեկություններ</h4>
//                         <div className="text-sm text-gray-600 space-y-1">
//                             <div>Գեներացման ամսաթիվ: {new Date(scenario.metadata.generatedAt).toLocaleDateString('hy-AM')}</div>
//                             <div>Տվյալների տեսակ: {scenario.metadata.dataType}</div>
//                             {scenario.metadata.adaptive && <div>Ադապտիվ սցենար: Այո</div>}
//                         </div>
//                     </div>
//                 )}

//                 {/* Գործողությունների կոճակներ */}
//                 <div className="flex gap-3">
//                     <Button
//                         onClick={onExport}
//                         variant="success"
//                         size="md"
//                         className="flex-1"
//                     >
//                         📊 Արտահանել տեղեկագիր
//                     </Button>
//                     <Button
//                         onClick={onClose}
//                         variant="secondary"
//                         size="md"
//                     >
//                         Փակել
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ScenariosTab;


// src/components/AnalysisWorkspace/TabContents/ScenariosTab.js
// Սցենարների գեներացման տաբ

import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { ChartCard, ScenarioCard } from '../../UI/Card';
import Button, { ButtonGroup } from '../../UI/Button';
import Alert from '../../UI/Alert';
import { generateAIScenarios } from '../../../utils/scenarios';


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
     * File download utility function
     */
    const downloadFile = (content, filename, mimeType = 'text/plain') => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

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
            // Prepare analysis results for AI
            const analysisResults = {
                fuzzyResults: fuzzyResults,
                statistics: {
                    mean: currentData?.reduce((sum, item) => sum + (typeof item === 'object' ? Object.values(item)[0] : item), 0) / currentData?.length || 0,
                    stdDev: 0, // You can calculate this properly if needed
                    min: Math.min(...currentData?.map(item => typeof item === 'object' ? Object.values(item)[0] : item) || [0]),
                    max: Math.max(...currentData?.map(item => typeof item === 'object' ? Object.values(item)[0] : item) || [0])
                }
            };

            // Context data for AI
            const contextData = {
                region: 'Կոտայքի մարզ', // You can make this dynamic
                timeframe: 'միջնաժամկետ',
                budget: '2-5 միլիոն դրամ'
            };

            // Get current user ID (you can get this from your auth context)
            const userId = getCurrentUserId();

            // Generate scenarios using AI
            const generatedScenarios = await generateAIScenarios(
                dataType,
                analysisResults,
                clusterData,
                contextData,
                userId
            );

            setScenarios(generatedScenarios);
            console.log('Գեներացված AI սցենարներ:', generatedScenarios);

        } catch (error) {
            console.error('Սցենարների գեներացիայի սխալ:', error);
            alert('Սցենարների գեներացման ժամանակ սխալ առաջացավ: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * Get current user ID - implement based on your auth system
     */
    const getCurrentUserId = () => {
        // Replace this with your actual user ID retrieval logic
        return parseInt(localStorage.getItem('userId')) || 1;
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
        const filename = `scenario_${scenario.title.replace(/[^a-zA-Z0-9\u0531-\u0587]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        downloadFile(content, filename);
        alert(`Սցենարը "${scenario.title}" արտահանվել է`);
    };

    /**
     * Բոլոր սցենարների արտահանում
     */
    const exportAllScenarios = () => {
        if (!scenarios || scenarios.length === 0) {
            alert('Արտահանելու համար սցենարներ չեն գտնվել');
            return;
        }

        const content = generateAllScenariosReport(scenarios);
        const filename = `all_scenarios_${projectName?.replace(/[^a-zA-Z0-9\u0531-\u0587]/g, '_') || 'project'}_${new Date().toISOString().split('T')[0]}.txt`;
        downloadFile(content, filename);
        alert(`${scenarios.length} սցենար արտահանվել է`);
    };

    /**
     * Սցենարի իրականացման պլանի արտահանում
     */
    const implementScenario = (scenario) => {
        const implementationPlan = generateImplementationPlan(scenario);
        const filename = `implementation_plan_${scenario.title.replace(/[^a-zA-Z0-9\u0531-\u0587]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        downloadFile(implementationPlan, filename);
        alert(`Կիրառման պլանը պատրաստ է "${scenario.title}" սցենարի համար`);
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
                {/* <p className="text-gray-600">
                    Որոշումների աջակցության գործնական սցենարների ինտելիգենտ ստեղծում AI-ի միջոցով
                </p> */}
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
                        {/* <h4 className="font-bold text-blue-800 mb-3">🤖 AI Սցենարային մոդելավորում</h4> */}
                        {/* <p className="text-sm text-blue-700 mb-4">
                            Արհեստական բանականությունը կվերլուծի ձեր տվյալները և կստեղծի 
                            հարմարեցված գործողությունների սցենարներ:
                        </p> */}

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
                            {isGenerating ? '🔄 գեներացում...' : '🤖 Գեներացնել սցենարներ'}
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
                                onClick={exportAllScenarios}
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
                            <div key={scenario.id || index} className="group">
                                <ScenarioCard
                                    title={scenario.title}
                                    description={scenario.description}
                                    priority={scenario.priority}
                                    priorityText={scenario.priorityText}
                                    actions={scenario.actions}
                                    className="transition-all duration-300 hover:shadow-lg cursor-pointer"
                                    onClick={() => showScenarioDetails(scenario)}
                                />

                                {/* AI ինդիկատոր */}
                                {/* {scenario.metadata?.aiGenerated && (
                                    <div className="mt-2 flex items-center space-x-2 text-xs text-blue-600">
                                        <span>🤖 AI-ով գեներացված</span>
                                        {scenario.confidenceText && <span>• {scenario.confidenceText}</span>}
                                    </div>
                                )} */}

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
                <Alert type="success" title="Սցենարային մոդելավորումը հաջողությամբ ավարտվել է">
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
                        {scenarios.some(s => s.metadata?.aiGenerated) && (
                            <div className="text-blue-600 text-xs flex items-center space-x-1">
                                <span>🤖</span>
                                {/* <span>Մի քանի սցենար գեներացվել են արհեստական բանականության միջոցով</span> */}
                            </div>
                        )}
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
     * Սցենարի տեղեկագիր
     */
    function generateScenarioReport(scenario) {
        return `
ՍՑԵՆԱՐԻ ՄԱՆՐԱՄԱՍՆ ՏԵՂԵԿԱԳԻՐ
===============================

Սցենարի անվանում: ${scenario.title}
Առաջնահերթություն: ${scenario.priorityText}
Գեներացման ամսաթիվ: ${new Date().toLocaleDateString('hy-AM')}
Նախագիծ: ${projectName || 'Անանուն'}
Տվյալների տեսակ: ${getDataTypeLabel(dataType)}
${scenario.metadata?.aiGenerated ? 'AI-ով գեներացված: Այո' : ''}

ՆԿԱՐԱԳՐՈՒԹՅՈՒՆ
==============
${scenario.description}

ԱՌԱՋԱՐԿՎՈՂ ԳՈՐԾՈՂՈՒԹՅՈՒՆՆԵՐ
==========================
${scenario.actions.map((action, index) => `${index + 1}. ${action}`).join('\n')}

${scenario.indicators ? `
ՉԱՓԱՆԻՇՆԵՐ
===========
${scenario.indicators.map((indicator, index) => `${index + 1}. ${indicator}`).join('\n')}
` : ''}

${scenario.risks ? `
ՌԻՍԿԵՐ
=======
${scenario.risks.map((risk, index) => `${index + 1}. ${risk}`).join('\n')}
` : ''}

${scenario.estimatedBudget ? `
ԳՆԱՀԱՏՎՈՂ ԲՅՈՒՋԵՏ
==================
${scenario.estimatedBudget}
` : ''}

${scenario.expectedOutcomes ? `
ԱԿՆԿԱԼՎՈՂ ԱՐԴՅՈՒՆՔՆԵՐ
====================
${scenario.expectedOutcomes.map((outcome, index) => `${index + 1}. ${outcome}`).join('\n')}
` : ''}

${scenario.metadata ? `
ԼՐԱՑՈՒՑԻՉ ՏԵՂԵԿՈՒԹՅՈՒՆՆԵՐ
========================
Գեներացման ամսաթիվ: ${new Date(scenario.metadata.generatedAt).toLocaleDateString('hy-AM')}
Տվյալների տեսակ: ${scenario.metadata.dataType}
${scenario.metadata.aiGenerated ? 'AI-ով գեներացված: Այո' : ''}
${scenario.confidenceText ? 'Վստահություն: ' + scenario.confidenceText : ''}
${scenario.feasibilityText ? 'Իրականացվելիություն: ' + scenario.feasibilityText : ''}
` : ''}

---
Տեղեկագիրը գեներացվել է ${new Date().toLocaleString('hy-AM')} ամսաթվին
    `.trim();
    }

    /**
     * Բոլոր սցենարների տեղեկագիր
     */
    function generateAllScenariosReport(scenarios) {
        const priorityCounts = scenarios.reduce((acc, scenario) => {
            acc[scenario.priority] = (acc[scenario.priority] || 0) + 1;
            return acc;
        }, {});

        const aiGeneratedCount = scenarios.filter(s => s.metadata?.aiGenerated).length;

        return `
ՍՑԵՆԱՐՆԵՐԻ ԱՄԲՈՂՋԱԿԱՆ ՏԵՂԵԿԱԳԻՐ
=================================

Նախագիծ: ${projectName || 'Անանուն'}
Տվյալների տեսակ: ${getDataTypeLabel(dataType)}
Գեներացման ամսաթիվ: ${new Date().toLocaleDateString('hy-AM')}

ԱՄՓՈՓ ՎԻՃԱԿԱԳՐՈՒԹՅՈՒՆ
=====================
Ընդհանուր սցենարներ: ${scenarios.length}
Բարձր առաջնահերթություն: ${priorityCounts.high || 0}
Միջին առաջնահերթություն: ${priorityCounts.medium || 0}
Ցածր առաջնահերթություն: ${priorityCounts.low || 0}
AI-ով գեներացված: ${aiGeneratedCount}

ՄԱՆՐԱՄԱՍՆ ՍՑԵՆԱՐՆԵՐ
===================

${scenarios.map((scenario, index) => `
${index + 1}. ${scenario.title}
${'-'.repeat(scenario.title.length + 3)}
Առաջնահերթություն: ${scenario.priorityText}
${scenario.metadata?.aiGenerated ? 'AI-ով գեներացված: Այո' : ''}
Նկարագրություն: ${scenario.description}

Գործողություններ:
${scenario.actions.map((action, actionIndex) => `  ${actionIndex + 1}. ${action}`).join('\n')}
`).join('\n')}

---
Տեղեկագիրը գեներացվել է ${new Date().toLocaleString('hy-AM')} ամսաթվին
    `.trim();
    }

    /**
     * Կիրառման պլանի գեներացում
     */
    function generateImplementationPlan(scenario) {
        return `
ԿԻՐԱՌՄԱՆ ՊԼԱՆ
=============

Սցենարի անվանում: ${scenario.title}
Առաջնահերթություն: ${scenario.priorityText}
Նախագիծ: ${projectName || 'Անանուն'}
${scenario.metadata?.aiGenerated ? 'AI-ով գեներացված: Այո' : ''}

ԻՐԱԿԱՆԱՑՄԱՆ ՔԱՅԼԵՐ
===================

${scenario.actions.map((action, index) => `
Քայլ ${index + 1}: ${action}
  □ Մեկնարկի ամսաթիվ: ___________
  □ Ավարտի ամսաթիվ: ___________
  □ Պատասխանատու: ___________
  □ Ռեսուրսներ: ___________
  □ Կարգավիճակ: □ Սկսված □ Ընթացքում □ Ավարտված
`).join('\n')}

ՄՈՆԻՏՈՐԻՆԳ ԵՎ ԳՆԱՀԱՏՈՒՄ
========================
□ Հաջողության ցուցանիշներ սահմանված են
□ Իրականացման ժամանակացույց պատրաստ է
□ Ռիսկերի գնահատումը կատարված է
□ Հետադարձ կապի մեխանիզմները կարգավորված են

${scenario.estimatedBudget ? `
ԲՅՈՒՋԵՏ
=======
Գնահատվող ծախսեր: ${scenario.estimatedBudget}
` : ''}

ԾԱՆՈԹԱԳՐՈՒԹՅՈՒՆՆԵՐ
==================
_________________________________________________
_________________________________________________
_________________________________________________

---
Պլանը կազմվել է ${new Date().toLocaleString('hy-AM')} ամսաթվին
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
    const aiGeneratedCount = scenarios.filter(s => s.metadata?.aiGenerated).length;

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

            <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{aiGeneratedCount}</div>
                <div className="text-sm text-purple-700">AI գեներացված</div>
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
                    <div>
                        <h3 className="text-xl font-bold text-white-800">{scenario.title}</h3>

                    </div>
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

                {/* Վստահություն և իրականացվելիություն */}
                {(scenario.confidenceText || scenario.feasibilityText) && (
                    <div className="mb-4 flex space-x-4 text-sm">
                        {scenario.confidenceText && (
                            <span className="text-blue-600">📊 {scenario.confidenceText}</span>
                        )}
                        {scenario.feasibilityText && (
                            <span className="text-green-600">⚡ {scenario.feasibilityText}</span>
                        )}
                    </div>
                )}

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

                {/* Չափանիշներ */}
                {scenario.indicators && scenario.indicators.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-700 mb-2">📈 Չափանիշներ</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {scenario.indicators.map((indicator, index) => (
                                <li key={index} className="text-gray-600">{indicator}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Ռիսկեր */}
                {scenario.risks && scenario.risks.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-700 mb-2">⚠️ Ռիսկեր</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {scenario.risks.map((risk, index) => (
                                <li key={index} className="text-gray-600">{risk}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Բյուջետ */}
                {scenario.estimatedBudget && (
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-700 mb-2">💰 Գնահատվող բյուջետ</h4>
                        <p className="text-gray-600">{scenario.estimatedBudget}</p>
                    </div>
                )}

                {/* Ակնկալվող արդյունքներ */}
                {scenario.expectedOutcomes && scenario.expectedOutcomes.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-700 mb-2">🎯 Ակնկալվող արդյունքներ</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {scenario.expectedOutcomes.map((outcome, index) => (
                                <li key={index} className="text-gray-600">{outcome}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Մետադատարներ */}
                {scenario.metadata && (
                    <div className="mb-6 bg-gray-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-700 mb-2">🔍 Լրացուցիչ տեղեկություններ</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>Գեներացման ամսաթիվ: {new Date(scenario.metadata.generatedAt).toLocaleDateString('hy-AM')}</div>
                            <div>Տվյալների տեսակ: {scenario.metadata.dataType}</div>
                            {scenario.metadata.aiGenerated && <div>AI-ով գեներացված: Այո</div>}
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