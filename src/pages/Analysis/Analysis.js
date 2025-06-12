// src/Analysis.js
// Հիմնական Analysis բաղադրիչ - ամբողջ հավելվածի մուտքակետ

import React from 'react';
import ManagerPhase from './../../components/WorkflowPhases/ManagerPhase';
import AnalystPhase from './../../components/WorkflowPhases/AnalystPhase';
import ExpertPhase from './../../components/WorkflowPhases/ExpertPhase';
import AnalysisWorkspace from './../../components/AnalysisWorkspace/AnalysisWorkspace';
const Analysis = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4" style={{ paddingTop: 100 }}
        >
            <div className="w-full mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <ManagerPhase />
                    <AnalystPhase />
                    <ExpertPhase />
                </div>
                <AnalysisWorkspace />
            </div>
        </div>
    );
};

export default Analysis;