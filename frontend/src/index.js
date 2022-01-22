import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Grow, ThemeProvider } from '@mui/material';
import { theme } from './mui/theme';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        preventDuplicate
        maxSnack={1}
        TransitionComponent={Grow}
        hideIconVariant
      >
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
