import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import './index.css';

const Editor = ({ value, language, onChange }) => {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="editor">
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'off',
          scrollBeyondLastLine: false,
          horizontalScrollbarSize: 10,
          automaticLayout: true
        }}
      />
    </div>
  );
};

export default Editor;