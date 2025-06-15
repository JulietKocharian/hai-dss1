// src/utils/scenarios.js
// Որոշումային սցենարների ինտելիգենտ գեներացիա մենեջերների համար

/**
 * Սցենարների գեներացիա տվյալների տեսակի, անորոշության և կլաստերիզացիայի հիման վրա
 * @param {string} dataType - Տվյալների տեսակ
 * @param {Object} fuzzyResults - Անորոշ տրամաբանության արդյունքներ
 * @param {Array} clusterData - Կլաստերիզացիայի արդյունքներ
 * @returns {Array} Սցենարների ցուցակ
 */
export const generateScenarios = (dataType, fuzzyResults = null, clusterData = null) => {
    try {
        // Բազային սցենարների ստացում
        const baseScenarios = getBaseScenarios(dataType);

        // Ադապտիվ սցենարների ստեղծում անորոշության և կլաստերների հիման վրա
        const adaptiveScenarios = createAdaptiveScenarios(dataType, fuzzyResults, clusterData);

        // Սցենարների կոմբինացիա և առաջնահերթության սորտավորում
        const allScenarios = [...baseScenarios, ...adaptiveScenarios];
        const prioritizedScenarios = prioritizeScenarios(allScenarios, fuzzyResults);

        // Վերջնական մշակում և վալիդացիա
        return finalizeScenarios(prioritizedScenarios);

    } catch (error) {
        console.error('Սցենարների գեներացիայի սխալ:', error);
        return getFallbackScenarios(dataType);
    }
};

/**
 * Տվյալների տեսակի համար հիմնական սցենարների ստացում
 * @param {string} dataType - Տվյալների տեսակ
 * @returns {Array} Հիմնական սցենարներ
 */
