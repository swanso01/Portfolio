import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../UserContext';
import '../App.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          email: userData.email,
          uid: userCredential.user.uid,
          orders: userData.orders || [],
          isAdmin: email === 'admin@gmail.com', 
        });

        alert('Login successful!');
        navigate('/');
      } else {
        alert('User data not found in Firestore.');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert('Invalid email or password.');
    }
  };

  return (
    <div className="App-login">
      <h2 className="App-login-title">Login</h2>
      <form className="App-login-form" onSubmit={handleLogin}>
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
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;