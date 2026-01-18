import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { Shield, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, hsl(210 20% 98%) 0%, hsl(221 83% 97%) 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ py: 3, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(262 83% 58%) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={22} color="white" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'hsl(222 47% 11%)' }}>
                AuthFlow
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                startIcon={<LogIn size={18} />}
                sx={{ color: 'hsl(222 47% 11%)' }}
              >
                Sign in
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                startIcon={<UserPlus size={18} />}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, md: 4 },
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                mb: 4,
                borderRadius: '100px',
                background: 'hsl(221 83% 95%)',
                color: 'hsl(221 83% 45%)',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              <Shield size={16} />
              Secure Authentication
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: 'hsl(222 47% 11%)',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              Authentication made{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(262 83% 58%) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                simple
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'hsl(215 16% 47%)',
                mb: 5,
                fontWeight: 400,
                maxWidth: 560,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              A complete authentication solution with JWT tokens, email verification, 
              and password reset functionality.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                endIcon={<ArrowRight size={20} />}
                sx={{
                  px: 4,
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Create Account
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: 'hsl(221 83% 53%)',
                  color: 'hsl(221 83% 53%)',
                  '&:hover': {
                    borderColor: 'hsl(221 83% 43%)',
                    background: 'hsl(221 83% 98%)',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>

            {/* Features */}
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                justifyContent: 'center',
                mt: 8,
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'JWT Authentication', icon: '🔐' },
                { label: 'Email Verification', icon: '✉️' },
                { label: 'Password Reset', icon: '🔑' },
              ].map((feature) => (
                <Box
                  key={feature.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'hsl(215 16% 47%)',
                    fontSize: '0.9rem',
                  }}
                >
                  <span>{feature.icon}</span>
                  {feature.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
