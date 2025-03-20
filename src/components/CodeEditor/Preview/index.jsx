import React, { useEffect, useState } from 'react';
import './index.css';

const Preview = ({ code, onClose, isMobile }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const sanitizedHtml = code.html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    const sanitizedJs = code.js.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    setSrcDoc(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${code.css}</style>
        </head>
        <body>
          ${sanitizedHtml}
          <script>
            try {
              ${sanitizedJs}
            } catch (error) {
              console.error('Error in preview:', error);
            }
          </script>
        </body>
      </html>
    `);
  }, [code]);

  return (
    <div className="preview">
      <div className="preview-header">
        <span>Preview</span>
        {isMobile && (
          <button 
            className="close-preview"
            onClick={onClose}
          >
            Back to Editor
          </button>
        )}
      </div>
      <iframe
        srcDoc={srcDoc}
        title="preview"
        sandbox="allow-scripts"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default Preview;