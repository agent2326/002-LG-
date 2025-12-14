
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PreviewFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ children, className, style }) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    // Write the initial HTML structure including Tailwind and Fonts
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&family=Space+Mono:wght@400;700&family=Open+Sans:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&family=Roboto:wght@300;400;500;700&family=Oswald:wght@400;600;700&family=Poppins:wght@300;400;600;700&family=Raleway:wght@300;400;700&family=Merriweather:wght@300;400;700&family=Nunito:wght@400;700&family=Rubik:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; }
            /* Custom Scrollbar for the preview to look nice */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
            
            /* Animation Utilities from original index.html */
            .reveal-section {
              opacity: 0;
              transform: translateY(30px);
              transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            .reveal-section.is-visible {
              opacity: 1;
              transform: translateY(0);
            }
          </style>
        </head>
        <body><div id="root"></div></body>
      </html>
    `);
    doc.close();

    const root = doc.getElementById('root');
    if (root) {
      setMountNode(root);
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      style={{ border: 'none', width: '100%', height: '100%', ...style }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};

export default PreviewFrame;
