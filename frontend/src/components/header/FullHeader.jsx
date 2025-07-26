// src/components/header/CommonHeader.jsx
import styled from 'styled-components';
import HeaderLogo from './HeaderLogo';
import HeaderCenter from './HeaderCenter';
import HeaderTime from './HeaderTime';

const HeaderGrid = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

export default function FullHeader({ centerContent, user, time }) {
  return (
    <HeaderGrid>
      <HeaderLogo />
      <HeaderCenter>{centerContent}</HeaderCenter>
      <HeaderTime user={user} time={time} />
    </HeaderGrid>
  );
}
