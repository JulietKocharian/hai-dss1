import React from 'react';
import { useData } from '../../context/DataContext';
import { PhaseCard } from '../UI/Card';
import Button from '../UI/Button';
import { parseCSV } from '../../utils/csvUtils';
const ManagerPhase = () => {
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
    const submitManagerData = () => {
        if (!projectName.trim()) {
            alert('Խնդրում ենք մուտքագրել նախագծի անվանումը');
            return;
        }
        if (!dataType) {
            alert('Խնդրում ենք ընտրել տվյալների տեսակը');
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
            setAnalystActive(true);

            console.log('Մենեջերի տվյալները հաջողությամբ ուղարկվել են:', {
                projectName,
                dataType,
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
    const csvExample = `Ամսաթիվ,Արժեք,Խումբ,Տարիք
2024-01-01,1500,A,25
2024-01-02,1750,B,30
2024-01-03,1200,A,22`;

    return (
        <PhaseCard
            title="Մենեջերի փուլ"
            icon="👨‍💼"
            phase="manager"
            className="h-fit"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-white-700 mb-2" style={{color: "#fff"}}>
                        Նախագծի անվանումը <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Մուտքագրեք նախագծի անվանումը"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        maxLength={100}
                    />
                    <div className="text-xs text-white-500 mt-1" style={{color: "#fff"}}>
                        {projectName.length}/100 նիշ
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-white-700 mb-2" style={{color: "#fff"}}>
                        Տվյալների տեսակը <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={dataType}
                        onChange={(e) => setDataType(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    >
                        <option value="">Ընտրեք տվյալների տեսակը</option>
                        <option value="demographic">📊 Դեմոգրաֆիական</option>
                        <option value="healthcare">🏥 Առողջապահական</option>
                        <option value="quality_of_life">🌟 Կյանքի որակ</option>
                        <option value="educational">🎓 Կրթական</option>
                    </select>
                    {dataType && (
                        <div className="text-xs text-blue-600 mt-1">
                            Ընտրված տեսակ։ {getDataTypeLabel(dataType)}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-white-700 mb-2" style={{color: "#fff"}}>
                        Տվյալների աղբյուրը
                    </label>
                    <textarea
                        value={dataSource}
                        onChange={(e) => setDataSource(e.target.value)}
                        rows="3"
                        placeholder="Նկարագրեք տվյալների աղբյուրը և բնութագրությունը (ոչ պարտադիր)"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                        maxLength={500}
                    />
                    <div className="text-xs text-white-500 mt-1" style={{color: "#fff"}}>
                        {dataSource.length}/500 նիշ
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-white-700 mb-2" style={{color: "#fff"}}>
                        Չափանիշներ (CSV ձևաչափով) <span className="text-red-500">*</span>
                    </label>

                    <details className="mb-2">
                        <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                            📝 Տվյալների օրինակ CSV ձևաչափով
                        </summary>
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                            <pre>{csvExample}</pre>
                        </div>
                    </details>

                    <textarea
                        value={rawData}
                        onChange={(e) => setRawData(e.target.value)}
                        rows="8"
                        placeholder={`Մուտքագրեք տվյալները CSV ձևաչափով\n\n${csvExample}`}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 font-mono text-sm resize-none"
                    />

                    {rawData && (
                        <div className="text-xs text-white-600 mt-1" style={{color: "#fff"}}>
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
                        className="w-full"
                        disabled={!projectName || !dataType || !rawData}
                    >
                        📤 Ուղարկել վերլուծաբանին
                    </Button>

                    <div className="mt-3 text-xs text-white-500" style={{color: "#fff"}}>
                        💡 <strong>Հուշումներ</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Առաջին տողը պետք է պարունակի սյունակների անվանումները (Ամսաթիվ, Արժեք, Խումբ, Տարիք)</li>
                            <li>Յուրաքանչյուր տողի արժեք պետք է համապատասխանի իր սյունակի տեսակին</li>
                            <li>Տվյալներ մուտքագրելուց հնարավորություն կա որոշ դաշտեր թողնել դատարկ</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PhaseCard>
    );
};

export default ManagerPhase;