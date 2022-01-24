import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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
import Loading from '../helper-components/Loading';
import ProductCard from '../helper-components/productCard';
import { clearErrors, fetchProducts } from '../redux/actions/productActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';
import Metadata from '../helper-components/metadata';
import { categories } from '../data/data';
import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';

export default function Products({ match }) {
  const keyword = match.params.keyword;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, products, limit, filteredProductsCount, error } =
    useSelector((state) => state.products);
  const md = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 10000]);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState('Popularity');
  const [category, setCategory] = useState([]);
  const conditions = [
    {
      value: '-numOfReviews',
      text: 'Popularity',
    },
    {
      value: '-price',
      text: 'Price high to low',
    },
    {
      value: 'price',
      text: 'Price low to high',
    },
    {
      value: '-rating',
      text: 'Rating high to low',
    },
    {
      value: 'rating',
      text: 'Rating low to high',
    },
  ];

  const totalPages = Math.ceil(filteredProductsCount / limit || 1);

  useEffect(() => {
    dispatch(
      fetchProducts(keyword, currentPage, [0, 10000], category, rating, sort),
    );
  }, [category, currentPage, dispatch, keyword, rating, sort]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
      dispatch(clearErrors());
    }
  }, [dispatch, enqueueSnackbar, error]);

  const handleToggle = (value) => () => {
    const currentIndex = category.indexOf(value);
    const newChecked = [...category];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCategory(newChecked);
  };

  const fetchProductsOnPriceFilter = (price) => {
    dispatch(fetchProducts(keyword, currentPage, price, category, rating));
  };

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
              data-testid="ExpandMoreIcon-price"
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
                  max={10000}
                  step={500}
                />
                <div className="flex justify-end">
                  <Button onClick={() => fetchProductsOnPriceFilter(price)}>
                    Apply
                  </Button>
                  <Button
                    onClick={() => {
                      setPrice([0, 10000]);
                      fetchProductsOnPriceFilter([0, 10000]);
                    }}
                  >
                    Clear
                  </Button>
                </div>
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
              <Typography>Brand</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {categories.map((categoryItem) => {
                  const labelId = `checkbox-list-label-${categoryItem}`;

                  return (
                    <div key={categoryItem}>
                      <ListItem disablePadding>
                        <ListItemButton
                          role={undefined}
                          onClick={handleToggle(categoryItem)}
                          dense
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={category.indexOf(categoryItem) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={labelId}
                            primary={`${categoryItem}`}
                          />
                        </ListItemButton>
                      </ListItem>
                    </div>
                  );
                })}
                {category.length ? (
                  <div className="flex justify-end">
                    <Button onClick={() => setCategory([])}>Clear</Button>
                  </div>
                ) : null}
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
                {rating ? (
                  <div className="flex justify-end">
                    <Button onClick={() => setRating(0)}>Clear</Button>
                  </div>
                ) : null}
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
              <Typography>Sort</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <List>
                  {conditions.map((condition) => {
                    return (
                      <ListItem disablePadding key={condition.value}>
                        <ListItemButton
                          onClick={() => setSort(condition.value)}
                          dense
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={sort === condition.value}
                              tabIndex={-1}
                              disableRipple
                              // inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          {condition.text}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}

                  {category.length ? (
                    <div className="flex justify-end">
                      <Button onClick={() => setCategory([])}>Clear</Button>
                    </div>
                  ) : null}
                </List>
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
              {products?.map((product) => {
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
