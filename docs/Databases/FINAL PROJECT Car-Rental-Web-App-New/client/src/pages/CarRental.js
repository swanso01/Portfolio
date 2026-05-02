import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CarRental.css';

function CarRental() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
  });
  const [totalCost, setTotalCost] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const fetchCarDetails = async (id) => {
    try {
      const resp = await axios.get('http://localhost:8000/cars');
      const raw = resp?.data?.data ?? resp?.data ?? [];
      const found = raw.find(c => String(c.id ?? c.car_id ?? c.carId) === String(id));
      if (found) {
        const normalized = {
          id: found.id ?? found.car_id ?? found.carId,
          year: found.year,
          make: found.make,
          model: found.model,
          license_plate: found.license_plate ?? found.licensePlate ?? found.plate,
          daily_rate: found.daily_rate ?? found.cost ?? found.price ?? found.dailyRate,
          availability: typeof found.availability !== 'undefined' ? Boolean(found.availability) : (found.in_use !== undefined ? Boolean(found.in_use) : true),
          location_id: found.location_id ?? found.locationId ?? found.location,
          type: found.type ?? found.car_type,
        };
        setCar(normalized);
      } else {
        setError('Car not found');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch car details');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carId) {
      fetchCarDetails(carId);
    } else {
      setError('No car selected');
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const resp = await axios.get('http://localhost:8000/get_locations/');
        const raw = resp?.data?.data ?? [];
        const list = Array.isArray(raw) ? raw : [];
        setLocations(list);
        if (car && car.location_id) {
          const loc = list.find(l => l.id === car.location_id);
          setSelectedLocation(loc ? loc.name : `Location ${car.location_id}`);
        }
      } catch (e) {
      }
    };
    if (car) fetchLocations();
  }, [car]);

  const calculateCost = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (days > 0 && car) {
        setTotalCost(days * car.daily_rate);
      } else {
        setTotalCost(0);
      }
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    calculateCost(
      name === 'startDate' ? value : formData.startDate,
      name === 'endDate' ? value : formData.endDate
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const userData = localStorage.getItem('userData');
      const user = JSON.parse(userData);
      const userId = user[0].id;
      if (!userId) {
        setError('Please log in to book a car');
        setSubmitting(false);
        return;
      }

      const response = await axios.post('http://localhost:8000/reserve_car/', {
        user_id: userId,
        car_id: carId,
        date_start: formData.startDate
      });

      if (response.data.data) {
        setSuccessMessage('✓ Rental booked successfully!');
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      } else {
        setError('Failed to create rental');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book rental');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="car-rental-container">
        <div className="loading-spinner">Loading car details...</div>
      </div>
    );
  }

  if (error && !car) {
    return (
      <div className="car-rental-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/cars')} className="back-button">
          ← Back to Cars
        </button>
      </div>
    );
  }

  return (
    <div className="car-rental-container">
      <div className="rental-header">
        <button onClick={() => navigate('/cars')} className="back-button-icon">
          ← Back
        </button>
        <h1>Book Your Rental</h1>
      </div>

      <div className="rental-content">
        <div className="car-details-section">
          <div className="car-details-card">
            <div className="car-image-large">
              <div className="car-emoji">🚗</div>
            </div>
            <div className="car-info">
              <h2 className="car-title">{car?.year} {car?.make} {car?.model}</h2>
              <div className="car-specs">
                <div className="spec-item">
                  <span className="spec-label">License Plate:</span>
                  <span className="spec-value">{car?.license_plate}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Daily Rate:</span>
                  <span className="spec-value price">${car?.daily_rate?.toFixed(2)}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Status:</span>
                  <span className={`spec-value ${car?.availability ? 'available' : 'unavailable'}`}>
                    {car?.availability ? '✓ Available' : '✗ Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rental-form-section">
          <div className="form-card">
            <h3>Rental Details</h3>

            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="error-alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  value={selectedLocation}
                  disabled
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleDateChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                  className="form-input"
                />
              </div>

              <div className="cost-summary">
                <div className="cost-item">
                  <span>Daily Rate:</span>
                  <span>${car?.daily_rate?.toFixed(2)}</span>
                </div>
                <div className="cost-item">
                  <span>Number of Days:</span>
                  <span>
                    {formData.startDate && formData.endDate
                      ? Math.ceil(
                          (new Date(formData.endDate) - new Date(formData.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )
                      : 0}
                  </span>
                </div>
                <div className="cost-item total">
                  <span>Total Cost:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={submitting || !car?.availability}
              >
                {submitting ? 'Processing...' : 'Complete Booking'}
              </button>
            </form>

            <div className="terms-notice">
              <p>
                By clicking "Complete Booking", you agree to our rental terms and conditions.
                You will receive a confirmation email shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarRental;
