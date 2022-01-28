import React, { useEffect } from 'react';
import ProductCard from '../helper-components/ProductCard';
import { clearErrors, fetchProducts } from '../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../helper-components/Loading';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import Metadata from '../helper-components/Metadata';
import { Link } from 'react-router-dom';

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
    <>
      <Metadata title="Home" />
      {loading ? (
        <Loading />
      ) : products ? (
        <div className="flex flex-col items-center">
          <h1 className="mb-4 text-3xl text-gray-500">FEATURED PRODUCTS</h1>
          <div className="w-[300px] mt-4 bg-red-300">
            <Button
              fullWidth
              variant="contained"
              size="large"
              color="secondary"
              component={Link}
              to="/products"
            >
              GO SHOPPING
            </Button>
          </div>
          <div className="flex flex-wrap justify-center my-10">
            {products.map((product) => {
              return <ProductCard key={product._id} product={product} />;
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
