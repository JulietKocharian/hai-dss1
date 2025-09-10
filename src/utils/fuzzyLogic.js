// src/utils/fuzzyLogic.js
// Անորոշ տրամաբանության ալգորիթմներ տվյալների վստահության գնահատման համար

import { detectDataType } from './dataHelpers';

// Social Spheres and Criteria Configuration
const dataTypeCriteria = {
    'demographic': [
        { id: 'births', label: 'Ծնվածների քանակ' },
        { id: 'immigration', label: 'Մեռելածինների քանակ' },
        { id: 'deaths', label: 'Մահացածների քանակ' },
        { id: 'infant_deaths', label: 'Մինչև 1 տարեկան մահացածների քանակ' },
        { id: 'natural_increase', label: 'Բնական հավելաճ' },
        { id: 'marriages', label: 'Ամուսնությունների քանակ' },
        { id: 'divorces', label: 'Ամուսնալուծությունների քանակ' },
    ],
    'healthcare': [
        { id: 'neonatal_diseases', label: 'Մունիցիպալ ամբուլատոր հիմնարկների թիվ' },
        { id: 'doctors_per_10k', label: 'Բժիշկներ՝ 10 հազ. մարդու հաշվով' },
        { id: 'nurses_per_10k', label: 'Մահճակալներ՝ 10 հազ. մարդու հաշվով' },
        { id: 'healthcare_total_expenses', label: 'Առողջապահության ընդհանուր ծախսեր' },
        { id: 'hospital_investments', label: 'Հիմնական միջոցների ներդրումներ' },
        { id: 'impact_expenses', label: 'Աշխատավարձային ծախսեր' },
        { id: 'covid19_mortality', label: 'COVID-19 բուժօգնության որակ' },
    ],
    'quality_of_life': [
        { id: 'min_monthly_income', label: 'Մեկ շնչի միջին ամսական եկամուտ' },
        { id: 'unemployment_rate', label: 'Աղքատության մակարդակ (%)' },
        { id: 'poverty_rate', label: 'Աշխատանքազուրկության մակարդակ (%)' },
        { id: 'education_years', label: 'Կրթության պարտադիր տևողություն (տարի)' },
        { id: 'life_expectancy', label: 'Կյանքի տևողություն (տարի)' },
        { id: 'healthcare_spending_per_capita', label: 'Առողջապահության ծախսեր մեկ շնչի հաշվով (USD)' },
        { id: 'internet_penetration', label: 'Ինտերնետ հասանելիություն (%)' },
    ],
    'educational': [
        { id: 'general_education_institutions', label: 'Նախադպրոցական հաստատություններ' },
        { id: 'higher_education_students', label: 'Հանրակրթական դպրոցների աշակերտներ' },
        { id: 'middle_vocational_institutions', label: 'Միջին մասնագիտական ուսանողներ' },
        { id: 'technical_institutions', label: 'Բարձրագույն ուսումնական հաստատությունների ուսանողներ' },
        { id: 'vocational_students', label: 'Ուսուցիչների ընդհանուր թիվ' },
        { id: 'literacy_statistics', label: 'Մեկ ուսուցչի բաժին ընկնող աշակերտներ' },
        { id: 'education_funding_gdp', label: 'Կրթության պետական ծախսեր ՀՆԱ-ում' },
    ]
};


const applyDemographicFuzzyRules = (fuzzyEngine, data, sphereScores) => {
    const demographicData = extractDemographicMetrics(data);

    const fuzzyConfig = {
        crisp_input: [
            demographicData.birth_rate || 50,
            demographicData.death_rate || 50,
            demographicData.natural_increase || 50,
            demographicData.marriage_rate || 50
        ],

        variables_input: [
            {
                name: "Ծնելիություն",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 25, 40],    // ցածր
                    [25, 40, 65, 80],  // միջին
                    [65, 80, 100, 100] // բարձր
                ]
            },
            {
                name: "Մահացություն",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 20, 35],    // ցածր (լավ)
                    [20, 35, 60, 75],  // միջին
                    [75, 85, 100, 100] // բարձր (վատ)
                ]
            },
            {
                name: "Բնական_Աճ",
                setsName: ["բացասական", "միջին", "դրական"],
                sets: [
                    [0, 0, 30, 45],    // բացասական
                    [30, 45, 65, 80],  // միջին
                    [65, 80, 100, 100] // դրական
                ]
            },
            {
                name: "Ամուսնություն",
                setsName: ["ցածր", "նորմալ", "բարձր"],
                sets: [
                    [0, 0, 25, 40],    // ցածր
                    [25, 40, 70, 85],  // նորմալ
                    [70, 85, 100, 100] // բարձր
                ]
            }
        ],

        variable_output: {
            name: "Դեմոգրաֆիական_Կայունություն",
            setsName: ["կրիտիկական", "անկայուն", "միջին", "կայուն", "գերազանց"],
            sets: [
                [0, 0, 15, 25],     // կրիտիկական
                [15, 25, 35, 50],   // անկայուն
                [35, 50, 65, 75],   // միջին
                [65, 75, 85, 95],   // կայուն
                [85, 95, 100, 100]  // գերազանց
            ]
        },

        // Դեմոգրաֆիական կանոններ
        inferences: [
            // Կանոն 1: IF Ծնելիություն=Բարձր AND Մահացություն=Ցածր THEN Կայունություն=Կայուն
            [2, 0, 1, 1, 3],

            // Կանոն 2: IF Բնական_Աճ=Դրական AND Ամուսնություն=Բարձր THEN Կայունություն=Կայուն
            [1, 1, 2, 2, 3],

            // Կանոն 3: IF Ծնելիություն=Ցածր AND Մահացություն=Բարձր THEN Կայունություն=Կրիտիկական
            [0, 2, 0, 1, 0],

            // Կանոն 4: IF Բնական_Աճ=Բացասական AND Ամուսնություն=Ցածր THEN Կայունություն=Անկայուն
            [1, 1, 0, 0, 1],

            // Կանոն 5: IF Ծնելիություն=Միջին AND Մահացություն=Միջին THEN Կայունություն=Միջին
            [1, 1, 1, 1, 2],

            // Կանոն 6: IF Ամուսնություն=Նորմալ AND Բնական_Աճ=Միջին THEN Կայունություն=Միջին
            [1, 1, 1, 1, 2],

            // Կանոն 7: IF Ծնելիություն=Բարձր AND Ամուսնություն=Բարձր THEN Կայունություն=Գերազանց
            [2, 1, 1, 2, 4],

            // Կանոն 8: IF Մահացություն=Ցածր AND Բնական_Աճ=Դրական THEN Կայունություն=Կայուն
            [1, 0, 2, 1, 3],

            // Կանոն 9: IF Ծնելիություն=Ցածր AND Բնական_Աճ=Բացասական THEN Կայունություն=Կրիտիկական
            [0, 1, 0, 1, 0],

            // Կանոն 10: IF Մահացություն=Բարձր AND Ամուսնություն=Ցածր THEN Կայունություն=Անկայուն
            [1, 2, 1, 0, 1]
        ]
    };

    const result = fuzzyEngine.getResult(fuzzyConfig);

    return {
        index: result,
        interpretation: interpretDemographicResult(result),
        sphereScores: { demographic: result },
        demographicMetrics: demographicData,
        rulesApplied: "Դեմոգրաֆիական ոլորտի 10 կանոն"
    };
};

