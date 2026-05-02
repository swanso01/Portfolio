import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Create user context
export const UserContext = createContext();

// Provide user data to app
export const UserProvider = ({ children }) => {
  // State for user and services
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);

  // Fetch services from Firestore
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
  }, []);

  // Check user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          isAdmin: firebaseUser.email === 'admin@gmail.com',
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Provide user and services to app
  return (
    <UserContext.Provider value={{ user, setUser, services, setServices }}>
      {children}
    </UserContext.Provider>
  );
};