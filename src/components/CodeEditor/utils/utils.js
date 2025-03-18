import JSZip from 'jszip';

export const downloadProject = async (code) => {
  const zip = new JSZip();

  // Add files to the zip
  zip.file('index.html', generateHTML(code));
  zip.file('styles.css', code.css);
  zip.file('script.js', code.js);

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'code-editor-project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating zip file:', error);
  }
};

const generateHTML = (code) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Editor Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    ${code.html}
    <script src="script.js"></script>
</body>
</html>
  `.trim();
};