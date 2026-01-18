import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: 'hsl(221, 83%, 53%)',
      light: 'hsl(221, 83%, 63%)',
      dark: 'hsl(221, 83%, 43%)',
      contrastText: '#fff',
    },
    secondary: {
      main: 'hsl(262, 83%, 58%)',
      light: 'hsl(262, 83%, 68%)',
      dark: 'hsl(262, 83%, 48%)',
    },
    error: {
      main: 'hsl(0, 84%, 60%)',
    },
    success: {
      main: 'hsl(142, 71%, 45%)',
    },
    warning: {
      main: 'hsl(38, 92%, 50%)',
    },
    background: {
      default: 'hsl(210, 20%, 98%)',
      paper: '#ffffff',
    },
    text: {
      primary: 'hsl(222, 47%, 11%)',
      secondary: 'hsl(215, 16%, 47%)',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '12px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 48%) 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, hsl(221, 83%, 48%) 0%, hsl(221, 83%, 43%) 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'hsl(210, 20%, 98%)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(221, 83%, 53%)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(221, 83%, 53%)',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
