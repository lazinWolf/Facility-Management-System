// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../resources/logo-crop.png'; // Make sure to replace with your actual logo path

// Define styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#ffffff',
  },
  leftPane: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    padding: '3rem',
    
  },
  leftPaneContent: {
    textAlign: 'center',
  },
  logo: {
    width: '10rem', 
    height: 'auto',
    margin: '0 auto 1.5rem', 
  },
  systemTitle: {
    fontSize: '1.875rem', 
    fontWeight: 'bold',
    color: '#1f2937', 
  },
  rightPane: {
    flex: '1 1 0%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  formContainer: {
    width: '100%',
    maxWidth: '28rem',
  },
  title: {
    fontSize: '2.25rem', 
    fontWeight: 'bold',
    color: '#111827', 
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem', 
  },
  inputGroup: {},
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151', 
    marginBottom: '0.25rem',
  },
  input: {
    marginTop: '0.125rem',
    display: 'block',
    width: '100%',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    padding: '0.75rem',
    color: '#111827',
    fontSize: '0.875rem',
    boxSizing: 'border-box', 
  },
  inputFocus: {
    borderColor: '#3b82f6', 
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.4)', 
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: '0.375rem',
    border: '1px solid transparent',
    backgroundColor: '#2563eb', // Corresponds to bg-blue-600
    padding: '0.75rem 1rem', // Adjusted for better feel
    fontSize: '1rem',
    fontWeight: '600', // Corresponds to font-semibold
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  buttonHover: {
    backgroundColor: '#1d4ed8', // Corresponds to hover:bg-blue-700
  },
  signupText: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#4b5563', // Corresponds to text-gray-600
  },
  link: {
    fontWeight: '500',
    color: '#2563eb', // Corresponds to text-blue-600
    textDecoration: 'none',
  },
  linkHover: {
    textDecoration: 'underline', // Corresponds to hover:underline
  },
  error: {
    marginBottom: '1rem',
    borderRadius: '0.375rem',
    backgroundColor: '#fef2f2', // Red-100
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#b91c1c', // Red-700
    textAlign: 'center',
  }
};

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      await login(userId, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Set a user-friendly error message
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  // Combine base and dynamic styles
  const buttonStyle = { ...styles.button, ...(isButtonHovered && styles.buttonHover) };
  const linkStyle = { ...styles.link, ...(isLinkHovered && styles.linkHover) };

  return (
    <div style={styles.container}>
      {/* Left Pane: Logo and System Name */}
      <div
        style={styles.leftPane}
        onClick={() => navigate('/')}
      >
        <div style={styles.leftPaneContent}>
          <img
            src={logo}
            alt="Facility Management System Logo"
            style={styles.logo}
          />
          <h1 style={styles.systemTitle}>Facility Management System</h1>
        </div>
      </div>


      {/* Right Pane: Login Form */}
      <div style={styles.rightPane}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Log In</h2>

          {/* Error Message */}
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label htmlFor="userId" style={styles.label}>
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                required
                onFocus={() => setFocusedField('userId')}
                onBlur={() => setFocusedField(null)}
                style={{ ...styles.input, ...(focusedField === 'userId' && styles.inputFocus) }}
                placeholder="Enter your user ID"
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={{ ...styles.input, ...(focusedField === 'password' && styles.inputFocus) }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              Log In
            </button>
          </form>

          <p style={styles.signupText}>
            Don’t have an account?{' '}
            <Link
              to="/register"
              style={linkStyle}
              onMouseEnter={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}