/**
 * Կրթական ոլորտի կանոններ
 */
const applyEducationalFuzzyRules = (fuzzyEngine, data, sphereScores) => {
    const educationalData = extractEducationalMetrics(data);

    const fuzzyConfig = {
        crisp_input: [
            educationalData.enrollment_rate || 50,
            educationalData.teacher_ratio || 50,
            educationalData.education_funding || 50,
            educationalData.literacy_rate || 50
        ],

        variables_input: [
            {
                name: "Գրառման_Մակարդակ",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 30, 45],    // ցածր
                    [30, 45, 70, 85],  // միջին
                    [70, 85, 100, 100] // բարձր
                ]
            },
            {
                name: "Ուսուցիչ_Աշակերտ_Հարաբերակցություն",
                setsName: ["անբավարար", "օպտիմալ", "գերազանց"],
                sets: [
                    [0, 0, 25, 40],    // անբավարար
                    [25, 40, 65, 80],  // օպտիմալ
                    [65, 80, 100, 100] // գերազանց
                ]
            },
            {
                name: "Կրթական_Ֆինանսավորում",
                setsName: ["ցածր", "բավարար", "բարձր"],
                sets: [
                    [0, 0, 25, 40],    // ցածր
                    [25, 40, 70, 85],  // բավարար
                    [70, 85, 100, 100] // բարձր
                ]
            },
            {
                name: "Գրագիտության_Մակարդակ",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 40, 55],    // ցածր
                    [40, 55, 80, 90],  // միջին
                    [80, 90, 100, 100] // բարձր
                ]
            }
        ],

        variable_output: {
            name: "Կրթական_Արդյունավետություն",
            setsName: ["ցածր", "բավարար", "միջին", "լավ", "գերազանց"],
            sets: [
                [0, 0, 20, 30],     // ցածր
                [20, 30, 40, 55],   // բավարար
                [40, 55, 70, 80],   // միջին
                [70, 80, 90, 95],   // լավ
                [90, 95, 100, 100]  // գերազանց
            ]
        },

        // Կրթական կանոններ
        inferences: [
            // Կանոն 1: IF Գրառում=Բարձր AND Ուսուցիչ_Հարաբերակցություն=Գերազանց THEN Արդյունավետություն=Գերազանց
            [2, 2, 1, 1, 4],

            // Կանոն 2: IF Ֆինանսավորում=Բարձր AND Գրագիտություն=Բարձր THEN Արդյունավետություն=Լավ
            [1, 1, 2, 2, 3],

            // Կանոն 3: IF Գրառում=Ցածր AND Ֆինանսավորում=Ցածր THEN Արդյունավետություն=Ցածր
            [0, 1, 0, 1, 0],

            // Կանոն 4: IF Ուսուցիչ_Հարաբերակցություն=Օպտիմալ AND Գրագիտություն=Բարձր THEN Արդյունավետություն=Լավ
            [1, 1, 1, 2, 3],

            // Կանոն 5: IF Գրառում=Միջին AND Ֆինանսավորում=Բավարար THEN Արդյունավետություն=Միջին
            [1, 1, 1, 1, 2],

            // Կանոն 6: IF Ուսուցիչ_Հարաբերակցություն=Անբավարար AND Գրագիտություն=Ցածր THEN Արդյունավետություն=Ցածր
            [1, 0, 1, 0, 0],

            // Կանոն 7: IF Ֆինանսավորում=Բարձր AND Ուսուցիչ_Հարաբերակցություն=Գերազանց THEN Արդյունավետություն=Գերազանց
            [1, 2, 2, 1, 4],

            // Կանոն 8: IF Գրառում=Բարձր AND Գրագիտություն=Միջին THEN Արդյունավետություն=Լավ
            [2, 1, 1, 1, 3],

            // Կանոն 9: IF Ֆինանսավորում=Ցածր AND Ուսուցիչ_Հարաբերակցություն=Անբավարար THEN Արդյունավետություն=Բավարար
            [1, 0, 0, 1, 1],

            // Կանոն 10: IF Գրագիտություն=Բարձր AND Գրառում=Բարձր THEN Արդյունավետություն=Գերազանց
            [2, 1, 1, 2, 4]
        ]
    };

    const result = fuzzyEngine.getResult(fuzzyConfig);

    return {
        index: result,
        interpretation: interpretEducationalResult(result),
        sphereScores: { educational: result },
        educationalMetrics: educationalData,
        rulesApplied: "Կրթական ոլորտի 10 կանոն"
    };
};

/**
 * Կյանքի որակի ոլորտի կանոններ
 */
