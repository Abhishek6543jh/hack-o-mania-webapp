import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection,doc,setDoc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Use the user's email as the document ID
      const userDocRef = doc(db, 'users', user.email); 

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role: 'farmer',
        displayName: displayName, 
        // Add other fields as needed
      });

      console.log('User registered and data stored in Firestore:', user, userDocRef);
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
      <label>Display Name:</label>
      <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      <button onClick={handleRegistration}>Register</button>
    </div>
  );
};

export default Register;
