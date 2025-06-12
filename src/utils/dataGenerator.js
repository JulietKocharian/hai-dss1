// src/utils/dataGenerator.js
// Սինթետիկ տվյալների գեներացման ալգորիթմներ

import { detectDataType } from './dataHelpers';

/**
 * Սինթետիկ տվյալների բազային գեներացիա
 * @param {Array} originalData - Բնօրինակ տվյալների զանգված
 * @param {Object} settings - Գեներացման կարգավորումներ
 * @returns {Promise<Array>} Գեներացված սինթետիկ տվյալներ
 */
export const generateSyntheticDataset = async (originalData, settings = {}) => {
    const {
        count = 50,
        method = 'statistical',
        includeNoise = true,
        preserveDistribution = true
    } = settings;

    if (!originalData || originalData.length === 0) {
        throw new Error('Բնօրինակ տվյալները բացակայում են');
    }

    try {
        // Տվյալների վերլուծություն և նախապատրաստում
        const dataAnalysis = analyzeDataStructure(originalData);

        // Գեներացման մեթոդի ընտրություն
        let generator;
        switch (method) {
            case 'pattern':
                generator = patternBasedGeneration;
                break;
            case 'interpolation':
                generator = interpolationGeneration;
                break;
            case 'machine_learning':
                generator = mlBasedGeneration;
                break;
            case 'statistical':
            default:
                generator = statisticalGeneration;
                break;
        }

        // Գեներացում
        const syntheticData = await generator(
            originalData,
            dataAnalysis,
            count,
            { includeNoise, preserveDistribution }
        );

        // Հետ-մշակում և վալիդացիա
        const cleanedData = postProcessSyntheticData(syntheticData, dataAnalysis);

        return cleanedData;

    } catch (error) {
        console.error('Սինթետիկ գեներացման սխալ:', error);
        throw new Error(`Սինթետիկ տվյալների գեներացման սխալ: ${error.message}`);
    }
};

/**
 * Տվյալների կառուցվածքի վերլուծություն գեներացման համար
 * @param {Array} data - Բնօրինակ տվյալներ
 * @returns {Object} Վերլուծության արդյունք
 */
const analyzeDataStructure = (data) => {
    const headers = Object.keys(data[0]);
    const analysis = {
        headers,
        rowCount: data.length,
        columnCount: headers.length,
        columnAnalysis: {}
    };

    headers.forEach(header => {
        const values = data.map(row => row[header]).filter(val => val !== null && val !== undefined && val !== '');
        const nonNullCount = values.length;

        analysis.columnAnalysis[header] = {
            dataType: detectDataType(values[0]),
            nonNullCount,
            missingCount: data.length - nonNullCount,
            uniqueValues: [...new Set(values)],
            sampleValues: values.slice(0, 10)
        };

        // Թվային սյունակների համար ստատիստիկական վերլուծություն
        const numericValues = values.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
        if (numericValues.length > 0) {
            const sorted = numericValues.sort((a, b) => a - b);
            const sum = numericValues.reduce((a, b) => a + b, 0);
            const mean = sum / numericValues.length;

            analysis.columnAnalysis[header].statistics = {
                min: sorted[0],
                max: sorted[sorted.length - 1],
                mean,
                median: sorted[Math.floor(sorted.length / 2)],
                standardDeviation: Math.sqrt(
                    numericValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericValues.length
                ),
                quartiles: {
                    q1: sorted[Math.floor(sorted.length * 0.25)],
                    q3: sorted[Math.floor(sorted.length * 0.75)]
                }
            };
        }
    });

    return analysis;
};

/**
 * Ստատիստիկական գեներացիա
 * @param {Array} originalData - Բնօրինակ տվյալներ
 * @param {Object} analysis - Տվյալների վերլուծություն
 * @param {number} count - Գեներացվող տողերի քանակ
 * @param {Object} options - Ընտրանքներ
 * @returns {Array} Գեներացված տվյալներ
 */
