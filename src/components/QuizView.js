import React, { useState, useEffect } from 'react';
import './QuizView.css'; // We'll create this file next

const QuizView = ({ content, isLoading }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Reset the quiz when new content arrives
    useEffect(() => {
        setAnswers({});
        setSubmitted(false);
    }, [content]);

    if (isLoading) return <div className="quiz-view"><h2>Generating your quiz...</h2></div>;
    if (!content) return <div className="quiz-view"><h2>Your quiz will appear here after you generate a lesson.</h2></div>;
    
    const handleAnswerChange = (qIndex, option) => {
        setAnswers({ ...answers, [qIndex]: option });
    };

    return (
        <div className="quiz-view">
            <h2>Quiz</h2>
            {content.map((q, qIndex) => (
                <div key={qIndex} className="quiz-question-card">
                    <p><strong>{qIndex + 1}. {q.question}</strong></p>
                    {q.options.map((option, oIndex) => {
                        let className = "quiz-option";
                        if (submitted) {
                            if (option === q.answer) className += " correct";
                            else if (answers[qIndex] === option) className += " incorrect";
                        }
                        return (
                            <label key={oIndex} className={className}>
                                <input type="radio" name={`q-${qIndex}`} value={option} onChange={() => handleAnswerChange(qIndex, option)} disabled={submitted} />
                                {option}
                            </label>
                        );
                    })}
                </div>
            ))}
            {!submitted && <button onClick={() => setSubmitted(true)} className="submit-btn">Submit Quiz</button>}
        </div>
    );
};
export default QuizView;