const getBaseScenarios = (dataType) => {
    const scenarioTemplates = {
        demographic: [
            {
                title: 'Ծերացող բնակչության կառավարում',
                description: 'Վերլուծությունը ցույց է տալիս բնակչության ծերացման միտում, որը պահանջում է համակարգային մոտեցում',
                category: 'population_management',
                priority: 'high',
                timeframe: 'long_term',
                actions: [
                    'Ծերունական ծառայությունների ցանցի ընդլայնում',
                    'Տնային խնամքի ծրագրերի զարգացում',
                    'Առողջապահական ռեսուրսների վերաբաշխում',
                    'Տրանսպորտային մատչելիության բարելավում',
                    'Ցերեկային կենտրոնների ստեղծում'
                ],
                indicators: ['բնակչության տարիքային կառուցվածք', 'ծերությամբ կախվածության գործակից'],
                risks: ['բյուջետային ճնշումներ', 'ծառայությունների անբավարարություն']
            },
            {
                title: 'Երիտասարդական միգրացիայի կանխարգելում',
                description: 'Երիտասարդ բնակչության արտագաղթը վտանգում է տնտեսական կայունությունը',
                category: 'retention_strategy',
                priority: 'medium',
                timeframe: 'medium_term',
                actions: [
                    'Աշխատատեղերի ստեղծման ծրագրերի գործարկում',
                    'Բարձրակարգ կրթական հնարավորությունների ապահովում',
                    'Երիտասարդների ձեռներեցության աջակցություն',
                    'Մշակութային և ժամանցային ենթակառուցվածքների զարգացում',
                    'Բնակարանային աջակցության ծրագրեր'
                ],
                indicators: ['միգրացիայի գործակից', 'երիտասարդների զբաղվածություն'],
                risks: ['տնտեսական անկում', 'ինովացիոն ներուժի կորուստ']
            },
            {
                title: 'Ընտանիքային կառուցվածքի աջակցություն',
                description: 'Ընտանեկան մոդելների փոփոխությունը պահանջում է նոր սոցիալական քաղաքականություն',
                category: 'social_support',
                priority: 'medium',
                timeframe: 'medium_term',
                actions: [
                    'Ընտանիքային վարկային ծրագրերի ներդրում',
                    'Մանկական զարգացման կենտրոնների ցանց',
                    'Աշխատանքի և ընտանեկան կյանքի հավասարակշռության ապահովում',
                    'Միամառնության պայմանների բարելավում',
                    'Սոցիալական պաշտպանության ծրագրերի ընդլայնում'
                ],
                indicators: ['ծնելիության գործակից', 'ինամօրենական ամուսնությունների թիվ'],
                risks: ['դեմոգրաֆիական ճգնաժամ', 'սոցիալական բևեռացում']
            }
        ],
        healthcare: [
            {
                title: 'Քրոնիկ հիվանդությունների համակարգային կառավարում',
                description: 'Քրոնիկ հիվանդությունների աճող տարածվածությունը պահանջում է կանխարգելիչ մոտեցում',
                category: 'chronic_disease_management',
                priority: 'high',
                timeframe: 'long_term',
                actions: [
                    'Կանխարգելիչ բժշկության ծրագրերի ընդլայնում',
                    'Դիակառուցված խնամքի մոդելի ներդրում',
                    'Հիվանդների ինքնակառավարման ծրագրեր',
                    'Տեխնոլոգիական լուծումների (telemedicine) օգտագործում',
                    'Մասնագիտական կադրերի պատրաստում'
                ],
                indicators: ['հիվանդացության և մահացության ցուցանիշներ', 'բուժական ծառայությունների մատչելիություն'],
                risks: ['բուժական ծախսերի աճ', 'ծառայությունների անհամարժեքություն']
            },
            {
                title: 'Հոգեկան առողջության ծառայությունների զարգացում',
                description: 'Հոգեկան առողջության խնդիրները գերակա են դառնում բոլոր տարիքային խմբերում',
                category: 'mental_health',
                priority: 'high',
                timeframe: 'medium_term',
                actions: [
                    'Հոգեբանական ծառայությունների մատչելիության բարելավում',
                    'Ավարտական աշխատակիցների պատրաստում',
                    'Հանրային իրազեկության ծրագրեր',
                    'Աջակցող խմբերի և համայնքային ծրագրերի ստեղծում',
                    'Ճգնաժամային հեռախոսային գծերի գործարկում'
                ],
                indicators: ['հոգեկան խանգարումների տարածվածություն', 'ինքնասպանությունների ցուցանիշ'],
                risks: ['ստիգմատիզացիա', 'մասնագիտական կադրերի պակաս']
            },
            {
                title: 'Առողջապահական համակարգի թվային փոխակերպում',
                description: 'Տեխնոլոգիական առաջընթացի ինտեգրման աճող անհրաժեշտություն',
                category: 'digital_transformation',
                priority: 'medium',
                timeframe: 'medium_term',
                actions: [
                    'Էլեկտրոնային բժշկական գրանցամատյանների ներդրում',
                    'Տելեբժշկության ծառայությունների ընդլայնում',
                    'Արհեստական բանականության օգտագործում ախտորոշման մեջ',
                    'Հիվանդների կողմից ինքնամոնիթորինգի հավելվածներ',
                    'Տվյալների անվտանգության ապահովում'
                ],
                indicators: ['ծառայությունների թվայնացման մակարդակ', 'հիվանդների գոհունակություն'],
                risks: ['տեխնոլոգիական խոցելիություններ', 'թվային անհավասարություն']
            }
        ],
        quality_of_life: [
            {
                title: 'Սոցիալական անհավասարության նվազեցում',
                description: 'Եկամտային բևեռացումը վտանգում է սոցիալական կայունությունը',
                category: 'social_equity',
                priority: 'high',
                timeframe: 'long_term',
                actions: [
                    'Պրոգրեսիվ հարկային համակարգի ներդրում',
                    'Նվազագույն աշխատավարձի կարգավորում',
                    'Մատչելի բնակարանային ծրագրերի ընդլայնում',
                    'Կրթական հնարավորությունների հավասարացում',
                    'Ունիվերսալ հիմնական եկամտի փորձարկում'
                ],
                indicators: ['Գինի գործակից', 'բնակչության խցկությունը', 'սոցիալական շարժունակություն'],
                risks: ['սոցիալական անկայունություն', 'հանցավորության աճ']
            },
            {
                title: 'Շրջակա միջավայրի և կյանքի որակի բարելավում',
                description: 'Էկոլոգիական ցուցանիշների վատթարացումը ազդում է հանրային առողջության վրա',
                category: 'environmental_quality',
                priority: 'medium',
                timeframe: 'long_term',
                actions: [
                    'Օդի որակի մոնիթորինգի համակարգ',
                    'Կանաչ տարածքների ընդլայնում',
                    'Վերականգնվող էներգիայի օգտագործման խրախուսում',
                    'Վերամշակման ծրագրերի ներդրում',
                    'Հանրային տրանսպորտի էկոլոգիականացում'
                ],
                indicators: ['օդի որակի ցուցանիշներ', 'կանաչ տարածքների մակերես', 'էներգաօգտագործման արդյունավետություն'],
                risks: ['կլիմայական փոփոխություններ', 'էկոսիստեմային դեգրադացիա']
            },
            {
                title: 'Թվային ինկլյուզիվության ապահովում',
                description: 'Թվային տեխնոլոգիաների տարածումը ստեղծում է նոր անհավասարություններ',
                category: 'digital_inclusion',
                priority: 'medium',
                timeframe: 'medium_term',
                actions: [
                    'Ճանապահային ինտերնետի հասանելիության ապահովում',
                    'Թվային գրամոտության ծրագրերի ներդրում',
                    'Հանրային կառավարման ծառայությունների թվայնացում',
                    'Ավագ հասակականների համար տեխնոլոգիական աջակցություն',
                    'Էլեկտրոնային ծառայությունների մատչելիության ստանդարտներ'
                ],
                indicators: ['ինտերնետի տարածվածություն', 'թվային գրամոտության մակարդակ'],
                risks: ['թվային անհավասարություն', 'տեխնոլոգիական կախվածություն']
            }
        ],
        educational: [
            {
                title: 'Կրթական համակարգի արդիականացում',
                description: '21-րդ դարի պահանջների համապատասխան կրթական մոդելի ներդրում',
                category: 'system_modernization',
                priority: 'high',
                timeframe: 'long_term',
                actions: [
                    'STEM կրթության ամրապնդում',
                    'Անհատականացված ուսուցման մեթոդների ներդրում',
                    'Ուսուցիչների մասնագիտական զարգացման ծրագրեր',
                    'Թվային ցանկությունների ինտեգրում ծրագրի մեջ',
                    'Կառուցվածքային գնահատման համակարգի բարեփոխում'
                ],
                indicators: ['ուսանողների ընդհանուր առաջադիմություն', 'ուսուցիչների որակավորում', 'տեխնոլոգիական հագեցվածություն'],
                risks: ['ֆինանսական պահանջներ', 'հակառակություն փոփոխություններին']
            },
            {
                title: 'Կարիերային ուղղորդման և մասնագիտական պատրաստման բարելավում',
                description: 'Աշխատանքային շուկայի և կրթական ոցանակիների մֆերի հզոր բացակում',
                category: 'career_guidance',
                priority: 'medium',
                timeframe: 'medium_term',
                actions: [
                    'Ոչունինները ծանկության խորհրդատվական ծառայությունների ստեղծում',
                    'Ուսանողների աշխատանքային փորձի ծրագրեր',
                    'Գեղործարական ծրագրերի հանցագործ գործողությունների հետ պայմանա ցուցադրական',
                    'Կառավարության և մասնավոր ոլոլմորենտական համագործակցություն',
                    'Թարմ մասնագիտությունների շեղի ծրագանակի գրել ցույցակարգեր'
                ],
                indicators: ['ավարտակիցների գործազրկություն', 'մասնագիտական համապատասխանություն'],
                risks: ['սիալբընտածիները պարապիտենակի գատակում', 'տնտեսական կոլեկտոտությունների փոփոխություն']
            },
            {
                title: 'Կրթական հնարավորությունների հավասարության ապահովում',
                description: 'Սոցիալ-տնտեսական ծագման կառանանակիկում են կրտական արդյունքների վրա',
                category: 'educational_equity',
                priority: 'high',
                timeframe: 'long_term',
                actions: [
                    'Ծառայության համար ճանկություն գարավարում',
                    'Նաեկանցային ծրագրերի գնանաի վիդատիրագիր',
                    'Հայգանի արաիցրողներ ծրագրերի ըստ շահանի',
                    'Անընդմհցի բլոկ սցանարագիր էվտագյառություն',
                    'Սոցիալ-տնտեսական աջակցության մեխանիզմներ'
                ],
                indicators: ['ցուցակվցի մետաղածությունների ճակառային բաշխում', 'ճանապահությունների մատչելիություն'],
                risks: ['գագավարական իիարսումներ', 'սոցիալական մոբիլիզացիայի պակաս']
            }
        ]
    };

    return scenarioTemplates[dataType] || [];
};

