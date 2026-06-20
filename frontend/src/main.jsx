import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Simple error boundary for runtime errors
function ErrorBoundary({ children }) {
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const handler = (event) => {
      setError(event.reason || event.error || 'Unknown error');
    };
    window.addEventListener('error', handler);
    window.addEventListener('unhandledrejection', handler);
    return () => {
      window.removeEventListener('error', handler);
      window.removeEventListener('unhandledrejection', handler);
    };
  }, []);
  if (error) {
    return <div style={{ color: 'red', padding: 32, fontSize: 20 }}>Frontend Error: {String(error.message || error)}</div>;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
