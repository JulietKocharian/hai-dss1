// ===== ProjectStorageManager.js =====
// Полная система управления проектами в localStorage

/**
 * Класс для управления проектами в localStorage
 * Основан на анализе всех ваших компонентов фаз
 */
class ProjectStorageManager {
  constructor() {
    this.storageKey = 'user_projects';
  }

  // === БАЗОВЫЕ CRUD ОПЕРАЦИИ ===
  
  /**
   * Получить все проекты
   * @returns {Array} Массив проектов
   */
  getAllProjects() {
    try {
      const projects = localStorage.getItem(this.storageKey);
      return projects ? JSON.parse(projects) : [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  /**
   * Сохранить все проекты
   * @param {Array} projects - Массив проектов
   * @returns {boolean} Успех операции
   */
  saveAllProjects(projects) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Error saving projects:', error);
      return false;
    }
  }

  /**
   * Создать новый проект
   * @param {Object} initialData - Начальные данные проекта
   * @returns {Object} Созданный проект
   */
  createProject(initialData = {}) {
    const projects = this.getAllProjects();
    
    const newProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: initialData.name || 'Նոր նախագիծ',
      status: 'draft',
      type: initialData.type || 'market-analysis',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
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
              projectName: '',
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
              userId: parseInt(localStorage.getItem('userId')) || 1,
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
    };

    projects.push(newProject);
    this.saveAllProjects(projects);
    return newProject;
  }

  /**
   * Получить проект по ID
   * @param {string} projectId - ID проекта
   * @returns {Object|null} Проект или null
   */
  getProject(projectId) {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === projectId) || null;
  }

  /**
   * Обновить проект
   * @param {string} projectId - ID проекта
   * @param {Object} updates - Обновления
   * @returns {Object|null} Обновленный проект
   */
  updateProject(projectId, updates) {
    const projects = this.getAllProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        ...updates,
        lastModified: new Date().toISOString()
      };
      
      // Пересчитать метрики
      projects[projectIndex] = this.recalculateMetrics(projects[projectIndex]);
      
      this.saveAllProjects(projects);
      return projects[projectIndex];
    }
    return null;
  }

  // === СПЕЦИАЛЬНЫЕ МЕТОДЫ ДЛЯ КАЖДОЙ ФАЗЫ ===

  /**
   * Обновить данные Manager Phase
   * @param {string} projectId - ID проекта
   * @param {Object} managerData - Данные менеджерской фазы
   */
  updateManagerPhase(projectId, managerData) {
    const project = this.getProject(projectId);
    if (!project) return null;

    const updatedWorkflowData = {
      ...project.workflowData,
      phases: {
        ...project.workflowData.phases,
        manager: {
          completed: true,
          completedAt: new Date().toISOString(),
          data: {
            projectName: managerData.projectName,
            dataType: managerData.dataType,
            selectedCriteria: managerData.selectedCriteria,
            rawData: managerData.rawData,
            parsedData: managerData.parsedData || [],
            dataSource: managerData.dataSource || 'CSV Upload',
            dataRowCount: managerData.parsedData?.length || 0,
            dataColumnCount: managerData.parsedData?.length > 0 ? Object.keys(managerData.parsedData[0]).length : 0
          }
        }
      },
      completedPhases: [...new Set([...project.workflowData.completedPhases, 0])],
      currentPhase: 1 // Переход к Analyst Phase
    };

    return this.updateProject(projectId, {
      name: managerData.projectName, // Обновляем название проекта
      workflowData: updatedWorkflowData,
      status: 'in-progress'
    });
  }

  /**
   * Обновить данные Analyst Phase
   * @param {string} projectId - ID проекта  
   * @param {Object} analystData - Данные аналитической фазы
   */
  updateAnalystPhase(projectId, analystData) {
    const project = this.getProject(projectId);
    if (!project) return null;

    const updatedWorkflowData = {
      ...project.workflowData,
      phases: {
        ...project.workflowData.phases,
        analyst: {
          completed: true,
          completedAt: new Date().toISOString(),
          data: {
            qualityMetrics: analystData.qualityMetrics,
            analysisStatus: 'completed',
            analysisStartTime: analystData.analysisStartTime || new Date().toISOString(),
            analysisEndTime: new Date().toISOString(),
            dataPreview: analystData.dataPreview || [],
            syntheticDataGenerated: analystData.syntheticDataGenerated || false
          }
        }
      },
      completedPhases: [...new Set([...project.workflowData.completedPhases, 1])],
      currentPhase: 2 // Переход к Expert Phase
    };

    return this.updateProject(projectId, {
      workflowData: updatedWorkflowData,
      analysisData: {
        ...project.analysisData,
        analysisWorkspace: true // Активируем workspace
      }
    });
  }

  /**
   * Обновить данные Expert Phase
   * @param {string} projectId - ID проекта
   * @param {Object} expertData - Данные экспертной фазы
   */
  updateExpertPhase(projectId, expertData) {
    const project = this.getProject(projectId);
    if (!project) return null;

    const updatedWorkflowData = {
      ...project.workflowData,
      phases: {
        ...project.workflowData.phases,
        expert: {
          completed: true,
          completedAt: new Date().toISOString(),
          data: {
            fuzzyResults: expertData.fuzzyResults || {},
            clusterData: expertData.clusterData || {},
            scenarios: expertData.scenarios || [],
            expertSummary: expertData.expertSummary || {},
            processingSteps: expertData.processingSteps || [],
            userId: expertData.userId || parseInt(localStorage.getItem('userId')) || 1,
            contextData: expertData.contextData || {}
          }
        }
      },
      completedPhases: [...new Set([...project.workflowData.completedPhases, 2])],
      currentPhase: 3 // Переход к Decision Phase
    };

    return this.updateProject(projectId, {
      workflowData: updatedWorkflowData
    });
  }

  /**
   * Обновить данные Decision Phase
   * @param {string} projectId - ID проекта
   * @param {Object} decisionData - Данные фазы решений
   */
  updateDecisionPhase(projectId, decisionData) {
    const project = this.getProject(projectId);
    if (!project) return null;

    const updatedWorkflowData = {
      ...project.workflowData,
      phases: {
        ...project.workflowData.phases,
        decision: {
          completed: true,
          completedAt: new Date().toISOString(),
          data: {
            decisionMatrix: decisionData.decisionMatrix || {},
            finalRecommendations: decisionData.finalRecommendations || {},
            decisionSummary: decisionData.decisionSummary || {}
          }
        }
      },
      completedPhases: [...new Set([...project.workflowData.completedPhases, 3])],
      allPhasesCompleted: true
    };

    return this.updateProject(projectId, {
      workflowData: updatedWorkflowData,
      status: 'completed',
      analysisData: {
        ...project.analysisData,
        overallProgress: 100
      }
    });
  }

  /**
   * Обновить активный таб Analysis Workspace
   * @param {string} projectId - ID проекта
   * @param {string} activeTab - Активный таб
   * @param {Object} tabData - Данные таба
   */
  updateAnalysisWorkspace(projectId, activeTab, tabData = {}) {
    const project = this.getProject(projectId);
    if (!project) return null;

    const updatedAnalysisData = {
      ...project.analysisData,
      activeTab,
      tabsData: {
        ...project.analysisData.tabsData,
        [activeTab]: {
          ...project.analysisData.tabsData[activeTab],
          ...tabData,
          lastUpdated: new Date().toISOString()
        }
      }
    };

    return this.updateProject(projectId, {
      analysisData: updatedAnalysisData
    });
  }

  /**
   * Пересчитать метрики проекта
   * @param {Object} project - Проект
   * @returns {Object} Проект с обновленными метриками
   */
  recalculateMetrics(project) {
    const completedPhases = project.workflowData.completedPhases.length;
    
    // Расчет accuracy на основе завершенных фаз и качества данных
    let accuracy = completedPhases * 25; // Базовые 25% за каждую фазу
    
    // Дополнительные баллы из Analyst Phase
    if (project.workflowData.phases.analyst.completed) {
      const analystAccuracy = project.workflowData.phases.analyst.data.qualityMetrics.accuracy || 0;
      accuracy = Math.min(100, (accuracy + analystAccuracy) / 2);
    }

    // Расчет количества решений
    let decisions = 0;
    
    // Решения из Manager Phase (критерии)
    const managerCriteria = project.workflowData.phases.manager.data.selectedCriteria || {};
    Object.values(managerCriteria).forEach(criteria => {
      decisions += Object.values(criteria).filter(Boolean).length;
    });
    
    // Решения из Expert Phase (сценарии)
    decisions += project.workflowData.phases.expert.data.scenarios?.length || 0;
    
    // Решения из Decision Phase (альтернативы)
    decisions += project.workflowData.phases.decision.data.decisionMatrix.alternatives?.length || 0;

    return {
      ...project,
      accuracy: Math.round(accuracy),
      decisions
    };
  }

  /**
   * Удалить проект
   * @param {string} projectId - ID проекта
   * @returns {boolean} Успех операции
   */
  deleteProject(projectId) {
    const projects = this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    return this.saveAllProjects(filteredProjects);
  }

  /**
   * Получить проекты для отображения в списке (с сортировкой)
   * @returns {Array} Отсортированные проекты
   */
  getProjectsForDisplay() {
    const projects = this.getAllProjects()
      .map(project => this.recalculateMetrics(project)) // Пересчитываем метрики
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)); // Сортируем по дате

    return projects;
  }
}

