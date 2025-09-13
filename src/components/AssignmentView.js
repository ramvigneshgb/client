import React from 'react';
import './AssignmentView.css'; // We'll create this file next

const AssignmentView = ({ content, isLoading }) => {
    if (isLoading) return <div className="assignment-view"><h2>Generating your assignment...</h2></div>;
    if (!content) return <div className="assignment-view"><h2>Your assignment will appear here after you generate a lesson.</h2></div>;

    return (
        <div className="assignment-view">
            <h2>Assignment</h2>
            <p className="assignment-text">{content}</p>
        </div>
    );
};
export default AssignmentView;