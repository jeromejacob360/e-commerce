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
  Rating,
  Slider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../helper-components/loading/Loading';
import ProductCard from '../../helper-components/productCard/productCard';
import { clearErrors, fetchProducts } from '../../redux/actions/productActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAlert } from 'react-alert';
import Metadata from '../../metadata';

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
  const alert = useAlert();
  const { loading, products, limit, filteredProductsCount, error } =
    useSelector((state) => state.products);
  const md = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([100, 25000]);
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);

  const totalPages = Math.ceil(filteredProductsCount / limit || 1);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(
      fetchProducts(keyword, currentPage, price, category, rating, error),
    );
  }, [dispatch, keyword, currentPage, price, category, rating, error, alert]);

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
      <Metadata title="Products" />
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
          <Accordion
            sx={{
              marginBottom: '20px',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Price</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <Slider
                  value={price}
                  onChange={(event, value) => setPrice(value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={25000}
                  step={500}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              marginBottom: '20px',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Category</Typography>
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
          <Accordion
            sx={{
              marginBottom: '20px',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Rating</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <Rating
                  name="simple-controlled"
                  value={rating}
                  precision={0.5}
                  size="large"
                  onChange={(event, newValue) => setRating(newValue)}
                  sx={{
                    width: '100%',
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
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