const useProjectStorage = () => {
  const storage = new ProjectStorageManager();
  return {
    getAllProjects: () => storage.getProjectsForDisplay(),
    getProject: (id) => storage.getProject(id),
    createProject: (data) => storage.createProject(data),
    updateProject: (id, updates) => storage.updateProject(id, updates),
    deleteProject: (id) => storage.deleteProject(id),
    updateManagerPhase: (id, data) => storage.updateManagerPhase(id, data),
    updateAnalystPhase: (id, data) => storage.updateAnalystPhase(id, data),  
    updateExpertPhase: (id, data) => storage.updateExpertPhase(id, data),
    updateDecisionPhase: (id, data) => storage.updateDecisionPhase(id, data),
    updateAnalysisWorkspace: (id, tab, data) => storage.updateAnalysisWorkspace(id, tab, data)
  };
};
const debugLocalStorage = {
  showAllProjects: () => {
    const storage = new ProjectStorageManager();
    console.table(storage.getAllProjects());
  },
  showProject: (projectId) => {
    const storage = new ProjectStorageManager();
    console.log('Project:', storage.getProject(projectId));
  },
  clearAllProjects: () => {
    localStorage.removeItem('user_projects');
    console.log('All projects cleared');
  },
  createTestProject: () => {
    const storage = new ProjectStorageManager();
    const testProject = storage.createProject({
      name: 'Թեստային նախագիծ',
      type: 'market-analysis'
    });
    console.log('Test project created:', testProject);
    return testProject.id;
  }
};
if (typeof window !== 'undefined') {
  window.debugLS = debugLocalStorage;
}
export { ProjectStorageManager, useProjectStorage, debugLocalStorage };
export default ProjectStorageManager;