/**
 * Ադապտիվ սցենարների ստեղծում անորոշության և կլաստերիզացիայի հիման վրա
 * @param {string} dataType - Տվյալների տեսակ
 * @param {Object} fuzzyResults - Անորոշ տրամաբանության արդյունքներ
 * @param {Array} clusterData - Կլաստերների տվյալներ
 * @returns {Array} Ադապտիվ սցենարներ
 */
const createAdaptiveScenarios = (dataType, fuzzyResults, clusterData) => {
    const adaptiveScenarios = [];

    // Անորոշության հիման վրա սցենարներ
    if (fuzzyResults) {
        if (fuzzyResults.low > 40) {
            adaptiveScenarios.push(createUncertaintyScenario('high_uncertainty', dataType, fuzzyResults));
        }

        if (fuzzyResults.high > 70) {
            adaptiveScenarios.push(createConfidenceScenario('high_confidence', dataType, fuzzyResults));
        }
    }

    // Կլաստերիզացիայի հիման վրա սցենարներ
    if (clusterData && clusterData.length > 0) {
        // Խմբավորված մոտեցման սցենարներ
        adaptiveScenarios.push(createClusterBasedScenario(dataType, clusterData));

        // Յուրաքանչյուր խմբի համար կապված սցենարներ
        clusterData.forEach((cluster, index) => {
            if (cluster.size > 20) { // Միայն նշանակալի չափի խմբերի համար
                adaptiveScenarios.push(createTargetedScenario(dataType, cluster, index));
            }
        });
    }

    return adaptiveScenarios;
};

/**
 * Անորոշության սցենարի ստեղծում
 * @param {string} type - Անորոշության տեսակ
 * @param {string} dataType - Տվյալների տեսակ
 * @param {Object} fuzzyResults - Անորոշության արդյունքներ
 * @returns {Object} Անորոշության սցենար
 */
const createUncertaintyScenario = (type, dataType, fuzzyResults) => {
    return {
        title: 'Անորոշության կառավարման ռազմավարություն',
        description: `Տվյալների ${fuzzyResults.low}%-ը ունի ցածր վստահություն, որը պահանջում է ռիսկ-հենչ մոտեցում`,
        category: 'uncertainty_management',
        priority: 'high',
        timeframe: 'short_term',
        adaptive: true,
        uncertaintyLevel: fuzzyResults.low,
        actions: [
            'Լրացուցիչ տվյալների հավաքման իրականացում',
            'Բազմակի սցենարային մոդելավորման կիրառում',
            'Փուլային որոշումների կառուցակարգի ճգնաժամային',
            'Մոնիթորինգի և արագ արձագանքման համակարգ',
            'Ռիսկային գորգեցման և միտիգացիայի պլան'
        ],
        indicators: ['տվյալների վստահության մակարդակ', 'որոշումների ճշտություն'],
        risks: ['սխալ որոշումներ', 'փոայմների ուշացում'],
        adaptiveNote: `Սցենարը ստեղծվել է ${fuzzyResults.low}% ցածր վստահության հիման վրա`
    };
};

/**
 * Վստահության սցենարի ստեղծում
 * @param {string} type - Վստահության տեսակ
 * @param {string} dataType - Տվյալների տեսակ  
 * @param {Object} fuzzyResults - Վստահության արդյունքներ
 * @returns {Object} Վստահության սցենար
 */
const createConfidenceScenario = (type, dataType, fuzzyResults) => {
    return {
        title: 'Արագ իրականացման ռազմավարություն',
        description: `Տվյալների բարձր որակը (${fuzzyResults.high}% վստահություն) թույլ է տալիս ագրեսիվ քային իրականացում`,
        category: 'rapid_implementation',
        priority: 'medium',
        timeframe: 'short_term',
        adaptive: true,
        confidenceLevel: fuzzyResults.high,
        actions: [
            'Արագ որոշումների կայացման մեխանիզմ',
            'Մեծ մասշտաբի ծրագրերի մեկնարկ',
            'Ռեսուրսների կոնցենտրացիա առաջնային ուղղություններում',
            'Արագ արգնակումների ներդրում',
            'Բազմակի զարալեկացիային պրոյեկտների համագործակցություն'
        ],
        indicators: ['իրականացման արագություն', 'ռեսուրսային արդյունավետություն'],
        risks: ['ևերգոանգակիսրանության ռիսկ', 'այլ ամփեազատիցների անտեսում'],
        adaptiveNote: `Սցենարը օպտիմիզացվել է ${fuzzyResults.high}% վստահության հիման վրա`
    };
};

/**
 * Կլաստեր-հենք սցենարի ստեղծում
 * @param {string} dataType - Տվյալների տեսակ
 * @param {Array} clusterData - Կլաստերների տվյալներ
 * @returns {Object} Կլաստեր-հենք սցենար
 */
const createClusterBasedScenario = (dataType, clusterData) => {
    const avgSize = clusterData.reduce((sum, c) => sum + c.size, 0) / clusterData.length;

    return {
        title: 'Ստրատիֆիկացված մոտեցման իրականացում',
        description: `Հայտնաբերված ${clusterData.length} տարբեր խումբը պահանջում է նպատակային քաղաքականություն`,
        category: 'targeted_approach',
        priority: 'medium',
        timeframe: 'medium_term',
        adaptive: true,
        clusterCount: clusterData.length,
        actions: [
            `${clusterData.length} տարբեր խմբի համար հատուկ ծրագրեր`,
            'Խմբայավոր-լարմարեցված ծառայությունների մշակում',
            'Բանակցային ռեսուրսրերի բաշխման օպտիմիզացում',
            'Խմբերի միջև սինեգրիայի ստեղծման գրվարություն',
            'Հատվառակային մոնիթորինգի և գնահատման համակարգ'
        ],
        indicators: ['խմբայավոր գոհունակություն', 'ծառայությունների արդյունավետություն'],
        risks: ['վարչական բարդությունների աճ', 'խմբերի միջև անהավասարություն'],
        adaptiveNote: `Վերլուծությունը բացահայտել է ${clusterData.length} տրամադրյուժ խումբ`
    };
};

