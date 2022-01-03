import {
  Box,
  Button,
  Container,
  TextField,
  useMediaQuery,
} from '@mui/material';
import React, { useState } from 'react';
import Metadata from '../../metadata';

export default function Search({ history }) {
  const [searchText, setSearchText] = useState('');
  const sm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/products/${searchText.trim()}`);
  };

  return (
    <Container
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Metadata title="Search" />
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: sm ? 'column' : 'row',
          alignItems: 'end',
          width: '100%',
          justifyContent: 'center',
          padding: sm ? '0 1rem' : '0 2rem',
        }}
        onSubmit={handleSearch}
      >
        <TextField
          fullWidth
          id="outlined-basic"
          label="Search..."
          variant="standard"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <Button variant="text" size="large" color="primary" type="submit">
          Search
        </Button>
      </Box>
    </Container>
  );
}
