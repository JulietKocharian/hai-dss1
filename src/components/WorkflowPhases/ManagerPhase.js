import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { PhaseCard } from '../UI/Card';
import Button from '../UI/Button';
import { parseCSV } from '../../utils/csvUtils';
import CSVUploaderr from '../csvUploader/csvUploader';
import { X, FileText, Info, AlertCircle } from 'lucide-react';

const ManagerPhase = ({
    isActive = true,
    isCompleted = false,
    onPhaseComplete,
    projectId,
    projectStorage,
    onUpdateProject
}) => {
    const {
        projectName,
        setProjectName,
        dataType,
        project,
        setDataType,
        dataSource,
        setDataSource,
        rawData,
        setRawData,
        currentData,
        setCurrentData,
        setAnalystActive,
        setAnalysisWorkspace,
    } = useData();

    console.log(projectId, 'projectprojectblabbala', projectName);

    const [showModal, setShowModal] = useState(false);
    const [selectedCriteria, setSelectedCriteria] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [csvColumns, setCsvColumns] = useState([]); // Новое состояние для столбцов CSV

    const saveCSVToLocalStorage = (csvData, fileName = null) => {
        if (projectId && csvData) {
            const storageKey = `csv_data_${projectId}`;
            const csvInfo = {
                data: csvData,
                fileName: fileName || `data_${new Date().toLocaleDateString()}.csv`,
                uploadedAt: new Date().toISOString(),
                dataType: dataType
            };
            localStorage.setItem(storageKey, JSON.stringify(csvInfo));
        }
    };

    const loadCSVFromLocalStorage = () => {
        if (projectId) {
            const storageKey = `csv_data_${projectId}`;
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                try {
                    const csvInfo = JSON.parse(savedData);
                    if (csvInfo.dataType === dataType && csvInfo.data) {
                        setRawData(csvInfo.data);
                        return true;
                    }
                } catch (error) {
                    console.error('CSV բեռնելու սխալ:', error);
                }
            }
        }
        return false;
    };

    const clearCSVFromLocalStorage = () => {
        if (projectId) {
            const storageKey = `csv_data_${projectId}`;
            localStorage.removeItem(storageKey);
        }
    };

    const handleDeleteCSV = () => {
        clearCSVFromLocalStorage();
        setRawData('');
        setCurrentData([]);
        setCsvColumns([]); // Очищаем столбцы
        setSelectedCriteria({}); // Очищаем выбранные критерии
    };

    // Функция для извлечения столбцов из CSV
    const extractColumnsFromCSV = (csvData) => {
        if (!csvData || !csvData.trim()) {
            return [];
        }

        try {
            const parsedData = parseCSV(csvData);
            if (parsedData.length === 0) {
                return [];
            }

            // Получаем все ключи из первой строки данных
            const columns = Object.keys(parsedData[0]).filter(key => {
                // Исключаем первый столбец (обычно это регион/название)
                const firstColumnName = Object.keys(parsedData[0])[0];
                return key !== firstColumnName;
            });

            return columns.map((column, index) => ({
                id: column.toLowerCase().replace(/[^a-zA-Zа-яА-Я0-9]/g, '_'),
                label: column,
                originalName: column
            }));
        } catch (error) {
            console.error('Ошибка извлечения столбцов из CSV:', error);
            return [];
        }
    };

    useEffect(() => {
        if (projectId && projectStorage) {
            const project = projectStorage.getProject(projectId);
            if (project) {
                const managerData = project.workflowData.phases.manager.data;

                if (managerData.projectName) setProjectName(managerData.projectName);
                if (managerData.dataType) setDataType(managerData.dataType);
                if (managerData.selectedCriteria) setSelectedCriteria(managerData.selectedCriteria);
                if (managerData.dataSource) setDataSource(managerData.dataSource);

                const loaded = loadCSVFromLocalStorage();

                if (!loaded && managerData.rawData) {
                    setRawData(managerData.rawData);
                    if (managerData.parsedData) {
                        setCurrentData(managerData.parsedData);
                    }
                }
            }
        }
    }, [projectId, projectStorage]);

    // Обновляем столбцы при изменении rawData
    useEffect(() => {
        if (rawData && rawData.trim()) {
            const columns = extractColumnsFromCSV(rawData);
            setCsvColumns(columns);
        } else {
            setCsvColumns([]);
        }
    }, [rawData]);

    useEffect(() => {
        const modalKey = `modal_shown_${projectId}_${dataType}`;
        const hasShownModal = localStorage.getItem(modalKey) === 'true';

        if (dataType && rawData && csvColumns.length > 0 && !showModal && isActive && !isCompleted && !hasShownModal) {
            setShowModal(true);
            localStorage.setItem(modalKey, 'true');
        }
    }, [rawData, dataType, csvColumns, isActive, isCompleted, projectId]);

    useEffect(() => {
        if (dataType && rawData) {
            const loaded = loadCSVFromLocalStorage();
            if (!loaded) {
                setRawData('');
                setCurrentData([]);
                setCsvColumns([]);
            }
        }
    }, [dataType]);

    const handleProjectNameChange = (e) => {
        const newName = e.target.value;
        setProjectName(newName);
        if (onUpdateProject && projectId) {
            onUpdateProject(projectId, { name: newName });
        }
    };

    const handleDataTypeChange = (typeValue) => {
        if (dataType && dataType !== typeValue) {
            clearCSVFromLocalStorage();
            setRawData('');
            setCurrentData([]);
            setCsvColumns([]);
        }
        setDataType(typeValue);
        setSelectedCriteria({});
    };

    const handleCriteriaChange = (criteriaId, isChecked) => {
        setSelectedCriteria(prev => ({
            ...prev,
            [dataType]: {
                ...prev[dataType],
                [criteriaId]: isChecked
            }
        }));
    };

    const handleSelectAll = (isChecked) => {
        const newSelection = {};

        csvColumns.forEach(criteria => {
            newSelection[criteria.id] = isChecked;
        });

        setSelectedCriteria(prev => ({
            ...prev,
            [dataType]: newSelection
        }));
    };

    const isAllSelected = () => {
        const currentSelection = selectedCriteria[dataType] || {};

        return csvColumns.length > 0 &&
            csvColumns.every(criteria => currentSelection[criteria.id]);
    };

    const isSomeSelected = () => {
        const currentSelection = selectedCriteria[dataType] || {};

        return csvColumns.some(criteria => currentSelection[criteria.id]);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const submitManagerData = async () => {
        if (!projectName.trim()) {
            alert('Խնդրում ենք մուտքագրել նախագծի անվանումը');
            return;
        }
        if (!dataType) {
            alert('Խնդրում ենք ընտրել սոցիալ-տնտեսական ոլորտը');
            return;
        }
        if (!rawData.trim()) {
            alert('Խնդրում ենք բեռնել CSV տվյալները');
            return;
        }

        setIsSubmitting(true);

        try {
            const parsedData = parseCSV(rawData);
            setAnalysisWorkspace(true);

            if (parsedData.length === 0) {
                alert('CSV տվյալները դատարկ են կամ սխալ ֆորմատ ունեն');
                setIsSubmitting(false);
                return;
            }

            setCurrentData(parsedData);
            saveCSVToLocalStorage(rawData);

            if (projectStorage && projectId) {
                projectStorage.updateManagerPhase(projectId, {
                    projectName,
                    dataType,
                    selectedCriteria,
                    rawData,
                    parsedData,
                    dataSource
                });
            }

            setIsSubmitting(false);

            if (onPhaseComplete) {
                onPhaseComplete();
            } else {
                setAnalystActive(true);
            }

        } catch (error) {
            console.error('CSV մշակման սխալ:', error);
            alert('CSV տվյալների մշակման ժամանակ սխալ առաջացավ: Ստուգեք ֆորմատը:');
            setIsSubmitting(false);
        }
    };

    const handleCSVUpload = (csvData, fileName = null) => {
        setRawData(csvData);
        saveCSVToLocalStorage(csvData, fileName);
        // Столбцы будут извлечены автоматически через useEffect
    };

    const getDataTypeLabel = (value) => {
        const labels = {
            'demographic': 'Դեմոգրաֆիական',
            'healthcare': 'Առողջապահական',
            'quality_of_life': 'Կյանքի որակ',
            'educational': 'Կրթական'
        };
        return labels[value] || value;
    };

    const showDataTypeRequiredWarning = () => {
        if (!dataType) {
            alert('Նախ ընտրեք սոցիալ-տնտեսական ոլորտը, ապա բեռնեք CSV ֆայլը');
            return true;
        }
        return false;
    };

    const canEnableCSVUploader = () => {
        const hasProjectName = projectName && projectName.trim().length > 0;
        const hasDataType = !!dataType && dataType.length > 0;
        return hasProjectName && hasDataType && !isCompleted && !isSubmitting;
    };

    return (
        <>
            <PhaseCard
                title="Մենեջերի փուլ"
                icon="👨‍💼"
                phase="manager"
                className={`h-fit transition-all duration-300 ${isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : isActive
                        ? 'bg-blue-500/10 border-blue-500/30 shadow-lg'
                        : 'opacity-60'
                    }`}
            >
                <div className="mb-3 sm:mb-4">
                    {isCompleted && (
                        <div className="flex items-center space-x-2 text-green-400 text-sm font-medium">
                            <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                            <span>Ավարտված</span>
                        </div>
                    )}
                    {isActive && !isCompleted && (
                        <div className="flex items-center space-x-2 text-green-400 text-sm font-medium">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Ընթացքի մեջ</span>
                        </div>
                    )}
                </div>

                <div className={`space-y-4 sm:space-y-6 ${!isActive && !isCompleted ? 'pointer-events-none' : ''}`}>
                    <div>
                        <label className="block text-sm sm:text-base font-bold text-white mb-2">
                            Նախագծի անվանումը <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={handleProjectNameChange}
                            placeholder="Մուտքագրեք նախագծի անվանումը"
                            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                            maxLength={100}
                            disabled={isCompleted || isSubmitting}
                        />
                        <div className="text-xs text-white mt-1">
                            {projectName.length}/100 նիշ
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">
                            Սոցիալ-տնտեսական ոլորտը <span className="text-red-500">*</span>
                        </label>

                        <div className="space-y-2 sm:space-y-3">
                            {[
                                { value: 'demographic', label: 'Դեմոգրաֆիական', icon: '📊' },
                                { value: 'healthcare', label: 'Առողջապահական', icon: '🏥' },
                                { value: 'quality_of_life', label: 'Կյանքի որակ', icon: '🌟' },
                                { value: 'educational', label: 'Կրթական', icon: '🎓' }
                            ].map((type) => (
                                <label
                                    key={type.value}
                                    className={`flex items-center p-2.5 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isCompleted || isSubmitting
                                        ? 'opacity-75 cursor-not-allowed'
                                        : dataType === type.value
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-400/5'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="dataType"
                                        value={type.value}
                                        checked={dataType === type.value}
                                        onChange={(e) => handleDataTypeChange(type.value)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-2 sm:mr-3 flex-shrink-0"
                                        disabled={isCompleted || isSubmitting}
                                    />
                                    <span className="text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0">{type.icon}</span>
                                    <span className="text-white font-medium text-sm sm:text-base flex-1 min-w-0">{type.label}</span>
                                    {selectedCriteria[type.value] && Object.values(selectedCriteria[type.value]).some(Boolean) && (
                                        <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                            {Object.values(selectedCriteria[type.value]).filter(Boolean).length}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>

                        {dataType && (
                            <div className="text-xs sm:text-sm text-white mt-3 p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <strong>Ընտրված ոլորտ:</strong> {getDataTypeLabel(dataType)}
                            </div>
                        )}
                    </div>

                    <div>
                        {!dataType && (
                            <div className="mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-red-200">
                                        <div className="font-medium text-sm sm:text-base mb-1">
                                            ⚠️ Պահանջվում է ընտրություն
                                        </div>
                                        <div className="text-xs sm:text-sm">
                                            CSV ֆայլ բեռնելու համար նախ ընտրեք սոցիալ-տնտեսական ոլորտը
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {dataType && (
                            <div className="mb-4 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-blue-200">
                                        <div className="font-medium text-sm sm:text-base mb-2">
                                            📂 Ընտրեք CSV ֆայլ
                                        </div>
                                        <div className="text-xs sm:text-sm space-y-1">
                                            <p>Ֆայլը պետք է պարունակի սյունակներ, որոնք համապատասխանում են ընտրված ոլորտին:</p>
                                            <ul className="list-disc list-inside ml-2 space-y-1">
                                                <li>
                                                    <strong>{getDataTypeLabel(dataType)}</strong>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {canEnableCSVUploader() ? (
                            <div>
                                <label className="block text-sm sm:text-base font-bold text-white mb-2">
                                    CSV ֆայլ <span className="text-red-500">*</span>
                                </label>
                                {rawData ? (
                                    <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-5 h-5 text-green-400" />
                                                <span className="text-white font-medium">
                                                    {JSON.parse(localStorage.getItem(`csv_data_${projectId}`))?.fileName || 'Բեռնված CSV'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleDeleteCSV}
                                                className="p-1 hover:bg-red-500/20 rounded-full text-red-400"
                                                disabled={isCompleted}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-white mt-2">
                                            Տողերի քանակ: {rawData.split('\n').filter(line => line.trim()).length - 1}
                                            (առանց վերնագրերի)
                                        </div>
                                        {csvColumns.length > 0 && (
                                            <div className="text-xs text-white mt-2">
                                                Ցուցանիշներ: {csvColumns.map(col => col.label).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <CSVUploaderr
                                        onBeforeUpload={showDataTypeRequiredWarning}
                                        onCSVUpload={handleCSVUpload}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="p-4 border-2 border-dashed border-gray-400/50 rounded-lg text-center bg-gray-500/10">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
                                <p className="text-gray-300 text-sm mb-2">
                                    CSV ֆայլ բեռնելու համար անհրաժեշտ է:
                                </p>
                                <div className="text-xs text-gray-400 space-y-1">
                                    {!projectName?.trim() && (
                                        <div className="flex items-center justify-center space-x-1">
                                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                            <span>Մուտքագրել նախագծի անվանումը</span>
                                        </div>
                                    )}
                                    {projectName?.trim() && !dataType && (
                                        <div className="flex items-center justify-center space-x-1">
                                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                            <span>Ընտրել սոցիալ-տնտեսական ոլորտը</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-gray-200 space-y-3 sm:space-y-4">
                        <Button
                            onClick={submitManagerData}
                            variant="manager"
                            size="md"
                            className={`w-full transition-all duration-300 text-sm sm:text-base py-2.5 sm:py-3 ${isCompleted
                                ? 'bg-green-500 text-white cursor-default'
                                : ''
                                }`}
                            disabled={
                                isCompleted ||
                                isSubmitting ||
                                !projectName || !rawData || !dataType
                            }
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    <span>Ուղարկվում է...</span>
                                </div>
                            ) : isCompleted ? (
                                '✅ Ուղարկված'
                            ) : (
                                '📤 Ուղարկել վերլուծաբանին'
                            )}
                        </Button>

                        <div className="text-xs sm:text-sm text-white bg-white/10 rounded-lg p-3 sm:p-4">
                            <div className="font-medium mb-2">💡 Հուշումներ</div>
                            <ul className="list-disc list-inside space-y-1 opacity-90 leading-relaxed">
                                <li>Նախ ընտրեք ոլորտը, ապա բեռնեք CSV ֆայլը</li>
                                <li>Առաջին տողը պետք է պարունակի սյունակների վերնագրերը</li>
                                <li>Յուրաքանչյուր արժեք պետք է համապատասխանի սյունակի տեսակին</li>
                                <li className="sm:block hidden">Որոշ դաշտեր կարող են դատարկ մնալ</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </PhaseCard>

            {showModal && !isCompleted && !isSubmitting && dataType && csvColumns.length > 0 && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" style={{ zIndex: 9999 }}>
                    <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-2xl h-[90vh] sm:h-[85vh] flex flex-col shadow-2xl">
                        <div className="bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white p-4 sm:p-6 flex items-start sm:items-center justify-between flex-shrink-0">
                            <div className="flex-1 min-w-0 pr-3">
                                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                                    {getDataTypeLabel(dataType)} ոլորտի ցուցանիշները
                                </h3>
                                <p className="text-white/80 text-sm mt-1 leading-relaxed">
                                    Ընտրեք անհրաժեշտ ցուցանիշները վերլուծության համար
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0">
                            <div className="h-full overflow-y-auto">
                                <div className="p-3 sm:p-6">
                                    <div className="space-y-2 sm:space-y-3">
                                        <label className="flex items-start p-3 sm:p-4 border-2 border-blue-500 bg-blue-50 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 mb-4">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected()}
                                                ref={input => {
                                                    if (input) input.indeterminate = !isAllSelected() && isSomeSelected();
                                                }}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-3 sm:mr-4 mt-0.5 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm sm:text-base font-bold text-blue-700 leading-relaxed block">
                                                    ✅ Ընտրել բոլորը
                                                </span>
                                                <span className="text-xs sm:text-sm text-blue-600 mt-1 block">
                                                    Ընտրել/չեղարկել բոլոր ցուցանիշները միանգամից
                                                </span>
                                            </div>
                                        </label>

                                        {csvColumns.map((criteria, index) => (
                                            <label
                                                key={criteria.id}
                                                className={`flex items-start p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 ${selectedCriteria[dataType]?.[criteria.id]
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCriteria[dataType]?.[criteria.id] || false}
                                                    onChange={(e) => handleCriteriaChange(criteria.id, e.target.checked)}
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-3 sm:mr-4 mt-0.5 flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed block">
                                                        {index + 1}. {criteria.label}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}

                                        <div className="h-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 border-t border-gray-200">
                            <div className="text-sm text-gray-600 order-2 sm:order-1">
                                Ընտրված: {Object.values(selectedCriteria[dataType] || {}).filter(Boolean).length} / {csvColumns.length}
                            </div>
                            <div className="flex space-x-3 order-1 sm:order-2">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base font-medium"
                                >
                                    Փակել
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-lg hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300 text-sm sm:text-base font-medium shadow-lg"
                                >
                                    Պահպանել
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManagerPhase;