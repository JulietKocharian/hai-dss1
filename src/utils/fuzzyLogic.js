// src/utils/fuzzyLogic.js
// Անորոշ տրամաբանության ալգորիթմներ տվյալների վստահության գնահատման համար

import { detectDataType } from './dataHelpers';

/**
 * Անորոշ տրամաբանության կիրառում տվյալների վրա
 * @param {Array} data - Վերլուծելիք տվյալներ
 * @param {string} dataType - Տվյալների տեսակ
 * @returns {Object} Անորոշության վերլուծության արդյունք
 */
export const applyFuzzyLogic = (data, dataType) => {
    if (!data || data.length === 0) {
        return {
            low: 0,
            medium: 0,
            high: 0,
            analysis: 'Տվյալներ չեն գտնվել',
            confidenceDistribution: [],
            recommendations: []
        };
    }

    try {
        // Յուրաքանչյուր տողի վստահության գնահատում
        const rowConfidences = data.map((row, index) =>
            calculateRowConfidence(row, index, data)
        );

        // Վստահության մակարդակների բաշխում
        const distribution = categorizeConfidences(rowConfidences);

        // Խելացի վերլուծություն տվյալների տեսակի հիման վրա
        const analysis = generateFuzzyAnalysis(distribution, dataType, rowConfidences);

        // Առաջարկություններ
        const recommendations = generateFuzzyRecommendations(distribution, dataType);

        return {
            low: distribution.low,
            medium: distribution.medium,
            high: distribution.high,
            analysis: analysis.summary,
            confidenceDistribution: rowConfidences,
            patterns: analysis.patterns,
            recommendations,
            uncertaintyFactors: analysis.uncertaintyFactors
        };

    } catch (error) {
        console.error('Անորոշ տրամաբանության սխալ:', error);
        return {
            low: 33,
            medium: 34,
            high: 33,
            analysis: 'Վերլուծությունը ցանցի՛շ կատարվեց սխալի պատճառով',
            confidenceDistribution: [],
            recommendations: ['Ստուգեք տվյալների ֆորմատը']
        };
    }
};

/**
 * Տողի վստահության մակարդակի հաշվարկ
 * @param {Object} row - Տվյալների տող
 * @param {number} index - Տողի ինդեքս
 * @param {Array} allData - Ամբողջ տվյալների բազա
 * @returns {Object} Տողի վստահության տվյալներ
 */
const calculateRowConfidence = (row, index, allData) => {
    const values = Object.values(row);
    const keys = Object.keys(row);
    let totalConfidence = 0;
    const fieldConfidences = {};

    keys.forEach(key => {
        const value = row[key];
        const fieldConfidence = calculateFieldConfidence(value, key, allData);
        fieldConfidences[key] = fieldConfidence;
        totalConfidence += fieldConfidence;
    });

    const averageConfidence = totalConfidence / keys.length;

    return {
        index,
        confidence: averageConfidence,
        fieldConfidences,
        missingFields: values.filter(v => v === null || v === undefined || v === '').length,
        totalFields: values.length,
        completeness: ((values.length - values.filter(v => v === null || v === undefined || v === '').length) / values.length) * 100
    };
};

/**
 * Դաշտի վստահության մակարդակի հաշվարկ
 * @param {*} value - Դաշտի արժեք
 * @param {string} fieldName - Դաշտի անվանում
 * @param {Array} allData - Ամբողջ տվյալների բազա
 * @returns {number} Վստահության մակարդակ (0-100)
 */
