import React, { useState, useEffect } from 'react';
import './LearningBoard.css';

const LearningBoard = ({ isLoading, content, error }) => {
    // -1 represents the flowchart view, 0 and above are the slides
    const [currentSlide, setCurrentSlide] = useState(-1);

    // When new content arrives, always start at the flowchart view
    useEffect(() => {
        setCurrentSlide(-1);
    }, [content]);

    if (isLoading) return <div className="learning-board"><h2>Generating your lesson...</h2></div>;
    if (error) return <div className="learning-board error"><h2>Error</h2><p>{error}</p></div>;
    if (!content || !content.lesson || !content.lesson.flowchart || !content.lesson.slides) {
        return <div className="learning-board"><h2>Your lesson will appear here.</h2></div>;
    }

    const { flowchart, slides } = content.lesson;

    const goToNext = () => {
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
    };

    const goToPrev = () => {
        setCurrentSlide(prev => Math.max(prev - 1, -1));
    };

    // Conditional rendering based on the current view
    if (currentSlide === -1) {
        // --- This is the new Flowchart View ---
        return (
            <div className="learning-board">
                <div className="flowchart-content">
                    <h3>Lesson Flowchart</h3>
                    <p>Here's what we'll cover in this lesson:</p>
                    <ul className="flowchart-list">
                        {flowchart.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
                <div className="slide-navigation">
                    {/* The only option from the flowchart is to start the lesson */}
                    <button onClick={goToNext} className="start-lesson-btn">
                        Start Lesson &rarr;
                    </button>
                </div>
            </div>
        );
    }

    // --- This is the regular Slide View ---
    const slide = slides[currentSlide];
    return (
        <div className="learning-board">
            <div className="slide-content">
                <h3>{slide.title}</h3>
                <p>{slide.content}</p>
            </div>
            <div className="slide-navigation">
                <button onClick={goToPrev}>
                    &larr; {currentSlide === 0 ? 'Flowchart' : 'Previous'}
                </button>
                <span>Slide {currentSlide + 1} of {slides.length}</span>
                <button onClick={goToNext} disabled={currentSlide === slides.length - 1}>
                    Next &rarr;
                </button>
            </div>
        </div>
    );
};

export default LearningBoard;