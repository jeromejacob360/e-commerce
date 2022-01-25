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
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { categories } from '../data/data';
import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useHistory } from 'react-router-dom';

export default function SortAndFilter({
  currentPage,
  setCurrentPage,
  perPageLimit,
  open,
}) {
  const history = useHistory();

  const { searchQuery } = useSelector((state) => state.products);

  const readFromLocalStorage = (name) => {
    return JSON.parse(localStorage.getItem(name));
  };

  const [price, setPrice] = useState(
    readFromLocalStorage('price') || [0, 10000],
  );
  const [rating, setRating] = useState(localStorage.getItem('rating') || 0);
  const [sort, setSort] = useState(
    readFromLocalStorage('sort') || '-popularity',
  );
  const [category, setCategory] = useState(
    readFromLocalStorage('category') || [],
  );
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  // const [queryString, setQueryString] = useState('');

  const queryString = useRef('');

  const isRendered = useRef(false);

  useEffect(() => {
    localStorage.setItem('rating', rating);
    localStorage.setItem('price', JSON.stringify(price));
    localStorage.setItem('sort', JSON.stringify(sort));
    localStorage.setItem('category', JSON.stringify(category));
  }, [category, price, rating, sort]);

  useEffect(() => {
    window.onresize = () => {
      setInnerWidth(window.innerWidth);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage, price, category, rating, sort, perPageLimit]);

  useEffect(() => {
    queryString.current = `/products?keyword=${
      searchQuery ? searchQuery : ''
    }&page=${currentPage}&price[$gte]=${price[0]}&price[$lte]=${
      price[1]
    }&rating[$gte]=${rating}&sort=${sort}&limit=${perPageLimit}`;

    let categoryString = '';
    category.forEach((cat) => (categoryString += `&category[$in]=${cat}`));
    queryString.current += categoryString;
  }, [category, currentPage, perPageLimit, price, rating, searchQuery, sort]);

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

    if (currentIndex === -1) newChecked.push(value);
    else newChecked.splice(currentIndex, 1);
    setCategory(newChecked);
  };

  useEffect(() => {
    console.log('queryString', queryString);
    if (isRendered.current) {
      console.log('isRendered.current', isRendered.current);
      history.push(queryString.current);
    } else {
      console.log('isRendered.current', isRendered.current);
      isRendered.current = true;
    }
  }, [queryString, history, rating, price, sort, category]);

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
            <div className="flex items-center space-x-4">
              {JSON.stringify(price) !== JSON.stringify([0, 10000]) && (
                <Tooltip title="Clear filter">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrice([0, 10000]);
                    }}
                    className="w-4 h-4 bg-orange-500 rounded-full shadow-md"
                  ></div>
                </Tooltip>
              )}
              <Typography>Price</Typography>
            </div>
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
            <div className="flex items-center space-x-4">
              {category.length > 0 && (
                <Tooltip title="Clear filter">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategory([]);
                    }}
                    className="w-4 h-4 bg-orange-500 rounded-full shadow-md"
                  ></div>
                </Tooltip>
              )}
              <Typography>Brand</Typography>
            </div>
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
            <div className="flex items-center space-x-4">
              {rating > 0 && (
                <Tooltip title="Clear filter">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setRating(0);
                    }}
                    className="w-4 h-4 bg-orange-500 rounded-full shadow-md"
                  ></div>
                </Tooltip>
              )}
              <Typography>Rating</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                width: '100%',
              }}
            >
              <Rating
                name="simple-controlled"
                value={parseFloat(rating)}
                precision={0.5}
                size="large"
                onChange={(event, newValue) => {
                  setRating(newValue ? newValue : 0);
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
            <div className="flex items-center space-x-4">
              {sort !== '-numOfReviews' && (
                <Tooltip title="Clear filter">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSort('-numOfReviews');
                    }}
                    className="w-4 h-4 bg-orange-500 rounded-full shadow-md"
                  ></div>
                </Tooltip>
              )}

              <Typography>Sort</Typography>
            </div>
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
