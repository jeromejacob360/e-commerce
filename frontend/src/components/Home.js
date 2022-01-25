import React, { useEffect } from 'react';
import ProductCard from '../helper-components/productCard';
import { clearErrors, fetchProducts } from '../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../helper-components/Loading';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import Metadata from '../helper-components/metadata';
import { Link } from 'react-router-dom';
import { categories } from '../data/data';

export default function Home() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
      dispatch(clearErrors());
    }
    const _ = undefined;
    dispatch(fetchProducts(_, _, _, _, _, '-popularity', 4));
  }, [dispatch, enqueueSnackbar, error]);

  return (
    <>
      <Metadata title="Home" />
      {loading ? (
        <Loading />
      ) : products ? (
        <div className="flex flex-col items-center">
          <div className="justify-between hidden w-full mb-4 md:flex xl:px-40 lg:px-20">
            {categories.map((category) => {
              return (
                <Button
                  key={category}
                  component={Link}
                  to={`/products/${category}`}
                >
                  {category}
                </Button>
              );
            })}
          </div>
          <h1 className="mb-4 text-3xl text-gray-500">FEATURED PRODUCTS</h1>
          <div className="flex items-center w-full px-4 mt-4 sm:px-10 md:px-20 lg:px-28 xl:px-40">
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
