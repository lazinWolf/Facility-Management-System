import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f1f5f9;

  /* Responsive layout for mobile devices */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

export default function Layout() {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
}
