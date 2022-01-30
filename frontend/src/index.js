import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Grow, ThemeProvider } from '@mui/material';
import { theme } from './mui/theme';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        preventDuplicate
        maxSnack={1}
        TransitionComponent={Grow}
        hideIconVariant
        autoHideDuration={2000}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
