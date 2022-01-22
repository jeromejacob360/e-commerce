import React, { useEffect } from 'react';
import ProductCard from '../helper-components/productCard';
import { clearErrors, fetchProducts } from '../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../helper-components/Loading';
import { useSnackbar } from 'notistack';
import { Container } from '@mui/material';
import Metadata from '../helper-components/metadata';

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
    dispatch(fetchProducts());
  }, [dispatch, enqueueSnackbar, error]);

  return (
    <>
      <Metadata title="Home" />
      <Container
        maxWidth="xxl"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Loading />
        ) : products ? (
          products.map((product) => {
            return <ProductCard key={product._id} product={product} />;
          })
        ) : null}
      </Container>
    </>
  );
}
