import { Rating } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="m-4">
      <div className="flex flex-col items-center justify-between h-full p-4 border shadow-md w-80">
        {product?.images?.length > 0 && (
          <img
            className="object-cover w-auto h-60"
            src={product.images[0].url}
            alt="product"
          />
        )}
        <h3 className="my-2 text-xl">{product.name}</h3>
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