const calculateFieldConfidence = (value, fieldName, allData) => {
    // Բացակայող արժեքների ստուգում
    if (value === null || value === undefined || value === '') {
        return 0;
    }

    let confidence = 50; // Հիմնական վստահություն

    // Տվյալի տիպի հետևողականություն
    const fieldValues = allData.map(row => row[fieldName]).filter(v => v !== null && v !== undefined && v !== '');
    const types = fieldValues.map(detectDataType);
    const dominantType = getMostFrequent(types);
    const currentType = detectDataType(value);

    if (currentType === dominantType) {
        confidence += 20;
    } else {
        confidence -= 15;
    }

    // Արժեքի եզակիություն (չափավոր եզակիությունը բարձրացնում է վստահությունը)
    const uniqueValues = [...new Set(fieldValues)];
    const uniquenessRatio = uniqueValues.length / fieldValues.length;

    if (uniquenessRatio > 0.8) {
        confidence += 10; // Բարձր եզակիություն
    } else if (uniquenessRatio < 0.1) {
        confidence -= 10; // Շատ ցածր եզակիություն
    } else {
        confidence += 5; // Միջին եզակիություն
    }

    // Ստատիստիկական ճշգրտություն (թվային արժեքների համար)
    if (currentType === 'number' || currentType === 'integer' || currentType === 'float') {
        const numericValues = fieldValues.map(v => parseFloat(v)).filter(v => !isNaN(v));
        if (numericValues.length > 1) {
            const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
            const stdDev = Math.sqrt(numericValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericValues.length);

            const currentValue = parseFloat(value);
            const zScore = Math.abs((currentValue - mean) / stdDev);

            if (zScore > 3) {
                confidence -= 20; // Ճիշտ ոչ ստանդարտ արժեք
            } else if (zScore > 2) {
                confidence -= 10; // Մի փոքր ոչ ստանդարտ
            } else {
                confidence += 10; // Նորմալ ինտերվալում
            }
        }
    }

    // Տեքստային արժեքների բովանդակության ստուգում
    if (currentType === 'text' && typeof value === 'string') {
        const text = value.trim();

        // Ստանդարտ ֆորմատների ստուգում
        if (isValidFormat(text, fieldName)) {
            confidence += 15;
        }

        // Տեքստի որակի ստուգում
        if (text.length > 0 && text.length < 200) {
            confidence += 5;
        }

        // Հատուկ նիշերի ստուգում
        if (/^[a-zA-Z0-9\u0530-\u058F\s\-.,]+$/.test(text)) {
            confidence += 5;
        }
    }

    return Math.max(0, Math.min(100, confidence));
};

/**
 * Ամենատարածված արժեքի գտնում
 * @param {Array} array - Արժեքների զանգված
 * @returns {*} Ամենատարածված արժեք
 */
const getMostFrequent = (array) => {
    const frequency = {};
    let maxCount = 0;
    let mostFrequent = array[0];

    array.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
        if (frequency[item] > maxCount) {
            maxCount = frequency[item];
            mostFrequent = item;
        }
    });

    return mostFrequent;
};

/**
 * Վալիդ ֆորմատի ստուգում
 * @param {string} text - Տեքստ
 * @param {string} fieldName - Դաշտի անվանում
 * @returns {boolean} Վալիդ է գոնակ
 */
const isValidFormat = (text, fieldName) => {
    const fieldLower = fieldName.toLowerCase();

    // Email ֆորմատ
    if (fieldLower.includes('email') || fieldLower.includes('mail')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    }

    // Հեռախոս
    if (fieldLower.includes('phone') || fieldLower.includes('tel') || fieldLower.includes('հեռախոս')) {
        return /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(text);
    }

    // Ամսաթիվ
    if (fieldLower.includes('date') || fieldLower.includes('ամսաթիվ') || fieldLower.includes('թվական')) {
        return /^\d{4}-\d{2}-\d{2}$/.test(text) || /^\d{2}\/\d{2}\/\d{4}$/.test(text);
    }

    return true; // Հիմանական ընդունելություն
};

/**
 * Վստահության մակարդակների կատեգորիզացիա
 * @param {Array} confidences - Վստահության զանգված
 * @returns {Object} Կատեգորիզացված բաշխում
 */
const categorizeConfidences = (confidences) => {
    let lowCount = 0;
    let mediumCount = 0;
    let highCount = 0;

    confidences.forEach(conf => {
        if (conf.confidence < 40) {
            lowCount++;
        } else if (conf.confidence < 70) {
            mediumCount++;
        } else {
            highCount++;
        }
    });

    const total = confidences.length;

    return {
        low: Math.round((lowCount / total) * 100),
        medium: Math.round((mediumCount / total) * 100),
        high: Math.round((highCount / total) * 100),
        lowCount,
        mediumCount,
        highCount,
        total
    };
};

/**
 * Անորոշության վերլուծության ստեղծում
 * @param {Object} distribution - Վստահության բաշխում
 * @param {string} dataType - Տվյալների տեսակ
 * @param {Array} rowConfidences - Տողերի վստահություն
 * @returns {Object} Վերլուծության արդյունք
 */
