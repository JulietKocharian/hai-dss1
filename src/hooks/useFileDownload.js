// src/hooks/useFileDownload.js
// Ֆայլ ներբեռնման React hook

import { useCallback } from 'react';
import { arrayToCSV } from '../utils/csvUtils';

/**
 * Ֆայլ ներբեռնման hook
 * Տարբեր ֆորմատներով ֆայլերի ստեղծում և ներբեռնում
 */
export const useFileDownload = () => {

    /**
     * Ֆայլի ներբեռնման հիմնական ֆունկցիա
     * @param {*} content - Ֆայլի բովանդակություն
     * @param {string} filename - Ֆայլի անուն
     * @param {string} format - Ֆայլի ֆորմատ (csv, json, txt)
     */
    const downloadFile = useCallback(async (content, filename, format = 'json') => {
        try {
            let processedContent;
            let mimeType;
            let fileExtension;

            // Ֆորմատի նախապատրաստում
            switch (format.toLowerCase()) {
                case 'csv':
                    processedContent = prepareCSVContent(content);
                    mimeType = 'text/csv;charset=utf-8;';
                    fileExtension = '.csv';
                    break;

                case 'json':
                    processedContent = prepareJSONContent(content);
                    mimeType = 'application/json;charset=utf-8;';
                    fileExtension = '.json';
                    break;

                case 'txt':
                case 'text':
                    processedContent = prepareTextContent(content);
                    mimeType = 'text/plain;charset=utf-8;';
                    fileExtension = '.txt';
                    break;

                case 'xml':
                    processedContent = prepareXMLContent(content);
                    mimeType = 'application/xml;charset=utf-8;';
                    fileExtension = '.xml';
                    break;

                default:
                    throw new Error(`Չապահովված ֆորմատ: ${format}`);
            }

            // Ֆայլի անվանի ճշգրտում
            const finalFilename = ensureFileExtension(filename, fileExtension);

            // Ֆայլի ստեղծում և ներբեռնում
            await createAndDownloadFile(processedContent, finalFilename, mimeType);

            return {
                success: true,
                filename: finalFilename,
                size: new Blob([processedContent]).size
            };

        } catch (error) {
            console.error('Ֆայլ ներբեռնման սխալ:', error);
            throw new Error(`Ֆայլ ներբեռնման սխալ: ${error.message}`);
        }
    }, []);

    /**
     * CSV բովանդակության պատրաստում
     * @param {*} content - Բովանդակություն
     * @returns {string} CSV տեքստ
     */
    const prepareCSVContent = (content) => {
        if (typeof content === 'string') {
            return content;
        }

        if (Array.isArray(content)) {
            return arrayToCSV(content);
        }

        if (content && typeof content === 'object') {
            // Օբյեկտը վերածել CSV-ի
            return convertObjectToCSV(content);
        }

        throw new Error('CSV ֆորմատի համար անհարմար տվյալների տեսակ');
    };

    /**
     * JSON բովանդակության պատրաստում
     * @param {*} content - Բովանդակություն
     * @returns {string} JSON տեքստ
     */
    const prepareJSONContent = (content) => {
        if (typeof content === 'string') {
            try {
                // Ստուգել արդյոք արդեն JSON է
                JSON.parse(content);
                return content;
            } catch {
                // Եթե չէ, ավելացնել quote-ներ
                return JSON.stringify(content, null, 2);
            }
        }

        return JSON.stringify(content, null, 2);
    };

    /**
     * Տեքստային բովանդակության պատրաստում
     * @param {*} content - Բովանդակություն
     * @returns {string} Տեքստ
     */
    const prepareTextContent = (content) => {
        if (typeof content === 'string') {
            return content;
        }

        if (Array.isArray(content)) {
            return content.map((item, index) =>
                `${index + 1}. ${typeof item === 'object' ? JSON.stringify(item) : item}`
            ).join('\n');
        }

        if (content && typeof content === 'object') {
            return Object.entries(content)
                .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
                .join('\n');
        }

        return String(content);
    };

    /**
     * XML բովանդակության պատրաստում
     * @param {*} content - Բովանդակություն
     * @returns {string} XML տեքստ
     */
    const prepareXMLContent = (content) => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';

        if (Array.isArray(content)) {
            content.forEach((item, index) => {
                xml += `  <item index="${index}">\n`;
                if (typeof item === 'object') {
                    Object.entries(item).forEach(([key, value]) => {
                        xml += `    <${key}>${escapeXML(String(value))}</${key}>\n`;
                    });
                } else {
                    xml += `    <value>${escapeXML(String(item))}</value>\n`;
                }
                xml += `  </item>\n`;
            });
        } else if (content && typeof content === 'object') {
            Object.entries(content).forEach(([key, value]) => {
                xml += `  <${key}>${escapeXML(String(value))}</${key}>\n`;
            });
        } else {
            xml += `  <content>${escapeXML(String(content))}</content>\n`;
        }

        xml += '</root>';
        return xml;
    };

    /**
     * Օբյեկտի CSV-ի վերածում
     * @param {Object} obj - Օբյեկտ
     * @returns {string} CSV տեքստ
     */
    const convertObjectToCSV = (obj) => {
        const headers = Object.keys(obj);
        const values = Object.values(obj);

        let csv = headers.join(',') + '\n';
        csv += values.map(value =>
            typeof value === 'object' ? JSON.stringify(value) : String(value)
        ).join(',');

        return csv;
    };

    /**
     * XML-ի համար հատուկ նիշերի escape
     * @param {string} text - Տեքստ
     * @returns {string} Escape արված տեքստ
     */
    const escapeXML = (text) => {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    /**
     * Ֆայլի ընդլայնության ապահովում
     * @param {string} filename - Ֆայլի անուն
     * @param {string} extension - Ընդլայնություն
     * @returns {string} Ճշգրտված ֆայլի անուն
     */
    const ensureFileExtension = (filename, extension) => {
        if (!filename.toLowerCase().endsWith(extension.toLowerCase())) {
            return filename + extension;
        }
        return filename;
    };

    /**
     * Ֆայլի ստեղծում և ներբեռնում
     * @param {string} content - Բովանդակություն
     * @param {string} filename - Ֆայլի անուն
     * @param {string} mimeType - MIME տիպ
     */
    const createAndDownloadFile = async (content, filename, mimeType) => {
        // BOM ավելացնել UTF-8 CSV-ի համար
        const bom = mimeType.includes('csv') ? '\uFEFF' : '';
        const fullContent = bom + content;

        // Blob ստեղծում
        const blob = new Blob([fullContent], { type: mimeType });

        // Browser-ի հակում ստուգել
        if (navigator.msSaveBlob) {
            // Internet Explorer և Edge legacy
            navigator.msSaveBlob(blob, filename);
        } else {
            // Մոդեռն բրաուզերներ
            const url = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');

            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.style.display = 'none';

            // DOM-ին ավելացնել, սեղմել, հեռացնել
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Memory cleanup
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        }
    };

    /**
     * Մի քանի ֆայլի զիպ արխիվի ստեղծում (հետագա իրականացման համար)
     * @param {Array} files - Ֆայլերի ցուցակ
     * @param {string} zipFilename - Zip ֆայլի անուն
     */
    const downloadMultipleFiles = useCallback(async (files, zipFilename = 'archive.zip') => {
        // Սա պահանջում է JSZip գրադարան կամ նմանատիպ լուծում
        // Առայժմ տեղեկացնում ենք, որ ֆունկցիան մշակման փուլում է
        console.warn('Multiple files download requires additional library (JSZip)');

        // Այս պահին ֆայլերը ներբեռնվում են առանձին-առանձին
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await downloadFile(file.content, file.filename, file.format);

            // Փոքր ուշացում հաջորդ ֆայլի համար
            if (i < files.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }, [downloadFile]);

    /**
     * Ֆայլի չափի ֆորմատավորում
     * @param {number} bytes - Բայթերի քանակ
     * @returns {string} Ֆորմատավորված չափ
     */
    const formatFileSize = useCallback((bytes) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    /**
     * Ֆայլի տիպի հայտնաբերում պարամետրերից
     * @param {string} filename - Ֆայլի անուն
     * @returns {string} Գնահատված ֆորմատ
     */
    const detectFileFormat = useCallback((filename) => {
        const extension = filename.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'csv':
                return 'csv';
            case 'json':
                return 'json';
            case 'txt':
                return 'txt';
            case 'xml':
                return 'xml';
            default:
                return 'txt';
        }
    }, []);

    return {
        downloadFile,
        downloadMultipleFiles,
        formatFileSize,
        detectFileFormat
    };
};