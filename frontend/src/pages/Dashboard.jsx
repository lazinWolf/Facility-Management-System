// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import Link for navigation



const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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

const WelcomeCard = styled(Card)`
  font-size: 24px;
  font-weight: 700;
`;

const TimeCard = styled(Card)`
  font-size: 14px;
  line-height: 1.6;
`;

const MainGrid = styled.main`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Create a 3-column grid */
  gap: 24px;
  flex: 1;
`;

const MetricsContainer = styled.div`
  grid-column: span 2; /* This container will span 2 of the 3 columns */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-content: start; /* Align items to the top */
`;

const MetricCard = styled(Link)` /* Make the card a navigable link */
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.07);
  }
`;

const MetricTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #4a4a68;
`;

const MetricValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #1e1e2f;
  margin-top: 8px;
`;

const PreviewList = styled.div`
  margin-top: 20px;
  font-size: 13px;
  color: #6b7280;
  border-top: 1px solid #e9e4f0;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PreviewItem = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;


const AnnouncementsContainer = styled.div`
  grid-column: span 1; /* This container spans the last column */
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
`;

const AnnouncementsHeader = styled.h3`
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9e4f0;
  text-align: center;
  font-size: 20px;
`;

const AnnouncementList = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-right: 8px; /* For scrollbar spacing */
`;

const AnnouncementCard = styled(Link)` /* Make the card a navigable link */
  display: block;
  background-color: #fafaff;
  border: 1px solid #e9e4f0;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  margin-bottom: 12px;
  text-decoration: none;
  color: #4a4a68;
  transition: border-color 0.2s;

  &:hover {
    border-color: #b8abd0;
  }
`;

// --- Main Component ---

export default function Dashboard() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  const [pendingComplaints, setPendingComplaints] = useState({ count: 0, preview: [] });
  const [billsDue, setBillsDue] = useState({ count: 0, preview: [] });
  const [pendingVisitors, setPendingVisitors] = useState({ count: 0, preview: [] });
  const [upcomingBookings, setUpcomingBookings] = useState({ count: 0, preview: [] });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [complaintsRes, billsRes, visitorsRes, bookingsRes, announcementsRes] = await Promise.all([
          API.get('/complaints/mine'),
          API.get('/bills/mine'),
          API.get('/visitors/mine'),
          API.get('/bookings/mine'),
          API.get('/announcements')
        ]);

        const pendingComplaintsData = complaintsRes.data.filter(c => c.status === 'Pending');
        setPendingComplaints({ count: pendingComplaintsData.length, preview: pendingComplaintsData.slice(0, 2) });

        const dueBillsData = billsRes.data.filter(b => b.status === 'unpaid');
        setBillsDue({ count: dueBillsData.length, preview: dueBillsData.slice(0, 2) });

        const pendingVisitorsData = visitorsRes.data.filter(v => !v.approved);
        setPendingVisitors({ count: pendingVisitorsData.length, preview: pendingVisitorsData.slice(0, 2) });

        const upcomingBookingsData = bookingsRes.data.filter(b => new Date(b.date) >= new Date());
        setUpcomingBookings({ count: upcomingBookingsData.length, preview: upcomingBookingsData.slice(0, 2) });
        
        setAnnouncements(announcementsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
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
          <img src="/logo.png" alt="Logo" style={{ width: 50, marginBottom: 8 }} />
        </LogoCard>
        <WelcomeCard>Welcome, {user.name}</WelcomeCard>
        <TimeCard>
          <div>{getGreeting()}</div>
          <div>🕒 {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div>📅 {time.toLocaleDateString()}</div>
        </TimeCard>
      </HeaderGrid>

      <MainGrid>
        <MetricsContainer>
          <MetricCard to="/complaints">
            <MetricTitle>Pending Complaints</MetricTitle>
            <MetricValue>{loading ? '...' : pendingComplaints.count}</MetricValue>
            <PreviewList>
              {loading ? <p>Loading...</p> : pendingComplaints.preview.length > 0 ? (
                pendingComplaints.preview.map(c => <PreviewItem key={c.id}>- {c.title}</PreviewItem>)
              ) : <p>No pending complaints.</p>}
            </PreviewList>
          </MetricCard>
          <MetricCard to="/bills">
            <MetricTitle>Bills Due</MetricTitle>
            <MetricValue>{loading ? '...' : billsDue.count}</MetricValue>
            <PreviewList>
              {loading ? <p>Loading...</p> : billsDue.preview.length > 0 ? (
                billsDue.preview.map(b => <PreviewItem key={b.id}>- {b.title}</PreviewItem>)
              ) : <p>No bills due.</p>}
            </PreviewList>
          </MetricCard>
          <MetricCard to="/visitors">
            <MetricTitle>Pending Visitors</MetricTitle>
            <MetricValue>{loading ? '...' : pendingVisitors.count}</MetricValue>
             <PreviewList>
              {loading ? <p>Loading...</p> : pendingVisitors.preview.length > 0 ? (
                pendingVisitors.preview.map(v => <PreviewItem key={v.id}>- {v.name}</PreviewItem>)
              ) : <p>No pending visitors.</p>}
            </PreviewList>
          </MetricCard>
          <MetricCard to="/facilities">
            <MetricTitle>Upcoming Bookings</MetricTitle>
            <MetricValue>{loading ? '...' : upcomingBookings.count}</MetricValue>
             <PreviewList>
              {loading ? <p>Loading...</p> : upcomingBookings.preview.length > 0 ? (
                upcomingBookings.preview.map(b => <PreviewItem key={b.id}>- {b.facility.name} on {new Date(b.date).toLocaleDateString()}</PreviewItem>)
              ) : <p>No upcoming bookings.</p>}
            </PreviewList>
          </MetricCard>
        </MetricsContainer>

        <AnnouncementsContainer>
          <AnnouncementsHeader>Recent Announcements</AnnouncementsHeader>
          <AnnouncementList>
            {loading ? <p>Loading...</p> : announcements.map((a) => (
              <AnnouncementCard key={a.id} to="/announcements">
                <strong>{a.title}</strong>
              </AnnouncementCard>
            ))}
             {announcements.length === 0 && !loading && <p>No new announcements.</p>}
          </AnnouncementList>
        </AnnouncementsContainer>
      </MainGrid>
    </Page>
  );
}