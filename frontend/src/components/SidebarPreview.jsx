// SidebarPreview.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './Sidebar'; // Adjust path as needed
import './index.css'; // Optional: include global styles

const Preview = () => (
  <div style={{ display: 'flex', height: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '2rem' }}>
      <h1>Sidebar Preview</h1>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Preview />);
