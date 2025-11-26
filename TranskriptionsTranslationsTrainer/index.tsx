import React from 'react';
import ReactDOM from 'react-dom/client';
import ProteinSynthesis from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
    root.render(
      <React.StrictMode>
        <div className="p-4 h-full">
          <ProteinSynthesis />
        </div>
      </React.StrictMode>
    );
} catch (error) {
    console.error("Failed to render app:", error);
    root.render(
        <div style={{color: 'red', padding: '20px'}}>
            <h2>Application Error</h2>
            <p>Failed to load the application. Please check console for details.</p>
            <pre>{String(error)}</pre>
        </div>
    );
}