const applyQualityOfLifeFuzzyRules = (fuzzyEngine, data, sphereScores) => {
    const qualityData = extractQualityOfLifeMetrics(data);

    const fuzzyConfig = {
        crisp_input: [
            qualityData.income_level || 50,
            qualityData.unemployment_rate || 50,
            qualityData.life_expectancy || 50,
            qualityData.internet_access || 50
        ],

        variables_input: [
            {
                name: "Եկամտի_Մակարդակ",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 25, 40],    // ցածր
                    [25, 40, 65, 80],  // միջին
                    [65, 80, 100, 100] // բարձր
                ]
            },
            {
                name: "Գործազրկություն",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 20, 35],    // ցածր (լավ)
                    [20, 35, 60, 75],  // միջին
                    [60, 75, 100, 100] // բարձր (վատ)
                ]
            },
            {
                name: "Կյանքի_Տևողություն",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 30, 45],    // ցածր
                    [30, 45, 70, 85],  // միջին
                    [70, 85, 100, 100] // բարձր
                ]
            },
            {
                name: "Ինտերնետ_Հասանելիություն",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 30, 50],    // ցածր
                    [30, 50, 70, 85],  // միջին
                    [70, 85, 100, 100] // բարձր
                ]
            }
        ],

        variable_output: {
            name: "Կյանքի_Որակի_Ինդեքս",
            setsName: ["ցածր", "բավարար", "միջին", "լավ", "գերազանց"],
            sets: [
                [0, 0, 20, 30],     // ցածր
                [20, 30, 40, 55],   // բավարար
                [40, 55, 70, 80],   // միջին
                [70, 80, 90, 95],   // լավ
                [90, 95, 100, 100]  // գերազանց
            ]
        },

        // Կյանքի որակի կանոններ
        inferences: [
            // Կանոն 1: IF Եկամուտ=Բարձր AND Գործազրկություն=Ցածր THEN Որակ=Լավ
            [2, 0, 1, 1, 3],

            // Կանոն 2: IF Կյանքի_Տևողություն=Բարձր AND Ինտերնետ=Բարձր THEN Որակ=Լավ
            [1, 1, 2, 2, 3],

            // Կանոն 3: IF Եկամուտ=Ցածր AND Գործազրկություն=Բարձր THEN Որակ=Ցածր
            [0, 2, 1, 1, 0],

            // Կանոն 4: IF Կյանքի_Տևողություն=Ցածր AND Ինտերնետ=Ցածր THEN Որակ=Բավարար
            [1, 1, 0, 0, 1],

            // Կանոն 5: IF Եկամուտ=Միջին AND Գործազրկություն=Միջին THEN Որակ=Միջին
            [1, 1, 1, 1, 2],

            // Կանոն 6: IF Կյանքի_Տևողություն=Բարձր AND Գործազրկություն=Ցածր THEN Որակ=Լավ
            [1, 0, 2, 1, 3],

            // Կանոն 7: IF Եկամուտ=Բարձր AND Ինտերնետ=Բարձր THEN Որակ=Գերազանց
            [2, 1, 1, 2, 4],

            // Կանոն 8: IF Գործազրկություն=Ցածր AND Ինտերնետ=Բարձր THEN Որակ=Լավ
            [1, 0, 1, 2, 3],

            // Կանոն 9: IF Եկամուտ=Ցածր AND Կյանքի_Տևողություն=Ցածր THEN Որակ=Ցածր
            [0, 1, 0, 1, 0],

            // Կանոն 10: IF Գործազրկություն=Բարձր AND Կյանքի_Տևողություն=Ցածր THEN Որակ=Բավարար
            [1, 2, 0, 1, 1]
        ]
    };

    const result = fuzzyEngine.getResult(fuzzyConfig);

    return {
        index: result,
        interpretation: interpretQualityOfLifeResult(result),
        sphereScores: { quality_of_life: result },
        qualityOfLifeMetrics: qualityData,
        rulesApplied: "Կյանքի որակի ոլորտի 10 կանոն"
    };
};

// Մետրիկների հավաքման ֆունկցիաներ

/**
 * Դեմոգրաֆիական մետրիկների استخراج
 */
const extractDemographicMetrics = (data) => {
    const metrics = {
        birth_rate: 50,
        death_rate: 50,
        natural_increase: 50,
        marriage_rate: 50
    };

    data.forEach(row => {
        Object.keys(row).forEach(key => {
            const keyLower = key.toLowerCase();
            const value = parseFloat(row[key]);

            if (!isNaN(value)) {
                if (keyLower.includes('birth') || keyLower.includes('ծնվ')) {
                    metrics.birth_rate = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('death') || keyLower.includes('մահ')) {
                    metrics.death_rate = Math.min(100, Math.max(0, 100 - value)); // Շրջել
                } else if (keyLower.includes('increase') || keyLower.includes('աճ')) {
                    metrics.natural_increase = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('marriage') || keyLower.includes('ամուսն')) {
                    metrics.marriage_rate = Math.min(100, Math.max(0, value));
                }
            }
        });
    });

    return metrics;
};

/**
 * Կրթական մետրիկների استخراج
 */
const extractEducationalMetrics = (data) => {
    const metrics = {
        enrollment_rate: 50,
        teacher_ratio: 50,
        education_funding: 50,
        literacy_rate: 50
    };

    data.forEach(row => {
        Object.keys(row).forEach(key => {
            const keyLower = key.toLowerCase();
            const value = parseFloat(row[key]);

            if (!isNaN(value)) {
                if (keyLower.includes('student') || keyLower.includes('ուսանող')) {
                    metrics.enrollment_rate = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('teacher') || keyLower.includes('ուսուցիչ')) {
                    metrics.teacher_ratio = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('funding') || keyLower.includes('ծախս')) {
                    metrics.education_funding = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('literacy') || keyLower.includes('գրագիտ')) {
                    metrics.literacy_rate = Math.min(100, Math.max(0, value));
                }
            }
        });
    });

    return metrics;
};

/**
 * Կյանքի որակի մետրիկների استخراج
 */
const extractQualityOfLifeMetrics = (data) => {
    const metrics = {
        income_level: 50,
        unemployment_rate: 50,
        life_expectancy: 50,
        internet_access: 50
    };

    data.forEach(row => {
        Object.keys(row).forEach(key => {
            const keyLower = key.toLowerCase();
            const value = parseFloat(row[key]);

            if (!isNaN(value)) {
                if (keyLower.includes('income') || keyLower.includes('եկամուտ')) {
                    metrics.income_level = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('unemployment') || keyLower.includes('գործազրկ')) {
                    metrics.unemployment_rate = Math.min(100, Math.max(0, 100 - value)); // Շրջել
                } else if (keyLower.includes('life_expectancy') || keyLower.includes('կյանքի_տև')) {
                    metrics.life_expectancy = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('internet') || keyLower.includes('ինտերնետ')) {
                    metrics.internet_access = Math.min(100, Math.max(0, value));
                }
            }
        });
    });

    return metrics;
};

// Մեկնաբանման ֆունկցիաներ

/**
 * Դեմոգրաֆիական արդյունքի մեկնաբանություն
 */
