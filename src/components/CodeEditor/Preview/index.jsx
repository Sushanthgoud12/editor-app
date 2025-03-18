import React, { useEffect, useState } from 'react';
import './index.css';

const Preview = ({ code }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const sanitizedHtml = code.html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    const sanitizedJs = code.js.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    setSrcDoc(`
      <!DOCTYPE html>
      <html>
        <head>
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
        Preview
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