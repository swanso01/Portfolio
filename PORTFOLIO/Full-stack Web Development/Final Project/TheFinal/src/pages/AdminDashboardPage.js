import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../App.css';

function AdminDashboardPage() {
  const { services, setServices } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const [newService, setNewService] = useState('');
  const [maxQuantity, setMaxQuantity] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const fetchedServices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [setServices]);

  const handleAddService = async () => {
    if (newService.trim() !== '') {
      const service = { name: newService.trim(), maxQuantity: parseInt(maxQuantity) || 0 };

      try {

        await addDoc(collection(db, 'services'), service);


        setServices([...services, service]);
        setNewService('');
        setMaxQuantity(0);
        alert('Service added successfully!');
      } catch (error) {
        console.error('Error adding service:', error);
        alert('An error occurred while adding the service. Please try again.');
      }
    } else {
      alert('Service name cannot be blank!');
    }
  };

  const handleRemoveService = (serviceName) => {
    setServices(services.filter((service) => service.name !== serviceName));
  };

  if (!user || !user.isAdmin) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Access Denied</h2>
        <p>You must be logged in as an administrator to view this page.</p>
        <a href="/">Go to Home</a>
      </div>
    );
  }

  return (
    <div className="App-admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="App-admin-input">
        <input
          type="text"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          placeholder="New service name"
        />
        <input
          type="number"
          min="0"
          value={maxQuantity}
          onChange={(e) => setMaxQuantity(e.target.value)}
          placeholder="Max quantity (0 = no limit)"
        />
        <button onClick={handleAddService}>Add Service</button>
      </div>

      <h3>Current Services</h3>
      <ul className="App-admin-services">
        {services.map((service, index) => (
          <li key={index} className="App-admin-service-item">
            {service.name} (Max: {service.maxQuantity === 0 ? 'No limit' : service.maxQuantity})
            <button onClick={() => handleRemoveService(service.name)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboardPage;