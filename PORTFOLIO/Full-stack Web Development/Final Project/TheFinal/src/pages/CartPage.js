import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../App.css';

function CartPage() {
  const { user, setUser } = useContext(UserContext);

  if (!user || !user.selectedItems || user.selectedItems.length === 0) {
    return <div className="App-cart-empty">Your cart is empty.</div>;
  }

  const handleRemoveItem = (itemName) => {
    if (!user) {
      console.error('User is undefined');
      return;
    }

    setUser({
      ...user,
      selectedItems: user.selectedItems.reduce((acc, curr) => {
        if (curr.name === itemName) {
          const newQuantity = curr.quantity - 1;
          if (newQuantity > 0) {
            return [...acc, { ...curr, quantity: newQuantity }];
          }
          return acc;
        }
        return [...acc, curr];
      }, []),
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      console.error('User is undefined');
      alert('Please log in to place an order.');
      return;
    }

    if (!user.selectedItems || user.selectedItems.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const order = {
      items: user.selectedItems,
      timestamp: new Date().toLocaleString(),
      email: user.email,
    };

    try {
     
      const orderRef = await addDoc(collection(db, 'orders'), order);

      
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        orders: [...(user.orders || []), { id: orderRef.id, ...order }],
      });


      setUser({
        ...user,
        selectedItems: [],
        orders: [...(user.orders || []), { id: orderRef.id, ...order }],
      });

      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order. Please try again.');
    }
  };

  return (
    <div className="App-cart">
      <h2>Your Cart</h2>
      <ul>
        {user.selectedItems.map((item, index) => (
          <li key={index} className="App-cart-item">
            <span>{item.name}</span>
            <div className="App-cart-actions">
              <span>Quantity: {item.quantity}</span>
              <button
                className="App-cart-remove-button"
                onClick={() => handleRemoveItem(item.name)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button className="App-cart-order-button" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}

export default CartPage;