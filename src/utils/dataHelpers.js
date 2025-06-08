// src/utils/dataHelpers.js
// Տվյալների մշակման և փոխակերպման օգնական ֆունկցիաներ

/**
 * Տվյալների տեսակի պիտակի ստացում
 * @param {string} value - Տվյալների տեսակի արժեք
 * @returns {string} Հայերեն պիտակ
 */
export const getDataTypeLabel = (value) => {
    const labels = {
        'demographic': 'Դեմոգրաֆիական',
        'healthcare': 'Առողջապահական',
        'quality_of_life': 'Կյանքի որակ',
        'educational': 'Կրթական'
    };
    return labels[value] || value;
};

/**
 * Տվյալների տիպի ավտոմատ հայտնաբերում
 * @param {*} value - Տվյալի արժեք
 * @returns {string} Տվյալի տիպ
 */
export const detectDataType = (value) => {
    if (value === null || value === undefined || value === '') {
        return 'empty';
    }

    if (typeof value === 'number') {
        return 'number';
    }

    if (typeof value === 'boolean') {
        return 'boolean';
    }

    const stringValue = String(value).trim();

    // Թվային արժեքների ստուգում
    if (!isNaN(parseFloat(stringValue)) && isFinite(stringValue)) {
        return stringValue.includes('.') ? 'float' : 'integer';
    }

    // Ամսաթվի ստուգում
    const datePatterns = [
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
        /^\d{2}\.\d{2}\.\d{4}$/, // DD.MM.YYYY
    ];

    if (datePatterns.some(pattern => pattern.test(stringValue))) {
        return 'date';
    }

    // Email-ի ստուգում
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
        return 'email';
    }

    // URL-ի ստուգում
    if (/^https?:\/\/.+/.test(stringValue)) {
        return 'url';
    }

    // Boolean տեքստային արժեքներ
    const booleanValues = ['true', 'false', 'yes', 'no', 'այո', 'ոչ'];
    if (booleanValues.includes(stringValue.toLowerCase())) {
        return 'boolean_text';
    }

    return 'text';
};

/**
 * Սյունակի տվյալների տիպի վերլուծություն
 * @param {Array} data - Տվյալների զանգված
 * @param {string} columnName - Սյունակի անվանում
 * @returns {Object} Սյունակի վերլուծական տվյալներ
 */
export const analyzeColumn = (data, columnName) => {
    if (!data || data.length === 0) {
        return null;
    }

    const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val !== '');
    const totalCount = data.length;
    const validCount = values.length;
    const missingCount = totalCount - validCount;

    // Տիպերի բաշխում
    const typeDistribution = {};
    values.forEach(value => {
        const type = detectDataType(value);
        typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    // Դոմինանտ տիպ
    const dominantType = Object.keys(typeDistribution).reduce((a, b) =>
        typeDistribution[a] > typeDistribution[b] ? a : b, 'unknown'
    );

    // Եզակի արժեքներ
    const uniqueValues = [...new Set(values)];
    const uniqueCount = uniqueValues.length;

    // Ստատիստիկական տվյալներ թվային սյունակների համար
    let statistics = null;
    if (['number', 'integer', 'float'].includes(dominantType)) {
        const numericValues = values.map(val => parseFloat(val)).filter(val => !isNaN(val));
        if (numericValues.length > 0) {
            const sorted = numericValues.sort((a, b) => a - b);
            const sum = numericValues.reduce((a, b) => a + b, 0);
            const mean = sum / numericValues.length;

            statistics = {
                min: sorted[0],
                max: sorted[sorted.length - 1],
                mean: mean,
                median: sorted[Math.floor(sorted.length / 2)],
                sum: sum,
                standardDeviation: Math.sqrt(
                    numericValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericValues.length
                )
            };
        }
    }

    return {
        columnName,
        totalCount,
        validCount,
        missingCount,
        missingPercentage: (missingCount / totalCount) * 100,
        uniqueCount,
        uniquePercentage: (uniqueCount / validCount) * 100,
        dominantType,
        typeDistribution,
        statistics,
        sampleValues: uniqueValues.slice(0, 5) // Առաջին 5 եզակի արժեքները
    };
};

/**
 * Ամբողջ տվյալների բազայի վերլուծություն
 * @param {Array} data - Տվյալների զանգված
 * @returns {Object} Ամբողջական վերլուծություն
 */
export const analyzeDataset = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        return {
            isEmpty: true,
            rowCount: 0,
            columnCount: 0,
            columns: [],
            overallQuality: 0
        };
    }

    const headers = Object.keys(data[0]);
    const rowCount = data.length;
    const columnCount = headers.length;

    // Յուրաքանչյուր սյունակի վերլուծություն
    const columns = headers.map(header => analyzeColumn(data, header));

    // Ընդհանուր որակի գնահատում
    const totalCells = rowCount * columnCount;
    const totalMissing = columns.reduce((sum, col) => sum + col.missingCount, 0);
    const overallCompleteness = ((totalCells - totalMissing) / totalCells) * 100;

    // Սյունակների որակի բաշխում
    const columnQuality = columns.map(col => ({
        name: col.columnName,
        completeness: 100 - col.missingPercentage,
        uniqueness: col.uniquePercentage,
        type: col.dominantType
    }));

    return {
        isEmpty: false,
        rowCount,
        columnCount,
        columns,
        columnQuality,
        overallCompleteness,
        overallQuality: overallCompleteness,
        recommendations: generateRecommendations(columns, overallCompleteness)
    };
};

