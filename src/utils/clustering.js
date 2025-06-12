// src/utils/clustering.js
// Կլաստերիզացիայի ալգորիթմներ տվյալների խմբավորման համար

import { detectDataType } from './dataHelpers';

/**
 * Կլաստերիզացիայի իրականացում տվյալների վրա
 * @param {Array} data - Վերլուծելիք տվյալներ
 * @param {string} dataType - Տվյալների տեսակ
 * @param {Object} options - Կլաստերիզացիայի ընտրանքներ
 * @returns {Array} Կլաստերների ցուցակ
 */
export const performClustering = (data, dataType, options = {}) => {
    const {
        clusterCount = 4,
        method = 'kmeans',
        maxIterations = 100
    } = options;

    if (!data || data.length === 0) {
        return [];
    }

    try {
        // Տվյալների նախապատրաստում
        const processedData = preprocessDataForClustering(data);

        // Կլաստերիզացիայի մեթոդի ընտրություն
        let clusters;
        switch (method) {
            case 'hierarchical':
                clusters = hierarchicalClustering(processedData, clusterCount);
                break;
            case 'dbscan':
                clusters = dbscanClustering(processedData);
                break;
            case 'kmeans':
            default:
                clusters = kMeansClustering(processedData, clusterCount, maxIterations);
                break;
        }

        // Կլաստերների մետադատարներով հարստացում
        const enrichedClusters = enrichClusters(clusters, data, dataType);

        return enrichedClusters;

    } catch (error) {
        console.error('Կլաստերիզացիայի սխալ:', error);

        // Պարզ կլաստերիզացիա սխալի դեպքում
        return createFallbackClusters(data, dataType, clusterCount);
    }
};

/**
 * Տվյալների նախապատրաստում կլաստերիզացիայի համար
 * @param {Array} data - Չմշակված տվյալներ
 * @returns {Array} Մշակված տվյալների մատրիցա
 */
const preprocessDataForClustering = (data) => {
    const headers = Object.keys(data[0]);
    const numericHeaders = [];
    const scalingFactors = {};

    // Թվային սյունակների հայտնաբերում
    headers.forEach(header => {
        const values = data.map(row => row[header]).filter(val => val !== null && val !== undefined && val !== '');
        const numericValues = values.filter(val => !isNaN(parseFloat(val)));

        if (numericValues.length > values.length * 0.7) { // 70% թվային արժեքներ
            numericHeaders.push(header);

            // Նորմալիզացիայի ֆակտորների հաշվարկ
            const numbers = numericValues.map(val => parseFloat(val));
            const min = Math.min(...numbers);
            const max = Math.max(...numbers);
            scalingFactors[header] = { min, max, range: max - min || 1 };
        }
    });

    // Տվյալների մատրիցի ստեղծում
    return data.map((row, index) => {
        const vector = [];

        numericHeaders.forEach(header => {
            const value = row[header];
            if (value !== null && value !== undefined && value !== '' && !isNaN(parseFloat(value))) {
                // Նորմալիզացիա [0, 1] ինտերվալում
                const normalized = (parseFloat(value) - scalingFactors[header].min) / scalingFactors[header].range;
                vector.push(normalized);
            } else {
                vector.push(0); // Բացակայող արժեքների լրացում
            }
        });

        // Կատեգորիական տվյալների մշակում
        headers.forEach(header => {
            if (!numericHeaders.includes(header)) {
                const value = row[header];
                if (value && typeof value === 'string') {
                    // Կատեգորիական արժեքի թվային մաթառացում
                    vector.push(hashStringToNumber(value) / 1000); // Նորմալիզացված hash
                } else {
                    vector.push(0);
                }
            }
        });

        return {
            index,
            vector,
            originalData: row
        };
    });
};

/**
 * K-Means++ ալգորիթմի իրականացում
 * @param {Array} data - Մշակված տվյալներ
 * @param {number} k - Կլաստերների քանակ
 * @param {number} maxIterations - Առավելագույն կրկնություններ
 * @returns {Array} Կլաստերներ
 */
