// src/pages/Facilities.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import styled from 'styled-components';

// --- Styled Components (No changes here, they remain the same) ---

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

const BookingContainer = styled.div`
  background-color: #fdf6ff;
  border: 2px solid #d8cfe8;
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 2;
`;

const MyBookingsContainer = styled(BookingContainer)`
  flex: 1;
`;

const PanelHeader = styled.div`
  padding-bottom: 16px;
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: #1e1e2f;
  border-bottom: 2px solid #e9e4f0;
`;

const FacilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  overflow-y: auto;
  padding: 4px;
`;

const FacilityCard = styled.div`
  background-color: #fafaff;
  border: 2px solid #e9e4f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #b8abd0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  h3 { margin: 0 0 8px 0; }
  p { margin: 0; font-size: 13px; color: #6b7280; }
`;

const DatePicker = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #c4c4d0;
  font-size: 14px;
  margin-bottom: 20px;
  width: 100%;
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const SlotButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid;
  transition: all 0.2s;

  background-color: ${props => props.bgColor || '#fafaff'};
  border-color: ${props => props.borderColor || '#d8cfe8'};
  color: ${props => props.color || '#1e1e2f'};

  &:hover:not(:disabled) {
    border-color: #5a4b81;
    background-color: #f5eeff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const BookingsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BookingItem = styled.div`
  background-color: #fafaff;
  border: 2px solid #e9e4f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
`;


// --- Main Component ---
export default function Facilities() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  
  const [facilities, setFacilities] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  // ✨ --- FINAL CORRECTION BASED ON YOUR ENUM --- ✨
  const TIME_SLOTS = [
      { value: 'S_09_10', label: '09:00-10:00' },
      { value: 'S_10_11', label: '10:00-11:00' },
      { value: 'S_11_12', label: '11:00-12:00' },
      { value: 'S_14_15', label: '14:00-15:00' },
      { value: 'S_15_16', label: '15:00-16:00' },
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [facilitiesRes, bookingsRes] = await Promise.all([
        API.get('/facilities'),
        API.get('/bookings/mine')
      ]);
      setFacilities(facilitiesRes.data);
      setMyBookings(bookingsRes.data);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    loadData();
    return () => clearInterval(timer);
  }, []);

  const handleCreateBooking = async (slotValue) => {
    try {
      await API.post('/bookings', {
        facilityId: selectedFacility.id,
        date: selectedDate,
        slot: slotValue
      });
      const bookingsRes = await API.get('/bookings/mine');
      setMyBookings(bookingsRes.data);
      alert('Booking successful!');
    } catch (err) {
      alert(`Booking failed: ${err.response?.data?.msg || 'An error occurred'}`);
    }
  };
  
  const getSlotStatus = (slotValue) => {
      const isBookedByUser = myBookings.some(
          b => b.facilityId === selectedFacility.id &&
          new Date(b.date).toISOString().split('T')[0] === selectedDate &&
          b.slot === slotValue
      );

      if (isBookedByUser) {
          return { status: 'Booked', disabled: true, styles: { bgColor: '#e9e4f0', borderColor: '#d8cfe8', color: '#6b7280' } };
      }
      
      return { status: 'Available', disabled: false };
  }

  const getSlotLabel = (slotValue) => {
      const slot = TIME_SLOTS.find(s => s.value === slotValue);
      return slot ? slot.label : slotValue;
  }


  return (
    <Page>
      <HeaderGrid>
        <Card><img src="/logo.png" alt="Logo" style={{ width: 50 }} /></Card>
        <TitleCard>Facility Booking</TitleCard>
        <TimeCard>
          <div>🕒 {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div>📅 {time.toLocaleDateString()}</div>
        </TimeCard>
      </HeaderGrid>

      <MainSection>
        <BookingContainer>
           <PanelHeader>
            {selectedFacility ? `Book: ${selectedFacility.name}` : '1. Select a Facility'}
           </PanelHeader>
           
           {selectedFacility ? (
             <div>
                <button onClick={() => setSelectedFacility(null)} style={{marginBottom: '16px'}}>← Back to all facilities</button>
                <p>{selectedFacility.description}</p>
                <hr />
                <Label>2. Select a Date</Label>
                <DatePicker type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                
                <Label>3. Select a Time Slot</Label>
                <SlotGrid>
                    {TIME_SLOTS.map(slot => {
                        const { status, disabled, styles } = getSlotStatus(slot.value);
                        return (
                            <SlotButton 
                                key={slot.value}
                                disabled={disabled}
                                onClick={() => handleCreateBooking(slot.value)}
                                {...styles}
                            >
                                {slot.label} ({status})
                            </SlotButton>
                        )
                    })}
                </SlotGrid>
             </div>
           ) : (
            <FacilityGrid>
                {loading ? <p>Loading facilities...</p> : facilities.map(f => (
                    <FacilityCard key={f.id} onClick={() => setSelectedFacility(f)}>
                        <h3>{f.name}</h3>
                        <p>Capacity per slot: {f.capacity}</p>
                    </FacilityCard>
                ))}
            </FacilityGrid>
           )}
        </BookingContainer>

        <MyBookingsContainer>
          <PanelHeader>My Bookings</PanelHeader>
          <BookingsList>
            {myBookings.length > 0 ? myBookings.map(b => (
                <BookingItem key={b.id}>
                    <div style={{fontWeight: 600}}>{b.facility.name}</div>
                    <div>Date: {new Date(b.date).toLocaleDateString()}</div>
                    <div>Slot: {getSlotLabel(b.slot)}</div>
                </BookingItem>
            )) : <p>You have no upcoming bookings.</p>}
          </BookingsList>
        </MyBookingsContainer>
      </MainSection>
    </Page>
  );
}

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1e1e2f;
`;