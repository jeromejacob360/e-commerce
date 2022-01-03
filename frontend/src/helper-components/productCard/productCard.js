import * as React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="m-4">
      <div className="p-4 shadow-md flex flex-col items-center border h-full w-80">
        <img
          className="h-60 w-auto object-cover"
          src={product.images[0].url}
          alt="product"
        />
        <h3 className="text-xl my-2">{product.name}</h3>
        <p className="text-gray-500">{product.description}</p>
        <p>Rs.{product.price}</p>
        {product.rating && <p>Rating: {product.rating}</p>}
        <p>{product.numOfReviews} reviews</p>
      </div>
    </Link>
  );
}
