import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRouter from './AppRouter';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function Header() {
  return (
    <header className="App-header">
      <img src="/logo.png" className="App-logo" alt="logo" />
    </header>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ minHeight: '80vh', padding: '20px' }}>
          <AppRouter />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
export { Header };
