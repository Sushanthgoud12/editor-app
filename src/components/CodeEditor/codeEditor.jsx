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
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 796);

  // Split screen state
  const [isResizing, setIsResizing] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const mainContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 796);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setIsPreviewActive(true);
  };

  const handleClosePreview = () => {
    setIsPreviewActive(false);
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
    if (!isMobile) {
      const container = mainContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const clickPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Reset to 50/50 if we're close to that already
      if (Math.abs(splitPosition - 50) < 5) {
        if (clickPosition < 50) {
          setSplitPosition(30); // Favor editor
        } else {
          setSplitPosition(70); // Favor preview
        }
      } else {
        setSplitPosition(50); // Reset to middle
      }
    }
  }, [isMobile, splitPosition]);

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
        onDoubleClick={!isMobile ? handleDoubleClick : undefined}
      >
        <div 
          className={`editor-section ${isPreviewActive && isMobile ? 'hidden' : ''}`}
          style={!isMobile ? { width: `${splitPosition}%` } : undefined}
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
          {!isMobile && (
            <div 
              className="resizer"
              onMouseDown={startResizing}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setSplitPosition(50);
              }}
              style={{ touchAction: 'none' }}
            />
          )}
        </div>
        <div 
          className={`preview-section ${isPreviewActive ? 'active' : ''}`}
          style={!isMobile ? { width: `${100 - splitPosition}%` } : undefined}
        >
          <Preview 
            code={previewCode} 
            onClose={handleClosePreview}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;