// src/pages/Bills.jsx
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

const BillsContainer = styled.div`
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BillsHeader = styled.div`
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

const BillsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BillItem = styled.div`
  background-color: #fafaff;
  border: 2px solid #e9e4f0;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  color: #2b2b38;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #d8cfe8;
  }
`;

const PayButton = styled.button`
  padding: 8px 16px;
  background-color: #d8cfe8;
  color: #1e1e2f;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b8abd0;
  }

  &:disabled {
    background-color: #e9e4f0;
    cursor: not-allowed;
  }
`;

// --- Main Component ---
export default function Bills() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [bills, setBills] = useState([]);
  const [paying, setPaying] = useState(null); // Tracks the ID of the bill being paid

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadBills = async () => {
    try {
      const { data } = await API.get('/bills/mine');
      setBills(data);
    } catch (err) {
      console.error("Failed to load bills:", err);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handlePayBill = async (billId) => {
    setPaying(billId);
    try {
      await API.post(`/bills/pay/${billId}`);
      // Refresh the bills list to reflect the change in status
      await loadBills();
    } catch (err) {
      console.error("Failed to pay bill:", err);
    } finally {
      setPaying(null);
    }
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const dueBills = bills.filter(b => b.status === 'unpaid');
  const paidBills = bills.filter(b => b.status === 'paid');

  return (
    <Page>
      <HeaderGrid>
        <LogoCard>
          <img src="/logo.png" alt="Facility Management Logo" style={{ width: 50, marginBottom: 8 }} />
        </LogoCard>
        <TitleCard>Bills & Payments</TitleCard>
        <TimeCard>
          <div>{getGreeting()}, {user.name}</div>
          <div>🕒 {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div>📅 {time.toLocaleDateString()}</div>
        </TimeCard>
      </HeaderGrid>

      <MainSection>
        <BillsContainer>
          <BillsHeader>Due Bills</BillsHeader>
          <BillsList>
            {dueBills.map((bill) => (
              <BillItem key={bill.id}>
                <div>
                  <div style={{fontWeight: '600'}}>{bill.title}</div>
                  <p style={{ margin: '6px 0', fontSize: '13px', color: '#6b7280' }}>
                    Amount: ₹{bill.amount.toFixed(2)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Due Date: {new Date(bill.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <PayButton 
                  onClick={() => handlePayBill(bill.id)}
                  disabled={paying === bill.id}
                >
                  {paying === bill.id ? 'Paying...' : 'Pay Now'}
                </PayButton>
              </BillItem>
            ))}
            {dueBills.length === 0 && <p>No outstanding bills. Well done!</p>}
          </BillsList>
        </BillsContainer>

        <BillsContainer>
          <BillsHeader>Payment History</BillsHeader>
          <BillsList>
            {paidBills.map((bill) => (
              <BillItem key={bill.id}>
                 <div>
                  <div style={{fontWeight: '600'}}>{bill.title}</div>
                  <p style={{ margin: '6px 0', fontSize: '13px', color: '#6b7280' }}>
                    Amount: ₹{bill.amount.toFixed(2)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Paid on: {new Date(bill.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{color: 'green', fontWeight: 'bold'}}>Paid</div>
              </BillItem>
            ))}
             {paidBills.length === 0 && <p>No payment history found.</p>}
          </BillsList>
        </BillsContainer>
      </MainSection>
    </Page>
  );
}