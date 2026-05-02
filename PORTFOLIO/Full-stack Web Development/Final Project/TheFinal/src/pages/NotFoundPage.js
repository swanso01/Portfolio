
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Need to Login First!</h2>
      <p>Click Login On the Top of the Screen.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}

export default NotFoundPage;