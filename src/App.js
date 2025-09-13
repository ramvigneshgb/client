import React, { useState, useRef } from 'react';
import './App.css';
import Mascot from './components/Mascot';
import InputForm from './components/InputForm';
import LearningBoard from './components/LearningBoard';
import CameraMonitor from './components/CameraMonitor';
import Notification from './components/Notification';
import LeftNav from './components/LeftNav';
import QuizView from './components/QuizView';
import AssignmentView from './components/AssignmentView';
import AnalyseView from './components/AnalyseView';

// Function to play a simple beep sound
const playAlertSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [exp, setExp] = useState(0);
  const [activeView, setActiveView] = useState('board');

  const [lessonContent, setLessonContent] = useState(null);
  const [quizContent, setQuizContent] = useState(null);
  const [assignmentContent, setAssignmentContent] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const rawContentText = useRef('');

  const handleGenerateAll = async (endpoint, body) => {
      setIsLoading(true);
      setError('');
      setLessonContent(null);
      setQuizContent(null);
      setAssignmentContent(null);
      setAnalysisResult(null);

      try {
          const response = await fetch(`http://localhost:3001/generate-all-content`, {
              method: 'POST',
              body: body,
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to generate content');
          }
          
          const data = await response.json();
          setLessonContent(data); 
          setQuizContent(data.quiz);
          setAssignmentContent(data.assignment);
          rawContentText.current = data.lesson.lesson ? data.lesson.map(s => s.content).join(' ') : '';

      } catch (err) {
          setError(err.message);
      } finally {
          setIsLoading(false);
      }
  };

  const handleNavClick = async (view) => {
    setActiveView(view);
    // ... analysis logic
  };

  const clearNotification = () => {
      setTimeout(() => setNotification(''), 3000);
  };

  const handleAttentionAlert = (type) => {
      if (type === 'distracted') {
          setNotification('Psst... Are you still there? Focus up!');
          playAlertSound();
      } else if (type === 'stressed') {
          setNotification('Looking a little stressed! How about a quick break?');
          playAlertSound();
      } else if (type === 'focused') {
          setNotification('Great focus! You earned 1 EXP!');
          // --- THIS IS THE FIX ---
          // We are now using the setExp function to add points.
          setExp(prevExp => prevExp + 1);
          // --- END OF FIX ---
      }
      clearNotification();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Your AI Study Buddy</h1>
        <p>Experience Points: {exp}</p>
      </header>
      <div className="app-body">
        <div className="nav-column">
          <LeftNav activeView={activeView} onNavClick={handleNavClick} />
        </div>
        <div className="content-column">
          {activeView === 'board' && (
            <>
              <LearningBoard isLoading={isLoading} content={lessonContent} error={error} />
              <InputForm onGenerate={handleGenerateAll} />
            </>
          )}
          {activeView === 'quiz' && <QuizView content={quizContent} isLoading={isLoading} />}
          {activeView === 'assignment' && <AssignmentView content={assignmentContent} isLoading={isLoading} />}
          {activeView === 'analyse' && <AnalyseView analysis={analysisResult} isLoading={isLoading} />}
        </div>
        <div className="camera-column">
          <CameraMonitor onAlert={handleAttentionAlert} />
        </div>
      </div>
      <Notification message={notification} />
      <Mascot />
    </div>
  );
}
export default App;