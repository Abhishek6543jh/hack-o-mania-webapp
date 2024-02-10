import React, { useState } from 'react';
import { auth, db } from '../firebase/config'; // Adjust the path based on your project structure
import { signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check the user's role in Firestore
      const roleQuery = query(collection(db, 'users'), where('email', '==', user.email));
      const roleSnapshot = await getDocs(roleQuery);

      roleSnapshot.forEach((doc) => {
        const userRole = doc.data().role;

        // If the user is an admin, navigate to the admin dashboard
        if (userRole === 'admin') {
          navigate('/admin-dashboard'); // Replace with your actual admin route
        }
        else if (userRole === 'farmer') {
            navigate('/farmer-dashboard'); // Replace with your actual admin route
          }
      });

      console.log('User logged in');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
