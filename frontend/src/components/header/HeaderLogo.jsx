import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CardStyle } from './CardStyles';

const LogoCard = styled(Link)`
  ${CardStyle}
  font-weight: 600;
  font-size: 14px;
`;

export default function HeaderLogo() {
  return (
    <LogoCard to="/dashboard">
      <img src="/logo.png" alt="Logo" style={{ width: 50, marginBottom: 8 }} />
    </LogoCard>
  );
}
