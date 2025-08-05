export const STATIC_PROJECTS = [
    {
        id: 'static_1',
        name: 'Շուկայի Վերլուծություն 2024',
        status: 'completed',
        type: 'market-analysis',
        createdAt: '2024-11-15T00:00:00.000Z',
        lastModified: '2024-12-10T00:00:00.000Z',
        accuracy: 94.2,
        decisions: 15,
        
        workflowData: {
            currentPhase: 3,
            completedPhases: [0, 1, 2, 3],
            allPhasesCompleted: true,
            phases: {
                manager: {
                    completed: true,
                    completedAt: '2024-11-16T10:00:00.000Z',
                    data: {
                        projectName: 'Շուկայի Վերլուծություն 2024',
                        dataType: ['market-data', 'financial'],
                        selectedCriteria: {
                            financial: { revenue: true, growth: true, profit: true },
                            market: { size: true, competition: true, trends: true }
                        },
                        rawData: 'tech_companies_market_data.csv',
                        parsedData: [],
                        dataSource: 'CSV Upload',
                        dataRowCount: 150,
                        dataColumnCount: 8
                    }
                },
                analyst: {
                    completed: true,
                    completedAt: '2024-11-20T14:30:00.000Z',
                    data: {
                        qualityMetrics: {
                            completeness: 92,
                            accuracy: 94,
                            missingValues: 8,
                            outliers: 3,
                            duplicates: 0
                        },
                        analysisStatus: 'completed',
                        analysisStartTime: '2024-11-20T14:00:00.000Z',
                        analysisEndTime: '2024-11-20T14:30:00.000Z',
                        dataPreview: [],
                        syntheticDataGenerated: true
                    }
                },
                expert: {
                    completed: true,
                    completedAt: '2024-12-01T16:45:00.000Z',
                    data: {
                        fuzzyResults: {
                            techSector: { confidence: 0.89, risk: 0.23 },
                            marketGrowth: { confidence: 0.76, risk: 0.34 }
                        },
                        clusterData: {
                            clusters: 4,
                            quality: 0.87
                        },
                        scenarios: [
                            { name: 'Օպտիմիստական', probability: 0.3 },
                            { name: 'Ռեալիստական', probability: 0.5 },
                            { name: 'Պեսիմիստական', probability: 0.2 }
                        ],
                        expertSummary: {
                            originalDataset: 150,
                            syntheticDataset: 300,
                            totalProcessed: 450,
                            analysisComplexity: 'Բարդ',
                            estimatedTime: '15-20 վայրկյան'
                        },
                        processingSteps: ['data_validation', 'fuzzy_analysis', 'clustering', 'scenario_generation'],
                        userId: 1,
                        contextData: { industry: 'technology', region: 'armenia' }
                    }
                },
                decision: {
                    completed: true,
                    completedAt: '2024-12-10T18:20:00.000Z',
                    data: {
                        decisionMatrix: {
                            alternatives: ['Company A', 'Company B', 'Company C'],
                            criteria: ['Ֆինանսական կայունություն', 'Շուկայական դիրք', 'Տեխնոլոգիական նորարարություն'],
                            scores: [[0.8, 0.7, 0.9], [0.6, 0.9, 0.7], [0.9, 0.6, 0.8]],
                            metadata: { method: 'AHP', consistency: 0.05 }
                        },
                        finalRecommendations: {
                            primary: { alternative: 'Company A', score: 0.82, confidence: 0.94 },
                            secondary: { alternative: 'Company C', score: 0.78, confidence: 0.89 },
                            risks: ['Շուկայական անկայունություն', 'Տեխնոլոգիական փոփոխություններ'],
                            opportunities: ['Նոր շուկաներ', 'Ստրատեգիական գործընկերություններ'],
                            timeline: { implementation: '3-6 ամիս', evaluation: '1 տարի' },
                            kpis: ['ROI', 'Շուկայական բաժին', 'Հաճախորդների գոհունակություն'],
                            metadata: { analysisDate: '2024-12-10', analyst: 'AI System' }
                        },
                        decisionSummary: {
                            dataPoints: 450,
                            criteriaCount: 3,
                            complexityLevel: 'Բարդ',
                            estimatedTime: '15-20 վայրկյան',
                            confidenceLevel: '94%',
                            contextValid: true
                        }
                    }
                }
            }
        },
        
        analysisData: {
            analysisWorkspace: true,
            activeTab: 'results',
            overallProgress: 100,
            tabsData: {
                analysis: { completed: true, lastUpdated: '2024-11-20T14:30:00.000Z' },
                synthetic: { generated: true, lastUpdated: '2024-11-22T10:15:00.000Z' },
                fuzzy: { processed: true, lastUpdated: '2024-12-01T16:45:00.000Z' },
                clustering: { completed: true, lastUpdated: '2024-12-01T16:45:00.000Z' },
                scenarios: { generated: true, lastUpdated: '2024-12-01T16:45:00.000Z' },
                results: { finalized: true, lastUpdated: '2024-12-10T18:20:00.000Z' }
            }
        },
        
        settings: {
            isPrivate: false,
            shareSettings: {
                allowComments: true,
                allowDownload: true
            },
            notifications: true
        }
    },
    {
        id: 'static_2',
        name: 'Ներդրումային Ռազմավարություն',
        status: 'in-progress',
        type: 'investment',
        createdAt: '2024-12-01T00:00:00.000Z',
        lastModified: '2024-12-15T00:00:00.000Z',
        accuracy: 87.5,
        decisions: 8,
        
        workflowData: {
            currentPhase: 2,
            completedPhases: [0, 1],
            allPhasesCompleted: false,
            phases: {
                manager: {
                    completed: true,
                    completedAt: '2024-12-02T09:30:00.000Z',
                    data: {
                        projectName: 'Ներդրումային Ռազմավարություն',
                        dataType: ['investment', 'risk-analysis'],
                        selectedCriteria: {
                            financial: { roi: true, risk: true, liquidity: true },
                            strategic: { alignment: true, timeline: true }
                        },
                        rawData: 'investment_opportunities.csv',
                        parsedData: [],
                        dataSource: 'CSV Upload',
                        dataRowCount: 75,
                        dataColumnCount: 12
                    }
                },
                analyst: {
                    completed: true,
                    completedAt: '2024-12-05T11:15:00.000Z',
                    data: {
                        qualityMetrics: {
                            completeness: 88,
                            accuracy: 87,
                            missingValues: 12,
                            outliers: 5,
                            duplicates: 1
                        },
                        analysisStatus: 'completed',
                        analysisStartTime: '2024-12-05T10:45:00.000Z',
                        analysisEndTime: '2024-12-05T11:15:00.000Z',
                        dataPreview: [],
                        syntheticDataGenerated: false
                    }
                },
                expert: {
                    completed: false,
                    completedAt: null,
                    data: {
                        fuzzyResults: {},
                        clusterData: {},
                        scenarios: [],
                        expertSummary: {
                            originalDataset: 75,
                            syntheticDataset: 0,
                            totalProcessed: 75,
                            analysisComplexity: 'Միջին',
                            estimatedTime: '8-12 վայրկյան'
                        },
                        processingSteps: [],
                        userId: 1,
                        contextData: {}
                    }
                },
                decision: {
                    completed: false,
                    completedAt: null,
                    data: {
                        decisionMatrix: {
                            alternatives: [],
                            criteria: [],
                            scores: [],
                            metadata: {}
                        },
                        finalRecommendations: {
                            primary: {},
                            secondary: {},
                            risks: [],
                            opportunities: [],
                            timeline: {},
                            kpis: [],
                            metadata: {}
                        },
                        decisionSummary: {
                            dataPoints: 0,
                            criteriaCount: 0,
                            complexityLevel: 'Միջին',
                            estimatedTime: '8-12 վայրկյան',
                            confidenceLevel: '75%',
                            contextValid: false
                        }
                    }
                }
            }
        },
        
        analysisData: {
            analysisWorkspace: true,
            activeTab: 'analysis',
            overallProgress: 50,
            tabsData: {
                analysis: { completed: true, lastUpdated: '2024-12-05T11:15:00.000Z' },
                synthetic: {},
                fuzzy: {},
                clustering: {},
                scenarios: {},
                results: {}
            }
        },
        
        settings: {
            isPrivate: false,
            shareSettings: {
                allowComments: true,
                allowDownload: false
            },
            notifications: true
        }
    },
    {
        id: 'static_3',
        name: 'Մրցակցային Վերլուծություն',
        status: 'draft',
        type: 'competitive',
        createdAt: '2024-12-05T00:00:00.000Z',
        lastModified: '2024-12-14T00:00:00.000Z',
        accuracy: 0,
        decisions: 0,
        
        workflowData: {
            currentPhase: 0,
            completedPhases: [],
            allPhasesCompleted: false,
            phases: {
                manager: {
                    completed: false,
                    completedAt: null,
                    data: {
                        projectName: 'Մրցակցային Վերլուծություն',
                        dataType: [],
                        selectedCriteria: {},
                        rawData: '',
                        parsedData: [],
                        dataSource: '',
                        dataRowCount: 0,
                        dataColumnCount: 0
                    }
                },
                analyst: {
                    completed: false,
                    completedAt: null,
                    data: {
                        qualityMetrics: {
                            completeness: 0,
                            accuracy: 0,
                            missingValues: 0,
                            outliers: 0,
                            duplicates: 0
                        },
                        analysisStatus: 'pending',
                        analysisStartTime: null,
                        analysisEndTime: null,
                        dataPreview: [],
                        syntheticDataGenerated: false
                    }
                },
                expert: {
                    completed: false,
                    completedAt: null,
                    data: {
                        fuzzyResults: {},
                        clusterData: {},
                        scenarios: [],
                        expertSummary: {
                            originalDataset: 0,
                            syntheticDataset: 0,
                            totalProcessed: 0,
                            analysisComplexity: 'Պարզ',
                            estimatedTime: '2-5 վայրկյան'
                        },
                        processingSteps: [],
                        userId: 1,
                        contextData: {}
                    }
                },
                decision: {
                    completed: false,
                    completedAt: null,
                    data: {
                        decisionMatrix: {
                            alternatives: [],
                            criteria: [],
                            scores: [],
                            metadata: {}
                        },
                        finalRecommendations: {
                            primary: {},
                            secondary: {},
                            risks: [],
                            opportunities: [],
                            timeline: {},
                            kpis: [],
                            metadata: {}
                        },
                        decisionSummary: {
                            dataPoints: 0,
                            criteriaCount: 0,
                            complexityLevel: 'Պարզ',
                            estimatedTime: '2-5 վայրկյան',
                            confidenceLevel: '75%',
                            contextValid: false
                        }
                    }
                }
            }
        },
        
        analysisData: {
            analysisWorkspace: false,
            activeTab: 'analysis',
            overallProgress: 0,
            tabsData: {
                analysis: {},
                synthetic: {},
                fuzzy: {},
                clustering: {},
                scenarios: {},
                results: {}
            }
        },
        
        settings: {
            isPrivate: false,
            shareSettings: {
                allowComments: true,
                allowDownload: false
            },
            notifications: true
        }
    },
    {
        id: 'static_4',
        name: 'Ֆինանսական Կանխատեսում',
        status: 'completed',
        type: 'financial',
        createdAt: '2024-10-20T00:00:00.000Z',
        lastModified: '2024-11-30T00:00:00.000Z',
        accuracy: 96.8,
        decisions: 23,
        
        workflowData: {
            currentPhase: 3,
            completedPhases: [0, 1, 2, 3],
            allPhasesCompleted: true,
            phases: {
                manager: {
                    completed: true,
                    completedAt: '2024-10-21T08:15:00.000Z',
                    data: {
                        projectName: 'Ֆինանսական Կանխատեսում',
                        dataType: ['financial', 'forecasting', 'budget'],
                        selectedCriteria: {
                            financial: { revenue: true, expenses: true, profit: true, cashflow: true },
                            operational: { efficiency: true, productivity: true },
                            strategic: { growth: true, risk: true }
                        },
                        rawData: 'financial_historical_data.csv',
                        parsedData: [],
                        dataSource: 'CSV Upload',
                        dataRowCount: 360,
                        dataColumnCount: 15
                    }
                },
                analyst: {
                    completed: true,
                    completedAt: '2024-10-25T13:45:00.000Z',
                    data: {
                        qualityMetrics: {
                            completeness: 97,
                            accuracy: 96,
                            missingValues: 3,
                            outliers: 2,
                            duplicates: 0
                        },
                        analysisStatus: 'completed',
                        analysisStartTime: '2024-10-25T13:00:00.000Z',
                        analysisEndTime: '2024-10-25T13:45:00.000Z',
                        dataPreview: [],
                        syntheticDataGenerated: true
                    }
                },
                expert: {
                    completed: true,
                    completedAt: '2024-11-10T15:30:00.000Z',
                    data: {
                        fuzzyResults: {
                            revenueGrowth: { confidence: 0.94, risk: 0.18 },
                            marketConditions: { confidence: 0.87, risk: 0.25 },
                            operationalEfficiency: { confidence: 0.91, risk: 0.15 }
                        },
                        clusterData: {
                            clusters: 3,
                            quality: 0.92
                        },
                        scenarios: [
                            { name: 'Կայուն աճ', probability: 0.4 },
                            { name: 'Չափավոր աճ', probability: 0.45 },
                            { name: 'Դանդաղ աճ', probability: 0.15 }
                        ],
                        expertSummary: {
                            originalDataset: 360,
                            syntheticDataset: 720,
                            totalProcessed: 1080,
                            analysisComplexity: 'Շատ բարդ',
                            estimatedTime: '25-30 վայրկյան'
                        },
                        processingSteps: ['data_validation', 'trend_analysis', 'fuzzy_modeling', 'clustering', 'scenario_planning'],
                        userId: 1,
                        contextData: { 
                            industry: 'financial_services', 
                            region: 'armenia',
                            period: '2024_budget_planning'
                        }
                    }
                },
                decision: {
                    completed: true,
                    completedAt: '2024-11-30T17:00:00.000Z',
                    data: {
                        decisionMatrix: {
                            alternatives: ['Կառուցողական ռազմավարություն', 'Պահպանողական ռազմավարություն', 'Ագրեսիվ ռազմավարություն'],
                            criteria: ['Ֆինանսական ռիսկ', 'Աճի ներուժ', 'Շուկայական կայունություն', 'Օպերացիոն արդյունավետություն'],
                            scores: [
                                [0.85, 0.9, 0.8, 0.88],
                                [0.95, 0.6, 0.9, 0.75],
                                [0.65, 0.95, 0.7, 0.85]
                            ],
                            metadata: { method: 'TOPSIS', consistency: 0.03 }
                        },
                        finalRecommendations: {
                            primary: { 
                                alternative: 'Կառուցողական ռազմավարություն', 
                                score: 0.86, 
                                confidence: 0.97 
                            },
                            secondary: { 
                                alternative: 'Ագրեսիվ ռազմավարություն', 
                                score: 0.79, 
                                confidence: 0.84 
                            },
                            risks: [
                                'Գնաճի ազդեցություն', 
                                'Արտարժույթի տատանումներ', 
                                'Շուկայական անորոշություն'
                            ],
                            opportunities: [
                                'Նոր ապրանքային գծեր', 
                                'Դիգիտալ տրանսֆորմացիա', 
                                'Գործընկերությունների ընդլայնում'
                            ],
                            timeline: { 
                                implementation: '2-4 ամիս', 
                                evaluation: '6 ամիս',
                                fullImplementation: '12 ամիս'
                            },
                            kpis: [
                                'Եկամուտների աճ (%)', 
                                'Շահույթի մարժա (%)', 
                                'Դրամական հոսքեր',
                                'ROI', 
                                'Օպերացիոն արդյունավետություն'
                            ],
                            metadata: { 
                                analysisDate: '2024-11-30', 
                                analyst: 'AI Financial System',
                                budgetPeriod: '2025',
                                confidence: 'Very High'
                            }
                        },
                        decisionSummary: {
                            dataPoints: 1080,
                            criteriaCount: 4,
                            complexityLevel: 'Շատ բարդ',
                            estimatedTime: '25-30 վայրկյան',
                            confidenceLevel: '97%',
                            contextValid: true
                        }
                    }
                }
            }
        },
        
        analysisData: {
            analysisWorkspace: true,
            activeTab: 'results',
            overallProgress: 100,
            tabsData: {
                analysis: { completed: true, lastUpdated: '2024-10-25T13:45:00.000Z' },
                synthetic: { generated: true, lastUpdated: '2024-10-28T09:20:00.000Z' },
                fuzzy: { processed: true, lastUpdated: '2024-11-10T15:30:00.000Z' },
                clustering: { completed: true, lastUpdated: '2024-11-10T15:30:00.000Z' },
                scenarios: { generated: true, lastUpdated: '2024-11-10T15:30:00.000Z' },
                results: { finalized: true, lastUpdated: '2024-11-30T17:00:00.000Z' }
            }
        },
        
        settings: {
            isPrivate: false,
            shareSettings: {
                allowComments: true,
                allowDownload: true
            },
            notifications: false
        }
    }
];