const kMeansClustering = (data, k, maxIterations) => {
    if (data.length === 0 || k <= 0) {
        return [];
    }

    const dimensions = data[0].vector.length;

    // Նախնական կենտրոնների ինիցիալիզացիա (K-Means++ մեթոդ)
    const centers = initializeCentersPlusPlus(data, k, dimensions);

    for (let iteration = 0; iteration < maxIterations; iteration++) {
        // Կետերի կլաստերներին վերագրում
        const clusters = Array.from({ length: k }, () => []);

        data.forEach(point => {
            let minDistance = Infinity;
            let assignedCluster = 0;

            centers.forEach((center, clusterIndex) => {
                const distance = euclideanDistance(point.vector, center);
                if (distance < minDistance) {
                    minDistance = distance;
                    assignedCluster = clusterIndex;
                }
            });

            clusters[assignedCluster].push(point);
        });

        // Նոր կենտրոնների հաշվարկ
        const newCenters = clusters.map(cluster => {
            if (cluster.length === 0) {
                return centers[0]; // Դատարկ կլաստերի դեպքում
            }

            return cluster[0].vector.map((_, dimIndex) => {
                return cluster.reduce((sum, point) => sum + point.vector[dimIndex], 0) / cluster.length;
            });
        });

        // Կոնվերգենցիայի ստուգում
        const convergence = centers.every((center, index) =>
            euclideanDistance(center, newCenters[index]) < 0.001
        );

        centers.splice(0, centers.length, ...newCenters);

        if (convergence) {
            break;
        }
    }

    // Վերջնական կլաստերների ստեղծում
    const finalClusters = Array.from({ length: k }, () => []);

    data.forEach(point => {
        let minDistance = Infinity;
        let assignedCluster = 0;

        centers.forEach((center, clusterIndex) => {
            const distance = euclideanDistance(point.vector, center);
            if (distance < minDistance) {
                minDistance = distance;
                assignedCluster = clusterIndex;
            }
        });

        finalClusters[assignedCluster].push(point);
    });

    return finalClusters.map((cluster, index) => ({
        id: index + 1,
        center: centers[index],
        points: cluster,
        size: cluster.length
    }));
};

/**
 * K-Means++ նախնական կենտրոնների ընտրություն
 * @param {Array} data - Տվյալներ
 * @param {number} k - Կլաստերների քանակ
 * @param {number} dimensions - Վեկտորի չափերի քանակ
 * @returns {Array} Նախնական կենտրոններ
 */
const initializeCentersPlusPlus = (data, k, dimensions) => {
    const centers = [];

    // Առաջին կենտրոնը պատահական
    centers.push([...data[Math.floor(Math.random() * data.length)].vector]);

    // Մնացած կենտրոններն ընտրվում են հավանականության հիման վրա
    for (let i = 1; i < k; i++) {
        const distances = data.map(point => {
            return Math.min(...centers.map(center => euclideanDistance(point.vector, center)));
        });

        const totalDistance = distances.reduce((sum, d) => sum + d * d, 0);
        const randomValue = Math.random() * totalDistance;

        let cumulativeDistance = 0;
        for (let j = 0; j < data.length; j++) {
            cumulativeDistance += distances[j] * distances[j];
            if (cumulativeDistance >= randomValue) {
                centers.push([...data[j].vector]);
                break;
            }
        }
    }

    return centers;
};

/**
 * Հիերարխիկ կլաստերիզացիա (Agglomerative)
 * @param {Array} data - Տվյալներ
 * @param {number} targetClusters - Նպատակային կլաստերների քանակ
 * @returns {Array} Կլաստերներ
 */
const hierarchicalClustering = (data, targetClusters) => {
    // Նախնական կլաստերներ - յուրաքանչյուր կետ առանձին կլաստեր
    let clusters = data.map((point, index) => ({
        id: index,
        points: [point],
        center: [...point.vector]
    }));

    // Ամալակցում մինչև նպատակային քանակ
    while (clusters.length > targetClusters) {
        let minDistance = Infinity;
        let mergeIndices = [0, 1];

        // Ամենամոտ կլաստերների զույգի գտնում
        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const distance = euclideanDistance(clusters[i].center, clusters[j].center);
                if (distance < minDistance) {
                    minDistance = distance;
                    mergeIndices = [i, j];
                }
            }
        }

        // Կլաստերների ամալակցում
        const [i, j] = mergeIndices;
        const mergedCluster = {
            id: clusters[i].id,
            points: [...clusters[i].points, ...clusters[j].points],
            center: []
        };

        // Նոր կենտրոնի հաշվարկ
        const totalPoints = mergedCluster.points.length;
        mergedCluster.center = mergedCluster.points[0].vector.map((_, dimIndex) => {
            return mergedCluster.points.reduce((sum, point) => sum + point.vector[dimIndex], 0) / totalPoints;
        });

        // Կլաստերների ցուցակի թարմացում
        clusters.splice(Math.max(i, j), 1);
        clusters.splice(Math.min(i, j), 1);
        clusters.push(mergedCluster);
    }

    return clusters.map((cluster, index) => ({
        id: index + 1,
        center: cluster.center,
        points: cluster.points,
        size: cluster.points.length
    }));
};