/**
 * Տվյալների բարելավման ռեկոմենդացիաների գեներացում
 * @param {Array} columns - Սյունակների վերլուծություն
 * @param {number} overallCompleteness - Ընդհանուր ամբողջականություն
 * @returns {Array} Ռեկոմենդացիաների ցուցակ
 */
export const generateRecommendations = (columns, overallCompleteness) => {
    const recommendations = [];

    if (overallCompleteness < 80) {
        recommendations.push({
            type: 'warning',
            title: 'Ցածր տվյալների ամբողջականություն',
            description: `Տվյալների ամբողջականությունը ${overallCompleteness.toFixed(1)}% է: Կարիք կա լրացուցիչ տվյալների հավաքման:`,
            priority: 'high'
        });
    }

    columns.forEach(col => {
        if (col.missingPercentage > 50) {
            recommendations.push({
                type: 'error',
                title: `"${col.columnName}" սյունակը գրեթե դատարկ է`,
                description: `${col.missingPercentage.toFixed(1)}% բացակայող արժեքներ: Հարցականի տակ է դնում սյունակի օգտակարությունը:`,
                priority: 'high'
            });
        } else if (col.missingPercentage > 20) {
            recommendations.push({
                type: 'warning',
                title: `"${col.columnName}" սյունակը ունի շատ բացակայող արժեքներ`,
                description: `${col.missingPercentage.toFixed(1)}% բացակայող արժեքներ: Խորհուրդ է տրվում լրացնել կամ ինտերպոլացնել:`,
                priority: 'medium'
            });
        }

        if (col.uniqueCount === 1) {
            recommendations.push({
                type: 'info',
                title: `"${col.columnName}" սյունակը ունի միայն մեկ եզակի արժեք`,
                description: 'Այս սյունակը կարող է ավելորդ լինել վերլուծության համար:',
                priority: 'low'
            });
        }

        if (col.uniquePercentage === 100 && col.validCount > 1) {
            recommendations.push({
                type: 'info',
                title: `"${col.columnName}" սյունակը ունի բացառապես եզակի արժեքներ`,
                description: 'Հավանաբար սա նույնականացնող սյունակ է (ID):',
                priority: 'low'
            });
        }
    });

    return recommendations;
};

/**
 * Տվյալների փոխակերպում վիզուալիզացիայի համար
 * @param {Array} data - Տվյալների զանգված
 * @param {string} xColumn - X առանցքի սյունակ
 * @param {string} yColumn - Y առանցքի սյունակ
 * @returns {Array} Գծապատկերի համար պատրաստ տվյալներ
 */
export const prepareChartData = (data, xColumn, yColumn) => {
    if (!data || data.length === 0) {
        return [];
    }

    return data
        .filter(row => row[xColumn] != null && row[yColumn] != null)
        .map(row => ({
            x: row[xColumn],
            y: parseFloat(row[yColumn]) || 0,
            label: `${row[xColumn]}: ${row[yColumn]}`
        }))
        .slice(0, 50); // Սահմանափակել 50 կետով
};

/**
 * Հետադարձ կապի ֆորմատավորում
 * @param {Object} analysis - Վերլուծության արդյունք
 * @returns {string} Հետադարձ կապի տեքստ
 */
export const formatAnalysisFeedback = (analysis) => {
    if (!analysis || analysis.isEmpty) {
        return 'Տվյալները բացակայում են վերլուծության համար:';
    }

    const { rowCount, columnCount, overallCompleteness, recommendations } = analysis;

    let feedback = `Վերլուծվել է ${rowCount} տող և ${columnCount} սյունակ: `;

    if (overallCompleteness >= 90) {
        feedback += 'Տվյալների որակը բարձր է: ';
    } else if (overallCompleteness >= 70) {
        feedback += 'Տվյալների որակը բավարար է: ';
    } else {
        feedback += 'Տվյալների որակը պահանջում է բարելավում: ';
    }

    if (recommendations.length > 0) {
        const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
        if (highPriorityCount > 0) {
            feedback += `Կա ${highPriorityCount} կարևոր խնդիր, որ պահանջում է անմիջական ուշադրություն:`;
        }
    }

    return feedback;
};