const interpretDemographicResult = (score) => {
    if (score <= 25) return {
        level: "critical",
        label: "Դեմոգրաֆիական ճգնաժամ",
        description: "Դեմոգրաֆիական իրավիճակը կրիտիկական է։ Անհրաժեշտ են ակտիվ միջամտություններ:"
    };
    else if (score <= 50) return {
        level: "unstable",
        label: "Անկայուն",
        description: "Դեմոգրաֆիական իրավիճակը անկայուն է։ Կարգավորման կարիք ունի:"
    };
    else if (score <= 75) return {
        level: "average",
        label: "Միջին",
        description: "Դեմոգրաֆիական իրավիճակը միջին մակարդակում է:"
    };
    else if (score <= 95) return {
        level: "stable",
        label: "Կայուն",
        description: "Դեմոգրաֆիական իրավիճակը կայուն է:"
    };
    else return {
        level: "excellent",
        label: "Գերազանց",
        description: "Դեմոգրաֆիական իրավիճակը գերազանց է:"
    };
};

/**
 * Կրթական արդյունքի մեկնաբանություն
 */
const interpretEducationalResult = (score) => {
    if (score <= 30) return {
        level: "low",
        label: "Ցածր մակարդակ",
        description: "Կրթական համակարգը ցածր մակարդակում է։ Լուրջ բարեփոխումներ են պետք:"
    };
    else if (score <= 55) return {
        level: "adequate",
        label: "Բավարար",
        description: "Կրթական համակարգը բավարար մակարդակում է, բայց բարելավման կարիք ունի:"
    };
    else if (score <= 80) return {
        level: "average",
        label: "Միջին",
        description: "Կրթական համակարգը միջին մակարդակում է:"
    };
    else if (score <= 95) return {
        level: "good",
        label: "Լավ",
        description: "Կրթական համակարգը լավ մակարդակում է:"
    };
    else return {
        level: "excellent",
        label: "Գերազանց",
        description: "Կրթական համակարգը գերազանց մակարդակում է:"
    };
};

/**
 * Կյանքի որակի արդյունքի մեկնաբանություն
 */
