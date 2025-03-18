import React from 'react';
import { downloadProject } from '../utils/utils';
import './index.css';

const Toolbar = ({ code, onSave, onReset }) => {
  return (
    <div className="toolbar">
      <button onClick={onSave}>Save</button>
      <button onClick={() => downloadProject(code)}>Download</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default Toolbar;