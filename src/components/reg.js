import React, { useState } from 'react';
import { auth, db } from '../firebase/config'; // Make sure to provide the correct path to your firebase.js file
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Assuming you have a 'users' collection in Firestore
      await addDoc(collection(db, 'users'), {
        email: user.email,
        role: 'farmer',
      });

      console.log('User registered and data stored in Firestore:', user);
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegistration}>Register</button>
    </div>
  );
};

export default Register;
