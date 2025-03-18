import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from './Editor/index';
import Tabs from './Tabs/index';
import Toolbar from './Toolbar/index';
import Preview from './Preview/index';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import './codeEditor.css';

const defaultHtml = `<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    Your code goes here
  </body>
</html>`;

const defaultCss=`@import url('https://fonts.googleapis.com/css2?family=Bree+Serif&family=Caveat:wght@400;700&family=Lobster&family=Monoton&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display+SC:ital,wght@0,400;0,700;1,700&family=Playfair+Display:ital,wght@0,400;0,700;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&family=Source+Sans+Pro:ital,wght@0,400;0,700;1,700&family=Work+Sans:ital,wght@0,400;0,700;1,700&display=swap');`

const CodeEditor = () => {
  const [activeTab, setActiveTab] = useState('html');
  const [code, setCode] = useState({
    html: loadFromLocalStorage('html') || defaultHtml,
    css: loadFromLocalStorage('css') || defaultCss,
    js: loadFromLocalStorage('js') || ''
  });
  const [previewCode, setPreviewCode] = useState({
    html: defaultHtml,
    css: '',
    js: ''
  });

  // Split screen state
  const [isResizing, setIsResizing] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const mainContainerRef = useRef(null);

  const handleCodeChange = (value) => {
    setCode(prevCode => ({
      ...prevCode,
      [activeTab]: value
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleRun = () => {
    setPreviewCode(code);
  };

  const handleSave = () => {
    Object.entries(code).forEach(([key, value]) => {
      saveToLocalStorage(key, value);
    });
    alert('Code saved successfully!');
  };

  const handleReset = () => {
    const resetCode = {
      html: defaultHtml,
      css: '',
      js: ''
    };
    setCode(resetCode);
    setPreviewCode(resetCode);
    ['html', 'css', 'js'].forEach(key => localStorage.removeItem(key));
  };

  // Split screen handlers
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.classList.add('resizing');
    mainContainerRef.current?.classList.add('resizing');
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.classList.remove('resizing');
    mainContainerRef.current?.classList.remove('resizing');
  }, []);

  const handleResize = useCallback((e) => {
    if (!isResizing || !mainContainerRef.current) return;

    const container = mainContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Limit the resizer between 20% and 80% of the container width
    if (newPosition >= 20 && newPosition <= 80) {
      requestAnimationFrame(() => {
        setSplitPosition(newPosition);
      });
    }
  }, [isResizing]);

  const handleDoubleClick = useCallback((e) => {
    if (e.target === mainContainerRef.current) {
      startResizing(e);
    }
  }, [startResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', stopResizing);
      window.addEventListener('mouseleave', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('mouseleave', stopResizing);
    };
  }, [isResizing, handleResize, stopResizing]);

  // Update preview when code changes
  useEffect(() => {
    setPreviewCode(code);
  }, [code]);

  return (
    <div className="code-editor">
      <div 
        className="main-container" 
        ref={mainContainerRef}
        onDoubleClick={handleDoubleClick}
      >
        <div 
          className="editor-section"
          style={{ width: `${splitPosition}%` }}
        >
          <Tabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            onRun={handleRun}
          />
          <div className="editor-container">
            <Editor
              value={code[activeTab]}
              language={activeTab}
              onChange={handleCodeChange}
            />
          </div>
          <Toolbar
            code={code}
            onSave={handleSave}
            onReset={handleReset}
          />
          <div 
            className="resizer"
            onMouseDown={startResizing}
            style={{ touchAction: 'none' }}
          />
        </div>
        <div 
          className="preview-section"
          style={{ width: `${100 - splitPosition}%` }}
        >
          <Preview code={previewCode} />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;