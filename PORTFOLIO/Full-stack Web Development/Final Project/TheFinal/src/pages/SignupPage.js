import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../App.css';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);


      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        uid: userCredential.user.uid,
        orders: [],
      });

      alert('Signup successful!');
      navigate('/');
    } catch (error) {
      console.error('Error during signup:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already in use. Please log in instead.');
      } else {
        alert(`An error occurred during signup: ${error.message}`);
      }
    }
  };

  return (
    <div className="App-login">
      <h2 className="App-login-title">Sign Up</h2>
      <form className="App-login-form" onSubmit={handleSignup}>
        <div className="App-login-inline">
          <input
            className="App-login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="App-login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="App-login-button" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;