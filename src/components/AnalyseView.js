import React from 'react';
import './AnalyseView.css'; // We will create this CSS file next

const AnalyseView = ({ analysis, isLoading }) => {
    if (isLoading) {
        return (
            <div className="analyse-view">
                <h2>Analysing...</h2>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="analyse-view">
                <h2>Analysis</h2>
                <p>Generate a lesson first, then the analysis of the core concepts will appear here.</p>
            </div>
        );
    }

    return (
        <div className="analyse-view">
            <h2>Content Analysis</h2>
            <p className="intro-text">Here are the core concepts from the material and potential areas to focus on:</p>
            {analysis.map((item, index) => (
                <div key={index} className="analysis-card">
                    <h3>{index + 1}. {item.concept}</h3>
                    <p><strong>Potential Difficulty:</strong> {item.potentialDifficulty}</p>
                </div>
            ))}
        </div>
    );
};

export default AnalyseView;