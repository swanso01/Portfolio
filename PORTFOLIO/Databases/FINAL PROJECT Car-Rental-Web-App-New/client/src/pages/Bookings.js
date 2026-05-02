import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Bookings.css';

function Bookings() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user_id = localStorage.getItem('userId');
      if (!user_id) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const [activeRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/get_bookings/?user_id=${user_id}`),
        axios.get(`${API_URL}/get_history/?user_id=${user_id}`)
      ]);

      setActiveBookings((activeRes.data.data || []).filter(booking => booking.active == 1));
      setHistoryBookings(historyRes.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load bookings: ' + err.message);
      setLoading(false);
    }
  };

  const handleTurnIn = async (id) => {
    try {
      await axios.post(`${API_URL}/turn_in_car/?id=${id}`);
      fetchBookings();
    } catch (err) {
      alert('Error turning in car: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <div className="bookings-sections">
        <div className="active-bookings">
          <h3>Active Reservations</h3>
          {activeBookings.length === 0 ? (
            <p>No active bookings</p>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>Car ID</th>
                  <th>Start Date</th>
                  <th>Active</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.car_id}</td>
                    <td>{booking.date_start}</td>
                    <td>{booking.active ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => handleTurnIn(booking.id)} className="turn-in-btn">Turn in</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="history-bookings">
          <h3>Past Reservations</h3>
          {historyBookings.length === 0 ? (
            <p>No past bookings</p>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Car ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {historyBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.user_id}</td>
                    <td>{booking.car_id}</td>
                    <td>{booking.date_start}</td>
                    <td>{booking.date_end}</td>
                    <td>${booking.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookings;
