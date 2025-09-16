import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../resources/logo-crop.png';

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
    cursor: 'pointer',
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
    backgroundColor: '#2563eb',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  buttonHover: {
    backgroundColor: '#1d4ed8',
  },
  loginText: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#4b5563',
  },
  link: {
    fontWeight: '500',
    color: '#2563eb',
    textDecoration: 'none',
  },
  linkHover: {
    textDecoration: 'underline',
  },
  error: {
    marginBottom: '1rem',
    borderRadius: '0.375rem',
    backgroundColor: '#fef2f2',
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#b91c1c',
    textAlign: 'center',
  }
};

// Media query for mobile
const mobileMediaQuery = `
@media (max-width: 767px) {
  .register-container {
    flex-direction: column;
  }

  .register-left-pane,
  .register-right-pane {
    width: 100% !important;
    padding: 2rem !important;
  }

  .register-left-pane {
    order: 1;
    padding-bottom: 1rem !important;
  }

  .register-right-pane {
    order: 2;
  }

  .register-logo {
    width: 8rem !important;
  }

  .register-title {
    font-size: 1.75rem !important;
  }
}
`;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  const buttonStyle = { ...styles.button, ...(isButtonHovered && styles.buttonHover) };
  const linkStyle = { ...styles.link, ...(isLinkHovered && styles.linkHover) };

  return (
    <div style={styles.container} className="register-container">
      <style>{mobileMediaQuery}</style>

      <div
        style={styles.leftPane}
        className="register-left-pane"
        onClick={() => navigate('/')}
      >
        <div style={styles.leftPaneContent}>
          <img
            src={logo}
            alt="Facility Management System Logo"
            style={styles.logo}
            className="register-logo"
          />
          <h1 style={styles.systemTitle}>Facility Management System</h1>
        </div>
      </div>

      <div style={styles.rightPane} className="register-right-pane">
        <div style={styles.formContainer}>
          <h2 style={styles.title} className="register-title">Sign Up</h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={styles.label}>Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.input,
                  ...(focusedField === 'name' && styles.inputFocus)
                }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.input,
                  ...(focusedField === 'email' && styles.inputFocus)
                }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.input,
                  ...(focusedField === 'password' && styles.inputFocus)
                }}
              />
            </div>

            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              Create Account
            </button>
          </form>

          <p style={styles.loginText}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={linkStyle}
              onMouseEnter={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
