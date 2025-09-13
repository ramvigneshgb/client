import React, { useState } from 'react';
import './InputForm.css';

const InputForm = ({ onGenerate }) => { // Changed prop name
    const [inputType, setInputType] = useState('text');
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let body;
        if (inputType === 'text') {
            body = new FormData();
            body.append('text', text);
        } else if (inputType === 'youtube') {
            body = new FormData();
            body.append('url', url);
        } else if (inputType === 'document') {
            body = new FormData();
            body.append('document', file);
        }
        onGenerate(null, body); // Call the main function in App.js
    };

    return (
        <div className="input-form-container">
            <div className="input-tabs">
                <button onClick={() => setInputType('text')} className={inputType === 'text' ? 'active' : ''}>Text</button>
                <button onClick={() => setInputType('youtube')} className={inputType === 'youtube' ? 'active' : ''}>YouTube</button>
                <button onClick={() => setInputType('document')} className={inputType === 'document' ? 'active' : ''}>Document</button>
            </div>
            <form onSubmit={handleSubmit} className="form-body">
                {inputType === 'text' && <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter a topic..."></textarea>}
                {inputType === 'youtube' && <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />}
                {inputType === 'document' && <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf" />}
                <button type="submit">Generate</button>
            </form>
        </div>
    );
};
export default InputForm;