const statisticalGeneration = (originalData, analysis, count, options) => {
    const { headers, columnAnalysis } = analysis;
    const syntheticData = [];

    for (let i = 0; i < count; i++) {
        const newRow = {};

        headers.forEach(header => {
            const colAnalysis = columnAnalysis[header];

            if (colAnalysis.nonNullCount === 0) {
                newRow[header] = null;
                return;
            }

            // Բացակայող արժեքների սիմուլյացիա
            const missingProbability = colAnalysis.missingCount / (colAnalysis.nonNullCount + colAnalysis.missingCount);
            if (Math.random() < missingProbability) {
                newRow[header] = null;
                return;
            }

            // Տվյալի տիպի հիման վրա գեներացում
            newRow[header] = generateValueByType(colAnalysis, options);
        });

        syntheticData.push(newRow);
    }

    return syntheticData;
};

/**
 * Արժեքի գեներացում տիպի հիման վրա
 * @param {Object} colAnalysis - Սյունակի վերլուծություն
 * @param {Object} options - Ընտրանքներ
 * @returns {*} Գեներացված արժեք
 */
const generateValueByType = (colAnalysis, options) => {
    const { dataType, statistics, uniqueValues, sampleValues } = colAnalysis;

    switch (dataType) {
        case 'number':
        case 'integer':
        case 'float':
            return generateNumericValue(statistics, dataType, options);

        case 'text':
            return generateTextValue(sampleValues, uniqueValues, options);

        case 'date':
            return generateDateValue(sampleValues, options);

        case 'boolean':
        case 'boolean_text':
            return generateBooleanValue(uniqueValues, options);

        case 'email':
            return generateEmailValue(sampleValues, options);

        default:
            return generateCategoricalValue(uniqueValues, options);
    }
};

/**
 * Թվային արժեքի գեներացում
 * @param {Object} stats - Ստատիստիկական տվյալներ
 * @param {string} dataType - Տվյալի տիպ
 * @param {Object} options - Ընտրանքներ
 * @returns {number} Գեներացված թիվ
 */
const generateNumericValue = (stats, dataType, options) => {
    if (!stats) {
        return Math.floor(Math.random() * 100);
    }

    const { mean, standardDeviation, min, max } = stats;

    // Նորմալ բաշխմամբ գեներացում
    let value = normalDistribution(mean, standardDeviation);

    // Սահմանափակում մին-մաքս ինտերվալում
    value = Math.max(min, Math.min(max, value));

    // Աղմուկի ավելացում
    if (options.includeNoise) {
        const noiseLevel = standardDeviation * 0.1;
        value += (Math.random() - 0.5) * noiseLevel;
    }

    // Տիպի ճշգրտում
    if (dataType === 'integer') {
        return Math.round(value);
    }

    return parseFloat(value.toFixed(2));
};

/**
 * Տեքստային արժեքի գեներացում
 * @param {Array} samples - Նմուշների ցուցակ
 * @param {Array} uniqueValues - Եզակի արժեքների ցուցակ
 * @param {Object} options - Ընտրանքներ
 * @returns {string} Գեներացված տեքստ
 */
const generateTextValue = (samples, uniqueValues, options) => {
    if (uniqueValues.length < 5) {
        // Փոքր եզակի արժեքների դեպքում - կատեգորիական մոտեցում
        return uniqueValues[Math.floor(Math.random() * uniqueValues.length)];
    }

    // Նմուշի հիման վրա նոր տեքստի գեներացում
    const sample = samples[Math.floor(Math.random() * samples.length)];

    if (typeof sample !== 'string') {
        return `Synthetic_${Math.floor(Math.random() * 1000)}`;
    }

    // Տեքստի մոդիֆիկացիա
    const modifications = [
        () => sample + `_${Math.floor(Math.random() * 100)}`,
        () => sample.replace(/\d+/g, () => Math.floor(Math.random() * 1000)),
        () => `Modified_${sample}`,
        () => sample.split('').reverse().join('') + `_${Math.floor(Math.random() * 100)}`
    ];

    const modification = modifications[Math.floor(Math.random() * modifications.length)];
    return modification();
};

/**
 * Ամսաթվի գեներացում
 * @param {Array} samples - Նմուշների ցուցակ
 * @param {Object} options - Ընտրանքներ
 * @returns {string} Գեներացված ամսաթիվ
 */
