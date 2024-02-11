import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Link } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError(null); // Reset error state

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check the user's role in Firestore
      const roleQuery = query(collection(db, 'users'), where('email', '==', user.email));
      const roleSnapshot = await getDocs(roleQuery);

      roleSnapshot.forEach((doc) => {
        const userRole = doc.data().role;

        // If the user is an admin or farmer, navigate accordingly
        if (userRole === 'admin') {
          navigate('/admin-dashboard'); // Replace with your actual admin route
        } else if (userRole === 'farmer') {
          navigate('/farmer-dashboard'); // Replace with your actual farmer route
        }
      });

      console.log('User logged in');
    } catch (error) {
      setError('Invalid email or password. Please try again.'); // Set error message
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div>
      <div style={styles.textContainer}>
        <h1 style={styles.pageHeading}>Welcome </h1>
        <p style={styles.description}>Discover a new way to connect and collaborate.</p>
        <br />
        <ps style={{ textAlign: 'center', marginTop: '16px' }}>
        <Link as={RouterLink} to="/farmer-restration">
              Click Here To Register as a new farmer.
            </Link>
        </ps>
        
      </div>
      <div style={styles.container}>
        <img src="/images/imge1.jpg" alt="Login" style={styles.image} />
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Login</h2>
          {error && (
            <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>
              {error}
            </p>
          )}
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleLogin} style={styles.button}>
            Login
          </button>
          <p style={{ textAlign: 'center', marginTop: '16px' }}>
            {' '}
            
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  textContainer: {
    marginTop: '120px',
    textAlign: 'center',
    marginBottom: '40px',
  },
  pageHeading: {
    fontSize: '36px',
    marginBottom: '10px',
    color: '#333',
  },
  description: {
    fontSize: '18px',
    color: '#555',
  },
  container: {
    display: 'flex',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  image: {
    width: '40%', // Adjust the width of the image as needed
    marginRight: '20px',
    borderRadius: '8px',
  },
  formContainer: {
    flex: 1,
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Login;
