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
    // НОВЫЕ ПРОПСЫ:
    projectId,
    projectStorage,
    onUpdateProject
}) => {
    const {
        projectName,
        setProjectName,
        dataType,
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

    const [showModal, setShowModal] = useState(false);
    const [selectedCriteria, setSelectedCriteria] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (projectId && projectStorage) {
            const project = projectStorage.getProject(projectId);
            if (project) {
                // Загружаем данные из localStorage в useData контекст
                const managerData = project.workflowData.phases.manager.data;
                if (managerData.projectName) {
                    setProjectName(managerData.projectName);
                }
                if (managerData.dataType) {
                    setDataType(managerData.dataType);
                }
                if (managerData.rawData) {
                    setRawData(managerData.rawData);
                }
                if (managerData.selectedCriteria) {
                    setSelectedCriteria(managerData.selectedCriteria);
                }
                if (managerData.dataSource) {
                    setDataSource(managerData.dataSource);
                }
            }
        }
    }, [projectId, projectStorage]);

    // НОВЫЙ useEffect: Автоматически открывает модалку после загрузки CSV
    useEffect(() => {
        // Открываем модалку только если:
        // 1. Выбран тип данных (один)
        // 2. CSV данные загружены
        // 3. Модалка еще не открыта
        // 4. Компонент активен и не завершен
        if (dataType && rawData && rawData.trim() && !showModal && isActive && !isCompleted) {
            setShowModal(true);
        }
    }, [rawData, dataType, isActive, isCompleted]);

    // НОВЫЙ useEffect: Очищаем CSV данные при смене типа данных
    useEffect(() => {
        // Если тип данных изменился и у нас есть загруженные данные, очищаем их
        if (rawData && rawData.trim()) {
            setRawData('');
            // Также очищаем текущие данные
            setCurrentData([]);
        }
    }, [dataType]);

    console.log('curreeeeent', currentData, 88888)

    // Define criteria for each data type
    const dataTypeCriteria = {
        'demographic': [
            { id: 'births', label: 'Ծնվածների քանակ' },
            { id: 'immigration', label: 'Մեռելածինների քանակ' },
            { id: 'deaths', label: 'Մահացածների քանակ' },
            { id: 'infant_deaths', label: 'Մինչև 1 տարեկան մահացածների քանակ' },
            { id: 'natural_increase', label: 'Բնական հավելաճ (Ծնվածներ - Մահացածներ)' },
            { id: 'marriages', label: 'Ամուսնությունների քանակ' },
            { id: 'divorces', label: 'Ամուսնալուծությունների քանակ' },
        ],
        'healthcare': [
            { id: 'neonatal_diseases', label: 'Մունիցիպալ ամբուլատոր հիմնարկների թիվ' },
            { id: 'doctors_per_10k', label: 'Բժիշկներ՝ 10 հազ. մարդու հաշվով' },
            { id: 'nurses_per_10k', label: 'Մահճակալներ՝ 10 հազ. մարդու հաշվով' },
            { id: 'healthcare_total_expenses', label: 'Առողջապահության ընդհանուր ծախսեր' },
            { id: 'hospital_investments', label: 'Ներդրումներ՝ հիմնական միջոցների համար' },
            { id: 'impact_expenses', label: 'Աշխատավարձային ծախսեր' },
            { id: 'covid19_mortality', label: 'COVID-19 բուժօգնության որակ*' },
        ],
        'quality_of_life': [
            { id: 'min_monthly_income', label: 'Մեկ շնչի միջին ամսական եկամուտ (դրամ)' },
            { id: 'unemployment_rate', label: 'Աղքատության մակարդակ (%)' },
            { id: 'poverty_rate', label: 'Աշխատանքազուրկության մակարդակ (%)' },
            { id: 'education_years', label: 'Կրթության պարտադիր տևողություն (տարի)' },
            { id: 'life_expectancy', label: 'Կյանքի տևողություն ծննդյան պահին (տարի)' },
            { id: 'healthcare_spending_per_capita', label: 'Առողջապահության ծախսեր մեկ շնչի հաշվով (USD)' },
            { id: 'internet_penetration', label: 'Ինտերնետ հասանելիություն բնակչության շրջանում (%)' },
        ],
        'educational': [
            { id: 'general_education_institutions', label: 'Նախադպրոցական հաստատություններ հաճախող երեխաների թիվ' },
            { id: 'higher_education_students', label: 'Հանրակրթական դպրոցների աշակերտների թիվ' },
            { id: 'middle_vocational_institutions', label: 'Միջին մասնագիտական ուսումնական հաստատությունների ուսանողների թիվ' },
            { id: 'technical_institutions', label: 'Բարձրագույն ուսումնական հաստատությունների ուսանողների թիվ' },
            { id: 'vocational_students', label: 'Հանրակրթական դպրոցների ուսուցիչների ընդհանուր թիվ' },
            { id: 'literacy_statistics', label: 'Մեկ ուսուցչի բաժին ընկնող աշակերտների միջին թիվ' },
            { id: 'education_funding_gdp', label: 'Կրթության ոլորտի պետական ծախսեր ՀՆԱ-ում' },
        ]
    };

    // НОВОЕ: Обработчик изменения названия проекта
    const handleProjectNameChange = (e) => {
        const newName = e.target.value;
        setProjectName(newName); // Обновляем в useData

        // Обновляем в localStorage
        if (onUpdateProject && projectId) {
            onUpdateProject(projectId, { name: newName });
        }
    };

    // ИЗМЕНЕННЫЙ: Теперь выбираем только ОДИН тип данных (radio button логика)
    const handleDataTypeChange = (typeValue) => {
        setDataType(typeValue);
        // Сбрасываем выбранные критерии при смене типа данных
        setSelectedCriteria({});
        // НОВОЕ: Очищаем загруженные CSV данные при смене типа
        if (rawData && rawData.trim()) {
            setRawData('');
            setCurrentData([]);
        }
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

    // Handle Select All functionality
    const handleSelectAll = (isChecked) => {
        const currentCriteria = dataTypeCriteria[dataType] || [];
        const newSelection = {};

        currentCriteria.forEach(criteria => {
            newSelection[criteria.id] = isChecked;
        });

        setSelectedCriteria(prev => ({
            ...prev,
            [dataType]: newSelection
        }));
    };

    // Check if all criteria are selected
    const isAllSelected = () => {
        const currentCriteria = dataTypeCriteria[dataType] || [];
        const currentSelection = selectedCriteria[dataType] || {};

        return currentCriteria.length > 0 &&
            currentCriteria.every(criteria => currentSelection[criteria.id]);
    };

    // Check if some criteria are selected (for indeterminate state)
    const isSomeSelected = () => {
        const currentCriteria = dataTypeCriteria[dataType] || [];
        const currentSelection = selectedCriteria[dataType] || {};

        return currentCriteria.some(criteria => currentSelection[criteria.id]);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // ОБНОВЛЕННАЯ submitManagerData функция
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
            alert('Խնդրում ենք մուտքագրել CSV տվյալները');
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const parsedData = parseCSV(rawData);
            console.log('Parsed CSV data:', parsedData);
            setAnalysisWorkspace(true);

            if (parsedData.length === 0) {
                alert('CSV տվյալները դատարկ են կամ սխալ ֆորմատ ունեն');
                setIsSubmitting(false);
                return;
            }

            setCurrentData(parsedData);

            // НОВОЕ: Сохраняем данные в localStorage через ProjectStorageManager
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

            console.log('Մենեջերի տվյալները հաջողությամբ ուղարկվել են:', {
                projectName,
                dataType,
                selectedCriteria,
                rowCount: parsedData.length
            });

            setIsSubmitting(false);

            if (onPhaseComplete) {
                onPhaseComplete();
            } else {
                setAnalystActive(true);
            }

        } catch (error) {
            console.error('CSV մշակման սխալ:', error);
            alert('CSV տվյալների մշակման ժամանակ սխալ առաջացավ: Ստուգեք ֆորմամտը:');
            setIsSubmitting(false);
        }
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

    // Check if data type is selected (now single value, not array)
    const hasSelectedDataType = !!dataType;

    // ОБНОВЛЕННАЯ: Строгая проверка для включения CSV uploader
    const canEnableCSVUploader = () => {
        const hasProjectName = projectName && projectName.trim().length > 0;
        const hasDataType = !!dataType && dataType.length > 0;

        return hasProjectName && hasDataType && !isCompleted && !isSubmitting;
    };

    // НОВАЯ: Функция для показа предупреждения при попытке загрузки без выбора типа
    const showDataTypeRequiredWarning = () => {
        if (!dataType) {
            alert('Նախ ընտրեք սոցիալ-տնտեսական ոլորտը, ապա բեռնեք CSV ֆայլը');
            return true;
        }
        return false;
    };

    console.log(dataType, 'dataTypedataType')

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
                {/* Status Badge */}
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
                    {/* ОБНОВЛЕННЫЙ Project Name Input */}
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

                    {/* ИЗМЕНЕННЫЙ Data Type Selection - теперь radio buttons */}
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
                                <strong>Ընտրված սոցիալ-տնտեսական ոլորտ:</strong> {getDataTypeLabel(dataType)}
                            </div>
                        )}
                    </div>

                    {/* ОБНОВЛЕННЫЙ CSV Upload Section */}
                    <div>
                        {/* НОВОЕ: Показываем предупреждение, если тип данных не выбран */}
                        {!hasSelectedDataType && (
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

                        {/* CSV Upload Instructions - показываем только когда выбран тип данных */}
                        {hasSelectedDataType && (
                            <div className="mb-4 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-blue-200">
                                        <div className="font-medium text-sm sm:text-base mb-2">
                                            📂 Ընտրեք CSV ֆայլ
                                        </div>
                                        <div className="text-xs sm:text-sm space-y-1">
                                            <p>Ֆայլը պետք է պարունակի հետևյալ սոցիալ-տնտեսական ոլորտին համապատասխան սյունակներ:</p>
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

                        {/* CSV Uploader или заблокированная область */}
                        {canEnableCSVUploader() ? (
                            <div>
                                <label className="block text-sm sm:text-base font-bold text-white mb-2">
                                    CSV ֆայլ <span className="text-red-500">*</span>
                                </label>
                                <CSVUploaderr
                                    onBeforeUpload={showDataTypeRequiredWarning}
                                />

                                {rawData && (
                                    <div className="text-xs sm:text-sm text-white mt-1">
                                        Տողերի քանակ {rawData.split('\n').filter(line => line.trim()).length - 1}
                                        (առանց սյունակների վերնագրերի)
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 border-2 border-dashed border-gray-400/50 rounded-lg text-center bg-gray-500/10">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
                                <p className="text-gray-300 text-sm mb-2">
                                    CSV ֆայլ բեռնելու համար հարկավոր է:
                                </p>
                                <div className="text-xs text-gray-400 space-y-1">
                                    {!projectName?.trim() && (
                                        <div className="flex items-center justify-center space-x-1">
                                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                            <span>Մուտքագրել նախագծի անվանումը</span>
                                        </div>
                                    )}
                                    {projectName?.trim() && !dataType.length > 0 && (
                                        <div className="flex items-center justify-center space-x-1">
                                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                            <span>Ընտրել սոցիալ-տնտեսական ոլորտը</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Section */}
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
                                !projectName || !rawData || !hasSelectedDataType
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

                        {/* Tips Section */}
                        <div className="text-xs sm:text-sm text-white bg-white/10 rounded-lg p-3 sm:p-4">
                            <div className="font-medium mb-2">💡 Հուշումներ</div>
                            <ul className="list-disc list-inside space-y-1 opacity-90 leading-relaxed">
                                <li>Նախ ընտրեք սոցիալ-տնտեսական ոլորտը, ապա բեռնեք CSV ֆայլը</li>
                                <li>Առաջին տողը պետք է պարունակի սյունակների անվանումները</li>
                                <li>Յուրաքանչյուր տողի արժեք պետք է համապատասխանի իր սյունակի տեսակին</li>
                                <li className="sm:block hidden">Տվյալներ մուտքագրելուց հնարավորություն կա որոշ դաշտեր թողնել դատարկ</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </PhaseCard>

            {showModal && !isCompleted && !isSubmitting && dataType && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" style={{ zIndex: 9999 }}>
                    <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-2xl h-[90vh] sm:h-[85vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white p-4 sm:p-6 flex items-start sm:items-center justify-between flex-shrink-0">
                            <div className="flex-1 min-w-0 pr-3">
                                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                                    {getDataTypeLabel(dataType)} ոլորտի ցուցանիշները
                                </h3>
                                <p className="text-white/80 text-sm mt-1 leading-relaxed">
                                    Ընտրեք անհրաժեշտ ցուցանիշներ վերլուծության համար
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Modal Content - правильный скролл */}
                        <div className="flex-1 min-h-0">
                            <div className="h-full overflow-y-auto">
                                <div className="p-3 sm:p-6">
                                    <div className="space-y-2 sm:space-y-3">
                                        {/* Select All Option */}
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

                                        {/* Individual Criteria */}
                                        {dataTypeCriteria[dataType]?.map((criteria, index) => (
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

                                        {/* Добавляем немного места внизу для удобства прокрутки */}
                                        <div className="h-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - зафиксирован внизу */}
                        <div className="bg-gray-50 p-3 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 border-t border-gray-200">
                            <div className="text-sm text-gray-600 order-2 sm:order-1">
                                Ընտրված չափանիշներ: {Object.values(selectedCriteria[dataType] || {}).filter(Boolean).length} / {dataTypeCriteria[dataType]?.length || 0}
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