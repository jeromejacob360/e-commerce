import React, { useEffect } from 'react';
import CardComponent from '../../helper-components/cardComponent/CardComponent';
import { fetchProducts } from '../../redux/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../helper-components/loading/Loading';
import { useAlert } from 'react-alert';
import './home.css';

export default function Home() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(fetchProducts());
  }, [dispatch, error, alert]);

  return (
    <div className="grid">
      {loading ? (
        <Loading />
      ) : products ? (
        products.map((product) => {
          return <CardComponent key={product._id} product={product} />;
        })
      ) : null}
    </div>
  );
}
