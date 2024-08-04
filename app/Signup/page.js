'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '@/firebase'; // Import your Firebase auth instance

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
    },
    secondary: {
      main: '#000000', // Black
    },
    background: {
      default: '#ffffff', // White background
      paper: '#ffffff', // White background for paper components
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#000000', // Black text
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      color: '#000000', // Black text for h5
    },
    body2: {
      fontWeight: 300,
      color: '#000000', // Black text for body2
    },
  },
});

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/pantry');
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak.';
          break;
        default:
          errorMessage = 'Failed to sign up. Please check your details and try again.';
      }
      setError(errorMessage);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Header */}
      <Box 
        width="100%" 
        bgcolor="black" 
        padding={2} 
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <StorefrontIcon sx={{ marginRight: 1, fontSize: '2rem' }} />
          <Typography variant="h4" fontWeight="bold">
            ShelfSmart
          </Typography>
        </Box>
      </Box>

      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Grid container justifyContent="center" alignItems="center" minHeight="100vh">
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 3, borderRadius: 2, boxShadow: 6, marginTop: -1 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                }
                title={
                  <Typography component="h1" variant="h5">
                    Sign up
                  </Typography>
                }
              />
              
              <CardContent>
                <Box component="form" onSubmit={handleSignup} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {error && (
                    <Typography color="error" sx={{ mb: 1 }}>
                      {error}
                    </Typography>
                  )}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{ style: { color: '#000000' } }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{ style: { color: '#000000' } }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{ style: { color: '#000000' } }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Link href="/Signin" variant="body2" sx={{ color: 'text.secondary' }}>
                        {"Already have an account? Sign In"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* Footer */}
      <Box 
        width="100%" 
        height="60px"
        bgcolor="black" 
        padding={2} 
        boxShadow="0 -4px 8px rgba(0, 0, 0, 0.1)"
        color="white"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: "auto" }}
      >
        <Typography variant="body1">
          © {new Date().getFullYear()} ShelfSmart. All rights reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default SignUp;
