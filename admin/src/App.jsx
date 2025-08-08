import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import axios from 'axios';
import {
    HomeIcon,
    UserPlusIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon,
    BuildingOffice2Icon,
    MegaphoneIcon,
    DocumentTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    ShieldCheckIcon,
    PlusCircleIcon,
    TrashIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';


// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f1f5f9;
    color: #334155;
  }
`;

// --- Styled Components ---

// General
const Button = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 0.2s;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const PrimaryButton = styled(Button)`
    background-color: #0ea5e9;
    color: white;
    &:hover {
        background-color: #0284c7;
    }
`;

const SecondaryButton = styled(Button)`
    background-color: #f1f5f9;
    color: #475569;
    border-color: #e2e8f0;
    &:hover {
        background-color: #e2e8f0;
    }
`;

const DangerButton = styled(Button)`
    background-color: #ef4444;
    color: white;
    &:hover {
        background-color: #dc2626;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    box-sizing: border-box;
    &:focus {
        outline: none;
        border-color: #0ea5e9;
        box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
    }
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    box-sizing: border-box;
    &:focus {
        outline: none;
        border-color: #0ea5e9;
        box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    box-sizing: border-box;
    background-color: white;
    &:focus {
        outline: none;
        border-color: #0ea5e9;
        box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
    }
`;

const Card = styled.div`
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

const Table = styled.table`
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    
    th, td {
        padding: 1rem;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
    }

    th {
        font-size: 0.875rem;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
    }

    tbody tr:hover {
        background-color: #f8fafc;
    }
`;

const Badge = styled.span`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    color: ${props => props.color || '#1e293b'};
    background-color: ${props => props.bgColor || '#e2e8f0'};
`;


// Layout
const AppContainer = styled.div`
    display: flex;
    height: 100vh;
    background-color: #f1f5f9;
`;

const MainContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const PageContent = styled.main`
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 2rem;
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
`;

const PageTitle = styled.h2`
    font-size: 1.875rem;
    font-weight: 700;
    color: #1e293b;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    height: 100%;
`;

const SpinnerStyled = styled.div`
    animation: ${spin} 1s linear infinite;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #0ea5e9;
    border-radius: 50%;
    width: 40px;
    height: 40px;
`;

// Modal Styled Components
const ModalBackdrop = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
`;
const ModalContent = styled.div`
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    padding: 1.5rem;
    width: 100%;
    max-width: 42rem;
    max-height: 90vh;
    overflow-y: auto;
`;
const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
`;

// Sidebar Styled Components
const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #1e293b;
    color: white;
    transition: width 0.3s ease-in-out;
    width: ${props => props.isExpanded ? '16rem' : '5rem'};
    flex-shrink: 0;
`;
const SidebarHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${props => props.isExpanded ? 'space-between' : 'center'};
    padding: 1rem;
    height: 4rem;
    border-bottom: 1px solid #334155;
`;
const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
    flex-grow: 1;
`;
const NavItem = styled.li`
    margin: 0.25rem 1rem;
`;
const NavLink = styled.a`
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 0.5rem;
    text-decoration: none;
    color: white;
    background-color: ${props => props.isActive ? '#0ea5e9' : 'transparent'};
    justify-content: ${props => !props.isExpanded ? 'center' : 'flex-start'};
    
    &:hover {
        background-color: ${props => !props.isActive && '#334155'};
    }
`;

// Login Page Styled Components
const LoginContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #f1f5f9;
`;
const LoginForm = styled.form`
    width: 100%;
    max-width: 24rem;
    padding: 2rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;


// --- API Service ---
const API = axios.create({
  baseURL: 'https://facility-management-system-backend.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Helper Components ---
const ModalComponent = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>{title}</h3>
                    <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer'}}><XMarkIcon width={24} height={24} /></button>
                </ModalHeader>
                {children}
            </ModalContent>
        </ModalBackdrop>
    );
};

const Spinner = () => <SpinnerContainer><SpinnerStyled /></SpinnerContainer>;

// --- Page Components ---

const Dashboard = () => (
    <div>
        <PageHeader>
            <PageTitle>Dashboard</PageTitle>
        </PageHeader>
        <Card>
            <p>Welcome to the Admin Dashboard. Select a section from the sidebar to manage your facility.</p>
        </Card>
    </div>
);

const Residents = () => {
    // State management
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // State for 'Add Resident' modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newResident, setNewResident] = useState({ name: '', email: '', password: '', role: 'RESIDENT' });

    // State for 'Edit Resident' modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingResident, setEditingResident] = useState(null);

    // --- Data Fetching ---
    const fetchResidents = async () => {
        setLoading(true);
        try {
            const res = await API.get('/admin/residents');
            setResidents(res.data);
        } catch (err) {
            setError('Failed to fetch residents.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    // --- Event Handlers ---
    const handleAddResident = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await API.post('/auth/register', newResident);
            setSuccess('Resident added successfully!');
            setIsAddModalOpen(false);
            setNewResident({ name: '', email: '', password: '', role: 'RESIDENT' });
            fetchResidents(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add resident.');
        }
    };

    const handleUpdateResident = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const { id, name, email, apartmentNo } = editingResident;
            await API.put(`/admin/residents/${id}`, { name, email, apartmentNo });
            setSuccess('Resident updated successfully!');
            setIsEditModalOpen(false);
            fetchResidents(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to update resident.');
        }
    };

    const handleDeleteResident = async (residentId) => {
        if (window.confirm('Are you sure you want to delete this resident? This action cannot be undone.')) {
            setError('');
            setSuccess('');
            try {
                await API.delete(`/admin/residents/${residentId}`);
                setSuccess('Resident deleted successfully!');
                fetchResidents(); // Refresh the list
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to delete resident.');
            }
        }
    };

    const openEditModal = (resident) => {
        setEditingResident(resident);
        setIsEditModalOpen(true);
    };

    return (
        <div>
            {/* Header */}
            <PageHeader>
                <PageTitle>Residents</PageTitle>
                <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
                    <UserPlusIcon width={20} height={20} style={{marginRight: '0.5rem'}} />
                    Add Resident
                </PrimaryButton>
            </PageHeader>

            {/* Success/Error Messages */}
            {success && <div style={{backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem'}}>{success}</div>}
            {error && <div style={{backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem'}}>{error}</div>}

            {/* Content */}
            <Card>
                {loading ? (
                    <Spinner />
                ) : (
                    <div style={{overflowX: 'auto'}}>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Apartment No.</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {residents.map(resident => (
                                    <tr key={resident.id}>
                                        <td>{resident.name}</td>
                                        <td>{resident.email}</td>
                                        <td>{resident.apartmentNo || 'N/A'}</td>
                                        <td style={{display: 'flex', gap: '0.5rem'}}>
                                            <button onClick={() => openEditModal(resident)} style={{color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer'}} title="Edit">
                                                <PencilSquareIcon width={20} height={20} />
                                            </button>
                                            <button onClick={() => handleDeleteResident(resident.id)} style={{color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer'}} title="Delete">
                                                <TrashIcon width={20} height={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>

            {/* Add Resident Modal */}
            <ModalComponent isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Resident">
                <form onSubmit={handleAddResident}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <Input type="text" placeholder="Full Name" value={newResident.name} onChange={e => setNewResident({...newResident, name: e.target.value})} required />
                        <Input type="email" placeholder="Email Address" value={newResident.email} onChange={e => setNewResident({...newResident, email: e.target.value})} required />
                        <Input type="password" placeholder="Password" value={newResident.password} onChange={e => setNewResident({...newResident, password: e.target.value})} required />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.5rem'}}>
                        <SecondaryButton type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit">Add Resident</PrimaryButton>
                    </div>
                </form>
            </ModalComponent>

            {/* Edit Resident Modal */}
            {editingResident && (
                <ModalComponent isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Resident">
                    <form onSubmit={handleUpdateResident}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <Input type="text" placeholder="Full Name" value={editingResident.name} onChange={e => setEditingResident({...editingResident, name: e.target.value})} required />
                            <Input type="email" placeholder="Email Address" value={editingResident.email} onChange={e => setEditingResident({...editingResident, email: e.target.value})} required />
                            <Input type="text" placeholder="Apartment No." value={editingResident.apartmentNo || ''} onChange={e => setEditingResident({...editingResident, apartmentNo: e.target.value})} />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.5rem'}}>
                            <SecondaryButton type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</SecondaryButton>
                            <PrimaryButton type="submit">Save Changes</PrimaryButton>
                        </div>
                    </form>
                </ModalComponent>
            )}
        </div>
    );
};

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await API.get('/complaints');
            setComplaints(res.data);
        } catch (error) {
            console.error("Failed to fetch complaints", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const handleUpdateStatus = async (id) => {
        try {
            await API.put(`/complaints/${id}`, { status: 'Resolved' });
            fetchComplaints();
        } catch (error) { console.error("Failed to update complaint", error); }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <PageHeader><PageTitle>Complaints</PageTitle></PageHeader>
            <Card>
                <div style={{overflowX: 'auto'}}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th><th>Resident</th><th>Title</th><th>Description</th><th>Status</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(c => (
                                <tr key={c.id}>
                                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td>{c.user?.name || 'N/A'}</td>
                                    <td style={{fontWeight: 500}}>{c.title}</td>
                                    <td>{c.description}</td>
                                    <td>
                                        <Badge bgColor={c.status === 'Resolved' ? '#dcfce7' : '#fef9c3'} color={c.status === 'Resolved' ? '#166534' : '#854d0e'}>
                                            {c.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {c.status === 'Pending' && (
                                            <button onClick={() => handleUpdateStatus(c.id)} style={{display: 'flex', alignItems: 'center', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer'}}>
                                                <ShieldCheckIcon width={16} height={16} style={{marginRight: '0.25rem'}} /> Mark as Resolved
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const res = await API.get('/visitors');
            setVisitors(res.data);
        } catch (error) {
            console.error("Failed to fetch visitors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVisitors(); }, []);

    const handleApproveVisitor = async (id) => {
        try {
            await API.put(`/visitors/${id}/approve`);
            fetchVisitors();
        } catch (error) { console.error("Failed to approve visitor", error); }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <PageHeader><PageTitle>Visitor Approvals</PageTitle></PageHeader>
            <Card>
                <div style={{overflowX: 'auto'}}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th><th>Visitor Name</th><th>Reason</th><th>Resident</th><th>Status</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.map(v => (
                                <tr key={v.id}>
                                    <td>{new Date(v.createdAt).toLocaleString()}</td>
                                    <td>{v.name}</td>
                                    <td>{v.reason}</td>
                                    <td>{v.user?.name || 'N/A'}</td>
                                    <td>
                                        <Badge bgColor={v.approved ? '#dcfce7' : '#fef9c3'} color={v.approved ? '#166534' : '#854d0e'}>
                                            {v.approved ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </td>
                                    <td>
                                        {!v.approved && (
                                            <button onClick={() => handleApproveVisitor(v.id)} style={{display: 'flex', alignItems: 'center', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer'}}>
                                                <ShieldCheckIcon width={16} height={16} style={{marginRight: '0.25rem'}} /> Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

const Facilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFacility, setNewFacility] = useState({ name: '', description: '', capacity: '' });

    const fetchFacilities = async () => {
        setLoading(true);
        try {
            const res = await API.get('/facilities');
            setFacilities(res.data);
        } catch (error) {
            console.error("Failed to fetch facilities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFacilities(); }, []);

    const handleAddFacility = async (e) => {
        e.preventDefault();
        try {
            await API.post('/facilities', { ...newFacility, capacity: parseInt(newFacility.capacity) });
            setIsModalOpen(false);
            setNewFacility({ name: '', description: '', capacity: '' });
            fetchFacilities();
        } catch (error) {
            console.error("Failed to add facility", error);
        }
    };

    return (
        <div>
            <PageHeader>
                <PageTitle>Facilities</PageTitle>
                <PrimaryButton onClick={() => setIsModalOpen(true)}>
                    <PlusCircleIcon width={20} height={20} style={{marginRight: '0.5rem'}} /> Add Facility
                </PrimaryButton>
            </PageHeader>
            {loading ? <Spinner /> : (
                <Card>
                    <div style={{overflowX: 'auto'}}>
                        <Table>
                            <thead>
                                <tr><th>Name</th><th>Description</th><th>Capacity</th></tr>
                            </thead>
                            <tbody>
                                {facilities.map(f => (
                                    <tr key={f.id}>
                                        <td>{f.name}</td>
                                        <td>{f.description}</td>
                                        <td>{f.capacity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}
            <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Facility">
                <form onSubmit={handleAddFacility}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <Input type="text" placeholder="Facility Name" value={newFacility.name} onChange={e => setNewFacility({...newFacility, name: e.target.value})} required />
                        <Textarea placeholder="Description" value={newFacility.description} onChange={e => setNewFacility({...newFacility, description: e.target.value})} required />
                        <Input type="number" placeholder="Capacity" value={newFacility.capacity} onChange={e => setNewFacility({...newFacility, capacity: e.target.value})} required />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.5rem'}}>
                        <SecondaryButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit">Add Facility</PrimaryButton>
                    </div>
                </form>
            </ModalComponent>
        </div>
    );
};

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const res = await API.get('/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error("Failed to fetch announcements", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await API.post('/announcements', newAnnouncement);
            setIsModalOpen(false);
            setNewAnnouncement({ title: '', content: '' });
            fetchAnnouncements();
        } catch (error) {
            console.error("Failed to create announcement", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await API.delete(`/announcements/${id}`);
                fetchAnnouncements();
            } catch (error) {
                console.error("Failed to delete announcement", error);
            }
        }
    };

    return (
        <div>
            <PageHeader>
                <PageTitle>Announcements</PageTitle>
                <PrimaryButton onClick={() => setIsModalOpen(true)}>
                    <PlusCircleIcon width={20} height={20} style={{marginRight: '0.5rem'}} /> Create Announcement
                </PrimaryButton>
            </PageHeader>
            {loading ? <Spinner /> : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {announcements.map(a => (
                        <Card key={a.id}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                <div>
                                    <h3 style={{fontWeight: 'bold'}}>{a.title}</h3>
                                    <p style={{marginTop: '0.25rem'}}>{a.content}</p>
                                    <p style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem'}}>By {a.creator.name} on {new Date(a.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => handleDelete(a.id)} style={{color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer'}}>
                                    <TrashIcon width={20} height={20} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Announcement">
                <form onSubmit={handleCreate}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <Input type="text" placeholder="Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} required />
                        <Textarea placeholder="Content" value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} rows="4" required />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.5rem'}}>
                        <SecondaryButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit">Create</PrimaryButton>
                    </div>
                </form>
            </ModalComponent>
        </div>
    );
};

const Bills = () => {
    const [bills, setBills] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newBill, setNewBill] = useState({ userId: '', title: '', amount: '', dueDate: '' });
    const [editingBill, setEditingBill] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Use the new /admin/residents endpoint
            const [billsRes, usersRes] = await Promise.all([
                API.get('/bills'),
                API.get('/admin/residents') 
            ]);
            setBills(billsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
            // Fallback to only fetching bills if users fail
            if (error.response?.config?.url?.includes('/admin/residents')) {
                 const billsRes = await API.get('/bills');
                 setBills(billsRes.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await API.post('/bills', { ...newBill, userId: parseInt(newBill.userId), amount: parseFloat(newBill.amount) });
            setIsCreateModalOpen(false);
            setNewBill({ userId: '', title: '', amount: '', dueDate: '' });
            fetchData();
        } catch (error) { console.error("Failed to create bill", error); }
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const {id, title, amount, dueDate, status} = editingBill;
            await API.put(`/bills/${id}`, { title, amount: parseFloat(amount), dueDate, status });
            setIsEditModalOpen(false);
            setEditingBill(null);
            fetchData();
        } catch (error) { console.error("Failed to update bill", error); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            try {
                await API.delete(`/bills/${id}`);
                fetchData();
            } catch (error) { console.error("Failed to delete bill", error); }
        }
    };

    const openEditModal = (bill) => {
        setEditingBill({...bill, dueDate: new Date(bill.dueDate).toISOString().split('T')[0]});
        setIsEditModalOpen(true);
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <PageHeader>
                <PageTitle>Bills Management</PageTitle>
                <PrimaryButton onClick={() => setIsCreateModalOpen(true)} disabled={!users.length}>
                    <PlusCircleIcon width={20} height={20} style={{marginRight: '0.5rem'}} /> Create Bill
                </PrimaryButton>
            </PageHeader>
            {!users.length && <div style={{backgroundColor: '#fef9c3', color: '#854d0e', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem'}}>Could not fetch residents. Please ensure the API is running and you have admin permissions.</div>}
            <Card>
                <div style={{overflowX: 'auto'}}>
                    <Table>
                        <thead>
                            <tr><th>Resident</th><th>Title</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {bills.map(b => (
                                <tr key={b.id}>
                                    <td>{b.user?.name || 'N/A'}</td>
                                    <td>{b.title}</td>
                                    <td>${b.amount.toFixed(2)}</td>
                                    <td>{new Date(b.dueDate).toLocaleDateString()}</td>
                                    <td>
                                        <Badge bgColor={b.status === 'paid' ? '#dcfce7' : '#fee2e2'} color={b.status === 'paid' ? '#166534' : '#991b1b'}>
                                            {b.status}
                                        </Badge>
                                    </td>
                                    <td style={{display: 'flex', gap: '0.5rem'}}>
                                        <button onClick={() => openEditModal(b)} style={{color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer'}}><PencilSquareIcon width={20} height={20} /></button>
                                        <button onClick={() => handleDelete(b.id)} style={{color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer'}}><TrashIcon width={20} height={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card>
            
            {/* Create Bill Modal */}
            <ModalComponent isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Bill">
                <form onSubmit={handleCreate}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <Select value={newBill.userId} onChange={e => setNewBill({...newBill, userId: e.target.value})} required>
                            <option value="" disabled>Select a Resident</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name} (Apt: {u.apartmentNo || 'N/A'})</option>)}
                        </Select>
                        <Input type="text" placeholder="Bill Title (e.g., Maintenance Fee)" value={newBill.title} onChange={e => setNewBill({...newBill, title: e.target.value})} required />
                        <Input type="number" step="0.01" placeholder="Amount" value={newBill.amount} onChange={e => setNewBill({...newBill, amount: e.target.value})} required />
                        <Input type="date" value={newBill.dueDate} onChange={e => setNewBill({...newBill, dueDate: e.target.value})} required />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.5rem'}}>
                        <SecondaryButton type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit">Create Bill</PrimaryButton>
                    </div>
                </form>
            </ModalComponent>

            {/* Edit Bill Modal */}
            {editingBill && (
                <ModalComponent isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Bill">
                    <form onSubmit={handleUpdate}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <Input type="text" placeholder="Bill Title" value={editingBill.title} onChange={e => setEditingBill({...editingBill, title: e.target.value})} required />
                            <Input type="number" step="0.01" placeholder="Amount" value={editingBill.amount} onChange={e => setEditingBill({...editingBill, amount: e.target.value})} required />
                            <Input type="date" value={editingBill.dueDate} onChange={e => setEditingBill({...editingBill, dueDate: e.target.value})} required />
                            <Select value={editingBill.status} onChange={e => setEditingBill({...editingBill, status: e.target.value})}>
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                            </Select>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.5rem'}}>
                            <SecondaryButton type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</SecondaryButton>
                            <PrimaryButton type="submit">Save Changes</PrimaryButton>
                        </div>
                    </form>
                </ModalComponent>
            )}
        </div>
    );
};


// --- Layout Components ---

const Sidebar = ({ activePage, setActivePage, isExpanded, setIsExpanded, onLogout }) => {
    const navItems = [
        { name: 'Dashboard', icon: HomeIcon },
        { name: 'Residents', icon: UserGroupIcon }, // Changed Icon for better representation
        { name: 'Complaints', icon: ClipboardDocumentListIcon },
        { name: 'Visitors', icon: UserGroupIcon },
        { name: 'Facilities', icon: BuildingOffice2Icon },
        { name: 'Announcements', icon: MegaphoneIcon },
        { name: 'Bills', icon: DocumentTextIcon },
    ];

    return (
        <SidebarContainer isExpanded={isExpanded}>
            <SidebarHeader isExpanded={isExpanded}>
                {isExpanded && <span style={{fontSize: '1.25rem', fontWeight: '700'}}>Admin Panel</span>}
                <button onClick={() => setIsExpanded(!isExpanded)} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>
                    {isExpanded ? <ChevronLeftIcon width={20} height={20} /> : <ChevronRightIcon width={20} height={20} />}
                </button>
            </SidebarHeader>
            <NavList>
                {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavItem key={item.name}>
                            <NavLink href="#" onClick={(e) => { e.preventDefault(); setActivePage(item.name); }} isActive={activePage === item.name} isExpanded={isExpanded}>
                                <Icon width={20} height={20} />
                                {isExpanded && <span style={{marginLeft: '1rem'}}>{item.name}</span>}
                            </NavLink>
                        </NavItem>
                    );
                })}
            </NavList>
             <div style={{padding: '1rem', borderTop: '1px solid #334155'}}>
                <DangerButton onClick={onLogout} style={{width: '100%'}}>
                    {isExpanded ? 'Logout' : <XMarkIcon width={20} height={20} />}
                </DangerButton>
            </div>
        </SidebarContainer>
    );
};

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.post('/auth/login', { email, password });
            const { token, user } = res.data;
            if (user.role !== 'ADMIN') {
                setError('Access Denied. Only admins are allowed.');
                setLoading(false);
                return;
            }
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(user));
            onLoginSuccess(user);
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid credentials or server error.');
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleLogin}>
                <h1 style={{fontSize: '1.5rem', fontWeight: '700', textAlign: 'center'}}>Admin Login</h1>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <Input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <Input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {error && <p style={{fontSize: '0.75rem', textAlign: 'center', color: '#dc2626'}}>{error}</p>}
                <PrimaryButton type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </PrimaryButton>
            </LoginForm>
        </LoginContainer>
    );
};

// --- Main App Component ---

// Moved outside the component to prevent re-creation on every render
const pageComponents = {
    'Dashboard': Dashboard,
    'Residents': Residents,
    'Complaints': Complaints,
    'Visitors': Visitors,
    'Facilities': Facilities,
    'Announcements': Announcements,
    'Bills': Bills,
};

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState('Dashboard');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('admin_user');
            const token = localStorage.getItem('admin_token');
            if (storedUser && token) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.role === 'ADMIN') setUser(parsedUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLoginSuccess = (loggedInUser) => setUser(loggedInUser);
    const handleLogout = () => {
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
        setUser(null);
    };

    const PageToRender = pageComponents[activePage] || Dashboard;

    if (loading) return <><GlobalStyle /><Spinner /></>;
    if (!user) return <><GlobalStyle /><LoginPage onLoginSuccess={handleLoginSuccess} /></>;

    return (
        <>
            <GlobalStyle />
            <AppContainer>
                <Sidebar 
                    activePage={activePage} 
                    setActivePage={setActivePage} 
                    isExpanded={isSidebarExpanded} 
                    setIsExpanded={setIsSidebarExpanded}
                    onLogout={handleLogout}
                />
                <MainContent>
                    <PageContent>
                        <PageToRender />
                    </PageContent>
                </MainContent>
            </AppContainer>
        </>
    );
}