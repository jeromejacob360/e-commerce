import {
  Box,
  Button,
  Container,
  MenuItem,
  Pagination,
  Select,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../helper-components/ProductCard';
import {
  clearErrors,
  fetchProductDetails,
  fetchProducts,
} from '../redux/actions/productActions';
import { useSnackbar } from 'notistack';
import Metadata from '../helper-components/Metadata';
import SortAndFilter from '../helper-components/SortAndFilter';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProductCardSkeleton from './loading-skeletons/ProductCardSkeleton';

export default function Products({ match }) {
  const keyword = match?.params.keyword;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const { loading, products, totalPages, error } = useSelector(
    (state) => state.products,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchAndFilterOpen, setSearchAndFilterOpen] = useState(false);
  const [perPageLimit, setPerPageLimit] = useState(10);

  useEffect(() => {
    dispatch(fetchProducts(location.pathname + location.search));
  }, [dispatch, location.pathname, location.search]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
      dispatch(clearErrors());
    }
  }, [dispatch, enqueueSnackbar, error]);

  return (
    <Container
      maxWidth="xxl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <Metadata title="Products" />
      <Box className="flex flex-col lg:flex-row">
        {!searchAndFilterOpen && (
          <div className="flex justify-center space-x-20 lg:hidden">
            <Button
              onClick={() => setSearchAndFilterOpen((prev) => !prev)}
              variant="outlined"
            >
              {'Sort & filter'}
            </Button>
          </div>
        )}
        {searchAndFilterOpen && (
          <div className="flex justify-center space-x-20 lg:hidden">
            <Button
              onClick={() => setSearchAndFilterOpen((prev) => !prev)}
              variant="outlined"
            >
              Close
            </Button>
          </div>
        )}

        <div>
          <SortAndFilter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            keyword={keyword}
            perPageLimit={perPageLimit}
            open={searchAndFilterOpen}
          />
        </div>

        <Box
          sx={{
            flex: 1,
          }}
        >
          {loading ? (
            <div className="flex flex-wrap justify-center mx-2 my-1 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((_, i) => (
                <div key={i}>
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : products?.length ? (
            <div className="flex flex-wrap justify-center mx-2 my-1 mb-8">
              {products?.map((product, i) => {
                return (
                  <motion.div
                    onMouseEnter={() =>
                      dispatch(fetchProductDetails(product._id))
                    }
                    key={product._id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="m-2"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="grid w-full my-40 text-3xl text-gray-500 place-items-center">
              <h1 className="my-4">No products found</h1>
              <div className="flex flex-col space-y-4 text-base">
                Try widening your search?
              </div>
            </div>
          )}
          <div className="flex items-center justify-center mb-10 space-x-10">
            <Pagination
              size="small"
              count={totalPages}
              onChange={(e, page) => setCurrentPage(page)}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              page={currentPage}
              variant="outlined"
              shape="rounded"
            />
            <div className="flex items-center">
              <span className="hidden text-sm text-gray-500 sm:block">
                Results per page &nbsp;
              </span>
              <Select
                variant="standard"
                value={perPageLimit}
                onChange={(e) => setPerPageLimit(e.target.value)}
              >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>{20}</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </div>
          </div>
        </Box>
      </Box>
    </Container>
  );
}