/**
 * Նպատակային սցենարի ստեղծում կոնկրետ խմբի համար
 * @param {string} dataType - Տվյալների տեսակ
 * @param {Object} cluster - Կլաստերի տվյալներ
 * @param {number} index - Կլաստերի ինդեքս
 * @returns {Object} Նպատակային սցենար
 */
const createTargetedScenario = (dataType, cluster, index) => {
    return {
        title: `"${cluster.label}" խմբի հատուկ ցննում`,
        description: `${cluster.size} մասնակիցներ ունեցող խմնում պահանջում է հատուկ մոտեցում`,
        category: 'group_specific',
        priority: cluster.size > 50 ? 'high' : 'medium',
        timeframe: 'medium_term',
        adaptive: true,
        targetGroup: cluster.label,
        groupSize: cluster.size,
        actions: [
            `${cluster.label} խմբի կարիքների խոր գնահատում`,
            'Խմբամիտ ժետեց լուծուանների մշակում',
            'Չլայազի մասնակցության անգամ գործընթացին',
            'Պիիլոտ ծրագրերի փորանկում ${cluster.label} խմբում',
            'Արդյունքների իըներթականապումայի այլ խմբերի'
        ],
        indicators: [`${cluster.label} խմբի գոհունակություն`, 'նպատակային բւղգանների հասանելիություն'],
        risks: ['խմբի ներսում հետերոգեն պահանջակիությունց', 'ծառայությունները խուսափելություն'],
        adaptiveNote: `Սցենարը մշակվել է "${cluster.label}" խմբի (${cluster.size} մասնակիցստ) համար`
    };
};

/**
 * Սցենարների առաջնահերթության սորտավորում
 * @param {Array} scenarios - Սցենարների ցուցակ
 * @param {Object} fuzzyResults - Անորոշության արդյունքներ
 * @returns {Array} Սորտավորված սցենարներ
 */
const prioritizeScenarios = (scenarios, fuzzyResults) => {
    return scenarios.sort((a, b) => {
        // Առաջնահերթության մատուցում
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

        if (priorityDiff !== 0) return priorityDiff;

        // Ադապտիվ սցենարների առաջնահերթություն
        if (a.adaptive && !b.adaptive) return -1;
        if (!a.adaptive && b.adaptive) return 1;

        // Անորոշության մակարդակի հաշվի առնում
        if (fuzzyResults && fuzzyResults.low > 30) {
            if (a.category === 'uncertainty_management') return -1;
            if (b.category === 'uncertainty_management') return 1;
        }

        return 0;
    });
};

/**
 * Սցենարների վերջնական մշակում
 * @param {Array} scenarios - Սցենարների ցուցակ
 * @returns {Array} Վերջնական սցենարներ
 */
const finalizeScenarios = (scenarios) => {
    return scenarios.slice(0, 5).map((scenario, index) => {
        // Առաջնահերթության տեքստի ճշգրտում
        const priorityTexts = {
            'high': 'ԲԱՐՁՐ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ',
            'medium': 'ՄԻՋԻՆ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ',
            'low': 'ՑԱԾՐ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ'
        };

        return {
            ...scenario,
            priorityText: priorityTexts[scenario.priority],
            id: index + 1,
            // Ժամանակային շրջանակի հայերեն թարգմանություն
            timeframeText: {
                'short_term': 'Կարճաժամկետ (3-6 ամիս)',
                'medium_term': 'Միջնաժամկետ (6-18 ամիս)',
                'long_term': 'Երկարաժամկետ (1-3 տարի)'
            }[scenario.timeframe] || scenario.timeframe,

            // Մետադատարների հարստացում
            metadata: {
                generatedAt: new Date().toISOString(),
                dataType: scenario.dataType || 'unknown',
                confidence: scenario.confidenceLevel || null,
                uncertainty: scenario.uncertaintyLevel || null,
                adaptive: scenario.adaptive || false
            }
        };
    });
};

/**
 * Պարզ սցենարներ սխալի դեպքում
 * @param {string} dataType - Տվյալների տեսակ  
 * @returns {Array} Պարզ սցենարներ
 */
const getFallbackScenarios = (dataType) => {
    return [
        {
            title: 'Ընդհանուր բարելավման ծրագիր',
            description: 'Տվյալների վերլուծության հիման վրա առաջարկվող հիմնական մոտեցումներ',
            category: 'general_improvement',
            priority: 'medium',
            priorityText: 'ՄԻՋԻՆ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ',
            timeframe: 'medium_term',
            timeframeText: 'Միջնաժամկետ (6-18 ամիս)',
            actions: [
                'Տվյալների հավաքման մեթոդաբանության բարելավում',
                'Հետազոտական գործունեության իրականացում',
                'Շահառուների ծրագրիր գունույկգիցին',
                'Փուլային իրականացման գահծի մշակում',
                'Մոնիթորինգի և գնահատման համակարգի ստեղծում'
            ],
            indicators: ['ծրագրերի իրականացման մակարդակ', 'շահառուների գոհունակություն'],
            risks: ['բյուջետային սահմանափակումներ', 'փոփոխություններին հակառակություն'],
            id: 1,
            metadata: {
                generatedAt: new Date().toISOString(),
                dataType: dataType,
                fallback: true
            }
        }
    ];
};

// // src/utils/aiScenarioGenerator.js
// // Fixed AI-հենց որոշումային սցենարների գեներացիա
// import axios from 'axios';

// /**
//  * AI-ի միջոցով սցենարների գեներացիա - FIXED VERSION
//  */
// export const generateAIScenarios = async (dataType, analysisResults, clusterData = null, contextData = {}, userId = 1) => {
//     console.log('🔍 AI Scenario Generation Started');
//     console.log('📊 Input Data:', { dataType, analysisResults, clusterData, contextData, userId });

//     try {
//         // 1. Build comprehensive context prompt
//         console.log('📝 Building context prompt...');
//         const contextPrompt = buildContextPrompt(dataType, analysisResults, clusterData, contextData);
//         console.log('📄 Generated prompt length:', contextPrompt.length);
        