const generateFuzzyAnalysis = (distribution, dataType, rowConfidences) => {
    let summary = '';
    const patterns = [];
    const uncertaintyFactors = [];

    // Հիմնական գնահատում
    if (distribution.high >= 70) {
        summary = `Տվյալների ${distribution.high}%-ը ունի բարձր վստահություն: Որոշումները կարելի է կայացնել վստահությամբ:`;
    } else if (distribution.high >= 50) {
        summary = `Տվյալների որակը բավարար է (${distribution.high}% բարձր վստահություն): Պահվում են որոշ ռիսկեր:`;
    } else {
        summary = `Ցածր վստահության մակարդակ (${distribution.high}% միայն): Պահանջվում է լրացուցիչ տվյալների հավաքում:`;
    }

    // Օրինաչափությունների բացահայտում
    const avgCompleteness = rowConfidences.reduce((sum, row) => sum + row.completeness, 0) / rowConfidences.length;

    if (avgCompleteness < 70) {
        patterns.push('Բացակայող տվյալների մեծ քանակ');
        uncertaintyFactors.push('Անամբողջական տեղեկություններ');
    }

    // Կոնցենտրացիա անալիզ
    const lowConfidenceRows = rowConfidences.filter(row => row.confidence < 40);
    if (lowConfidenceRows.length > 0) {
        patterns.push(`${lowConfidenceRows.length} տող ունի շատ ցածր վստահություն`);
        uncertaintyFactors.push('Որակի մակարդակի անհամասեղություն');
    }

    // Տվյալների տեսակի հիման վրա վերլուծություն
    switch (dataType) {
        case 'demographic':
            if (distribution.medium > 40) {
                patterns.push('Դեմոգրաֆիական տվյալները պահանջում են ստուգում');
            }
            break;
        case 'healthcare':
            if (distribution.low > 20) {
                patterns.push('Բժշկական տվյալների որակը վտանգավոր մակարդակում է');
                uncertaintyFactors.push('Կրիտիկական սփալմանության ռիսկ');
            }
            break;
        case 'quality_of_life':
            if (distribution.high < 60) {
                patterns.push('Կյանքի որակի մետրիկներն անորոշ են');
            }
            break;
    }

    return {
        summary,
        patterns,
        uncertaintyFactors
    };
};

/**
 * Անորոշ տրամաբանության ռեկոմենդացիաների գեներացիա
 * @param {Object} distribution - Վստահության բաշխում
 * @param {string} dataType - Տվյալների տեսակ
 * @returns {Array} Ռեկոմենդացիաների ցուցակ
 */
const generateFuzzyRecommendations = (distribution, dataType) => {
    const recommendations = [];

    if (distribution.low > 30) {
        recommendations.push({
            priority: 'high',
            action: 'Անմիջապես վերահսկել ցածր վստահության տվյալները',
            reason: `${distribution.low}% տվյալներ ունեն ցածր վստահություն`
        });
    }

    if (distribution.medium > 50) {
        recommendations.push({
            priority: 'medium',
            action: 'Կիրառել տվյալների մաքրման տեխնիկաներ',
            reason: 'Միջին վստահության տվյալների մեծ բաժին'
        });
    }

    if (distribution.high < 50) {
        recommendations.push({
            priority: 'high',
            action: 'Վերանայել տվյալների հավաքման մեթոդաբանությունը',
            reason: 'Ընդհանուր վստահության ցածր մակարդակ'
        });
    }

    // Տեսակի հատուկ ռեկոմենդացիաներ
    switch (dataType) {
        case 'healthcare':
            recommendations.push({
                priority: 'high',
                action: 'Կիրառել բժշկական տվյալների վալիդացիայի պրոտոկոլներ',
                reason: 'Առողջապահական տվյալների կրիտիկական բնույթ'
            });
            break;
        case 'demographic':
            recommendations.push({
                priority: 'medium',
                action: 'Համադրել տարբեր աղբյուրներից ստացված տվյալները',
                reason: 'Դեմոգրաֆիական տվյալների ճշտության բարձրացում'
            });
            break;
    }

    return recommendations;
};