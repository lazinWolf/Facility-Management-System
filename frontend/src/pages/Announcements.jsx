// src/pages/Announcements.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import styled from 'styled-components';

// --- Styled Components ---

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px;
  background-color: #fafaff;
  box-sizing: border-box;
`;

const HeaderGrid = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoCard = styled(Card)`
  font-weight: 600;
  font-size: 14px;
`;

const TitleCard = styled(Card)`
  font-size: 24px;
  font-weight: 700;
`;

const TimeCard = styled(Card)`
  font-size: 14px;
  line-height: 1.6;
`;

const MainSection = styled.main`
  flex: 1;
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AnnouncementItem = styled.div`
  background-color: #fafaff;
  border: 2px solid #e9e4f0;
  border-radius: 12px;
  padding: 20px;
  flex-shrink: 0;

  h3 {
    margin: 0 0 12px 0;
    color: #1e1e2f;
    font-size: 18px;
  }

  p {
    margin: 0 0 16px 0;
    color: #4a4a68;
    line-height: 1.6;
  }
`;

const Footer = styled.div`
  font-size: 12px;
  color: #6b7280;
  border-top: 1px solid #e9e4f0;
  padding-top: 12px;
`;

// --- Main Component ---
export default function Announcements() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/announcements');
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to load announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Page>
      <HeaderGrid>
        <LogoCard>
          <img src="/logo.png" alt="Facility Management Logo" style={{ width: 50, marginBottom: 8 }} />
        </LogoCard>
        <TitleCard>Announcements</TitleCard>
        <TimeCard>
          <div>{getGreeting()}, {user.name}</div>
          <div>� {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div>📅 {time.toLocaleDateString()}</div>
        </TimeCard>
      </HeaderGrid>

      <MainSection>
        {loading ? (
          <p>Loading announcements...</p>
        ) : (
          <ListContainer>
            {announcements.map((item) => (
              <AnnouncementItem key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <Footer>
                  Posted by {item.creator.name} on {new Date(item.createdAt).toLocaleDateString()}
                </Footer>
              </AnnouncementItem>
            ))}
            {announcements.length === 0 && <p>There are no announcements at this time.</p>}
          </ListContainer>
        )}
      </MainSection>
    </Page>
  );
}
