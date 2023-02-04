import React from 'react';

const Property = ({ property }) => (
  <div>
    <h2>{property.title}</h2>
    <p>{property.description}</p>
    <img src={property.image} alt={property.title} />
    <p>${property.price} per night</p>
  </div>
);

export default Property;