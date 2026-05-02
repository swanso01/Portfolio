import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="navbar-logo" />
        <span className="navbar-title">SolidBase Construction</span>
      </div>
      <div className="navbar-center">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/order" className="navbar-link">Order Materials</Link>
        <Link to="/account" className="navbar-link">Account</Link>
        <Link to="/login" className="navbar-link">Login</Link>
        <Link to="/signup" className="navbar-link">Sign Up</Link>
      </div>
      <div className="navbar-right">
        <Link to="/cart">
        <img src={`${process.env.PUBLIC_URL}/cart.png`} alt="Cart" className="navbar-cart-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;