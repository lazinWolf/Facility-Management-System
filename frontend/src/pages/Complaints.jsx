// src/pages/Complaints.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import styled from 'styled-components';

// --- Styled Components (with your requested changes) ---

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px;
  background-color: #fafaff; /* Original light background */
  box-sizing: border-box;
`;

const HeaderGrid = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background-color: #fdf6ff; /* Reverted box color */
  border: 2px solid #d8cfe8;  /* Reverted border color */
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  display: flex; /* Added for easier content alignment */
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

// ✨ KEY CHANGE: Both main containers will now stretch to a uniform height.
const BaseMainContainer = styled.div`
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
  display: flex; /* Use flexbox to manage inner content */
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
  background-color: #d8cfe8; /* Reverted button color */
  color: #1e1e2f;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: auto; /* Pushes button to the bottom of the form container */

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
  margin: -24px -24px 16px -24px; /* Adjust to create a nice header bar */
  background-color: #f5eeff;
  border-radius: 14px 14px 0 0;
`;

const HistoryList = styled.div`
  flex: 1; /* This makes the list grow to fill the parent 'HistoryContainer' */
  overflow-y: auto; /* Add a scrollbar only when needed */
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

// --- Main Component ---
export default function Complaints() {
    // ... all your existing state and logic remains exactly the same
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await API.get('/complaints/mine');
         const mockData = [
            ...data,
            {id: 2, title: "AC Not Cooling", status: "In Progress", createdAt: new Date().toISOString()},
            {id: 3, title: "Projector Bulb Fused", status: "Resolved", createdAt: new Date().toISOString()},
            {id: 4, title: "Chair is Broken", status: "Pending", createdAt: new Date().toISOString()},
            {id: 5, title: "Coffee Machine Out of Order", status: "Pending", createdAt: new Date().toISOString()},
        ]
        setHistory(mockData);
      } catch (err) {
        console.error(err);
      }
    };
    loadHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/complaints', { title, description });
      const { data } = await API.get('/complaints/mine');
      setHistory(data);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
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
          {/* ✨ KEY CHANGE: Text removed from here */}
          <img src="/logo.png" alt="Facility Management Logo" style={{ width: 50, marginBottom: 8 }} />
        </LogoCard>
        <TitleCard>Complaints</TitleCard>
        <TimeCard>
          <div>{getGreeting()}, {user.name}</div>
          <div>🕒 {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div>📅 {time.toLocaleDateString()}</div>
        </TimeCard>
      </HeaderGrid>

      <MainSection>
        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </FormGroup>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Complaint'}
          </Button>
        </FormContainer>

        <HistoryContainer>
          <HistoryHeader>Your Complaints</HistoryHeader>
          <HistoryList>
            {history.map((c) => (
              <HistoryItem key={c.id}>
                <div style={{fontWeight: '600'}}>{c.title}</div>
                <p style={{ margin: '6px 0', fontSize: '13px', color: '#6b7280' }}>
                  Status: {c.status}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </HistoryItem>
            ))}
          </HistoryList>
        </HistoryContainer>
      </MainSection>
    </Page>
  );
}