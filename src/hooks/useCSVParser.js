// src/hooks/useCSVParser.js
// CSV տվյալների մշակման React hook

import { useState, useCallback } from 'react';
import { parseCSV, validateCSVData, cleanCSVData, createCSVPreview } from '../utils/csvUtils';

/**
 * CSV մշակման hook
 * Տվյալների մուտքագրում, վալիդացիա, մաքրում և նախադիտում
 */
export const useCSVParser = () => {
    const [parsedData, setParsedData] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewData, setPreviewData] = useState(null);

    /**
     * CSV տեքստի մշակում
     * @param {string} csvText - CSV ֆորմատի տեքստ
     * @param {Object} options - Մշակման ընտրանքներ
     */
    const parseCSVText = useCallback(async (csvText, options = {}) => {
        const {
            autoClean = false,
            validateData = true,
            createPreview = true,
            maxPreviewRows = 10
        } = options;

        setIsLoading(true);
        setError(null);

        try {
            // CSV-ի մշակում
            const data = parseCSV(csvText);

            if (!data || data.length === 0) {
                throw new Error('CSV տվյալները դատարկ են կամ սխալ ֆորմատ ունեն');
            }

            setParsedData(data);

            // Վալիդացիա
            let validation = null;
            if (validateData) {
                validation = validateCSVData(data);
                setValidationResult(validation);
            }

            // Նախադիտում
            let preview = null;
            if (createPreview) {
                preview = createCSVPreview(data, maxPreviewRows);
                setPreviewData(preview);
            }

            // Ավտոմատ մաքրում
            let cleanedData = data;
            if (autoClean && validation && !validation.isValid) {
                cleanedData = cleanCSVData(data, {
                    removeEmptyRows: true,
                    removeEmptyColumns: false,
                    trimWhitespace: true,
                    fillMissingValues: false
                });
                setParsedData(cleanedData);

                // Վերավալիդացիա մաքրումից հետո
                if (validateData) {
                    const newValidation = validateCSVData(cleanedData);
                    setValidationResult(newValidation);
                }
            }

            return {
                success: true,
                data: cleanedData,
                validation,
                preview,
                originalRowCount: data.length,
                cleanedRowCount: cleanedData.length
            };

        } catch (err) {
            const errorMessage = `CSV մշակման սխալ: ${err.message}`;
            setError(errorMessage);
            console.error('CSV parsing error:', err);

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Ֆայլից CSV-ի կարդալ
     * @param {File} file - CSV ֆայլ
     * @param {Object} options - Կարդալու ընտրանքներ
     */
    const parseCSVFile = useCallback(async (file, options = {}) => {
        const { encoding = 'UTF-8' } = options;

        if (!file) {
            throw new Error('Ֆայլը բացակայում է');
        }

        if (!file.name.toLowerCase().endsWith('.csv')) {
            throw new Error('Ֆայլը պետք է .csv ընդլայնություն ունենա');
        }

        setIsLoading(true);
        setError(null);

        try {
            const text = await readFileAsText(file, encoding);
            return await parseCSVText(text, options);
        } catch (err) {
            const errorMessage = `Ֆայլ կարդալու սխալ: ${err.message}`;
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, [parseCSVText]);

    /**
     * Ֆայլի տեքստային կարդալ
     * @param {File} file - Ֆայլ
     * @param {string} encoding - Կոդավորում
     * @returns {Promise<string>} Ֆայլի բովանդակություն
     */
    const readFileAsText = (file, encoding) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                resolve(event.target.result);
            };

            reader.onerror = () => {
                reject(new Error('Ֆայլ կարդալու սխալ'));
            };

            reader.readAsText(file, encoding);
        });
    };

    /**
     * Տվյալների մաքրում կարգավորումներով
     * @param {Object} cleaningOptions - Մաքրման ընտրանքներ
     */
    const cleanData = useCallback(async (cleaningOptions = {}) => {
        if (!parsedData) {
            throw new Error('Մաքրելու համար տվյալներ չեն գտնվել');
        }

        setIsLoading(true);

        try {
            const cleaned = cleanCSVData(parsedData, cleaningOptions);
            setParsedData(cleaned);

            // Վերավալիդացիա
            const newValidation = validateCSVData(cleaned);
            setValidationResult(newValidation);

            // Նոր նախադիտում
            const newPreview = createCSVPreview(cleaned);
            setPreviewData(newPreview);

            return {
                success: true,
                data: cleaned,
                validation: newValidation,
                preview: newPreview
            };

        } catch (err) {
            const errorMessage = `Մաքրման սխալ: ${err.message}`;
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [parsedData]);

    /**
     * Սյունակի վերանվանում
     * @param {string} oldName - Հին անուն
     * @param {string} newName - Նոր անուն
     */
    const renameColumn = useCallback((oldName, newName) => {
        if (!parsedData || parsedData.length === 0) {
            throw new Error('Տվյալներ չեն գտնվել');
        }

        if (!newName || newName.trim() === '') {
            throw new Error('Նոր անունը չի կարող դատարկ լինել');
        }

        const updatedData = parsedData.map(row => {
            const newRow = { ...row };
            if (oldName in newRow) {
                newRow[newName.trim()] = newRow[oldName];
                delete newRow[oldName];
            }
            return newRow;
        });

        setParsedData(updatedData);

        // Նոր նախադիտում
        const newPreview = createCSVPreview(updatedData);
        setPreviewData(newPreview);

        return updatedData;
    }, [parsedData]);

    /**
     * Սյունակի հեռացում
     * @param {string} columnName - Սյունակի անուն
     */
    const removeColumn = useCallback((columnName) => {
        if (!parsedData || parsedData.length === 0) {
            throw new Error('Տվյալներ չեն գտնվել');
        }

        const updatedData = parsedData.map(row => {
            const newRow = { ...row };
            delete newRow[columnName];
            return newRow;
        });

        setParsedData(updatedData);

        // Նոր վալիդացիա և նախադիտում
        const newValidation = validateCSVData(updatedData);
        setValidationResult(newValidation);

        const newPreview = createCSVPreview(updatedData);
        setPreviewData(newPreview);

        return updatedData;
    }, [parsedData]);

    /**
     * Տողի հեռացում
     * @param {number} rowIndex - Տողի ինդեքս
     */
    const removeRow = useCallback((rowIndex) => {
        if (!parsedData || parsedData.length === 0) {
            throw new Error('Տվյալներ չեն գտնվել');
        }

        if (rowIndex < 0 || rowIndex >= parsedData.length) {
            throw new Error('Սխալ տողի ինդեքս');
        }

        const updatedData = parsedData.filter((_, index) => index !== rowIndex);
        setParsedData(updatedData);

        // Նոր վալիդացիա և նախադիտում
        const newValidation = validateCSVData(updatedData);
        setValidationResult(newValidation);

        const newPreview = createCSVPreview(updatedData);
        setPreviewData(newPreview);

        return updatedData;
    }, [parsedData]);

    /**
     * Սյունակի մեջ արժեքի փոխարինում
     * @param {string} columnName - Սյունակի անուն
     * @param {*} oldValue - Հին արժեք
     * @param {*} newValue - Նոր արժեք
     */
    const replaceColumnValue = useCallback((columnName, oldValue, newValue) => {
        if (!parsedData || parsedData.length === 0) {
            throw new Error('Տվյալներ չեն գտնվել');
        }

        const updatedData = parsedData.map(row => {
            const newRow = { ...row };
            if (newRow[columnName] === oldValue) {
                newRow[columnName] = newValue;
            }
            return newRow;
        });

        setParsedData(updatedData);

        // Նոր նախադիտում
        const newPreview = createCSVPreview(updatedData);
        setPreviewData(newPreview);

        return updatedData;
    }, [parsedData]);

    /**
     * Տվյալների ստատիստիկա
     */
    const getDataStatistics = useCallback(() => {
        if (!parsedData || parsedData.length === 0) {
            return null;
        }

        const headers = Object.keys(parsedData[0]);
        const totalCells = parsedData.length * headers.length;
        let filledCells = 0;
        let missingCells = 0;

        parsedData.forEach(row => {
            headers.forEach(header => {
                const value = row[header];
                if (value !== null && value !== undefined && value !== '') {
                    filledCells++;
                } else {
                    missingCells++;
                }
            });
        });

        return {
            rowCount: parsedData.length,
            columnCount: headers.length,
            totalCells,
            filledCells,
            missingCells,
            completeness: (filledCells / totalCells) * 100,
            headers
        };
    }, [parsedData]);

    /**
     * Վիճակի վերականգնում
     */
    const reset = useCallback(() => {
        setParsedData(null);
        setValidationResult(null);
        setError(null);
        setPreviewData(null);
    }, []);

    /**
     * CSV-ի արտահանում
     * @param {Object} exportOptions - Արտահանման ընտրանքներ
     */
    const exportToCSV = useCallback((exportOptions = {}) => {
        if (!parsedData || parsedData.length === 0) {
            throw new Error('Ներբեռնելու համար տվյալներ չեն գտնվել');
        }

        const {
            includeHeaders = true,
            delimiter = ',',
            encoding = 'UTF-8'
        } = exportOptions;

        try {
            // CSV տեքստի ստեղծում
            const headers = Object.keys(parsedData[0]);
            let csvContent = '';

            if (includeHeaders) {
                csvContent += headers.join(delimiter) + '\n';
            }

            parsedData.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    if (value === null || value === undefined) {
                        return '';
                    }

                    const stringValue = String(value);
                    // Եթե արժեքը պարունակում է delimiter, գծիկներ կամ նոր տող
                    if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                });

                csvContent += values.join(delimiter) + '\n';
            });

            return csvContent;

        } catch (err) {
            throw new Error(`CSV արտահանման սխալ: ${err.message}`);
        }
    }, [parsedData]);

    return {
        // Վիճակ
        parsedData,
        validationResult,
        isLoading,
        error,
        previewData,

        // Գործողություններ
        parseCSVText,
        parseCSVFile,
        cleanData,
        renameColumn,
        removeColumn,
        removeRow,
        replaceColumnValue,
        exportToCSV,
        reset,

        // Օգնական ֆունկցիաներ
        getDataStatistics
    };
};