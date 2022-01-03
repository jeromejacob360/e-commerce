import React, { useEffect } from 'react';
import ProductCard from '../../helper-components/productCard/productCard';
import { fetchProducts } from '../../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../helper-components/loading/Loading';
import { useAlert } from 'react-alert';
import { Container } from '@mui/material';

export default function Home() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Container
      fluid
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
  );
}
