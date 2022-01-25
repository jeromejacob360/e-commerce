import { Rating } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} target={'_blank'} className="m-4">
      <div
        className="flex-row items-center justify-between hidden h-full p-4 border shadow-md sm:flex sm:flex-col w-[295px]"
        data-testid="product-card"
      >
        <div>
          {product?.images?.length > 0 && (
            <img
              className="object-contain w-auto h-20 sm:h-60"
              src={product.images[0].url}
              alt="product"
            />
          )}
          <h3 className="my-2 text-xl text-gray-500 capitalize">
            {product.name.toLowerCase()}
          </h3>
        </div>
        <p className="text-gray-500">{product.description}</p>
        <p>₹{product.price}</p>
        {product.reviews.length > 0 ? (
          <div className="flex space-x-2">
            <Rating value={product.rating} precision={0.5} readOnly />
            <p>({product.reviews.length})</p>
          </div>
        ) : (
          <div className="text-sm text-gray-400">No reviews yet</div>
        )}
      </div>

      <div
        className="flex flex-row items-center justify-between h-full p-4 space-x-4 border shadow-md sm:hidden sm:flex-col w-80"
        data-testid="product-card"
      >
        <div>
          {product?.images?.length > 0 && (
            <img
              className="object-contain w-auto h-20 sm:h-60"
              src={product.images[0].url}
              alt="product"
            />
          )}
          <h3 className="my-2 text-xl text-gray-500 capitalize">
            {product.name.toLowerCase()}
          </h3>
        </div>
        <div>
          <p className="text-gray-500">{product.description}</p>
          <p>₹{product.price}</p>
          {product.reviews.length > 0 ? (
            <div className="flex space-x-2">
              <Rating value={product.rating} precision={0.5} readOnly />
              <p>({product.reviews.length})</p>
            </div>
          ) : (
            <div className="text-sm text-gray-400">No reviews yet</div>
          )}
        </div>
      </div>
    </Link>
  );
}
