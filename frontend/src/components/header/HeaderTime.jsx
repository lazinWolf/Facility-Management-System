import styled from 'styled-components';
import { CardStyle } from './CardStyles';

const TimeCard = styled.div`
  ${CardStyle}
  font-size: 14px;
  line-height: 1.6;
`;

export default function HeaderTime({ user, time }) {
  const hour = time.getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <TimeCard>
      <div>{greeting}{user ? `, ${user.name}` : ''}</div>
      <div>🕒 {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div>📅 {time.toLocaleDateString()}</div>
    </TimeCard>
  );
}
