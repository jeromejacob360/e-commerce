import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Collapse,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Rating,
  Slider,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { categories } from '../data/data';
import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useHistory } from 'react-router-dom';

export default function SortAndFilter({
  keyword,
  currentPage,
  setCurrentPage,
  perPageLimit,
  open,
  params,
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [price, setPrice] = useState([0, 10000]);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState('-numOfReviews');
  const [category, setCategory] = useState([]);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [queryString, setQueryString] = useState('');

  useEffect(() => {
    window.onresize = () => {
      setInnerWidth(window.innerWidth);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchProducts(window.location.href.split('products')[1]));
  }, [dispatch, queryString]);

  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage, keyword, price, category, rating, sort, perPageLimit]);

  useEffect(() => {
    history.push('/products?' + queryString);
  }, [dispatch, history, queryString]);

  useEffect(() => {
    setQueryString(
      `keyword=${keyword ? keyword : ''}&page=${currentPage}&price[$gte]=${
        price[0]
      }&price[$lte]=${
        price[1]
      }&rating[$gte]=${rating}&sort=${sort}&limit=${perPageLimit}`,
    );
    let categoryString = '';
    // category.forEach((cat) => (categoryString += `&category=${cat}`));
    setQueryString((prev) => prev + categoryString);
  }, [
    category,
    currentPage,
    dispatch,
    history,
    keyword,
    perPageLimit,
    price,
    rating,
    sort,
  ]);

  const conditions = [
    { value: '-numOfReviews', text: 'Popularity' },
    { value: '-price', text: 'Price high to low' },
    { value: 'price', text: 'Price low to high' },
    { value: '-rating', text: 'Rating high to low' },
    { value: 'rating', text: 'Rating low to high' },
  ];

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

  return (
    <Collapse in={innerWidth > 1024 ? true : open}>
      <Container className="w-[300px] md:w-full mt-4 lg:mt-0">
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
                step={100}
              />
              <div className="flex justify-end">
                {JSON.stringify(price) !== JSON.stringify([0, 10000]) && (
                  <Button
                    onClick={() => {
                      setPrice([0, 10000]);
                    }}
                  >
                    Clear
                  </Button>
                )}
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
                  <div className="capitalize" key={categoryItem}>
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
                  <Button
                    onClick={() => {
                      setCategory([]);
                    }}
                  >
                    Clear
                  </Button>
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
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                sx={{
                  width: '100%',
                }}
              />
              {rating ? (
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setRating(0);
                    }}
                  >
                    Clear
                  </Button>
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
                        onClick={() => {
                          console.log('condition.value', condition.value);
                          setSort(condition.value);
                        }}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={sort === condition.value}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        {condition.text}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Collapse>
  );
}