const interpretQualityOfLifeResult = (score) => {
    if (score <= 30) return {
        level: "low",
        label: "Ցածր որակ",
        description: "Կյանքի որակը ցածր մակարդակում է։ Բարելավման անհրաժեշտություն:"
    };
    else if (score <= 55) return {
        level: "adequate",
        label: "Բավարար",
        description: "Կյանքի որակը բավարար մակարդակում է:"
    };
    else if (score <= 80) return {
        level: "average",
        label: "Միջին",
        description: "Կյանքի որակը միջին մակարդակում է:"
    };
    else if (score <= 95) return {
        level: "good",
        label: "Լավ",
        description: "Կյանքի որակը լավ մակարդակում է:"
    };
    else return {
        level: "excellent",
        label: "Գերազանց",
        description: "Կյանքի որակը գերազանց մակարդակում է:"
    };
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

// Integrated Fuzzy Logic Engine
class IntegratedFuzzyLogic {
    constructor() { }

    /**
     * Трапециевидная функция принадлежности
     */
    trapezoidalMembership(x, params) {
        const [a, b, c, d] = params;
        if (x <= a || x >= d) return 0;
        if (x >= b && x <= c) return 1;
        if (x > a && x < b) return (x - a) / (b - a);
        if (x > c && x < d) return (d - x) / (d - c);
        return 0;
    }

    /**
     * Главный метод для получения результата
     */
    getResult(config) {
        try {
            // Фаззификация входных значений
            const fuzzifiedInputs = this.fuzzifyInputs(config);

            // Применение правил вывода
            const ruleResults = this.applyInferenceRules(config, fuzzifiedInputs);

            // Дефаззификация результата
            const result = this.defuzzify(config.variable_output, ruleResults);

            return result;
        } catch (error) {
            console.error('Fuzzy logic error:', error);
            return 50; // Возвращаем средний результат при ошибке
        }
    }

    fuzzifyInputs(config) {
        const fuzzifiedInputs = [];
        config.variables_input.forEach((variable, varIndex) => {
            const crispValue = config.crisp_input[varIndex];
            const membershipValues = [];

            variable.sets.forEach(set => {
                const membership = this.trapezoidalMembership(crispValue, set);
                membershipValues.push(membership);
            });

            fuzzifiedInputs.push(membershipValues);
        });
        return fuzzifiedInputs;
    }

    applyInferenceRules(config, fuzzifiedInputs) {
        const outputSets = config.variable_output.sets;
        const ruleResults = new Array(outputSets.length).fill(0);

        config.inferences.forEach((rule, ruleIndex) => {
            rule.forEach((outputSetIndex, inputVarIndex) => {
                if (inputVarIndex < fuzzifiedInputs.length &&
                    ruleIndex < fuzzifiedInputs[inputVarIndex].length) {

                    const membershipValue = fuzzifiedInputs[inputVarIndex][ruleIndex];
                    ruleResults[outputSetIndex] = Math.max(
                        ruleResults[outputSetIndex],
                        membershipValue
                    );
                }
            });
        });

        return ruleResults;
    }

    defuzzify(outputVariable, ruleResults) {
        let numerator = 0;
        let denominator = 0;

        outputVariable.sets.forEach((set, setIndex) => {
            const membership = ruleResults[setIndex];
            const centroid = this.calculateCentroid(set);

            numerator += membership * centroid;
            denominator += membership;
        });

        return denominator > 0 ? numerator / denominator : 50;
    }

    calculateCentroid(set) {
        const [a, b, c, d] = set;
        return (a + b + c + d) / 4;
    }
}

/**
 * Անորոշ տրամաբանության կիրառում տվյալների վրա
 * @param {Array} data - Վերլուծելիք տվյալներ
 * @param {string} dataType - Տվյալների տեսակ
 * @returns {Object} Անորոշության վերլուծության արդյունք
 */
// export const applyFuzzyLogic = (data, dataType) => {
//     if (!data || data.length === 0) {
//         return {
//             low: 0,
//             medium: 0,
//             high: 0,
//             analysis: 'Տվյալներ չեն գտնվել',
//             confidenceDistribution: [],
//             recommendations: []
//         };
//     }

//     try {
//         // Յուրաքանչյուր տողի վստահության գնահատում
//         const rowConfidences = data.map((row, index) =>
//             calculateRowConfidence(row, index, data)
//         );

//         // Վստահության մակարդակների բաշխում
//         const distribution = categorizeConfidences(rowConfidences);

//         // Խելացի վերլուծություն տվյալների տեսակի հիման վրա
//         const analysis = generateFuzzyAnalysis(distribution, dataType, rowConfidences);

//         // Առաջարկություններ
//         const recommendations = generateFuzzyRecommendations(distribution, dataType);

//         // Սոցիալական զարգացման գնահատում (բարձր վստահության դեպքում)
//         const socialDevelopment = applySocialDevelopmentFuzzy(data, dataType, distribution);

//         return {
//             low: distribution.low,
//             medium: distribution.medium,
//             high: distribution.high,
//             analysis: analysis.summary,
//             confidenceDistribution: rowConfidences,
//             patterns: analysis.patterns,
//             recommendations,
//             uncertaintyFactors: analysis.uncertaintyFactors,
//             socialDevelopment: socialDevelopment
//         };

//     } catch (error) {
//         console.error('Անորոշ տրամաբանության սխալ:', error);
//         return {
//             low: 33,
//             medium: 34,
//             high: 33,
//             analysis: 'Վերլուծությունը ցանցիշ կատարվեց սխալի պատճառով',
//             confidenceDistribution: [],
//             recommendations: ['Ստուգեք տվյալների ֆորմատը']
//         };
//     }
// };
export const applyFuzzyLogic = (data, dataType, syntheticData = []) => {
    // Если нет данных вообще
    if ((!data || data.length === 0) && (!syntheticData || syntheticData.length === 0)) {
        return {
            low: 0,
            medium: 0,
            high: 0,
            averageConfidence: 0,
            analysis: 'Տվյալներ չեն գտնվել',
            confidenceDistribution: [],
            recommendations: [],
            patterns: [],
            uncertaintyFactors: [],
            socialDevelopment: null
        };
    }

    try {
        // Рассчитываем доверие для каждой строки
        const realConfidences = (data || []).map((row, index) =>
            calculateRowConfidence(row, index, data, false) // реальные данные
        );

        const syntheticConfidences = (syntheticData || []).map((row, index) =>
            calculateRowConfidence(row, index, data, true) // синтетические данные
        );

        // Объединяем
        const rowConfidences = [...realConfidences, ...syntheticConfidences];

        // Средняя уверенность (учитываем все строки)
        const averageConfidence = rowConfidences.length
            ? rowConfidences.reduce((sum, r) => sum + r.confidence, 0) / rowConfidences.length
            : 0;

        // Категоризация по количеству строк
        const distribution = categorizeConfidences(rowConfidences);

        // Анализ
        const analysis = generateFuzzyAnalysis(distribution, dataType, rowConfidences);

        // Рекомендации
        const recommendations = generateFuzzyRecommendations(distribution, dataType);

        // Социальное развитие
        const socialDevelopment = rowConfidences.length > 0
            ? applySocialDevelopmentFuzzy([...data, ...syntheticData], dataType, distribution)
            : null;

        return {
            low: distribution.low,       // процент строк с низкой уверенностью
            medium: distribution.medium, // процент строк с средней уверенностью
            high: distribution.high,     // процент строк с высокой уверенностью
            averageConfidence: Math.round(averageConfidence), // для прогресс-бара и цвета
            analysis: analysis.summary,
            confidenceDistribution: rowConfidences,
            patterns: analysis.patterns,
            recommendations,
            uncertaintyFactors: analysis.uncertaintyFactors,
            socialDevelopment
        };

    } catch (error) {
        console.error('Անորոշ տրամաբանության սխալ:', error);
        return {
            low: 0,
            medium: 0,
            high: 0,
            averageConfidence: 0,
            analysis: 'Վերլուծությունը կատարվեց սխալի պատճառով',
            confidenceDistribution: [],
            recommendations: ['Ստուգեք տվյալների ֆորմատը'],
            patterns: [],
            uncertaintyFactors: [],
            socialDevelopment: null
        };
    }
};





/**
 * Սոցիալական զարգացման գնահատում ձեր կանոններով
 */
const applySocialDevelopmentFuzzy = (data, dataType, distribution) => {
    // Միայն բարձր վստահության դեպքում կիրառել
    if (distribution.high < 40) {
        return {
            index: null,
            interpretation: {
                level: "insufficient_data",
                label: "Անբավարար տվյալներ",
                description: "Տվյալների վստահությունը բավարար չէ սոցիալական զարգացման գնահատման համար"
            },
            sphereScores: null
        };
    }

    try {
        const fuzzyEngine = new IntegratedFuzzyLogic();

        // Հաշվել ոլորտային միավորները
        const sphereScores = calculateSphereScores(data, dataType);

        // Ոլորտի հատուկ կանոններ
        switch (dataType) {
            case 'healthcare':
                return applyHealthcareFuzzyRules(fuzzyEngine, data, sphereScores);
            case 'demographic':
                return applyDemographicFuzzyRules(fuzzyEngine, data, sphereScores);
            case 'quality_of_life':
                return applyQualityOfLifeFuzzyRules(fuzzyEngine, data, sphereScores);
            case 'educational':
                return applyEducationalFuzzyRules(fuzzyEngine, data, sphereScores);
        }

        // Ընդհանուր սոցիալական զարգացման գնահատում
        const fuzzyConfig = {
            crisp_input: [
                sphereScores.demographic,
                sphereScores.healthcare,
                sphereScores.quality_of_life,
                sphereScores.educational
            ],

            variables_input: [
                {
                    name: "demographic_development",
                    setsName: ["ցածր", "միջին", "բարձր"],
                    sets: [
                        [0, 0, 25, 40],    // ցածր
                        [25, 40, 60, 75],  // միջին
                        [60, 75, 100, 100] // բարձր
                    ]
                },
                {
                    name: "healthcare_development",
                    setsName: ["ցածր", "միջին", "բարձր"],
                    sets: [
                        [0, 0, 30, 45],    // ցածր
                        [30, 45, 65, 80],  // միջին
                        [65, 80, 100, 100] // բարձր
                    ]
                },
                {
                    name: "quality_of_life_level",
                    setsName: ["ցածր", "միջին", "բարձր"],
                    sets: [
                        [0, 0, 35, 50],    // ցածր
                        [35, 50, 70, 85],  // միջին
                        [70, 85, 100, 100] // բարձր
                    ]
                },
                {
                    name: "educational_level",
                    setsName: ["ցածր", "միջին", "բարձր"],
                    sets: [
                        [0, 0, 20, 35],    // ցածր
                        [20, 35, 65, 80],  // միջին
                        [65, 80, 100, 100] // բարձր
                    ]
                }
            ],

            variable_output: {
                name: "social_development_index",
                setsName: ["կրիտիկական", "ցածր", "միջին", "լավ", "գերազանց"],
                sets: [
                    [0, 0, 15, 25],     // կրիտիկական
                    [15, 25, 35, 50],   // ցածր
                    [35, 50, 65, 75],   // միջին
                    [65, 75, 85, 95],   // լավ
                    [85, 95, 100, 100]  // գերազանց
                ]
            },

            inferences: [
                [0, 0, 1, 1], // Ցածր ցուցանիշներ → կրիտիկական մինչև ցածր
                [0, 1, 1, 2], // Միջին-ցածր խառնուրդ → կրիտիկական մինչև միջին
                [1, 1, 2, 2], // Միջին ցուցանիշներ → ցածր մինչև միջին
                [1, 2, 2, 3], // Միջին-բարձր խառնուրդ → ցածր մինչև լավ
                [2, 2, 3, 3], // Բարձր ցուցանիշներ → միջին մինչև լավ
                [2, 3, 3, 4], // Բարձր-գերազանց → միջին մինչև գերազանց
                [3, 3, 4, 4], // Գերազանց ցուցանիշներ → լավ մինչև գերազանց
                [3, 4, 4, 4]  // Բոլոր գերազանց → գերազանց
            ]
        };

        // Վստահությամբ կշռված արդյունք
        const rawResult = fuzzyEngine.getResult(fuzzyConfig);
        const confidenceWeight = distribution.high / 100;
        const adjustedResult = rawResult * confidenceWeight + (rawResult * 0.5 * (1 - confidenceWeight));

        return {
            index: adjustedResult,
            interpretation: interpretSocialDevelopment(adjustedResult),
            sphereScores: sphereScores,
            confidenceAdjusted: true
        };

    } catch (error) {
        console.error('Սոցիալական զարգացման գնահատման սխալ:', error);
        return null;
    }
};

/**
 * Առողջապահական համակարգի հատուկ կանոններ (ձեր 10 կանոնները)
 */
const applyHealthcareFuzzyRules = (fuzzyEngine, data, sphereScores) => {
    // Հավաքել առողջապահական տվյալներ
    const healthcareData = extractHealthcareMetrics(data);

    const fuzzyConfig = {
        crisp_input: [
            healthcareData.doctors_per_10k || 50,
            healthcareData.beds_per_10k || 50,
            healthcareData.healthcare_gdp || 50,
            healthcareData.infant_mortality || 50
        ],

        variables_input: [
            {
                name: "Բժիշկներ_10000_Բնակչի",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 20, 35],    // ցածր
                    [20, 35, 60, 75],  // միջին  
                    [60, 75, 100, 100] // բարձր
                ]
            },
            {
                name: "Մահճակալներ_10000_Բնակչի",
                setsName: ["ցածր", "նորմալ", "բարձր"],
                sets: [
                    [0, 0, 25, 40],    // ցածր
                    [25, 40, 65, 80],  // նորմալ
                    [65, 80, 100, 100] // բարձր
                ]
            },
            {
                name: "Առողջապահական_Ծախսեր_ՀՆԱ",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 30, 45],    // ցածր
                    [30, 45, 70, 85],  // միջին
                    [70, 85, 100, 100] // բարձր
                ]
            },
            {
                name: "Մանկական_Մահացություն",
                setsName: ["ցածր", "միջին", "բարձր"],
                sets: [
                    [0, 0, 20, 35],    // ցածր (լավ)
                    [20, 35, 65, 80],  // միջին
                    [65, 80, 100, 100] // բարձր (վատ)
                ]
            }
        ],

        variable_output: {
            name: "Առողջապահական_Համակարգի_Արդյունավետություն",
            setsName: ["ցածր", "բավարար", "միջին", "բարձր", "գերազանց"],
            sets: [
                [0, 0, 20, 30],     // ցածր
                [20, 30, 40, 55],   // բավարար
                [40, 55, 70, 80],   // միջին
                [70, 80, 90, 95],   // բարձր
                [90, 95, 100, 100]  // գերազանց
            ]
        },

        // Ձեր 10 կանոնները
        inferences: [
            // Կանոն 1: IF Բժիշկներ=Բարձր AND Մահճակալներ=Բարձր THEN Արդյունավետություն=Բարձր
            [2, 2, 1, 0, 3], // բարձր բժիշկ, բարձր մահճակալ → բարձր արդյունավետություն

            // Կանոն 2: IF Ծախսեր=Բարձր AND Բժիշկներ=Բարձր THEN Ռեսուրսներ=Բարձր
            [2, 1, 2, 0, 3], // բարձր ծախս, բարձր բժիշկ → բարձր արդյունավետություն

            // Կանոն 3: IF Մանկական_Մահացություն=Ցածր AND Բժիշկներ=Բարձր THEN Մանկական_Առողջություն=Բարձր
            [2, 1, 1, 0, 4], // ցածր մանկական մահացություն, բարձր բժիշկ → գերազանց

            // Կանոն 4: IF Մանկական_Մահացություն=Բարձր AND Ծախսեր=Ցածր THEN Արդյունավետություն=Ցածր
            [0, 1, 0, 2, 0], // ցածր ծախս, բարձր մանկական մահացություն → ցածր արդյունավետություն

            // Կանոն 5: IF Մահճակալներ=Ցածր AND Մանկական_Մահացություն=Բարձր THEN Խնամք=Ցածր
            [1, 0, 1, 2, 0], // ցածր մահճակալ, բարձր մանկական մահացություն → ցածր

            // Կանոն 6: IF Բժիշկներ=Միջին AND Մահճակալներ=Նորմալ THEN Հիմնական_Բուժսպասարկում=Բավարար
            [1, 1, 1, 1, 1], // միջին բժիշկ, նորմալ մահճակալ → բավարար

            // Կանոն 7: IF Ծախսեր=Միջին AND Մանկական_Մահացություն=Միջին THEN Կանխարգելում=Միջին
            [1, 1, 1, 1, 2], // միջին ծախս, միջին մանկական մահացություն → միջին

            // Կանոն 8: IF Բժիշկներ=Ցածր AND Մահճակալներ=Ցածր THEN Անհամապատասխանություն=Բարձր
            [0, 0, 1, 1, 0], // ցածր բժիշկ, ցածր մահճակալ → ցածր արդյունավետություն

            // Կանոն 9: IF Ծախսեր=Բարձր AND Մանկական_Մահացություն=Ցածր THEN Ֆինանսական_Արդյունավետություն=Բարձր
            [1, 1, 2, 0, 3], // բարձր ծախս, ցածր մանկական մահացություն → բարձր

            // Կանոն 10: IF Մահճակալներ=Բարձր AND Մանկական_Մահացություն=Ցածր THEN Հիվանդանոցային_Որակ=Բարձր
            [1, 2, 1, 0, 3]  // բարձր մահճակալ, ցածր մանկական մահացություն → բարձր
        ]
    };

    const result = fuzzyEngine.getResult(fuzzyConfig);

    return {
        index: result,
        interpretation: interpretHealthcareResult(result),
        sphereScores: { healthcare: result },
        healthcareMetrics: healthcareData,
        rulesApplied: "Առողջապահական համակարգի 10 կանոն"
    };
};

