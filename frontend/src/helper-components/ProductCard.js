import { Button, Rating } from '@mui/material';
import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { addToCart, clearCartErrors } from '../redux/actions/cartActions';
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import shoePlaceHolder from '../assets/shoePlaceHolder.jpg';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const [addedQuantity, setAddedQuantity] = React.useState(0);

  const history = useHistory();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    cartItems,
    error: cartError,
    loading: cartLoading,
    completed,
  } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  React.useEffect(() => {
    if (completed) {
      enqueueSnackbar('Item added to cart', {
        variant: 'success',
      });
    }
    if (cartError) {
      enqueueSnackbar(cartError, {
        variant: 'error',
      });
      dispatch(clearCartErrors());
    }
    if (product) {
      const item = cartItems?.find((item) => {
        return item.productId === product._id;
      });
      if (item) {
        setAddedQuantity(item.quantity);
      }
    }
  }, [
    cartError,
    cartItems,
    completed,
    dispatch,
    enqueueSnackbar,
    history,
    product,
  ]);

  function handleAddToCart(e, product) {
    e.preventDefault();
    if (!isAuthenticated) {
      return enqueueSnackbar(
        <div className="flex items-center">
          <p className="mr-4">Please login to continue!</p>
          <Button
            variant="contained"
            sx={{ color: 'white' }}
            onClick={() => {
              history.push('/login?redirect=' + window.location.pathname);
            }}
          >
            Login
          </Button>
        </div>,
      );
    }
    dispatch(addToCart(product._id, 1));
  }
  return (
    <Link className="pl-4 m-2 group snap-start" to={`/product/${product?._id}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="flex-row group overflow-hidden relative transition-all hover:pb-20 items-center justify-between hidden h-[470px] p-4 border shadow-md hover:shadow-xl sm:flex sm:flex-col w-[295px]"
        data-testid="product-card"
      >
        <div>
          {product?.images?.length > 0 && (
            <div className="relative pr-32 w-[250px] h-60 duration-500">
              <div className="flex space-x-10 absolute left-0 delay-500 group-hover:-left-[calc(100%+30px)] duration-500 w-full">
                <img
                  className="object-contain w-full h-auto sm:h-60"
                  src={product.images[0].url}
                  onError={(e) => (e.target.src = shoePlaceHolder)}
                  alt="product"
                />
                <img
                  className="object-contain w-auto h-20 sm:h-60"
                  src={product?.images[1]?.url}
                  alt="product"
                />
              </div>
            </div>
          )}
          <h3 className="my-2 text-xl text-gray-500 capitalize">
            {product?.name.toLowerCase()}
          </h3>
        </div>
        <p className="text-gray-500">{product?.description}</p>
        <p className="mr-auto text-lg lining-nums">₹{product?.price}</p>
        <span className="overflow-hidden text-sm group-hover:h-0">
          {product?.stock > 0 ? (
            product?.stock < 10 ? (
              <span className="font-bold text-orange-500">
                Only {product?.stock} left in stock
              </span>
            ) : (
              <span className="font-bold text-green-500">In stock</span>
            )
          ) : (
            <span className="font-bold text-red-500">Out of stock</span>
          )}
        </span>
        {product?.reviews.length > 0 ? (
          <div className="flex space-x-2">
            <Rating value={product?.rating} precision={0.5} readOnly />
            <p>({product?.reviews.length})</p>
          </div>
        ) : (
          <div className="text-sm text-gray-400">No reviews yet</div>
        )}
        <div className="absolute transition-all -bottom-20 group-hover:bottom-4">
          <Button
            onClick={(e) => handleAddToCart(e, product)}
            disabled={
              !product?.stock || cartLoading || addedQuantity >= product?.stock
            }
            color="primary"
            variant="contained"
          >
            {addedQuantity + 1 > product.stock
              ? 'Out of stock'
              : cartLoading
              ? 'Adding...'
              : 'Add to cart'}
          </Button>
        </div>
      </motion.div>

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
            {product?.name.toLowerCase()}
          </h3>
        </div>
        <div>
          <p className="text-gray-500">{product?.description}</p>
          <p>₹{product?.price}</p>
          {product?.reviews.length > 0 ? (
            <div className="flex space-x-2">
              <Rating value={product?.rating} precision={0.5} readOnly />
              <p>({product?.reviews.length})</p>
            </div>
          ) : (
            <div className="text-sm text-gray-400">No reviews yet</div>
          )}
        </div>
      </div>
    </Link>
  );
}
