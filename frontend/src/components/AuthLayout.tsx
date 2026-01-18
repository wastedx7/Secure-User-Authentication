import React from 'react';
import { Box, Typography } from '@mui/material';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Box className="auth-container">
      <Box className="auth-card animate-slide-up">
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
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
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'hsl(222 47% 11%)',
              letterSpacing: '-0.02em',
            }}
          >
            AuthFlow
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'hsl(222 47% 11%)',
            mb: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              color: 'hsl(215 16% 47%)',
              mb: 4,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
