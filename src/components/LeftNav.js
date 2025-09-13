import React from 'react';
import './LeftNav.css';

// The component now accepts props to handle state
const LeftNav = ({ activeView, onNavClick }) => {
    return (
        <div className="left-nav">
            <button 
                onClick={() => onNavClick('board')} 
                className={`nav-button ${activeView === 'board' ? 'active' : ''}`}
            >
                Learning Board
            </button>
            <button 
                onClick={() => onNavClick('quiz')} 
                className={`nav-button ${activeView === 'quiz' ? 'active' : ''}`}
            >
                Quiz
            </button>
            <button 
                onClick={() => onNavClick('assignment')} 
                className={`nav-button ${activeView === 'assignment' ? 'active' : ''}`}
            >
                Assignment
            </button>
            <button 
                onClick={() => onNavClick('analyse')} 
                className={`nav-button ${activeView === 'analyse' ? 'active' : ''}`}
            >
                Analyse
            </button>
        </div>
    );
};

export default LeftNav;