//         // 2. Make single AI request for all scenarios
//         console.log('🤖 Making single comprehensive AI request...');
//         const aiScenarios = await requestScenariosFromAI(contextPrompt, dataType, clusterData, userId);
//         console.log('✅ AI Response received:', aiScenarios);
        
//         // 3. Validate and process all scenarios
//         if (!aiScenarios || aiScenarios.length === 0) {
//             console.warn('⚠️ AI returned no scenarios, using fallback');
//             return await getFallbackAIScenarios(dataType, analysisResults, userId);
//         }

//         console.log('🔄 Processing all scenarios...');
//         const processedScenarios = await validateAndEnrichScenarios(aiScenarios, analysisResults);
//         console.log('✅ Processed scenarios:', processedScenarios);
        
//         // 4. Finalize scenarios
//         const finalScenarios = finalizeAIScenarios(processedScenarios);
//         console.log('🎉 Final scenarios ready:', finalScenarios);
        
//         return finalScenarios;
        
//     } catch (error) {
//         console.error('❌ AI Scenario Generation Error:', error);
//         console.log('🔄 Attempting fallback scenarios...');
        
//         try {
//             return await getFallbackAIScenarios(dataType, analysisResults, userId);
//         } catch (fallbackError) {
//             console.error('❌ Fallback also failed:', fallbackError);
//             return getHardcodedFallbackScenarios(dataType, analysisResults);
//         }
//     }
// };

// /**
//  * FIXED: AI-ի համար կոնտեքստային պրոմպտի կառուցում
//  */
// const buildContextPrompt = (dataType, analysisResults, clusterData, contextData) => {
//     const dataTypeTranslations = {
//         demographic: 'դեմոգրաֆիական',
//         healthcare: 'առողջապահական', 
//         quality_of_life: 'կյանքի որակի',
//         educational: 'կրթական'
//     };

//     let prompt = `Դու փորձագետ քաղաքականության վերլուծաբան ես։ Ստեղծիր 5 ԿՈՆԿՐԵՏ ${dataTypeTranslations[dataType] || dataType} բարելավման ծրագիր Կոտայքի մարզի համար։

// ԿԱՐԵՎՈՐ: Գործողությունները պետք է լինեն ԻՐԱԿԱՆ և ԿՈՆԿՐԵՏ, ոչ թե ընդհանուր։

// ՏՎՅԱԼՆԵՐ:`;

//     // Simplified cluster data addition
//     if (clusterData && Array.isArray(clusterData) && clusterData.length > 0) {
//         prompt += `\nՄարզում հայտնաբերված խմբեր:\n`;
//         clusterData.forEach(cluster => {
//             if (cluster && cluster.label && cluster.size) {
//                 prompt += `• ${cluster.label}: ${cluster.size} մարդ\n`;
//             }
//         });
//     }

//     if (contextData.budget) {
//         prompt += `\nԲյուջետ: ${contextData.budget}`;
//     }

//     // Fixed JSON example format to avoid parsing issues
//     prompt += `

// Պատասխանիր ՄԻԱՅՆ JSON array ֆորմատով (առանց markdown backticks):

// [
//   {
//     "title": "Ցածր եկամուտ ունեցող ընտանիքների սոցիալական աջակցություն",
//     "description": "Կոտայքի մարզում ցածր եկամուտ ունեցող ընտանիքների կյանքի որակի բարելավման համակարգ",
//     "category": "social_support",
//     "priority": "high",
//     "timeframe": "short_term",
//     "actions": ["Ցածր եկամուտ ունեցող ընտանիքների ցուցակի կազմում", "Ամսական 50,000 դրամ սննդային օգնություն", "Երեխաների համար անվճար դպրոցական պարագաներ"],
//     "indicators": ["օգնություն ստացող ընտանիքների քանակ", "եկամտի աճ"],
//     "risks": ["բյուջետի անբավարարություն", "կեղծ հայտերի ռիսկ"],
//     "estimatedBudget": "2-3 միլիոն դրամ",
//     "expectedOutcomes": ["150 ընտանիք օգնություն կստանա", "երեխաների կրթական ցուցանիշների բարելավում"]
//   }
// ]

// Ստեղծիր 5 նման սցենար JSON array ֆորմատով:`;

//     return prompt;
// };

// /**
//  * FIXED: AI-ից սցենարների պահանջում with better error handling
//  */
// const requestScenariosFromAI = async (prompt, dataType, clusterData = null, userId = 1) => {
//     console.log('🌐 Making AI request...');
//     console.log('📍 URL: http://localhost:6001/api/v1/ai/ask');
//     console.log('👤 User ID:', userId);
    
//     try {
//         const requestData = {
//             text: prompt,
//             userId: userId,
//             clusters: clusterData || []
//         };
        
//         console.log('📤 Request payload:', {
//             textLength: prompt.length,
//             userId,
//             clustersCount: (clusterData || []).length
//         });

//         // Create axios instance with proper configuration
//         const axiosInstance = axios.create({
//             timeout: 30000, // Reduced timeout to 30 seconds
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         const response = await axiosInstance.post('http://localhost:6001/api/v1/ai/ask', requestData);

//         console.log('📥 Response status:', response.status);
//         console.log('📥 Response headers:', response.headers);

//         // Better response validation
//         if (!response.data) {
//             throw new Error('Empty response data from AI API');
//         }

//         if (!response.data.reply) {
//             console.error('Invalid response structure:', response.data);
//             throw new Error('Invalid response format: missing reply field');
//         }

//         const aiResponse = response.data.reply;
//         console.log('🤖 AI Reply length:', aiResponse.length);
//         console.log('🤖 AI Reply preview:', aiResponse.substring(0, 200) + '...');
        
//         // Extract scenarios from the response
//         const extractedScenarios = extractJSONFromResponse(aiResponse);
        
//         if (!extractedScenarios || extractedScenarios.length === 0) {
//             console.warn('⚠️ No valid scenarios extracted from AI response');
//             console.log('📄 Full AI response for debugging:', aiResponse);
//             throw new Error('No valid scenarios could be extracted from AI response');
//         }
        
//         console.log(`✅ Successfully extracted ${extractedScenarios.length} scenarios`);
//         return extractedScenarios;
        
//     } catch (error) {
//         console.error('❌ AI API Request failed:');
        