const generateDateValue = (samples, options) => {
    if (samples.length === 0) {
        return new Date().toISOString().split('T')[0];
    }

    // Ամսաթվերի ինտերվալի գտնում
    const dates = samples.map(sample => new Date(sample)).filter(date => !isNaN(date.getTime()));

    if (dates.length === 0) {
        return new Date().toISOString().split('T')[0];
    }

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Պատահական ամսաթիվ ինտերվալում
    const randomTime = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
};

/**
 * Տրամաբանական արժեքի գեներացում
 * @param {Array} uniqueValues - Եզակի արժեքներ
 * @param {Object} options - Ընտրանքներ
 * @returns {string|boolean} Գեներացված արժեք
 */
const generateBooleanValue = (uniqueValues, options) => {
    if (uniqueValues.length > 0) {
        return uniqueValues[Math.floor(Math.random() * uniqueValues.length)];
    }

    const booleanOptions = ['true', 'false', 'yes', 'no', 'այո', 'ոչ'];
    return booleanOptions[Math.floor(Math.random() * booleanOptions.length)];
};

/**
 * Էլեկտրոնային փոստի գեներացում
 * @param {Array} samples - Նմուշների ցուցակ
 * @param {Object} options - Ընտրանքներ
 * @returns {string} Գեներացված email
 */
const generateEmailValue = (samples, options) => {
    const domains = ['example.com', 'test.am', 'sample.org', 'demo.net'];
    const usernames = ['user', 'test', 'sample', 'demo', 'synthetic'];

    const username = usernames[Math.floor(Math.random() * usernames.length)];
    const number = Math.floor(Math.random() * 1000);
    const domain = domains[Math.floor(Math.random() * domains.length)];

    return `${username}${number}@${domain}`;
};

/**
 * Կատեգորիական արժեքի գեներացում
 * @param {Array} uniqueValues - Եզակի արժեքներ
 * @param {Object} options - Ընտրանքներ
 * @returns {*} Գեներացված արժեք
 */
const generateCategoricalValue = (uniqueValues, options) => {
    if (uniqueValues.length === 0) {
        return `Category_${Math.floor(Math.random() * 10)}`;
    }

    return uniqueValues[Math.floor(Math.random() * uniqueValues.length)];
};

/**
 * Նորմալ բաշխմամբ պատահական թվի գեներացում (Box-Muller transform)
 * @param {number} mean - Միջին արժեք
 * @param {number} standardDeviation - Ստանդարտ շեղում
 * @returns {number} Նորմալ բաշխմամբ թիվ
 */
const normalDistribution = (mean, standardDeviation) => {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random(); // [0,1) to (0,1)
    while (v === 0) v = Math.random();

    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * standardDeviation + mean;
};

/**
 * Օրինակային գեներացիա (pattern-based)
 * @param {Array} originalData - Բնօրինակ տվյալներ
 * @param {Object} analysis - Վերլուծություն
 * @param {number} count - Քանակ
 * @param {Object} options - Ընտրանքներ
 * @returns {Array} Գեներացված տվյալներ
 */
const patternBasedGeneration = (originalData, analysis, count, options) => {
    const syntheticData = [];

    for (let i = 0; i < count; i++) {
        // Պատահական բնօրինակ տողի ընտրություն որպես կաղապար
        const templateRow = originalData[Math.floor(Math.random() * originalData.length)];
        const newRow = {};

        Object.keys(templateRow).forEach(key => {
            const originalValue = templateRow[key];

            if (originalValue === null || originalValue === undefined) {
                newRow[key] = null;
            } else {
                // Արժեքի մոդիֆիկացիա
                newRow[key] = modifyValue(originalValue, analysis.columnAnalysis[key], options);
            }
        });

        syntheticData.push(newRow);
    }

    return syntheticData;
};

/**
 * Ինտերպոլյացիային գեներացիա
 * @param {Array} originalData - Բնօրինակ տվյալներ
 * @param {Object} analysis - Վերլուծություն
 * @param {number} count - Քանակ
 * @param {Object} options - Ընտրանքներ
 * @returns {Array} Գեներացված տվյալներ
 */
