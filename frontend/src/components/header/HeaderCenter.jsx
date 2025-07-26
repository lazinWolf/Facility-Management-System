import styled from 'styled-components';
import { CardStyle } from './CardStyles';

const CenterCard = styled.div`
  ${CardStyle}
  font-size: 24px;
  font-weight: 700;
`;

export default function HeaderCenter({ children }) {
  return <CenterCard>{children}</CenterCard>;
}
