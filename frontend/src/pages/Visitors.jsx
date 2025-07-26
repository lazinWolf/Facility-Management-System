// src/pages/Visitors.jsx
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
  display: flex;
  flex: 1;
  gap: 24px;
  overflow: hidden;
`;

const BaseMainContainer = styled.div`
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const FormContainer = styled(BaseMainContainer).attrs({ as: 'form' })`
  flex: 1;
  min-width: 350px;
  max-width: 500px;
`;

const HistoryContainer = styled(BaseMainContainer)`
  flex: 2;
  min-width: 300px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 600;
  color: #1e1e2f;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #c4c4d0;
  font-size: 14px;
  outline: none;
`;

const Textarea = styled.textarea`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #c4c4d0;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  outline: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px 20px;
  background-color: #d8cfe8;
  color: #1e1e2f;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: auto;

  &:hover {
    background-color: #b8abd0;
  }

  &:disabled {
    background-color: #e9e4f0;
    cursor: not-allowed;
  }
`;

const HistoryHeader = styled.div`
  padding: 16px;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: #1e1e2f;
  flex-shrink: 0;
  border-bottom: 2px solid #d8cfe8;
  margin: -24px -24px 16px -24px;
  background-color: #f5eeff;
  border-radius: 14px 14px 0 0;
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HistoryItem = styled.div`
  background-color: #fafaff;
  border: 2px solid #e9e4f0;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  color: #2b2b38;
  flex-shrink: 0;

  &:hover {
    border-color: #d8cfe8;
  }
`;

const Status = styled.p`
  margin: 6px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${props => (props.approved ? '#28a745' : '#fd7e14')};
`;


// --- Main Component ---
export default function Visitors() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [visitorLog, setVisitorLog] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadVisitors = async () => {
    try {
      const { data } = await API.get('/visitors/mine'); // Fetches the user's specific visitor logs
      setVisitorLog(data);
    } catch (err) {
      console.error("Failed to load visitor log:", err);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Creates a new visitor entry, which is pending approval by default
      await API.post('/visitors', { name, reason });
      await loadVisitors(); // Refresh the log after submission
      setName('');
      setReason('');
    } catch (err) {
      console.error("Failed to submit visitor request:", err);
    }
    setSubmitting(false);
  };

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
        <TitleCard>Visitor Management</TitleCard>
        <TimeCard>
          <div>{getGreeting()}, {user.name}</div>
          <div>🕒 {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div>📅 {time.toLocaleDateString()}</div>
        </TimeCard>
      </HeaderGrid>

      <MainSection>
        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Visitor Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label>Reason for Visit</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
          </FormGroup>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Visitor Request'}
          </Button>
        </FormContainer>

        <HistoryContainer>
          <HistoryHeader>Your Visitor Log</HistoryHeader>
          <HistoryList>
            {visitorLog.map((v) => (
              <HistoryItem key={v.id}>
                <div style={{fontWeight: '600'}}>{v.name}</div>
                <p style={{ margin: '6px 0', fontSize: '13px', color: '#6b7280' }}>
                  Reason: {v.reason}
                </p>
                <Status approved={v.approved}>
                  Status: {v.approved ? 'Approved' : 'Pending Approval'}
                </Status>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Requested on: {new Date(v.createdAt).toLocaleDateString()}
                </p>
              </HistoryItem>
            ))}
             {visitorLog.length === 0 && <p>You have not registered any visitors yet.</p>}
          </HistoryList>
        </HistoryContainer>
      </MainSection>
    </Page>
  );
}