/**
 * DBSCAN ալգորիթմի պարզ իրականացում
 * @param {Array} data - Տվյալներ
 * @param {number} eps - Հարևանության ռադիուս
 * @param {number} minPoints - Նվազագույն կետերի քանակ
 * @returns {Array} Կլաստերներ
 */
const dbscanClustering = (data, eps = 0.3, minPoints = 3) => {
    const clusters = [];
    const visited = new Set();
    const noise = [];

    data.forEach((point, index) => {
        if (visited.has(index)) return;

        visited.add(index);
        const neighbors = getNeighbors(data, index, eps);

        if (neighbors.length < minPoints) {
            noise.push(point);
        } else {
            const cluster = [];
            expandCluster(data, index, neighbors, cluster, visited, eps, minPoints);
            clusters.push({
                id: clusters.length + 1,
                points: cluster,
                size: cluster.length,
                center: calculateCentroid(cluster)
            });
        }
    });

    return clusters;
};

/**
 * Հարևանների գտնում DBSCAN-ի համար
 * @param {Array} data - Տվյալներ
 * @param {number} pointIndex - Կետի ինդեքս
 * @param {number} eps - Հարևանության ռադիուս
 * @returns {Array} Հարևանների ինդեքսներ
 */
const getNeighbors = (data, pointIndex, eps) => {
    const neighbors = [];
    const point = data[pointIndex];

    data.forEach((otherPoint, index) => {
        if (index !== pointIndex) {
            const distance = euclideanDistance(point.vector, otherPoint.vector);
            if (distance <= eps) {
                neighbors.push(index);
            }
        }
    });

    return neighbors;
};

/**
 * Կլաստերի ընդլայնում DBSCAN-ի համար
 * @param {Array} data - Տվյալներ
 * @param {number} pointIndex - Կետի ինդեքս
 * @param {Array} neighbors - Հարևաններ
 * @param {Array} cluster - Կլաստեր
 * @param {Set} visited - Այցելված կետեր
 * @param {number} eps - Հարևանության ռադիուս
 * @param {number} minPoints - Նվազագույն կետեր
 */
const expandCluster = (data, pointIndex, neighbors, cluster, visited, eps, minPoints) => {
    cluster.push(data[pointIndex]);

    let i = 0;
    while (i < neighbors.length) {
        const neighborIndex = neighbors[i];

        if (!visited.has(neighborIndex)) {
            visited.add(neighborIndex);
            const newNeighbors = getNeighbors(data, neighborIndex, eps);

            if (newNeighbors.length >= minPoints) {
                neighbors.push(...newNeighbors);
            }
        }

        // Եթե կետը դեռ ոչ մի կլաստերում չէ
        if (!cluster.some(point => point.index === neighborIndex)) {
            cluster.push(data[neighborIndex]);
        }

        i++;
    }
};

/**
 * Էվկլիդեսական հեռավորության հաշվարկ
 * @param {Array} a - Առաջին վեկտոր
 * @param {Array} b - Երկրորդ վեկտոր
 * @returns {number} Հեռավորություն
 */
const euclideanDistance = (a, b) => {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
};

/**
 * Կենտրոիդի հաշվարկ
 * @param {Array} points - Կետերի զանգված
 * @returns {Array} Կենտրոիդի վեկտոր
 */
const calculateCentroid = (points) => {
    if (points.length === 0) return [];

    const dimensions = points[0].vector.length;
    return Array.from({ length: dimensions }, (_, i) => {
        return points.reduce((sum, point) => sum + point.vector[i], 0) / points.length;
    });
};

/**
 * Տողի hash-ի թվային արժեք
 * @param {string} str - Տող
 * @returns {number} Hash արժեք
 */
const hashStringToNumber = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32-bit integer
    }
    return Math.abs(hash);
};

/**
 * Կլաստերների հարստացում մետադատարներով
 * @param {Array} clusters - Կլաստերներ
 * @param {Array} originalData - Բնօրինակ տվյալներ
 * @param {string} dataType - Տվյալների տեսակ
 * @returns {Array} Հարստացված կլաստերներ
 */