//         // Better error categorization
//         if (axios.isAxiosError(error)) {
//             if (error.response) {
//                 // Server responded with error status
//                 console.error('Server Error:', {
//                     status: error.response.status,
//                     statusText: error.response.statusText,
//                     data: error.response.data
//                 });
//                 throw new Error(`AI API Server Error: ${error.response.status} - ${error.response.statusText}`);
//             } else if (error.request) {
//                 // Request was made but no response received
//                 console.error('Network Error: No response received');
//                 console.error('Request details:', error.request);
//                 throw new Error('AI API Network Error: No response from server');
//             } else {
//                 // Request setup error
//                 console.error('Request Setup Error:', error.message);
//                 throw new Error(`AI API Request Error: ${error.message}`);
//             }
//         } else {
//             // Non-axios error
//             console.error('Unexpected error:', error);
//             throw new Error(`Unexpected error: ${error.message}`);
//         }
//     }
// };

// /**
//  * FIXED: Enhanced JSON extraction with simplified regex patterns
//  */
// const extractJSONFromResponse = (text) => {
//     console.log('🔍 Extracting JSON from AI response...');
//     console.log('📄 Response length:', text.length);
//     console.log('📄 First 300 chars:', text.substring(0, 300));
    
//     const jsonBlocks = [];
//     let cleanedText = text.trim();
    
//     try {
//         // Method 1: Try to parse the entire response as JSON first
//         if ((cleanedText.startsWith('[') && cleanedText.endsWith(']')) || 
//             (cleanedText.startsWith('{') && cleanedText.endsWith('}'))) {
//             console.log('🔍 Trying to parse entire response as JSON...');
//             try {
//                 const parsed = JSON.parse(cleanedText);
//                 if (Array.isArray(parsed)) {
//                     parsed.forEach(scenario => {
//                         const fixedScenario = fixScenarioStructure(scenario);
//                         jsonBlocks.push(fixedScenario);
//                     });
//                     console.log(`✅ Successfully parsed entire response as JSON array with ${jsonBlocks.length} scenarios`);
//                     return jsonBlocks;
//                 } else if (typeof parsed === 'object') {
//                     const fixedScenario = fixScenarioStructure(parsed);
//                     jsonBlocks.push(fixedScenario);
//                     console.log('✅ Successfully parsed entire response as single JSON object');
//                     return jsonBlocks;
//                 }
//             } catch (parseError) {
//                 console.log('⚠️ Failed to parse entire response as JSON:', parseError.message);
//             }
//         }
        
//         // Method 2: Look for JSON arrays in code blocks
//         const codeBlockArrayPattern = /```(?:json)?\s*(\[\s*\{[\s\S]*?\}\s*\])\s*```/gi;
//         let match = codeBlockArrayPattern.exec(cleanedText);
        
//         if (match) {
//             console.log('🔍 Found JSON array in code block...');
//             try {
//                 const jsonArrayString = match[1].trim();
//                 const parsedArray = JSON.parse(jsonArrayString);
//                 if (Array.isArray(parsedArray)) {
//                     parsedArray.forEach(scenario => {
//                         const fixedScenario = fixScenarioStructure(scenario);
//                         jsonBlocks.push(fixedScenario);
//                     });
//                     console.log(`✅ Successfully extracted ${jsonBlocks.length} scenarios from code block array`);
//                     return jsonBlocks;
//                 }
//             } catch (parseError) {
//                 console.warn('⚠️ Failed to parse JSON array from code block:', parseError.message);
//             }
//         }
        
//         // Method 3: Look for standalone JSON arrays (without code blocks)
//         const standaloneArrayPattern = /\[\s*\{[\s\S]*?\}\s*\]/g;
//         const arrayMatches = cleanedText.match(standaloneArrayPattern);
        
//         if (arrayMatches && arrayMatches.length > 0) {
//             console.log(`🔍 Found ${arrayMatches.length} potential JSON arrays...`);
//             for (const arrayMatch of arrayMatches) {
//                 try {
//                     const parsed = JSON.parse(arrayMatch);
//                     if (Array.isArray(parsed)) {
//                         parsed.forEach(scenario => {
//                             const fixedScenario = fixScenarioStructure(scenario);
//                             jsonBlocks.push(fixedScenario);
//                         });
//                         console.log(`✅ Successfully parsed JSON array with ${parsed.length} scenarios`);
//                         if (jsonBlocks.length >= 5) break; // Stop after finding enough scenarios
//                     }
//                 } catch (parseError) {
//                     console.log('⚠️ Failed to parse potential JSON array:', parseError.message);
//                 }
//             }
//         }
        
//         // Method 4: Look for individual JSON objects
//         if (jsonBlocks.length === 0) {
//             console.log('🔍 Looking for individual JSON objects...');
//             const objectPattern = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
//             let objectMatch;
            
//             while ((objectMatch = objectPattern.exec(cleanedText)) !== null && jsonBlocks.length < 5) {
//                 try {
//                     const parsed = JSON.parse(objectMatch[0]);
//                     if (parsed.title || parsed.description) { // Basic validation
//                         const fixedScenario = fixScenarioStructure(parsed);
//                         jsonBlocks.push(fixedScenario);
//                         console.log('✅ Found and parsed individual JSON object');
//                     }
//                 } catch (parseError) {
//                     console.log('⚠️ Failed to parse individual JSON object:', parseError.message);
//                 }
//             }
//         }
        
//     } catch (error) {
//         console.error('❌ Critical error during JSON extraction:', error);
//     }
    
//     console.log(`🎉 Total extracted ${jsonBlocks.length} scenarios from AI response`);
//     return jsonBlocks;
// };

// /**
//  * FIXED: Better scenario structure validation and fixing
//  */
// const fixScenarioStructure = (scenario) => {
//     if (!scenario || typeof scenario !== 'object') {
//         console.warn('⚠️ Invalid scenario object provided to fixScenarioStructure');
//         return null;
//     }
    
//     const fixed = { ...scenario };
    
//     // Ensure required fields exist with safe defaults
//     fixed.title = scenario.title || 'Անանուն սցենար';
//     fixed.description = scenario.description || 'Նկարագրություն բացակայում է';
//     fixed.category = scenario.category || 'general';
//     fixed.priority = ['high', 'medium', 'low'].includes(scenario.priority) ? scenario.priority : 'medium';
//     fixed.timeframe = ['short_term', 'medium_term', 'long_term'].includes(scenario.timeframe) ? scenario.timeframe : 'medium_term';
    
