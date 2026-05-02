import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Cars.css';

function Cars({ isLoggedIn }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ location_id: '', make: '', color: '', drivetrain: '' });
  const [filterOptions, setFilterOptions] = useState({ locations: [], makes: [], colors: [], drivetrains: [] });

  

  const normalize = (c) => ({
    id: c.id ?? c.car_id ?? c.carId,
    year: c.year ? Number(c.year) : null,
    make: c.make ?? '',
    model: c.model ?? '',
    image: c.image ?? c.picture ?? c.photo ?? c.img ?? null,
    cost: (typeof c.cost !== 'undefined' && c.cost !== null) ? Number(c.cost) : 0,
    color: c.color ?? '',
    drivetrain: c.drivetrain ?? '',
    availability: (typeof c.availability !== 'undefined') ? Boolean(c.availability) : (typeof c.in_use !== 'undefined' ? Boolean(c.in_use) : true),
  });

  useEffect(() => {
    let isMounted = true;

    const fetchFilterOptions = async () => {
      try {
        const [locRes, makeRes, colorRes, driveRes] = await Promise.all([
          axios.get('http://localhost:8000/get_locations/'),
          axios.get('http://localhost:8000/get_makes/'),
          axios.get('http://localhost:8000/get_colors/'),
          axios.get('http://localhost:8000/get_drivetrains/')
        ]);
        
        if (isMounted) {
          setFilterOptions({
            locations: locRes.data?.data?.map(l => ({ id: l.id, name: l.name })) || [],
            makes: makeRes.data?.data || [],
            colors: colorRes.data?.data || [],
            drivetrains: driveRes.data?.data || []
          });
        }
      } catch (err) {
        console.error('Failed to fetch filter options');
      }
    };

    fetchFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCars = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.location_id) params.append('location_id', filters.location_id);
        if (filters.make) params.append('make', filters.make);
        if (filters.color) params.append('color', filters.color);
        if (filters.drivetrain) params.append('drivetrain', filters.drivetrain);
        
        const url = `http://localhost:8000/get_cars/?${params.toString()}`;
        const response = await axios.get(url);
        const raw = response?.data?.data ?? response?.data ?? [];
        const list = Array.isArray(raw) ? raw.map(normalize) : [];
        if (isMounted) {
          setCars(list);
          setError('');
        }
      } catch (err) {
        if (isMounted) setError('Failed to fetch cars');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCars();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleBookNow = (carId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(`/rental/${carId}`);
  };

  if (loading) return <div className="loading">Loading cars...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="cars-container">
      <h2>Available Cars</h2>
      <div className="filters-section">
        <div className="filter-group">
          <label>Location:</label>
          <select name="location_id" value={filters.location_id} onChange={handleFilterChange}>
            <option value="">All Locations</option>
            {filterOptions.locations?.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Make:</label>
          <select name="make" value={filters.make} onChange={handleFilterChange}>
            <option value="">All Makes</option>
            {filterOptions.makes?.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Color:</label>
          <select name="color" value={filters.color} onChange={handleFilterChange}>
            <option value="">All Colors</option>
            {filterOptions.colors?.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Drivetrain:</label>
          <select name="drivetrain" value={filters.drivetrain} onChange={handleFilterChange}>
            <option value="">All Drivetrains</option>
            {filterOptions.drivetrains?.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <div className="car-image">
              {car.image ? (
                <img src={car.image} alt={`${car.make} ${car.model}`} />
              ) : (
                '🚗'
              )}
            </div>
            <h3>{car.year} {car.make} {car.model}</h3>
            <p className="color">{car.color}</p>
            <p className="drivetrain">{car.drivetrain}</p>
            <p className="price">${car.cost}/day</p>
            <p className={car.availability ? 'available' : 'unavailable'}>
              {car.availability ? 'Available' : 'Not Available'}
            </p>
            <button
              className="book-btn"
              disabled={!car.availability}
              onClick={() => handleBookNow(car.id)}
            >
              {car.availability ? 'Book Now' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cars;
