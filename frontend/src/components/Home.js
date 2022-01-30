import React, { useEffect } from 'react';
import ProductCard from '../helper-components/ProductCard';
import {
  clearErrors,
  fetchProductDetails,
  fetchProducts,
} from '../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import Metadata from '../helper-components/Metadata';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCardSkeleton from './loading-skeletons/ProductCardSkeleton';

export default function Home() {
  const { loading, error, products } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
      dispatch(clearErrors());
    }
    dispatch(fetchProducts());
  }, [dispatch, enqueueSnackbar, error]);

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-3xl text-gray-500">FEATURED PRODUCTS</h1>
        <div className="w-[400px] mt-4 bg-red-300">
          <Button
            sx={{
              color: 'white',
            }}
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            component={Link}
            to="/products"
          >
            GO SHOPPING
          </Button>
        </div>
      </div>

      <AnimatePresence></AnimatePresence>
      <Metadata title="Home" />
      {loading ? (
        <div className="flex flex-wrap justify-center mx-2 my-10">
          {[1, 2, 3, 4].map((p, i) => (
            <div key={i}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : products ? (
        <div className="flex flex-wrap justify-center my-10">
          {products.map((product, i) => {
            return (
              <motion.div
                onMouseEnter={() => dispatch(fetchProductDetails(product._id))}
                initial={{ opacity: 0, x: i * 20 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
                key={product._id}
                className="m-2"
              >
                <ProductCard product={product} />
              </motion.div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
