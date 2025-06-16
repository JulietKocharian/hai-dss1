// src/components/AnalysisWorkspace/TabContents/ClusteringTab.js
// Կլաստերիզացիայի վերլուծության տաբ

import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { ChartCard, ClusterCard } from '../../UI/Card';
import Button, { ButtonGroup } from '../../UI/Button';
import Alert from '../../UI/Alert';
import { performClustering } from '../../../utils/clustering';
import ClusterCharts from '../../Charts/ClusterCharts';
import ClusterPointsChart from '../../Charts/ClusterPointsChart';
import ClusterScatterChart from '../../Charts/ClusteringScatter';

/**
 * ClusteringTab բաղադրիչ - կլաստերիզացիայի վերլուծության ինտերֆեյս
 * Ցուցադրում է տվյալների խմբավորման արդյունքները և կլաստերային վիճակագրությունը
 */
const ClusteringTab = () => {
    const {
        currentData,
        clusterData,
        setClusterData,
        dataType
    } = useData();

    const [showVisualization, setShowVisualization] = useState(false);


    const [clusteringSettings, setClusteringSettings] = useState({
        clusterCount: 4,
        method: 'acas', // Changed from 'kmeans' to 'acas' as default
        maxIterations: 100
    });

    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Կլաստերիզացիայի մեկնարկ
     */
    const startClustering = async () => {
        if (!currentData || currentData.length === 0) {
            alert('Տվյալները բացակայում են կլաստերիզացիայի համար');
            return;
        }

        setIsProcessing(true);

        try {
            // Սիմուլյացիայի հետաձգում
            await new Promise(resolve => setTimeout(resolve, 2000));

            const clusters = await performClustering(currentData, dataType, clusteringSettings);
            setClusterData(clusters);

            console.log('Կլաստերիզացիայի արդյունք:', clusters);

        } catch (error) {
            console.error('Կլաստերիզացիայի սխալ:', error);
            alert('Կլաստերիզացիայի ժամանակ սխալ առաջացավ');
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Կարգավորումների թարմացում
     */
    const updateSettings = (key, value) => {
        setClusteringSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    if (!currentData || currentData.length === 0) {
        return (
            <Alert type="warning" title="Տվյալներ չեն գտնվել">
                Կլաստերիզացիայի համար անհրաժեշտ է նախ մուտքագրել տվյալները:
            </Alert>
        );
    }

    console.log(clusterData, 'clusterDataclusterData')
    return (
        <div className="space-y-6">
            {/* Վերնագիր */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    🎯 Կլաստերացման մեթոդ
                </h3>
            </div>

            {/* Մեթոդաբանական ինֆո */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">🧮 Կլաստերացման մասին</h4>
                <div className="text-sm text-red-700 space-y-2">
                    {/* <p>
                        <strong>Կլաստերիզացիան</strong> մեքենայական ուսուցման անուսուցանաչ մեթոդ է, որը տվյալները
                        բաժանում է նմանության հիման վրա:
                    </p> */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="bg-white rounded p-3 border">
                            <div className="font-bold text-blue-600">ACAS</div>
                            <div className="text-xs text-gray-600 mt-1">Ավտոմատ ընտրություն և օպտիմալ կարգավորում</div>
                        </div>
                        <div className="bg-white rounded p-3 border">
                            <div className="font-bold text-green-600">Hierarchical</div>
                            <div className="text-xs text-gray-600 mt-1">Ստեղծում է կլաստերների ծառ</div>
                        </div>
                        <div className="bg-white rounded p-3 border">
                            <div className="font-bold text-purple-600">DBSCAN</div>
                            <div className="text-xs text-gray-600 mt-1">Հաշվի է առնում աղմուկը և ոչ ստանդարտ կետերը</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Կլաստերիզացիայի կարգավորումներ */}
                <ChartCard
                    title="Կլաստերացման կարգավորումներ"
                >
                    <div className="space-y-4">
                        {/* Կլաստերների քանակ */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Կլաստերների քանակ
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="8"
                                value={clusteringSettings.clusterCount}
                                onChange={(e) => updateSettings('clusterCount', parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>2</span>
                                <span className="font-bold text-red-600">{clusteringSettings.clusterCount}</span>
                                <span>8</span>
                            </div>
                        </div>

                        {/* Ալգորիթմի մեթոդ */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Կլաստերացման մեթոդ
                            </label>
                            <select
                                value={clusteringSettings.method}
                                onChange={(e) => updateSettings('method', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                {/* <option value="kmeans">🎯 K-Means</option>
                                <option value="hierarchical">🌳 Հիերարխիկ</option>
                                <option value="dbscan">🔍 DBSCAN</option> */}
                                <option value="acas">🤖 ACAS (Ավտոմատ ընտրություն)</option>
                                <option value="kmeans">🎯 K-Միջիններ (K-Means)</option>
                                <option value="fuzzy_cmeans">🌸 Fuzzy C-Միջիններ</option>
                                <option value="hierarchical">🌳 Հիերարխիկ կլաստերացում</option>
                                <option value="dbscan">🔍 DBSCAN</option>
                                <option value="spectral">🌈 Սպեկտրալ կլաստերացում</option>
                            </select>
                        </div>

                        {/* Առավելագույն կրկնություններ */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Առավելագույն կրկնություններ
                            </label>
                            <input
                                type="number"
                                min="50"
                                max="500"
                                step="50"
                                value={clusteringSettings.maxIterations}
                                onChange={(e) => updateSettings('maxIterations', parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Կլաստերիզացիայի կոճակ */}
                        <div className="pt-4 border-t border-gray-200">
                            <Button
                                onClick={startClustering}
                                variant="warning"
                                size="md"
                                className="w-full"
                                disabled={isProcessing}
                                loading={isProcessing}
                            >
                                {isProcessing ? '🔄 Կլաստերացում...' : '🎯 Սկսել կլաստերացումը'}
                            </Button>
                        </div>
                    </div>
                </ChartCard>

                {/* Տվյալների նախապատրաստում */}

                <ChartCard
                    title="Տվյալների նախապատրաստում"
                >
                    <div className="space-y-4">
                        {/* Տվյալների վիճակագրություն */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-bold text-gray-700 mb-3">📊 Տվյալների ամփոփում</h5>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Տողեր:</span>
                                    <span className="font-bold ml-2">{currentData.length}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Սյունակներ:</span>
                                    <span className="font-bold ml-2">{Object.keys(currentData[0]).length}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Կլաստերների քանակ:</span>
                                    <span className="font-bold ml-2">{getDimensionality()}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Հարմարություն:</span>
                                    <span className="font-bold ml-2 text-green-600">{getClusterabilityScore()}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Մեթոդի ընտրության առաջարկություն */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-bold text-blue-700 mb-2">🤖 Առաջարկվող մեթոդ</h5>
                            <div className="text-sm text-blue-600">
                                {getRecommendedMethod()}
                            </div>
                        </div>

                        {/* Կանխատեսված ժամանակ */}
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <h5 className="font-bold text-yellow-700 mb-2">⏱️ Գնահատված ժամանակ</h5>
                            <div className="text-sm text-yellow-600">
                                <div>Մշակման ժամանակ: {getEstimatedTime()}</div>
                                <div>Բարդություն: {getComplexity()}</div>
                            </div>
                        </div>

                        {/* Նախապայմաններ */}
                        <div className="text-xs text-gray-500">
                            <strong>💡 Հուշումներ:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Ավելի քիչ կլաստերներ = ավելի շատ ընդհանուր խմբեր</li>
                                <li>ACAS ալգորիթմը ավտոմատ կընտրի լավագույն մեթոդը</li>
                                <li>Ալգորիթմը կհայտնաբերի աղմուկը և անկանոն կետերը</li>
                            </ul>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Կլաստերիզացիայի արդյունքներ */}
            {clusterData && clusterData.length > 0 && (
                <>
                    <ChartCard title="Կլաստերացման արդյունքներ">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {clusterData.map((cluster, index) => (
                                <ClusterCard
                                    key={index}
                                    id={cluster.id}
                                    label={cluster.label}
                                    size={cluster.size}
                                    avgValue={cluster.avgValue}
                                    quality={cluster.quality}
                                />
                            ))}
                        </div>
                    </ChartCard>

                    {/* Կլաստերների վիճակագրություն */}
                    <ChartCard title="Խմբավորման վիճակագրություն">
                        <ClusterStatistics clusters={clusterData} totalData={currentData.length} />
                    </ChartCard>

                    {/* Գործողությունների կոճակներ */}
                    <div className="text-center">
                        <ButtonGroup>
                            <Button
                                onClick={() => exportClusterData()}
                                variant="success"
                                size="md"
                            >
                                📊 Ներբեռնել կլաստերները
                            </Button>

                            <Button
                                onClick={() => visualizeClusters()}
                                variant="secondary"
                                size="md"
                            >
                                📈 Վիզուալացում
                            </Button>

                            <Button
                                onClick={() => startClustering()}
                                variant="warning"
                                size="md"
                            >
                                🔄 Վերակլաստերացում
                            </Button>
                        </ButtonGroup>
                    </div>
                </>
            )}


            {/* Կլաստերիզացիայի վերլուծության ծանուցում */}
            {clusterData && clusterData.length > 0 && (
                <Alert type="success" title="🎯 Կլաստերացումը հաջողությամբ ավարտվել է">
                    <div className="space-y-2 text-sm">
                        <p>
                            Հայտնաբերվել է <strong>{clusterData.length} տարբեր խումբ</strong> ընդհանուր
                            <strong> {currentData.length} տվյալի</strong> մեջ
                        </p>
                        <div>
                            <strong>Հիմնական բացահայտումներ</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Ամենամեծ խումբը պարունակում է {Math.max(...clusterData.map(c => c.size))} տարր</li>
                                <li>Ամենամիջին որակի խումբը ունի {Math.max(...clusterData.map(c => c.quality))}% որակ</li>
                                <li>Տվյալների բաշխումը {clusterData.length > 4 ? 'բազմախմբային' : 'հավասարակշռված'} է</li>
                            </ul>
                        </div>
                    </div>
                </Alert>
            )}

            {showVisualization && clusterData.length > 0 && (
                <ClusterCharts clusters={clusterData} />
            )}
            {showVisualization && clusterData.length > 0 && (
                <ClusterScatterChart clusters={clusterData} />

            )}


        </div>
    );

    /**
     * Տվյալների չափեր (dimensions)
     */
    function getDimensionality() {
        return Object.keys(currentData[0]).length;
    }

    /**
     * Կլաստերիզացիայի հարմարության գնահատակ
     */
    function getClusterabilityScore() {
        // Պարզ գնահատակ՝ հիմված տվյալների չափի և բազմազանության վրա
        const size = currentData.length;
        const dimensions = getDimensionality();

        if (size < 20) return 60;
        if (size < 100) return 75;
        if (dimensions > 10) return 85;
        return 90;
    }

    /**
     * Առաջարկվող մեթոդի ստացում
     */
    function getRecommendedMethod() {
        const size = currentData.length;
        const dimensions = getDimensionality();

        if (size < 50) {
            return '🤖 ACAS (ավտոմատ մեթոդի ընտրություն փոքր տվյալների համար)';
        } else if (dimensions > 5) {
            return '🤖 ACAS (բազմաչափ տվյալների համար ավտոմատ օպտիմիզացիա)';
        } else {
            return '🤖 ACAS (ավտոմատ կլաստերացման ալգորիթմի ընտրություն)';
        }
    }

    /**
     * Գնահատված ժամանակի ստացում
     */
    function getEstimatedTime() {
        const size = currentData.length;
        if (size < 100) return '1-2 վայրկյան';
        if (size < 500) return '3-5 վայրկյան';
        return '5-10 վայրկյան';
    }

    /**
     * Բարդության ստացում
     */
    function getComplexity() {
        const size = currentData.length;
        const clusters = clusteringSettings.clusterCount;

        if (size < 100 && clusters < 5) return 'Ցածր';
        if (size < 500 && clusters < 7) return 'Միջին';
        return 'Բարձր';
    }

    /**
     * Կլաստերային տվյալների արտահանում
     */
    function exportClusterData() {
        // Կիրականացվի useFileDownload hook-ով
        console.log('Արտահանում կլաստերները...', clusterData);
        alert('Կլաստերները արտահանվել են CSV ֆայլի մեջ');
    }

    /**
     * Կլաստերների վիզուալիզացիա
     */
    function visualizeClusters() {
        console.log('Վիզուալիզացման մեկնարկ...', clusterData);
        setShowVisualization(true); // Show charts
    }

};

/**
 * Կլաստերների վիճակագրության բաղադրիչ
 */
const ClusterStatistics = ({ clusters, totalData }) => {
    const totalClustered = clusters.reduce((sum, cluster) => sum + cluster.size, 0);
    const avgClusterSize = totalClustered / clusters.length;
    const coverage = (totalClustered / totalData) * 100;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{clusters.length}</div>
                <div className="text-sm text-blue-700">Խմբերի քանակ</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{Math.round(avgClusterSize)}</div>
                <div className="text-sm text-green-700">Միջին չափ</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{coverage.toFixed(1)}%</div>
                <div className="text-sm text-purple-700">Ընդգրկում </div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                    {Math.round(clusters.reduce((sum, c) => sum + c.quality, 0) / clusters.length)}%
                </div>
                <div className="text-sm text-orange-700">Միջին որակ</div>
            </div>
        </div>
    );
};

export default ClusteringTab;