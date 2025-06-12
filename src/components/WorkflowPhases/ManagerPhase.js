import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PhaseCard } from '../UI/Card';
import Button from '../UI/Button';
import { parseCSV } from '../../utils/csvUtils';
import CSVUploaderr from '../csvUploader/csvUploader';
import { X } from 'lucide-react';

const ManagerPhase = ({ isActive = true, isCompleted = false, onStartProgression }) => {
    const {
        projectName,
        setProjectName,
        dataType,
        setDataType,
        dataSource,
        setDataSource,
        rawData,
        setRawData,
        setCurrentData,
        setAnalystActive
    } = useData();

    const [showModal, setShowModal] = useState(false);
    const [currentModalType, setCurrentModalType] = useState('');
    const [selectedCriteria, setSelectedCriteria] = useState({});

    // Define criteria for each data type
    const dataTypeCriteria = {
        'demographic': [
            { id: 'births', label: 'Ծնվածների քանակ' },
            { id: 'immigration', label: 'Ներգաղթօղների քանակ' },
            { id: 'deaths', label: 'Նահատակների քանակ' },
            { id: 'infant_deaths', label: 'Ընկ 1 տարեկան նահատակների քանակ' },
            { id: 'natural_increase', label: 'Բնական հավելյալ (Ծնվածների - Նահատակները)' },
            { id: 'marriages', label: 'Ամուսնությունների քանակ' },
            { id: 'divorces', label: 'Ամուսնալուծությունների քանակ' },
        ],
        'healthcare': [
            { id: 'neonatal_diseases', label: 'Նորահասակ ամորսականք հիվանդությունների թիվ' },
            { id: 'doctors_per_10k', label: 'Բժիշկներ՝ 10 հազ. բնակիչ հաշվով' },
            { id: 'nurses_per_10k', label: 'Նահծանակտար՝ 10 հազ. բնակիչ հաշվով' },
            { id: 'healthcare_total_expenses', label: 'Առողջապահության ընդհանուր ծանուցումր' },
            { id: 'hospital_investments', label: 'Ներդրումներ՝ հիվանդանա միջոցների համար' },
            { id: 'impact_expenses', label: 'Ազդուրակարկություն ծանուցումր' },
            { id: 'covid19_mortality', label: 'COVID-19 բուծծություն դրսում' },
        ],
        'quality_of_life': [
            { id: 'min_monthly_income', label: 'Ընկ շքի մինիմում ամսական եկամուտ' },
            { id: 'unemployment_rate', label: 'Արտանցություն ցամանակակ' },
            { id: 'poverty_rate', label: 'Աղքատությանցունցություն ցամանակակ' },
            { id: 'education_years', label: 'Կրթության ամտանակիր ունենտությունր' },
            { id: 'life_expectancy', label: 'Կանթի ունենտությունր ծանանակ ապահի' },
            { id: 'healthcare_spending_per_capita', label: 'Արտանցահության ծանուցումր ցել շքի հաշվով' },
            { id: 'internet_penetration', label: 'Ինտերնետ համակիցությունր բնակչություն շրջանակ' },
        ],
        'educational': [
            { id: 'general_education_institutions', label: 'Նանատակական համատարածվության հաստատությունների հաճացակնակ նեգյանական թիվ' },
            { id: 'higher_education_students', label: 'Հանդումանակական դիգությունների ծանակյունների թիվ' },
            { id: 'middle_vocational_institutions', label: 'Միջի ցամարագուական ոճանական համատարածվության ոճանական թիվ' },
            { id: 'technical_institutions', label: 'Բարյանուտանց ոճանական համատարածվության ոճանական թիվ' },
            { id: 'vocational_students', label: 'Հանդումանակական դիգությունների ոճանցիարին ծնուցուանր թիվ' },
            { id: 'literacy_statistics', label: 'Նել ոճանցի բարցի ընիռուր ծանակյունների միծի թիվ' },
            { id: 'education_funding_gdp', label: 'Կրթական դիսուռի ամժանակական ծանուցումր ԷՆԵ-ուսկ' },
        ]
    };

    const handleDataTypeChange = (typeValue, isChecked) => {
        const currentDataType = Array.isArray(dataType) ? dataType : [];

        if (isChecked) {
            // Add to array and open modal for criteria selection
            setDataType([...currentDataType, typeValue]);
            setCurrentModalType(typeValue);
            setShowModal(true);
        } else {
            // Remove from array and clear its criteria
            setDataType(currentDataType.filter(t => t !== typeValue));
            setSelectedCriteria(prev => {
                const updated = { ...prev };
                delete updated[typeValue];
                return updated;
            });
        }
    };

    const handleCriteriaChange = (criteriaId, isChecked) => {
        setSelectedCriteria(prev => ({
            ...prev,
            [currentModalType]: {
                ...prev[currentModalType],
                [criteriaId]: isChecked
            }
        }));
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentModalType('');
    };

    const submitManagerData = () => {
        if (!projectName.trim()) {
            alert('Խնդրում ենք մուտքագրել նախագծի անվանումը');
            return;
        }
        if (Array.isArray(dataType) ? dataType.length === 0 : !dataType) {
            alert('Խնդրում ենք ընտրել առնվազն մեկ տվյալների տեսակ');
            return;
        }
        if (!rawData.trim()) {
            alert('Խնդրում ենք մուտքագրել CSV տվյալները');
            return;
        }
        try {
            const parsedData = parseCSV(rawData);

            if (parsedData.length === 0) {
                alert('CSV տվյալները դատարկ են կամ սխալ ֆորմատ ունեն');
                return;
            }
            setCurrentData(parsedData);

            // Use the new progression system instead of setAnalystActive
            if (onStartProgression) {
                onStartProgression();
            } else {
                // Fallback to original behavior if not using the new system
                setAnalystActive(true);
            }

            console.log('Մենեջերի տվյալները հաջողությամբ ուղարկվել են:', {
                projectName,
                dataType,
                selectedCriteria,
                rowCount: parsedData.length
            });

        } catch (error) {
            console.error('CSV մշակման սխալ:', error);
            alert('CSV տվյալների մշակման ժամանակ սխալ առաջացավ: Ստուգեք ֆորմատը:');
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

    return (
        <>
            <PhaseCard
                title="Մենեջերի փուլ"
                icon="👨‍💼"
                phase="manager"
                className={`h-fit transition-all duration-300 ${
                    isCompleted 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : isActive 
                        ? 'bg-blue-500/10 border-blue-500/30 shadow-lg' 
                        : 'opacity-60'
                }`}
            >
                {/* Status Badge */}
                <div className="mb-4">
                    {isCompleted && (
                        <div className="flex items-center space-x-2 text-green-400 text-sm font-medium">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span>Ավարտված</span>
                        </div>
                    )}
                    {isActive && !isCompleted && (
                        <div className="flex items-center space-x-2 text-blue-400 text-sm font-medium">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span>Ակտիվ</span>
                        </div>
                    )}
                    {!isActive && !isCompleted && (
                        <div className="flex items-center space-x-2 text-gray-400 text-sm font-medium">
                            <span className="w-2 h-2 bg-gray-400 rounded-full opacity-50"></span>
                            <span>Սպասում</span>
                        </div>
                    )}
                </div>

                <div className={`space-y-4 ${!isActive && !isCompleted ? 'pointer-events-none' : ''}`}>
                    <div>
                        <label className="block text-sm font-bold text-white-700 mb-2" style={{ color: "#fff" }}>
                            Նախագծի անվանումը <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Մուտքագրեք նախագծի անվանումը"
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                            maxLength={100}
                            disabled={isCompleted}
                        />
                        <div className="text-xs text-white-500 mt-1" style={{ color: "#fff" }}>
                            {projectName.length}/100 նիշ
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-white-700 mb-2" style={{ color: "#fff" }}>
                            Տվյալների տեսակը <span className="text-red-500">*</span>
                        </label>

                        <div className="space-y-3">
                            {[
                                { value: 'demographic', label: 'Դեմոգրաֆիական', icon: '📊' },
                                { value: 'healthcare', label: 'Առողջապահական', icon: '🏥' },
                                { value: 'quality_of_life', label: 'Կյանքի որակ', icon: '🌟' },
                                { value: 'educational', label: 'Կրթական', icon: '🎓' }
                            ].map((type) => (
                                <label
                                    key={type.value}
                                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                        isCompleted 
                                            ? 'opacity-75 cursor-not-allowed' 
                                            : Array.isArray(dataType) && dataType.includes(type.value)
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-400/5'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(dataType) && dataType.includes(type.value)}
                                        onChange={(e) => handleDataTypeChange(type.value, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-3"
                                        disabled={isCompleted}
                                    />
                                    <span className="text-xl mr-3">{type.icon}</span>
                                    <span className="text-white font-medium">{type.label}</span>
                                    {selectedCriteria[type.value] && Object.values(selectedCriteria[type.value]).some(Boolean) && (
                                        <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                            {Object.values(selectedCriteria[type.value]).filter(Boolean).length}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>

                        {Array.isArray(dataType) && dataType.length > 0 && (
                            <div className="text-xs text-white mt-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <strong>Ընտրված տեսակներ:</strong> {dataType.map(type => getDataTypeLabel(type)).join(', ')}
                            </div>
                        )}
                    </div>

                    <div>
                        <CSVUploaderr />

                        {rawData && (
                            <div className="text-xs text-white-600 mt-1" style={{ color: "#fff" }}>
                                Տողերի քանակ {rawData.split('\n').filter(line => line.trim()).length - 1}
                                (առանց սյունակների վերնագրերի)
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <Button
                            onClick={submitManagerData}
                            variant="manager"
                            size="md"
                            className={`w-full transition-all duration-300 ${
                                isCompleted 
                                    ? 'bg-green-500 text-white cursor-default' 
                                    : ''
                            }`}
                            disabled={
                                isCompleted || 
                                !projectName 
                            }
                        >
                            {isCompleted ? '✅ Ուղարկված' : '📤 Ուղարկել վերլուծաբանին'}
                        </Button>

                        <div className="mt-3 text-xs text-white-500" style={{ color: "#fff" }}>
                            💡 <strong>Հուշումներ</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Առաջին տողը պետք է պարունակի սյունակների անվանումները (Ամսաթիվ, Արժեք, Խումբ, Որոշումների ընդունման փուլ)</li>
                                <li>Յուրաքանչյուր տողի արժեք պետք է համապատասխանի իր սյունակի տեսակին</li>
                                <li>Տվյալներ մուտքագրելուց հնարավորություն կա որոշ դաշտեր թողնել դատարկ</li>
                                <li>Որոշումների ընդունման փուլը կարող է լինել՝ Բարձր, Միջին, Ցածր</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </PhaseCard>

            {/* Criteria Selection Modal */}
            {showModal && !isCompleted && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {getDataTypeLabel(currentModalType)} ցուցանիշները
                                </h3>
                                <p className="text-white/80 text-sm mt-1">
                                    Ընտրեք անհրաժեշտ ցուցանիշներ վերլուծության համար
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {dataTypeCriteria[currentModalType]?.map((criteria, index) => (
                                    <label
                                        key={criteria.id}
                                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedCriteria[currentModalType]?.[criteria.id]
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                            }`}
                                    >
                                        <div className="flex items-center w-full">
                                            <input
                                                type="checkbox"
                                                checked={selectedCriteria[currentModalType]?.[criteria.id] || false}
                                                onChange={(e) => handleCriteriaChange(criteria.id, e.target.checked)}
                                                className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-4"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-900">
                                                        {index + 1}. {criteria.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 p-6 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Ընտրված չափանիշներ: {Object.values(selectedCriteria[currentModalType] || {}).filter(Boolean).length}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Փակել
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white rounded-lg hover:from-[#0f7fb5] hover:to-[#0369a1] transition-all duration-300"
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
};

export default ManagerPhase;