//     // Safely convert arrays with better error handling
//     fixed.actions = ensureArray(scenario.actions, []);
//     fixed.indicators = ensureArray(scenario.indicators, []);
//     fixed.risks = ensureArray(scenario.risks, []);
//     fixed.expectedOutcomes = ensureArray(scenario.expectedOutcomes, []);
    
//     // Ensure estimatedBudget is a string
//     fixed.estimatedBudget = String(scenario.estimatedBudget || 'Չշահցված');
    
//     console.log('🔧 Fixed scenario structure for:', fixed.title);
//     return fixed;
// };

// /**
//  * HELPER: Safely ensure a value is an array
//  */
// const ensureArray = (value, defaultValue = []) => {
//     if (Array.isArray(value)) {
//         return value.filter(item => item && String(item).trim()); // Remove empty items
//     }
    
//     if (typeof value === 'string' && value.trim()) {
//         // Try to split by common delimiters
//         return value.split(/[,،\n|]/).map(item => item.trim()).filter(item => item);
//     }
    
//     if (value && typeof value === 'object') {
//         // If it's an object, try to extract values
//         return Object.values(value).filter(item => item && String(item).trim());
//     }
    
//     return defaultValue;
// };

// /**
//  * FIXED: Better validation and enrichment
//  */
// const validateAndEnrichScenarios = async (scenarios, analysisResults) => {
//     const validatedScenarios = [];
    
//     if (!Array.isArray(scenarios)) {
//         console.warn('⚠️ Scenarios is not an array, converting...');
//         scenarios = [scenarios];
//     }
    
//     for (const scenario of scenarios) {
//         try {
//             // More thorough validation
//             if (!scenario || typeof scenario !== 'object') {
//                 console.warn('⚠️ Skipping invalid scenario:', scenario);
//                 continue;
//             }
            
//             if (!scenario.title && !scenario.description) {
//                 console.warn('⚠️ Skipping scenario without title or description');
//                 continue;
//             }
            
//             // Enhanced enrichment with error handling
//             const enrichedScenario = {
//                 ...scenario,
//                 id: generateScenarioId(),
//                 generatedBy: 'ai',
//                 confidence: calculateScenarioConfidence(scenario, analysisResults),
//                 feasibilityScore: calculateFeasibilityScore(scenario),
//                 metadata: {
//                     generatedAt: new Date().toISOString(),
//                     aiGenerated: true,
//                     dataBasedConfidence: analysisResults?.fuzzyResults?.high || 0,
//                     validationPassed: true
//                 }
//             };
            
//             validatedScenarios.push(enrichedScenario);
            
//         } catch (enrichmentError) {
//             console.error('❌ Error enriching scenario:', enrichmentError);
//             // Still add the basic scenario if enrichment fails
//             validatedScenarios.push({
//                 ...scenario,
//                 id: generateScenarioId(),
//                 generatedBy: 'ai',
//                 confidence: 50,
//                 feasibilityScore: 50,
//                 metadata: {
//                     generatedAt: new Date().toISOString(),
//                     aiGenerated: true,
//                     enrichmentError: enrichmentError.message
//                 }
//             });
//         }
//     }
    
//     return validatedScenarios;
// };

// /**
//  * HELPER: Generate unique scenario ID
//  */
// const generateScenarioId = () => {
//     return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// };

// /**
//  * FIXED: Better confidence calculation with error handling
//  */
// const calculateScenarioConfidence = (scenario, analysisResults) => {
//     try {
//         let confidence = 50; // Base confidence
        
//         // Actions quality
//         if (scenario.actions && Array.isArray(scenario.actions) && scenario.actions.length >= 3) {
//             confidence += 15;
//         }
        
//         // Risk assessment quality
//         if (scenario.risks && Array.isArray(scenario.risks) && scenario.risks.length >= 2) {
//             confidence += 10;
//         }
        
//         // Expected outcomes quality
//         if (scenario.expectedOutcomes && Array.isArray(scenario.expectedOutcomes) && scenario.expectedOutcomes.length >= 2) {
//             confidence += 10;
//         }
        
//         // Data-based confidence boost
//         if (analysisResults?.fuzzyResults?.high) {
//             confidence += (analysisResults.fuzzyResults.high * 0.2);
//         }
        
//         return Math.min(100, Math.max(0, Math.round(confidence)));
        
//     } catch (error) {
//         console.warn('⚠️ Error calculating scenario confidence:', error);
//         return 50; // Default confidence
//     }
// };

// /**
//  * FIXED: Better feasibility calculation
//  */
// const calculateFeasibilityScore = (scenario) => {
//     try {
//         // Complexity assessment
//         const actionsCount = Array.isArray(scenario.actions) ? scenario.actions.length : 0;
//         const complexityScore = Math.min(100, Math.max(20, 100 - (actionsCount * 5)));
        
//         // Timeframe assessment
//         const timeframeScores = {
//             'short_term': 85,
//             'medium_term': 65, 
//             'long_term': 45
//         };
//         const timeScore = timeframeScores[scenario.timeframe] || 60;
        
//         // Budget assessment
//         let budgetScore = 70;
//         if (scenario.estimatedBudget && typeof scenario.estimatedBudget === 'string') {
//             const budget = extractNumberFromBudget(scenario.estimatedBudget);
//             if (budget > 5000000) budgetScore = 30;
//             else if (budget > 2000000) budgetScore = 50;
//             else if (budget > 500000) budgetScore = 70;
//             else budgetScore = 90;
//         }
        
//         const finalScore = Math.round((complexityScore * 0.3 + timeScore * 0.4 + budgetScore * 0.3));
//         return Math.min(100, Math.max(10, finalScore));
        
//     } catch (error) {
//         console.warn('⚠️ Error calculating feasibility score:', error);
//         return 60; // Default feasibility
//     }
// };

// /**
//  * HELPER: Extract number from budget string with better regex
//  */
// const extractNumberFromBudget = (budgetString) => {
//     try {
//         const numbers = budgetString.match(/[\d,\.]+/g);
//         if (numbers && numbers.length > 0) {
//             return parseInt(numbers[0].replace(/[,\.]/g, ''));
//         }
//         return 0;
//     } catch (error) {
//         console.warn('⚠️ Error extracting number from budget:', error);
//         return 0;
//     }
// };

