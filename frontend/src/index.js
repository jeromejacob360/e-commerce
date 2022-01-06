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
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
};

ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          TransitionComponent={Grow}
          hideIconVariant
        >
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </SnackbarProvider>
      </ThemeProvider>
    </AlertProvider>
  </Provider>,
  document.getElementById('root'),
);
