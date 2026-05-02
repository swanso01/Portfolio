import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import '../App.css';

function OrderMaterialsPage() {
  const { user, setUser, services } = useContext(UserContext);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemName, value, maxQuantity) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    if (maxQuantity === 0 || quantity <= maxQuantity) {
      setQuantities((prev) => ({
        ...prev,
        [itemName]: quantity,
      }));
    } else {
      alert(`You cannot order more than ${maxQuantity} of ${itemName}`);
    }
  };

  const handleSelectItem = (item) => {
    if (!user) {
      alert('Please log in to add items to the cart.');
      return;
    }

    const quantityToAdd = quantities[item.name] || 1;

    setUser({
      ...user,
      selectedItems: [...(user.selectedItems || [])].reduce((acc, curr) => {
        if (curr.name === item.name) {
          const newQuantity = curr.quantity + quantityToAdd;
          if (item.maxQuantity === 0 || newQuantity <= item.maxQuantity) {
            return [...acc, { ...curr, quantity: newQuantity }];
          } else {
            alert(`You cannot order more than ${item.maxQuantity} of ${item.name}`);
            return acc;
          }
        }
        return [...acc, curr];
      }, []).concat(
        user.selectedItems && user.selectedItems.some((i) => i.name === item.name)
          ? []
          : [{ name: item.name, quantity: quantityToAdd }]
      ),
    });
  };

  return (
    <div className="App-order-materials">
      <h2>Order Materials</h2>
      <div className="App-order-list">
        {services.map((service, index) => (
          <div key={index} className="App-order-item">
            <span>{service.name}</span>
            <input
              type="number"
              min="1"
              value={quantities[service.name] || 1}
              onChange={(e) => handleQuantityChange(service.name, e.target.value, service.maxQuantity)}
              className="App-order-quantity-input"
            />
            <button
              className="App-order-button"
              onClick={() => handleSelectItem(service)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderMaterialsPage;