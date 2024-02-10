import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Assuming you have a 'users' collection in Firestore
      await addDoc(collection(db, 'users'), {
        email: user.email,
        role: 'farmer',
      });

      console.log('User logged in and data stored in Firestore:', user);
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
