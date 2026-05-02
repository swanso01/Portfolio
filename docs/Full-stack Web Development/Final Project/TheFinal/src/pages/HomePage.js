import React from 'react';
import SpecialOfferCard from '../components/SpecialOfferCard';

function HomePage() {
  const specialOffer = {
    title: 'Summer Sale!',
    description: 'Get 20% off on all labor services this summer.',
    discount: '20%'
  };
  const specialOffer2 = {
    title: 'March Special!',
    description: 'Get 15% off on all Materials.',
    discount: '15%'
  };

  return (
    <div>
      <h2>Welcome to SolidBase Construction!</h2>
      <p>We provide construction, labor, and materials services. Order now easily!</p>
      <SpecialOfferCard offer={specialOffer} />
      <SpecialOfferCard offer={specialOffer2} />
    </div>
  );
}

export default HomePage;