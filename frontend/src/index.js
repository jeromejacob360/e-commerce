import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { Grow, ThemeProvider } from '@mui/material';
import { theme } from './mui/theme';
import { SnackbarProvider } from 'notistack';

const options = {
  position: positions.BOTTOM_LEFT,
  autoHideDuration: 2000,
  transition: transitions.SCALE,
};

ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
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
    </AlertProvider>
  </Provider>,
  document.getElementById('root'),
);
