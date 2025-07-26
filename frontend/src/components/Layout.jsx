import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const layoutStyles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
  },
};

export default function Layout() {
  return (
    <div style={layoutStyles.container}>
      <Sidebar />
      <main style={layoutStyles.content}>
        <Outlet />
      </main>
    </div>
  );
}
