import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearErrors,
  fetchProductDetails,
} from '../redux/actions/productActions';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Button, Rating } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ReviewCard from '../helper-components/ReviewCard';
import Loading from '../helper-components/Loading';
import { useSnackbar } from 'notistack';
import Metadata from '../helper-components/Metadata';
import { addToCart, clearCartErrors } from '../redux/actions/cartActions';
import RatingDialog from '../helper-components/RatingDialog';
import { getMyOrders } from '../redux/actions/orderActions';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../helper-components/ProductCard';

export default function ProductDetails({ match, history }) {
  const [quantity, setQuantity] = useState(1);
  const [addedQuantity, setAddedQuantity] = useState(0);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [reviews, setReviews] = useState([]);

  const reviewsRef = useRef();
  const watching = useRef(false);

  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, product, error } = useSelector(
    (state) => state.productDetails,
  );
  const { orders } = useSelector((state) => state.myOrders);
  const { success: reviewSuccess } = useSelector((state) => state.reviews);
  const {
    loading: reviewLoading,
    success,
    error: reviewError,
  } = useSelector((state) => state.newReview);
  const {
    cartItems,
    error: cartError,
    loading: cartLoading,
    completed,
  } = useSelector((state) => state.cart);

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    // fetch data on page reload
    if (!product?._id) dispatch(fetchProductDetails(match.params.id));

    // fetch product if it is not in the store or when review is successful
    if (product?._id !== match.params.id || success)
      dispatch(fetchProductDetails(match.params.id));

    if (error) {
      dispatch(clearErrors());
      enqueueSnackbar(error, {
        variant: 'error',
      });
      setTimeout(() => {
        window.history.back();
      }, 3000);
    }
  }, [
    dispatch,
    error,
    enqueueSnackbar,
    match.params.id,
    success,
    reviewSuccess,
    product?._id,
  ]);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (product?.reviews.length > 0 && isAuthenticated) {
      const reviewed = product.reviews.some(
        (review) => review.userId === user?._id,
      );
      setReviewed(reviewed);

      if (reviewed) {
        // Shift my review to first position
        const reviewIndex = product.reviews.findIndex(
          (review) => review.userId === user._id,
        );
        const temp = [...product.reviews];
        temp.splice(reviewIndex, 1);
        temp.unshift(product.reviews[reviewIndex]);
        setReviews(temp);
      } else setReviews(product?.reviews);
    } else setReviews(product?.reviews);
  }, [product?.reviews, user, reviewSuccess, product, isAuthenticated]);

  useEffect(() => {
    if (cartError) {
      if (cartError === 'Please login to continue!') {
        dispatch(clearCartErrors());
        enqueueSnackbar(
          <div className="flex items-center">
            <p className="mr-4">Please login to continue!</p>
            <Button
              variant="contained"
              sx={{ color: 'white' }}
              onClick={() => {
                closeSnackbar();
                history.push('/login?redirect=' + window.location.pathname);
              }}
            >
              Login
            </Button>
          </div>,
        );
      } else {
        dispatch(clearCartErrors());
        enqueueSnackbar(cartError, {
          variant: 'error',
        });
      }
    }
    if (reviewError) {
      enqueueSnackbar(reviewError, {
        variant: 'error',
      });
      dispatch(clearCartErrors());
    }
    if (success) {
      enqueueSnackbar('Thanks for your review', {
        variant: 'success',
      });
      dispatch({
        type: 'CLEAR_NEW_REVIEW',
      });
    }
  }, [
    reviewError,
    dispatch,
    enqueueSnackbar,
    success,
    cartError,
    history,
    closeSnackbar,
  ]);

  //find the item in the cart
  useEffect(() => {
    if (product) {
      const item = cartItems.find((item) => {
        return item.productId === product._id;
      });
      if (item) {
        setAddedQuantity(item.quantity);
      }
    }
  }, [cartItems, product]);

  // Watch for changes in the cartItems array
  useEffect(() => {
    if (!completed) {
      watching.current = true;
    }
    if (completed && watching.current) {
      enqueueSnackbar('Item added to cart', {
        variant: 'success',
      });
      watching.current = false;
    }
  }, [completed, enqueueSnackbar]);

  function increaseQuantity() {
    if (quantity < product.stock) setQuantity(quantity + 1);
  }

  function decreaseQuantity() {
    if (quantity > 1) setQuantity(quantity - 1);
  }

  async function handleAddToCart(quantity) {
    dispatch(addToCart(product._id, quantity));
  }

  function handleSubmitReviewClick() {
    // Find if the user has ordered the product
    let hasOrdered = 0;
    orders?.forEach((order) => {
      if (order.orderStatus === 'Delivered')
        order.orderItems.forEach((item) => {
          if (item.productId === product._id) {
            return hasOrdered++;
          }
        });
      if (hasOrdered > 0) return;
    });
    if (hasOrdered) {
      setRatingDialogOpen(true);
    } else {
      enqueueSnackbar(
        'Buy this product to add a review. If ordered, please wait until delivery',
        {
          variant: 'error',
        },
      );
    }
  }

  if (loading || reviewLoading) {
    return <Loading />;
  }

  return product?.images ? (
    <motion.div
      className="my-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
    >
      <Metadata title={product.name + '--The shoe store'} />
      <div className="flex flex-col items-center justify-center px-5 border-b lg:flex-row">
        <div className="max-w-[300px]">
          <Carousel>
            {product.images.map((image, index) => (
              <img
                alt="product"
                className="object-contain w-full h-full cursor-pointer"
                key={index}
                src={image.url}
              />
            ))}
          </Carousel>
        </div>
        <div className="mx-5 lg:mt-56">
          <h3 className="mb-2 text-xl">{product.name}</h3>
          <div className="text-gray-500 max-w-[400px] mb-3">
            {product.description}
          </div>
          <div className="flex items-baseline space-x-4">
            <h5 className="text-3xl">₹{product.price}</h5>
            <span>
              {product.stock > 0 ? (
                product.stock > 9 ? (
                  <span className="text-lg font-bold text-green-500">
                    In stock
                  </span>
                ) : (
                  <span className="text-lg font-bold text-green-500">
                    Hot cake!!.. Only {product.stock} left in stock.
                  </span>
                )
              ) : (
                <span className="text-lg font-bold text-red-500">
                  Out of stock
                </span>
              )}
            </span>
          </div>
          <br />
          {product.reviews.length > 0 ? (
            <div
              onClick={() =>
                reviewsRef.current.scrollIntoView({ behavior: 'smooth' })
              }
              className="flex items-center cursor-pointer"
            >
              <Rating
                sx={{ marginRight: '10px' }}
                value={product.rating}
                precision={0.5}
                readOnly
              />
              <span>({product.reviews.length})</span>
            </div>
          ) : (
            <div className="text-sm text-gray-400">No reviews yet</div>
          )}
          <br />
          <div className="flex flex-col items-center justify-between py-4 mb-1 sm:flex-row sm:space-x-4">
            <div className="inline-flex items-center px-2 py-1 my-1 border border-yellow-600 rounded-md">
              <Button
                disabled={!product.stock}
                onClick={decreaseQuantity}
                className="px-2"
              >
                <RemoveIcon />
              </Button>
              <span className="text-xl font-bold">{quantity}</span>
              <Button
                disabled={!product.stock}
                onClick={increaseQuantity}
                className="px-2"
              >
                <AddIcon />
              </Button>
            </div>
            <Button
              onClick={() => handleAddToCart(quantity)}
              sx={{
                padding: '10px 30px',
              }}
              disabled={
                !product.stock ||
                cartLoading ||
                addedQuantity + quantity > product.stock
              }
              color="primary"
              variant="contained"
            >
              {addedQuantity + quantity > product.stock
                ? 'Out of stock'
                : cartLoading
                ? 'Adding...'
                : 'Add to cart'}
            </Button>
          </div>
        </div>
      </div>
      {isAuthenticated ? (
        reviewed ? null : (
          <div className="flex justify-center pt-6">
            <Button variant="outlined" onClick={handleSubmitReviewClick}>
              Submit a review
            </Button>
          </div>
        )
      ) : (
        <div className="flex justify-center pt-6 text-xl text-orange-500">
          <Link to={'/login?redirect=' + window.location.pathname}>
            Login to submit a review
          </Link>
        </div>
      )}

      {reviews?.length > 0 ? (
        <>
          <h3 className="my-4 text-xl text-center">Reviews</h3>
          <div
            ref={reviewsRef}
            className="flex items-stretch px-10 overflow-auto snap-x md:snap-none"
          >
            {reviews.map((review, index) => (
              <ReviewCard review={review} key={index} />
            ))}
          </div>
        </>
      ) : (
        <h4 className="flex justify-center my-6 text-2xl">No reviews yet</h4>
      )}

      {/* RELATED PRODUCTS */}
      <h3 className="pt-6 my-4 text-xl text-center border-b">
        Related products
      </h3>
      <div className="flex items-center px-10 overflow-auto snap-x md:snap-none">
        {products
          .slice(0, products.length - 1)
          .map((relatedProduct) =>
            relatedProduct._id === product._id ? null : (
              <ProductCard product={relatedProduct} key={relatedProduct._id} />
            ),
          )}
      </div>

      <RatingDialog
        productId={product._id}
        open={ratingDialogOpen}
        setOpen={setRatingDialogOpen}
      />
    </motion.div>
  ) : null;
}
