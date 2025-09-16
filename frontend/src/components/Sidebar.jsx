import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  UsersIcon,
  BuildingLibraryIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const links = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/complaints', label: 'Complaints', Icon: ClipboardDocumentListIcon },
  { to: '/bills', label: 'Bills', Icon: BanknotesIcon },
  { to: '/visitors', label: 'Visitors', Icon: UsersIcon },
  { to: '/facilities', label: 'Facilities', Icon: BuildingLibraryIcon },
  { to: '/announcements', label: 'Announcements', Icon: BellIcon },
];

const styles = {
  sidebar: (collapsed) => ({
    width: collapsed ? '70px' : '240px',
    height: '100vh',
    padding: '20px 10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    transition: 'width 0.2s ease',
  }),
  toggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '20px',
    padding: '4px',
    display: 'flex',
    alignSelf: 'flex-end',
  },
  title: (collapsed) => ({
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: collapsed ? '0px' : '22px',
    fontWeight: '700',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    transition: 'font-size 0.2s ease',
  }),
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: '6px',
    color: '#475569',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  linkHover: {
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
  },
  linkActive: {
    backgroundColor: '#cbd5e1',
    color: '#0f172a',
    fontWeight: 600,
    boxShadow: 'inset 2px 0 0 #0f172a',
  },
  icon: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
    flexShrink: 0,
  },
  footer: (collapsed) => ({
    textAlign: 'center',
    fontSize: '12px',
    color: '#64748b',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px',
    marginTop: '20px',
    display: collapsed ? 'none' : 'block',
  }),
  username: {
    color: '#1e293b',
    fontWeight: 'bold',
    fontSize: '13px',
  },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside style={styles.sidebar(collapsed)}>
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={styles.toggle}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? (
            <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
          ) : (
            <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
          )}
        </button>

        <h1 style={styles.title(collapsed)}>FMS</h1>
        <nav style={styles.nav}>
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.linkActive : {}),
              })}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, styles.linkHover)
              }
              onMouseLeave={(e) => {
                if (e.currentTarget.getAttribute('aria-current') !== 'page') {
                  Object.assign(e.currentTarget.style, {
                    backgroundColor: '',
                    color: '#475569',
                  });
                }
              }}
            >
              <Icon style={styles.icon} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}

          <button
            onClick={logout}
            style={styles.link}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.linkHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, {
                backgroundColor: '',
                color: '#475569',
              })
            }
          >
            <ArrowRightOnRectangleIcon style={styles.icon} />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>

      <div style={styles.footer(collapsed)}>
        Logged in as<br />
        <strong style={styles.username}>{user?.name || 'User'}</strong>
      </div>
    </aside>
  );
}
