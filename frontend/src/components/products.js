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
import Loading from '../helper-components/Loading';
import ProductCard from '../helper-components/productCard';
import { clearErrors, fetchProducts } from '../redux/actions/productActions';
import { useSnackbar } from 'notistack';
import Metadata from '../helper-components/metadata';
import SortAndFilter from '../helper-components/SortAndFilter';
import { useLocation } from 'react-router-dom';

export default function Products({ match }) {
  const keyword = match.params.keyword;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const { loading, products, limit, filteredProductsCount, error } =
    useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchAndFilterOpen, setSearchAndFilterOpen] = useState(false);
  const [perPageLimit, setPerPageLimit] = useState(4);

  const totalPages = Math.ceil(filteredProductsCount / limit || 1);

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
            <Loading />
          ) : products?.length ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '2rem',
              }}
            >
              {products?.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })}
            </div>
          ) : (
            <h1 className="grid w-full mt-40 text-3xl text-gray-500 place-items-center">
              No products found
            </h1>
          )}
          <div className="flex items-center justify-center mb-10 space-x-10">
            <Pagination
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
              <span className="text-sm text-gray-500">
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