/**
 * Առողջապահական մետրիկների استخراج
 */
const extractHealthcareMetrics = (data) => {
    const metrics = {
        doctors_per_10k: 50,
        beds_per_10k: 50,
        healthcare_gdp: 50,
        infant_mortality: 50
    };

    // Փնտրել համապատասխան դաշտերը տվյալներում
    data.forEach(row => {
        Object.keys(row).forEach(key => {
            const keyLower = key.toLowerCase();
            const value = parseFloat(row[key]);

            if (!isNaN(value)) {
                if (keyLower.includes('doctor') || keyLower.includes('բժիշկ')) {
                    metrics.doctors_per_10k = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('bed') || keyLower.includes('մահճակալ')) {
                    metrics.beds_per_10k = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('healthcare') || keyLower.includes('առողջապահ')) {
                    metrics.healthcare_gdp = Math.min(100, Math.max(0, value));
                } else if (keyLower.includes('infant') || keyLower.includes('մանկական')) {
                    // Մանկական մահացությունը շրջել (ցածր = լավ)
                    metrics.infant_mortality = Math.min(100, Math.max(0, 100 - value));
                }
            }
        });
    });

    return metrics;
};

/**
 * Առողջապահական արդյունքի մեկնաբանություն
 */
const interpretHealthcareResult = (score) => {
    if (score <= 30) return {
        level: "critical",
        label: "Կրիտիկական վիճակ",
        description: "Առողջապահական համակարգը կրիտիկական վիճակում է։ Անհետաձգելի բարեփոխումներ են պետք:"
    };
    else if (score <= 55) return {
        level: "adequate",
        label: "Բավարար",
        description: "Առողջապահական համակարգը բավարար մակարդակում է, բայց բարելավման կարիք ունի:"
    };
    else if (score <= 80) return {
        level: "average",
        label: "Միջին",
        description: "Առողջապահական համակարգը միջին մակարդակում է:"
    };
    else if (score <= 95) return {
        level: "good",
        label: "Լավ",
        description: "Առողջապահական համակարգը լավ մակարդակում է:"
    };
    else return {
        level: "excellent",
        label: "Գերազանց",
        description: "Առողջապահական համակարգը գերազանց մակարդակում է:"
    };
};

