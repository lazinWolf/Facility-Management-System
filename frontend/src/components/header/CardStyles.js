// src/components/header/CardStyles.js
import { css } from 'styled-components';

export const CardStyle = css`
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.06);
  }
`;