const interpolationGeneration = (originalData, analysis, count, options) => {
    const syntheticData = [];

    for (let i = 0; i < count; i++) {
        // Երկու պատահական տողերի ինտերպոլյացիա
        const row1 = originalData[Math.floor(Math.random() * originalData.length)];
        const row2 = originalData[Math.floor(Math.random() * originalData.length)];
        const weight = Math.random();

        const newRow = {};

        Object.keys(row1).forEach(key => {
            const val1 = row1[key];
            const val2 = row2[key];

            newRow[key] = interpolateValues(val1, val2, weight, analysis.columnAnalysis[key]);
        });

        syntheticData.push(newRow);
    }

    return syntheticData;
};

/**
 * Մեքենայական ուսուցման հիման վրա գեներացիա (պարզ իրականացում)
 * @param {Array} originalData - Բնօրինակ տվյալներ
 * @param {Object} analysis - Վերլուծություն
 * @param {number} count - Քանակ
 * @param {Object} options - Ընտրանքներ
 * @returns {Array} Գեներացված տվյալներ
 */
const mlBasedGeneration = (originalData, analysis, count, options) => {
    // Սա ավելի պարզ իրականացում է - իրական ML մոդելի փոխարեն
    // Կիրառում է բարձր մակարդակի ստատիստիկական մեթոդներ

    return statisticalGeneration(originalData, analysis, count, {
        ...options,
        includeNoise: true,
        enhancedDistribution: true
    });
};

/**
 * Արժեքի մոդիֆիկացիա
 * @param {*} value - Բնօրինակ արժեք
 * @param {Object} colAnalysis - Սյունակի վերլուծություն
 * @param {Object} options - Ընտրանքներ
 * @returns {*} Մոդիֆիկացված արժեք
 */
const modifyValue = (value, colAnalysis, options) => {
    if (value === null || value === undefined) {
        return null;
    }

    const dataType = colAnalysis.dataType;

    switch (dataType) {
        case 'number':
        case 'integer':
        case 'float':
            const numValue = parseFloat(value);
            const variation = numValue * 0.1 * (Math.random() - 0.5);
            return dataType === 'integer' ? Math.round(numValue + variation) : parseFloat((numValue + variation).toFixed(2));

        case 'text':
            if (typeof value === 'string' && value.length > 0) {
                return value + '_synthetic_' + Math.floor(Math.random() * 100);
            }
            return value;

        default:
            return value;
    }
};

/**
 * Արժեքների ինտերպոլյացիա
 * @param {*} val1 - Առաջին արժեք
 * @param {*} val2 - Երկրորդ արժեք
 * @param {number} weight - Կշիռ (0-1)
 * @param {Object} colAnalysis - Սյունակի վերլուծություն
 * @returns {*} Ինտերպոլյացված արժեք
 */
const interpolateValues = (val1, val2, weight, colAnalysis) => {
    if (val1 === null || val2 === null) {
        return Math.random() < weight ? val1 : val2;
    }

    const dataType = colAnalysis.dataType;

    if (['number', 'integer', 'float'].includes(dataType)) {
        const num1 = parseFloat(val1);
        const num2 = parseFloat(val2);

        if (!isNaN(num1) && !isNaN(num2)) {
            const interpolated = num1 * (1 - weight) + num2 * weight;
            return dataType === 'integer' ? Math.round(interpolated) : parseFloat(interpolated.toFixed(2));
        }
    }

    // Կատեգորիական տվյալների համար
    return Math.random() < weight ? val1 : val2;
};

/**
 * Սինթետիկ տվյալների հետ-մշակում
 * @param {Array} syntheticData - Գեներացված տվյալներ
 * @param {Object} analysis - Տվյալների վերլուծություն
 * @returns {Array} Մշակված տվյալներ
 */
const postProcessSyntheticData = (syntheticData, analysis) => {
    return syntheticData.map((row, index) => {
        const processedRow = { ...row };

        // Ինդեքսի ավելացում եզակիության համար
        Object.keys(processedRow).forEach(key => {
            if (processedRow[key] && typeof processedRow[key] === 'string' && processedRow[key].includes('synthetic')) {
                processedRow[key] = processedRow[key].replace('synthetic', `synthetic_${index}`);
            }
        });

        return processedRow;
    });
};