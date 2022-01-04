import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearErrors,
  fetchProductDetails,
} from '../../redux/actions/productActions';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Button, Rating } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ReviewCard from '../../helper-components/ReviewCard';
import Loading from '../../helper-components/loading/Loading';
import { useAlert } from 'react-alert';
import Metadata from '../../metadata';

export default function ProductDetails({ match }) {
  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    dispatch(fetchProductDetails(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
      alert.error(error.message + '\nRedirecting...');
      setTimeout(() => {
        window.history.back();
      }, 3000);
    }
  });

  const { loading, product, error } = useSelector(
    (state) => state.productDetails,
  );

  if (loading) {
    return <Loading />;
  }

  return product?.images ? (
    <div className="my-10">
      <Metadata title={product.name + '--Virtual shop'} />
      <div className="flex flex-col items-center justify-center px-5 border-b lg:flex-row">
        <div className="max-w-[200px]">
          <Carousel>
            {product.images.map((image, index) => (
              <img
                alt="product"
                className="object-cover w-auto h-full"
                key={index}
                src={image.url}
              />
            ))}
          </Carousel>
        </div>
        <div className="mx-5 my-auto">
          <h3 className="mb-4 text-xl">{product.name}</h3>
          <div className="text-gray-500 max-w-[400px] mb-4">
            {product.description}
          </div>
          <div className="flex items-baseline space-x-4">
            <h5 className="text-3xl">${product.price}</h5>
            <span>
              {product.stock > 0 ? (
                <span className="text-lg font-bold text-green-500">
                  In stock
                </span>
              ) : (
                <span className="text-lg font-bold text-red-500">
                  Out of stock
                </span>
              )}
            </span>
          </div>
          <br />
          <div className="flex items-center">
            <Rating
              sx={{ marginRight: '10px' }}
              value={product.rating}
              precision={0.5}
              readOnly
            />
            <span>({product.reviews.length} reviews)</span>
          </div>
          <br />
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center py-1 mr-2 border border-blue-600 rounded-lg">
              <Button disabled={!product.stock} className="px-2">
                <RemoveIcon />
              </Button>
              <span className="text-xl font-bold">0</span>
              <Button disabled={!product.stock} className="px-2">
                <AddIcon />
              </Button>
            </div>
            <Button
              sx={{
                padding: '10px 30px',
              }}
              disabled={!product.stock}
              color="primary"
              variant="contained"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
      {product.reviews.length > 0 ? (
        <>
          <h3 className="my-4 text-xl text-center">Reviews</h3>
          <div className="flex flex-col items-center justify-center w-screen overflow-auto md:items-stretch md:flex-row">
            {product.reviews.map((review, index) => (
              <ReviewCard review={review} key={index} />
            ))}
          </div>
        </>
      ) : (
        <h4 className="flex justify-center my-6 text-2xl">No reviews yet</h4>
      )}
    </div>
  ) : null;
}
