import React, { useState, useRef, useEffect } from 'react';
import Editor from './Editor';
import Tabs from './Tabs';
import Toolbar from './Toolbar';
import Preview from './Preview';
import { useResize } from './hooks/useResize';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useMobile } from './hooks/useMobile';
import { DEFAULT_CODE } from './utils/constants';
import './styles/codeEditor.css';

const CodeEditor = () => {
  const [activeTab, setActiveTab] = useState('html');
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const mainContainerRef = useRef(null);

  const isMobile = useMobile();
  const { code, setCode, handleSave, handleReset } = useLocalStorage();
  const {
    isResizing,
    splitPosition,
    startResizing,
    stopResizing,
    handleResize,
    handleDoubleClick
  } = useResize(isMobile);

  const [previewCode, setPreviewCode] = useState(DEFAULT_CODE);

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
      handleSave(key, value);
    });
    alert('Code saved successfully!');
  };

  // Update preview when code changes
  useEffect(() => {
    setPreviewCode(code);
  }, [code]);

  return (
    <div className="code-editor">
      <div 
        className="main-container" 
        ref={mainContainerRef}
        onDoubleClick={!isMobile ? (e) => handleDoubleClick(e, mainContainerRef) : undefined}
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