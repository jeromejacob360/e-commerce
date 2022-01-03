import { createTheme } from '@mui/material';
import { orange, red } from '@mui/material/colors';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920,
    },
  },

  palette: {
    appbar: {
      main: red[500],
    },
    primary: {
      main: orange[500],
    },
    secondary: {
      main: '#fafafa',
    },
  },
});
