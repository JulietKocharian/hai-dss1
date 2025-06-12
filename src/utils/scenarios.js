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