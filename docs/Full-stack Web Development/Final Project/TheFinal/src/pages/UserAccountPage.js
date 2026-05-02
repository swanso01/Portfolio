import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

function UserAccountPage() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.email) {
        console.error('User is not logged in.');
        return;
      }

      try {

        const q = query(collection(db, 'orders'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user || !user.email) {
    return <Navigate to="/LoginPage" />;
  }

  return (
    <div>
      <h2>My Account</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.name || 'N/A'}</p>

      <h3>Order History:</h3>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <strong>Order placed on {order.timestamp}</strong>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name}: {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders yet.</p>
      )}
    </div>
  );
}

export default UserAccountPage;