/**
 * Սոցիալական ոլորտների միավորների հաշվարկ
 */
const calculateSphereScores = (data, dataType) => {
    const scores = {
        demographic: 50,
        healthcare: 50,
        quality_of_life: 50,
        educational: 50
    };

    if (Object.keys(scores).includes(dataType)) {
        const sphereScore = calculateSpecificSphereScore(data, dataType);
        scores[dataType] = sphereScore;
    }

    return scores;
};

const calculateSpecificSphereScore = (data, dataType) => {
    const criteria = dataTypeCriteria[dataType];
    if (!criteria) return 50;

    let totalScore = 0;
    let validCriteria = 0;

    criteria.forEach(criterion => {
        const criterionData = data.filter(row =>
            Object.keys(row).some(key =>
                key.toLowerCase().includes(criterion.id.toLowerCase()) ||
                criterion.id.toLowerCase().includes(key.toLowerCase())
            )
        );

        if (criterionData.length > 0) {
            const criterionScore = calculateCriterionScore(criterionData, criterion.id, dataType);
            totalScore += criterionScore;
            validCriteria++;
        }
    });

    return validCriteria > 0 ? totalScore / validCriteria : 50;
};

const calculateCriterionScore = (criterionData, criterionId, dataType) => {
    const values = criterionData.map(row =>
        Object.values(row).find(val => typeof val === 'number')
    ).filter(val => val !== undefined && val !== null);

    if (values.length === 0) return 50;

    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

    switch (dataType) {
        case 'demographic':
            if (criterionId.includes('deaths') || criterionId.includes('infant_deaths')) {
                return Math.max(0, 100 - Math.min(100, avg));
            }
            return Math.min(100, Math.max(0, avg));
        case 'healthcare':
            if (criterionId.includes('mortality') || criterionId.includes('մահացություն')) {
                return Math.max(0, 100 - Math.min(100, avg));
            }
            return Math.min(100, Math.max(0, avg));
        case 'quality_of_life':
            if (criterionId.includes('unemployment') || criterionId.includes('poverty')) {
                return Math.max(0, 100 - Math.min(100, avg));
            }
            return Math.min(100, Math.max(0, avg));
        case 'educational':
            return Math.min(100, Math.max(0, avg));
        default:
            return Math.min(100, Math.max(0, avg));
    }
};

/**
 * Սոցիալական զարգացման գնահատման մեկնաբանություն
 */
const interpretSocialDevelopment = (score) => {
    if (score <= 25) return {
        level: "critical",
        label: "Կրիտիկական",
        description: "Սոցիալական զարգացումը կրիտիկական մակարդակում է։ Անհրաժեշտ են տարր միջոցառումներ:"
    };
    else if (score <= 50) return {
        level: "below_average",
        label: "Միջինից ցածր",
        description: "Սոցիալական զարգացումը միջին մակարդակից ցածր է։ Բարելավման կարիք կա:"
    };
    else if (score <= 75) return {
        level: "average",
        label: "Միջին",
        description: "Սոցիալական զարգացումը միջին մակարդակում է։"
    };
    else if (score <= 95) return {
        level: "good",
        label: "Լավ",
        description: "Սոցիալական զարգացումը լավ մակարդակում է։"
    };
    else return {
        level: "excellent",
        label: "Գերազանց",
        description: "Սոցիալական զարգացումը գերազանց մակարդակում է։"
    };
};


