'use client';
import { useState } from 'react';
import { Button, Container, Typography, Box, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

// Custom theme with updated colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#008080', // Teal
    },
    text: {
      primary: '#ffffff',
      secondary: '#757575',
    },
    background: {
      default: '#00695c', // Dark Teal for menu background
      paper: '#00695c', // Dark Teal for menu background
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      '@media (max-width:600px)': {
        fontSize: '2rem', // Smaller font size on mobile
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.5rem', // Smaller font size on mobile
      },
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#ffffff', // White text color for menu items
          '&:hover': {
            backgroundColor: '#333333', // Darker background on hover
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: 'hidden', // Hide scrollbar
        },
      },
    },
  },
});


const LandingPage = () => {

  // adding router to navigate to sign in page

  const router = useRouter();

  const handleSignIn = () => {
    router.push('/Signin');
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
}

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#00695c', // Dark Teal
            color: '#ffffff',
            padding: '16px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '@media (max-width:600px)': {
              padding: '10px',
            },
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
            sx={{
              marginLeft: '16px',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                backgroundColor: 'black', // Dark Teal background for menu
                color: '#ffffff', // White text color for menu items
              },
            }}
          >
            <MenuItem onClick={handleMenuClose} href="/Signin">Sign In</MenuItem>
            <MenuItem onClick={handleMenuClose} href="/Signup">Sign Up</MenuItem>
          </Menu>
        </Box>

        {/* Hero Section */}
        <Box
          sx={{
            backgroundColor: '#00695c', // Dark Teal
            color: '#ffffff',
            padding: '80px 0',
            textAlign: 'center',
            '@media (max-width:600px)': {
              padding: '40px 0', // Less padding on mobile
            },
          }}
        >
          <Container>
            <Typography variant="h1" gutterBottom>
              Welcome to ShelfSmart
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: '40px' }}>
              Your Smart Solution to Manage Pantry Items Effortlessly
            </Typography>
            <Button
              variant="contained"
              color="secondary" // Teal
              size="large"
              sx={{
                borderRadius: '20px',
                padding: '10px 30px',
                '@media (max-width:600px)': {
                  padding: '8px 20px', // Smaller button on mobile
                },
              }}
              href="/Signin" // Adjust based on your routing
            >
              Get Started
            </Button>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ padding: '80px 0', '@media (max-width:600px)': { padding: '40px 0' } }}>
          <Typography variant="h2" textAlign="center" sx={{ marginBottom: '60px' }}>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <StorefrontIcon sx={{ fontSize: '50px', color: '#000000', '@media (max-width:600px)': { fontSize: '40px' } }} />
                <Typography variant="h6" sx={{ marginTop: '20px', fontSize: '1.25rem' }}>
                  Manage Your Pantry
                </Typography>
                <Typography sx={{ marginTop: '10px', color: '#757575', fontSize: '1rem' }}>
                  Easily keep track of your pantry items, their quantities, and expiration dates.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <SearchIcon sx={{ fontSize: '50px', color: '#000000', '@media (max-width:600px)': { fontSize: '40px' } }} />
                <Typography variant="h6" sx={{ marginTop: '20px', fontSize: '1.25rem' }}>
                  Search Your Items
                </Typography>
                <Typography sx={{ marginTop: '10px', color: '#757575', fontSize: '1rem' }}>
                  Quickly find items in your pantry with our powerful search feature.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: '50px', color: '#000000', '@media (max-width:600px)': { fontSize: '40px' } }} />
                <Typography variant="h6" sx={{ marginTop: '20px', fontSize: '1.25rem' }}>
                  Easy Setup
                </Typography>
                <Typography sx={{ marginTop: '10px', color: '#757575', fontSize: '1rem' }}>
                  Quick and easy setup to get your pantry organized in minutes.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: '#333333',
            color: '#ffffff',
            padding: '20px 0',
            textAlign: 'center',
          }}
        >
          <Container>
            <Typography variant="body2">
              © {new Date().getFullYear()} ShelfSmart. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