// /**
//  * UNCHANGED: Final scenario processing
//  */
// const finalizeAIScenarios = (scenarios) => {
//     return scenarios.slice(0, 5).map((scenario, index) => {
//         const priorityTexts = {
//             'high': 'ԲԱՐՁՐ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ',
//             'medium': 'ՄԻՋԻՆ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ', 
//             'low': 'ՑԱԾՐ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ'
//         };

//         const timeframeTexts = {
//             'short_term': 'Կարճաժամկետ (3-6 ամիս)',
//             'medium_term': 'Միջնաժամկետ (6-18 ամիս)',
//             'long_term': 'Երկարաժամկետ (1-3 տարի)'
//         };

//         return {
//             ...scenario,
//             displayOrder: index + 1,
//             priorityText: priorityTexts[scenario.priority] || 'ՄԻՋԻՆ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ',
//             timeframeText: timeframeTexts[scenario.timeframe] || scenario.timeframe,
//             confidenceText: `${Math.round(scenario.confidence || 50)}% վստահություն`,
//             feasibilityText: `${scenario.feasibilityScore || 50}% իրականացվելիություն`,
//             metadata: {
//                 ...scenario.metadata,
//                 finalizedAt: new Date().toISOString(),
//                 version: '2.0'
//             }
//         };
//     });
// };

// /**
//  * FIXED: Simpler fallback scenarios with better error handling
//  */
// const getFallbackAIScenarios = async (dataType, analysisResults, userId = 1) => {
//     const simplePrompt = `Մենեջերական որոշումների աջակցության համակարգ: Ստեղծիր  ${dataType}  ոլորտի ռիսկային իրավիճակների կառավարման սցենարներ (3)  JSON array ֆորմատով։ Պատասխանիր միայն JSON array-ով, միանգամից վերադարձրու կոնկրետ վերլուծություն։ տուր առնվազն 3 սցենարային վերլուծություն, տարբեր կարեւորության`;
    
//     try {
//         const fallbackScenarios = await requestScenariosFromAI(simplePrompt, dataType, null, userId);
        
//         if (!fallbackScenarios || fallbackScenarios.length === 0) {
//             console.warn('⚠️ Fallback AI also returned empty, using hardcoded');
//             return getHardcodedFallbackScenarios(dataType, analysisResults);
//         }
        
//         const scenarios = Array.isArray(fallbackScenarios) ? fallbackScenarios : [fallbackScenarios];
//         return finalizeAIScenarios(scenarios);
        
//     } catch (error) {
//         console.error('❌ Fallback AI սցենարների սխալ:', error);
//         return getHardcodedFallbackScenarios(dataType, analysisResults);
//     }
// };

// /**
//  * UNCHANGED: Hardcoded fallback scenarios
//  */
// const getHardcodedFallbackScenarios = (dataType, analysisResults) => {
//     const dataTypeTranslations = {
//         demographic: 'դեմոգրաֆիական',
//         healthcare: 'առողջապահական',
//         quality_of_life: 'կյանքի որակի',
//         educational: 'կրթական'
//     };

//     return [{
//         title: `${dataTypeTranslations[dataType] || dataType} ոլորտի ընդհանուր բարելավման ծրագիր`,
//         description: 'Տվյալների վերլուծության հիման վրա առաջարկվող հիմնական մոտեցումներ և բարելավումներ',
//         category: 'general_improvement',
//         priority: 'medium',
//         priorityText: 'ՄԻՋԻՆ ԿԱՐԵՎՈՐՈՒԹՅՈՒՆ',
//         timeframe: 'medium_term',
//         timeframeText: 'Միջնաժամկետ (6-18 ամիս)',
//         actions: [
//             'Տվյալների հավաքման մեթոդաբանության բարելավում',
//             'Հետազոտական գործունեության իրականացում',
//             'Շահառուների հետ խորհրդակցական գործընթացների կազմակերպում',
//             'Փուլային իրականացման ծրագծի մշակում',
//             'Մոնիթորինգի և գնահատման համակարգի ստեղծում'
//         ],
//         indicators: ['ծրագրերի իրականացման մակարդակ', 'շահառուների գոհունակություն', 'ծառայությունների որակ'],
//         risks: ['բյուջետային սահմանափակումներ', 'փոփոխություններին հակառակություն', 'ռեսուրսային պակաս'],
//         estimatedBudget: '500,000 - 1,000,000 դրամ',
//         expectedOutcomes: [
//             'Ծառայությունների որակի բարելավում',
//             'Շահառուների գոհունակության աճ',
//             'Համակարգային արդյունավետության բարձրացում'
//         ],
//         confidence: 70,
//         feasibilityScore: 80,
//         confidenceText: '70% վստահություն',
//         feasibilityText: '80% իրականացվելիություն',
//         id: generateScenarioId(),
//         displayOrder: 1,
//         generatedBy: 'fallback',
//         metadata: {
//             generatedAt: new Date().toISOString(),
//             dataType: dataType,
//             fallback: true,
//             aiGenerated: false,
//             version: '2.0'
//         }
//     }];
// };

// // Export test functions for debugging
// export const testMultipleScenariosExtraction = () => {
//     const multipleScenarios = `[
//   {
//     "title": "Կյանքի որակի բարելավման ծրագիր",
//     "description": "Սոցիալական և տնտեսական բարելավումների համակարգ",
//     "category": "quality_improvement",
//     "priority": "high",
//     "timeframe": "medium_term",
//     "actions": ["Սոցիալական ծրագրերի մշակում", "Տնտեսական աջակցության ապահովում"],
//     "indicators": ["գոհունակության մակարդակ", "եկամտի փոփոխություն"],
//     "risks": ["բյուջետային սահմանափակումներ"],
//     "estimatedBudget": "3-5 միլիոն դրամ",
//     "expectedOutcomes": ["կյանքի որակի բարելավում"]
//   }
// ]`;
    
//     console.log('🧪 Testing multiple scenarios extraction...');
//     const scenarios = extractJSONFromResponse(multipleScenarios);
//     console.log(`🎉 Test result: extracted ${scenarios.length} scenarios`);
//     return scenarios;
// };