/**
 * Տողի վստահության մակարդակի հաշվարկ
 */
const calculateRowConfidence = (row, index, allData, isSynthetic = false) => {
    const values = Object.values(row);
    const keys = Object.keys(row);
    let totalConfidence = 0;
    const fieldConfidences = {};

    keys.forEach(key => {
        const value = row[key];
        const fieldConfidence = calculateFieldConfidence(value, key, allData, isSynthetic);
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
 */
const calculateFieldConfidence = (value, fieldName, allData, isSynthetic = false) => {
    // Если значение пустое → 0
    if (value === null || value === undefined || value === '') {
        return 0;
    }

    // Базовая уверенность: для синтетических данных можно дать стартовый boost
    let confidence = isSynthetic ? 70 : 0;

    // Фильтруем реальные значения для поля
    const fieldValues = allData
        .map(row => row[fieldName])
        .filter(v => v !== null && v !== undefined && v !== '');

    if (fieldValues.length === 0) {
        // Нет данных для сравнения → доверие минимальное или базовое
        return confidence;
    }

    // Определяем доминирующий тип среди данных
    const types = fieldValues.map(detectDataType);
    const dominantType = getMostFrequent(types);
    const currentType = detectDataType(value);

    // Если тип совпадает с доминирующим → небольшое повышение
    if (currentType === dominantType) {
        confidence += 15;
    }

    // Уникальность значения
    const uniqueValues = [...new Set(fieldValues)];
    const uniquenessRatio = uniqueValues.length / fieldValues.length;
    if (uniquenessRatio > 0.8) {
        confidence += 10;
    } else if (uniquenessRatio < 0.1) {
        confidence -= 5;
    }

    // Для числовых значений проверяем отклонения от среднего
    if (['number', 'integer', 'float'].includes(currentType)) {
        const numericValues = fieldValues.map(v => parseFloat(v)).filter(v => !isNaN(v));
        if (numericValues.length > 1) {
            const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
            const stdDev = Math.sqrt(numericValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericValues.length);
            const currentValue = parseFloat(value);
            const zScore = Math.abs((currentValue - mean) / stdDev);

            if (zScore <= 1) confidence += 20; // близко к среднему → высокое доверие
            else if (zScore <= 2) confidence += 10; // умеренное доверие
            else confidence -= 10; // далеко от среднего → понижаем
        }
    }

    // Для текстовых значений проверяем формат
    if (currentType === 'text' && typeof value === 'string') {
        const text = value.trim();

        if (isValidFormat(text, fieldName)) confidence += 10;
        if (text.length > 0 && text.length < 200) confidence += 5;
        if (/^[a-zA-Z0-9\u0530-\u058F\s\-.,]+$/.test(text)) confidence += 5;
    }

    // Ограничиваем 0–100
    return Math.max(0, Math.min(100, confidence));
};



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


const isValidFormat = (text, fieldName) => {
    const fieldLower = fieldName.toLowerCase();

    if (fieldLower.includes('email') || fieldLower.includes('mail')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    }

    if (fieldLower.includes('phone') || fieldLower.includes('tel') || fieldLower.includes('հեռախոս')) {
        return /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(text);
    }

    if (fieldLower.includes('date') || fieldLower.includes('ամսաթիվ') || fieldLower.includes('թվական')) {
        return /^\d{4}-\d{2}-\d{2}$/.test(text) || /^\d{2}\/\d{2}\/\d{4}$/.test(text);
    }

    return true;
};


const categorizeConfidences = (confidences, onlyReal = true) => {
    if (!confidences || confidences.length === 0) {
        return { low: 0, medium: 0, high: 0, lowCount: 0, mediumCount: 0, highCount: 0, total: 0 };
    }

    // Если onlyReal, фильтруем синтетические строки
    const dataToUse = onlyReal ? confidences.filter(c => !c.isSynthetic) : confidences;

    let lowCount = 0;
    let mediumCount = 0;
    let highCount = 0;

    dataToUse.forEach(conf => {
        if (conf.confidence < 40) lowCount++;
        else if (conf.confidence < 70) mediumCount++;
        else highCount++;
    });

    const total = dataToUse.length || 1; // чтобы не делить на 0

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


const generateFuzzyAnalysis = (distribution, dataType, rowConfidences) => {
    let summary = '';
    const patterns = [];
    const uncertaintyFactors = [];

    if (distribution.high >= 70) {
        summary = `Տվյալների ${distribution.high}%-ը ունի բարձր վստահություն: Որոշումները կարելի է կայացնել վստահությամբ:`;
    } else if (distribution.high >= 50) {
        summary = `Տվյալների որակը բավարար է (${distribution.high}% բարձր վստահություն): Պահվում են որոշ ռիսկեր:`;
    } else {
        summary = `Ցածր վստահության մակարդակ (${distribution.high}% միայն): Պահանջվում է լրացուցիչ տվյալների հավաքում:`;
    }

    const avgCompleteness = rowConfidences.reduce((sum, row) => sum + row.completeness, 0) / rowConfidences.length;

    if (avgCompleteness < 70) {
        patterns.push('Բացակայող տվյալների մեծ քանակ');
        uncertaintyFactors.push('Անամբողջական տեղեկություններ');
    }

    const lowConfidenceRows = rowConfidences.filter(row => row.confidence < 40);
    if (lowConfidenceRows.length > 0) {
        patterns.push(`${lowConfidenceRows.length} տող ունի շատ ցածր վստահություն`);
        uncertaintyFactors.push('Որակի մակարդակի անհամասեղություն');
    }

    switch (dataType) {
        case 'demographic':
            if (distribution.medium > 40) {
                patterns.push('Դեմոգրաֆիական տվյալները պահանջում են ստուգում');
            }
            break;
        case 'healthcare':
            if (distribution.low > 20) {
                patterns.push('Բժշկական տվյալների որակը վտանգավոր մակարդակում է');
                uncertaintyFactors.push('Կրիտիկական սխալմանության ռիսկ');
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