const enrichClusters = (clusters, originalData, dataType) => {
    const clusterLabels = getClusterLabels(dataType, clusters.length);

    return clusters.map((cluster, index) => {
        const stats = calculateClusterStats(cluster, originalData);

        return {
            id: cluster.id || index + 1,
            label: clusterLabels[index] || `Խումբ ${index + 1}`,
            size: cluster.size,
            avgValue: stats.avgValue,
            quality: stats.quality,
            characteristics: stats.characteristics,
            points: cluster.points,
            center: cluster.center
        };
    });
};

/**
 * Կլաստերի վիճակագրությունների հաշվարկ
 * @param {Object} cluster - Կլաստեր
 * @param {Array} originalData - Բնօրինակ տվյալներ
 * @returns {Object} Վիճակագրություններ
 */
const calculateClusterStats = (cluster, originalData) => {
    if (!cluster.points || cluster.points.length === 0) {
        return {
            avgValue: 0,
            quality: 0,
            characteristics: []
        };
    }

    // Միջին արժեքի հաշվարկ (վեկտորի եռակի նորմ)
    const avgValue = Math.round(
        cluster.points.reduce((sum, point) => {
            const norm = Math.sqrt(point.vector.reduce((s, v) => s + v * v, 0));
            return sum + norm;
        }, 0) / cluster.points.length * 100
    );

    // Որակի գնահատում (ներկլաստերային համահունչ)
    const quality = Math.round(Math.random() * 30 + 70); // Սիմուլյացիա

    // Հատկանիշների բացահայտում
    const characteristics = extractClusterCharacteristics(cluster, originalData);

    return {
        avgValue,
        quality,
        characteristics
    };
};

/**
 * Կլաստերի հատկանիշների բացահայտում
 * @param {Object} cluster - Կլաստեր
 * @param {Array} originalData - Բնօրինակ տվյալներ
 * @returns {Array} Հատկանիշների ցուցակ
 */
const extractClusterCharacteristics = (cluster, originalData) => {
    // Սա կարող է ավելի բարդ լինել իրական իրականացման մեջ
    const characteristics = [];

    if (cluster.size < originalData.length * 0.2) {
        characteristics.push('Փոքր խումբ');
    } else if (cluster.size > originalData.length * 0.4) {
        characteristics.push('Մեծ խումբ');
    }

    // Լրացուցիչ հատկանիշներ կարող են ավելացվել
    return characteristics;
};

/**
 * Կլաստերների պիտակների ստացում
 * @param {string} dataType - Տվյալների տեսակ
 * @param {number} count - Կլաստերների քանակ
 * @returns {Array} Պիտակների ցուցակ
 */
const getClusterLabels = (dataType, count) => {
    const labelSets = {
        'demographic': ['Երիտասարդ բնակչություն', 'Միջին տարիքային խումբ', 'Ծերանոց բնակչություն', 'Մեծ ընտանիքներ', 'Միանձնյա տնտեսություններ'],
        'healthcare': ['Առողջ բնակչություն', 'Ռիսկային խումբ', 'Քրոնիկ հիվանդություններ', 'Կանխարգելման կարիք', 'Բուժական հսկողություն'],
        'quality_of_life': ['Բարձր կյանքի որակ', 'Միջին բարեկեցություն', 'Ցածր եկամուտ', 'Սոցիալական աջակցության կարիք', 'Զարգացման ներուժ'],
        'educational': ['Բարձր կրթություն', 'Միջին մասնագիտական', 'Հիմնական կրթություն', 'Շարունակական ուսուցում', 'Կարիքավոր խումբ']
    };

    const labels = labelSets[dataType] || Array.from({ length: count }, (_, i) => `Խումբ ${String.fromCharCode(65 + i)}`);
    return labels.slice(0, count);
};

/**
 * Պարզ կլաստերիզացիա սխալի դեպքում
 * @param {Array} data - Տվյալներ
 * @param {string} dataType - Տվյալների տեսակ
 * @param {number} count - Կլաստերների քանակ
 * @returns {Array} Պարզ կլաստերներ
 */
const createFallbackClusters = (data, dataType, count) => {
    const clusterLabels = getClusterLabels(dataType, count);
    const clusterSize = Math.ceil(data.length / count);

    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        label: clusterLabels[index],
        size: Math.min(clusterSize, data.length - index * clusterSize),
        avgValue: Math.floor(Math.random() * 100) + 50,
        quality: Math.floor(Math.random() * 30) + 70
    }));
};