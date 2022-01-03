import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Slider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../helper-components/loading/Loading';
import ProductCard from '../../helper-components/productCard/productCard';
import { fetchProducts } from '../../redux/actions/productActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const categories = [
  'Laptop',
  'Mobile',
  'Tablet',
  'Camera',
  'Headphone',
  'Speaker',
  'Watch',
  'Accessories',
  'Others',
  'All',
];

export default function Products({ match }) {
  const keyword = match.params.keyword;
  const dispatch = useDispatch();
  const { loading, products, limit, filteredProductsCount } = useSelector(
    (state) => state.products,
  );
  const md = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([100, 25000]);
  const [category, setCategory] = useState('');

  const totalPages = Math.ceil(filteredProductsCount / limit || 1);

  useEffect(() => {
    dispatch(fetchProducts(keyword, currentPage, price, category));
  }, [dispatch, keyword, currentPage, price, category]);

  return (
    <Container
      fluid
      maxWidth="xxl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: md ? 'column' : 'row',
        }}
      >
        <Container
          sx={{
            width: md ? '100%' : '300px',
          }}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={(event, value) => setPrice(value)}
              valueLabelDisplay="auto"
              min={0}
              max={25000}
              step={500}
              sx={{
                marginTop: '1rem',
              }}
            />
          </Box>
          <Box>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Categories</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {categories.map((categoryItem) => {
                    return (
                      <ListItem disablePadding key={categoryItem}>
                        <ListItemButton
                          onClick={() => setCategory(categoryItem)}
                          sx={{
                            backgroundColor:
                              category === categoryItem ? '#f0f0f0' : '#fff',
                          }}
                        >
                          <ListItemText primary={categoryItem} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Container>
        <Box
          sx={{
            flex: 1,
          }}
        >
          {loading ? (
            <Loading />
          ) : products ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '2rem',
              }}
            >
              {products.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })}
            </div>
          ) : null}
        </Box>
      </Box>
      <Pagination
        count={totalPages}
        onChange={(e, page) => setCurrentPage(page)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        variant="outlined"
        shape="rounded"
      />
    </Container>
  );
}
