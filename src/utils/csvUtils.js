// src/utils/csvUtils.js
// CSV տվյալների մշակման օգնական ֆունկցիաներ

/**
 * CSV տեքստի մշակում JavaScript օբյեկտների զանգվածի
 * @param {string} csvText - CSV ֆորմատի տեքստ
 * @returns {Array} Օբյեկտների զանգված
 */
export const parseCSV = (csvText) => {
    if (!csvText || typeof csvText !== 'string') {
        throw new Error('CSV տվյալները պետք է լինեն տեքստային ֆորմատով');
    }

    try {
        // Տողերի բաժանում և դատարկ տողերի ֆիլտրում
        const lines = csvText.trim().split('\n').filter(line => line.trim());

        if (lines.length < 2) {
            throw new Error('CSV տվյալները պետք է ունենան նվազագույնը վերնագիր և մեկ տող');
        }

        // Վերնագրերի ստացում և մաքրում
        const headers = lines[0]
            .split(',')
            .map(header => header.trim().replace(/["\r]/g, ''));

        if (headers.length === 0) {
            throw new Error('CSV վերնագրերը չեն գտնվել');
        }

        // Տվյալների մշակում
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Բաց թողնել դատարկ տողերը

            // Արժեքների բաժանում և մաքրում
            const values = line.split(',').map(value => {
                const cleanValue = value.trim().replace(/["\r]/g, '');
                return cleanValue === '' ? null : cleanValue;
            });

            // Օբյեկտի ստեղծում
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || null;
            });

            data.push(row);
        }

        console.log(`CSV մշակումը հաջողություն: ${data.length} տող, ${headers.length} սյունակ`);
        return data;

    } catch (error) {
        console.error('CSV մշակման սխալ:', error);
        throw new Error(`CSV մշակման սխալ: ${error.message}`);
    }
};

/**
 * Օբյեկտների զանգվածի փոխարկում CSV տեքստի
 * @param {Array} data - Օբյեկտների զանգված
 * @param {Array} headers - Սյունակների վերնագրեր (կամանք)
 * @returns {string} CSV ֆորմատի տեքստ
 */
export const arrayToCSV = (data, headers = null) => {
    if (!Array.isArray(data) || data.length === 0) {
        return '';
    }

    try {
        // Վերնագրերի ստացում
        const csvHeaders = headers || Object.keys(data[0]);

        // CSV տողերի ստեղծում
        let csvContent = csvHeaders.join(',') + '\n';

        data.forEach(row => {
            const values = csvHeaders.map(header => {
                const value = row[header];
                if (value === null || value === undefined) {
                    return '';
                }
                // Հատուկ նիշերի escape
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            });

            csvContent += values.join(',') + '\n';
        });

        return csvContent;

    } catch (error) {
        console.error('CSV-ի փոխարկման սխալ:', error);
        throw new Error(`CSV-ի փոխարկման սխալ: ${error.message}`);
    }
};

/**
 * CSV տվյալների վալիդացիա
 * @param {Array} data - Մշակված տվյալներ
 * @returns {Object} Վալիդացիայի արդյունք
 */
export const validateCSVData = (data) => {
    if (!Array.isArray(data)) {
        return {
            isValid: false,
            errors: ['Տվյալները պետք է լինեն զանգված']
        };
    }

    const errors = [];
    const warnings = [];

    // Հիմնական ստուգումներ
    if (data.length === 0) {
        errors.push('Տվյալները դատարկ են');
        return { isValid: false, errors, warnings };
    }

    const headers = Object.keys(data[0]);
    if (headers.length === 0) {
        errors.push('Վերնագրեր չեն գտնվել');
        return { isValid: false, errors, warnings };
    }

    // Տվյալների որակի ստուգում
    let missingValues = 0;
    let totalCells = 0;
    const columnStats = {};

    headers.forEach(header => {
        columnStats[header] = {
            total: 0,
            missing: 0,
            unique: new Set()
        };
    });

    data.forEach((row, rowIndex) => {
        headers.forEach(header => {
            totalCells++;
            columnStats[header].total++;

            const value = row[header];
            if (value === null || value === undefined || value === '') {
                missingValues++;
                columnStats[header].missing++;
            } else {
                columnStats[header].unique.add(value);
            }
        });

        // Տողի բովանդակության ստուգում
        const rowValues = Object.values(row);
        const emptyRow = rowValues.every(val => val === null || val === undefined || val === '');
        if (emptyRow) {
            warnings.push(`Տող ${rowIndex + 1}-ը ամբողջությամբ դատարկ է`);
        }
    });

    // Բացակայող արժեքների վիճակագրություն
    const missingPercentage = (missingValues / totalCells) * 100;
    if (missingPercentage > 50) {
        warnings.push(`Շատ բացակայող արժեքներ: ${missingPercentage.toFixed(1)}%`);
    } else if (missingPercentage > 20) {
        warnings.push(`Միջին մակարդակի բացակայող արժեքներ: ${missingPercentage.toFixed(1)}%`);
    }

    // Սյունակների վիճակագրություն
    headers.forEach(header => {
        const stats = columnStats[header];
        const missingPercent = (stats.missing / stats.total) * 100;

        if (missingPercent === 100) {
            warnings.push(`"${header}" սյունակը ամբողջությամբ դատարկ է`);
        } else if (stats.unique.size === 1) {
            warnings.push(`"${header}" սյունակը ունի միայն մեկ եզակի արժեք`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats: {
            rows: data.length,
            columns: headers.length,
            missingValues,
            totalCells,
            missingPercentage: missingPercentage.toFixed(1),
            columnStats
        }
    };
};

/**
 * CSV տվյալների նախադիտման ստեղծում
 * @param {Array} data - Տվյալների զանգված
 * @param {number} maxRows - Առավելագույն տողերի քանակ
 * @returns {Object} Նախադիտման տվյալներ
 */
export const createCSVPreview = (data, maxRows = 5) => {
    if (!Array.isArray(data) || data.length === 0) {
        return { headers: [], preview: [], totalRows: 0 };
    }

    const headers = Object.keys(data[0]);
    const preview = data.slice(0, maxRows);

    return {
        headers,
        preview,
        totalRows: data.length,
        hasMore: data.length > maxRows
    };
};

/**
 * CSV տվյալների մաքրում
 * @param {Array} data - Տվյալների զանգված
 * @param {Object} options - Մաքրման ընտրանքներ
 * @returns {Array} Մաքրված տվյալներ
 */
export const cleanCSVData = (data, options = {}) => {
    const {
        removeEmptyRows = true,
        removeEmptyColumns = true,
        trimWhitespace = true,
        fillMissingValues = false,
        fillValue = 'N/A'
    } = options;

    if (!Array.isArray(data) || data.length === 0) {
        return data;
    }

    let cleanedData = [...data];

    // Սպիտակ տողերի մաքրում
    if (trimWhitespace) {
        cleanedData = cleanedData.map(row => {
            const cleanedRow = {};
            Object.keys(row).forEach(key => {
                const value = row[key];
                cleanedRow[key] = typeof value === 'string' ? value.trim() : value;
            });
            return cleanedRow;
        });
    }

    // Դատարկ տողերի հեռացում
    if (removeEmptyRows) {
        cleanedData = cleanedData.filter(row => {
            const values = Object.values(row);
            return !values.every(val => val === null || val === undefined || val === '');
        });
    }

    // Բացակայող արժեքների լրացում
    if (fillMissingValues) {
        cleanedData = cleanedData.map(row => {
            const filledRow = {};
            Object.keys(row).forEach(key => {
                const value = row[key];
                filledRow[key] = (value === null || value === undefined || value === '') ? fillValue : value;
            });
            return filledRow;
        });
    }

    // Դատարկ սյունակների հեռացում
    if (removeEmptyColumns && cleanedData.length > 0) {
        const headers = Object.keys(cleanedData[0]);
        const columnsToKeep = headers.filter(header => {
            return cleanedData.some(row => {
                const value = row[header];
                return value !== null && value !== undefined && value !== '';
            });
        });

        if (columnsToKeep.length < headers.length) {
            cleanedData = cleanedData.map(row => {
                const filteredRow = {};
                columnsToKeep.forEach(header => {
                    filteredRow[header] = row[header];
                });
                return filteredRow;
            });
        }
    }

    return cleanedData;
};