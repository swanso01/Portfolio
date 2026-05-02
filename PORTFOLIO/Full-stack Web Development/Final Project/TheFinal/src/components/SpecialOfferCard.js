import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import '../App.css';

function SpecialOfferCard({ offer }) {
  const { user, setUser } = useContext(UserContext);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please log in to add items to the cart.');
      return;
    }

    const newCartItem = {
      name: offer.title,
      quantity: 1,
    };

    setUser({
      ...user,
      selectedItems: [...(user.selectedItems || []), newCartItem],
    });

    alert(`${offer.title} has been added to your cart!`);
  };

  return (
    <div className="App-special-offer-card">
      <h4>{offer.title}</h4>
      <p>{offer.description}</p>
      <p>Discount: {offer.discount}</p>
      <button className="App-special-offer-button" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default SpecialOfferCard;