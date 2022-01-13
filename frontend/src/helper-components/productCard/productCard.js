import { Rating } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="m-4">
      <div className="p-4 shadow-md flex flex-col items-center border h-full w-80 justify-between">
        <img
          className="h-60 w-auto object-cover"
          src={product.images[0].url}
          alt="product"
        />
        <h3 className="text-xl my-2">{product.name}</h3>
        <p className="text-gray-500">{product.description}</p>
        <p>₹{product.price}</p>
        <div className="flex space-x-2">
          <Rating value={product.rating} precision={0.5} readOnly />
          <p>({product.reviews.length})</p>
        </div>
      </div>
    </Link>
  );
}
