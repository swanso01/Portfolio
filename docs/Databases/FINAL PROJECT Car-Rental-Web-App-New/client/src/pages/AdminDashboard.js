import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const navigate = useNavigate();

  const [carForm, setCarForm] = useState({ make: '', model: '', year: '', location_id: '', drivetrain: '', color: '', miles: '', type: '', cost: '' });
  const [userForm, setUserForm] = useState({ admin: false });
  const [rentalForm, setRentalForm] = useState({ user_id: '', car_id: '', start_date: '', end_date: '', total_cost: '', status: 'pending' });

  const API_URL = 'http://localhost:8000';
  const userData = localStorage.getItem('userData');

  useEffect(() => {
    if (!userData) {
      navigate('/login');
    } else {
      try {
        const user = JSON.parse(userData);
        if (user[0]?.admin !== 1) {
          navigate('/');
        } else {
          if (activeTab === 'cars') fetchCars();
          if (activeTab === 'users') fetchUsers();
          if (activeTab === 'rentals') fetchRentals();
        }
      } catch (e) {
        navigate('/login');
      }
    }
  }, [activeTab]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/cars/`);
      const carList = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setCars(carList);
    } catch (error) {
      alert('Error fetching cars: ' + error.message);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/`);
      setUsers(response.data.data || []);
    } catch (error) {
      alert('Error fetching users: ' + error.message);
    }
    setLoading(false);
  };

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/rentals`);
      setRentals(response.data);
    } catch (error) {
      alert('Error fetching rentals: ' + error.message);
    }
    setLoading(false);
  };

  const handleAddCar = async () => {
    if (isAddingCar) {
      if (!carForm.make || !carForm.model || !carForm.year || !carForm.location_id || !carForm.cost) {
        alert('Please fill make, model, year, location, and cost');
        return;
      }
      try {
        const params = new URLSearchParams();
        params.append('make', carForm.make);
        params.append('model', carForm.model);
        params.append('year', carForm.year);
        params.append('location_id', carForm.location_id);
        params.append('drivetrain', carForm.drivetrain || '');
        params.append('color', carForm.color || '');
        params.append('miles', carForm.miles || 0);
        params.append('type', carForm.type || '');
        params.append('cost', carForm.cost);
        
        await axios.post(`${API_URL}/createcar/?${params.toString()}`);
        alert('Car added successfully');
        setIsAddingCar(false);
        setCarForm({ make: '', model: '', year: '', location_id: '', drivetrain: '', color: '', miles: '', type: '', cost: '' });
        fetchCars();
      } catch (error) {
        alert('Error: ' + error.response?.data?.error || error.message);
      }
    } else if (editingId) {
      if (!carForm.cost || carForm.location_id === '') {
        alert('Please fill cost and location');
        return;
      }
      try {
        const params = new URLSearchParams();
        params.append('id', editingId);
        params.append('location_id', carForm.location_id);
        params.append('cost', carForm.cost);
        params.append('miles', carForm.miles || 0);
        
        await axios.post(`${API_URL}/edit_car/?${params.toString()}`);
        alert('Car updated successfully');
        setEditingId(null);
        setCarForm({ make: '', model: '', year: '', location_id: '', drivetrain: '', color: '', miles: '', type: '', cost: '' });
        fetchCars();
      } catch (error) {
        alert('Error: ' + error.response?.data?.error || error.message);
      }
    }
  };

  const handleDeleteCar = async (id) => {
    alert('Car deletion is not allowed');
  };

  const handleEditCar = (car) => {
    setEditingId(car.id);
    setIsAddingCar(false);
    setCarForm({ 
      make: car.make || '',
      model: car.model || '',
      year: car.year || '',
      location_id: car.location_id || '',
      drivetrain: car.drivetrain || '',
      color: car.color || '',
      miles: car.miles || '',
      type: car.type || '',
      cost: car.cost || ''
    });
  };

  const handleAddUser = async () => {
    if (!editingId) return; 
    try {
      await axios.post(`${API_URL}/edit_user/?id=${editingId}&admin=${userForm.admin ? 1 : 0}`);
      alert('User updated successfully');
      setEditingId(null);
      setUserForm({ admin: false });
      fetchUsers();
    } catch (error) {
      alert('Error: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleEditUser = (user) => {
    setUserForm({ admin: user.admin == 1 });
    setEditingId(user.id);
  };


  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`} onClick={() => setActiveTab('cars')}>
          🚗 Manage Cars
        </button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          👥 Manage Users
        </button>
      </div>


      {activeTab === 'cars' && (
        <div className="admin-section">
          <h2>Cars Management</h2>
          <div className="form-section">
            <h3>{isAddingCar ? 'Add New Car' : editingId ? `Edit Car #${editingId}` : 'Select a car to edit or add a new one'}</h3>
            {(editingId || isAddingCar) && (
              <div className="form-grid">
                <input 
                  type="text" 
                  placeholder="Make" 
                  value={carForm.make} 
                  onChange={(e) => setCarForm({ ...carForm, make: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Model" 
                  value={carForm.model} 
                  onChange={(e) => setCarForm({ ...carForm, model: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Year" 
                  value={carForm.year} 
                  onChange={(e) => setCarForm({ ...carForm, year: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Location ID" 
                  value={carForm.location_id} 
                  onChange={(e) => setCarForm({ ...carForm, location_id: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Drivetrain" 
                  value={carForm.drivetrain} 
                  onChange={(e) => setCarForm({ ...carForm, drivetrain: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Color" 
                  value={carForm.color} 
                  onChange={(e) => setCarForm({ ...carForm, color: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Miles" 
                  value={carForm.miles} 
                  onChange={(e) => setCarForm({ ...carForm, miles: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Type" 
                  value={carForm.type} 
                  onChange={(e) => setCarForm({ ...carForm, type: e.target.value })} 
                />
                <input 
                  type="number" 
                  placeholder="Cost" 
                  value={carForm.cost} 
                  onChange={(e) => setCarForm({ ...carForm, cost: e.target.value })} 
                />
              </div>
            )}
            {(editingId || isAddingCar) && (
              <>
                <button onClick={handleAddCar} className="submit-btn">{isAddingCar ? 'Add Car' : 'Update Car'}</button>
                <button onClick={() => { setEditingId(null); setIsAddingCar(false); setCarForm({ make: '', model: '', year: '', location_id: '', drivetrain: '', color: '', miles: '', type: '', cost: '' }); }} className="cancel-btn">Cancel</button>
              </>
            )}
            {!editingId && !isAddingCar && (
              <button onClick={() => setIsAddingCar(true)} className="submit-btn">Add New Car</button>
            )}
          </div>

          <div className="table-section">
            {loading ? <p>Loading...</p> : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Cost</th>
                    <th>Location ID</th>
                    <th>In Use</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id}>
                      <td>{car.id}</td>
                      <td>{car.make}</td>
                      <td>{car.model}</td>
                      <td>{car.year}</td>
                      <td>${car.cost}</td>
                      <td>{car.location_id}</td>
                      <td>{car.in_use ? '✓' : '✗'}</td>
                      <td>
                        <button onClick={() => handleEditCar(car)} className="edit-btn">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>Users Management</h2>
          <div className="form-section">
            <h3>{editingId ? 'Edit User Admin Status' : 'Select a user to edit'}</h3>
            {editingId && (
              <div className="form-grid">
                <label>
                  <input 
                    type="checkbox" 
                    checked={userForm.admin} 
                    onChange={(e) => setUserForm({ admin: e.target.checked })} 
                  />
                  Is Admin
                </label>
              </div>
            )}
            {editingId && (
              <>
                <button onClick={handleAddUser} className="submit-btn">Update User</button>
                <button onClick={() => { setEditingId(null); setUserForm({ admin: false }); }} className="cancel-btn">Cancel</button>
              </>
            )}
          </div>

          <div className="table-section">
            {loading ? <p>Loading...</p> : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Created At</th>
                    <th>Admin</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>{user.admin ? 'Yes' : 'No'}</td>
                      <td>
                        <button onClick={() => handleEditUser(user)} className="edit-btn">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'rentals' && (
        <div className="admin-section">
          <h2>Rentals Management</h2>
          <div className="table-section">
            {loading ? <p>Loading...</p> : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Car</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((rental) => (
                    <tr key={rental.id}>
                      <td>{rental.id}</td>
                      <td>{rental.user_name}</td>
                      <td>{rental.make} {rental.model}</td>
                      <td>{rental.start_date}</td>
                      <td>{rental.end_date}</td>
                      <td>${rental.total_cost}</td>
                      <td>{rental.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
