import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import {
  Shield,
  LogOut,
  Mail,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, sendOtp } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsSendingOtp(true);
    try {
      await sendOtp();
      navigate('/verify-email');
    } catch (error) {
      console.error('Failed to send OTP:', error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'hsl(210 20% 98%)' }}>
      {/* Header */}
      <Box
        sx={{
          background: '#fff',
          borderBottom: '1px solid hsl(214 32% 91%)',
          px: { xs: 2, md: 4 },
          py: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(262 83% 58%) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={20} color="white" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'hsl(222 47% 11%)' }}>
              AuthFlow
            </Typography>
          </Box>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'hsl(222 47% 11%)' }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'hsl(215 16% 47%)' }}>
                {user?.email}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(262 83% 58%) 100%)',
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <MoreVertical size={20} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                <User size={18} style={{ marginRight: 8 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Settings size={18} style={{ marginRight: 8 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut size={18} style={{ marginRight: 8 }} />
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: 'hsl(222 47% 11%)', mb: 1 }}
          >
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'hsl(215 16% 47%)' }}>
            Here's an overview of your account
          </Typography>
        </Box>

        {/* Verification Alert */}
        {user && !user.accountVerified && (
          <Card
            sx={{
              mb: 4,
              background: 'linear-gradient(135deg, hsl(38 92% 95%) 0%, hsl(38 92% 90%) 100%)',
              border: '1px solid hsl(38 92% 80%)',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, flexWrap: 'wrap' }}>
              <AlertCircle size={24} color="hsl(38 92% 40%)" />
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'hsl(38 92% 25%)' }}>
                  Verify your email
                </Typography>
                <Typography variant="body2" sx={{ color: 'hsl(38 92% 35%)' }}>
                  Please verify your email address to access all features.
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleVerifyEmail}
                disabled={isSendingOtp}
                sx={{
                  background: 'hsl(38 92% 45%)',
                  '&:hover': { background: 'hsl(38 92% 40%)' },
                }}
              >
                {isSendingOtp ? 'Sending...' : 'Verify Now'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'hsl(221 83% 95%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={24} color="hsl(221 83% 53%)" />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'hsl(215 16% 47%)' }}>
                    Account Status
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Active
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="Personal Account"
                size="small"
                sx={{ background: 'hsl(221 83% 95%)', color: 'hsl(221 83% 45%)' }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: user?.accountVerified ? 'hsl(142 71% 92%)' : 'hsl(0 84% 95%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {user?.accountVerified ? (
                    <CheckCircle size={24} color="hsl(142 71% 40%)" />
                  ) : (
                    <AlertCircle size={24} color="hsl(0 84% 55%)" />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'hsl(215 16% 47%)' }}>
                    Email Verification
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user?.accountVerified ? 'Verified' : 'Pending'}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={user?.email}
                size="small"
                icon={<Mail size={14} />}
                sx={{ background: 'hsl(210 40% 96%)', maxWidth: '100%' }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'hsl(262 83% 95%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Shield size={24} color="hsl(262 83% 55%)" />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'hsl(215 16% 47%)' }}>
                    Security
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Protected
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="JWT Authentication"
                size="small"
                sx={{ background: 'hsl(262 83% 95%)', color: 'hsl(262 83% 45%)' }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
          Quick Actions
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            sx={{
              py: 2,
              justifyContent: 'flex-start',
              gap: 1.5,
              borderColor: 'hsl(214 32% 91%)',
              color: 'hsl(222 47% 11%)',
              '&:hover': {
                borderColor: 'hsl(221 83% 53%)',
                background: 'hsl(221 83% 98%)',
              },
            }}
          >
            <User size={20} />
            Edit Profile
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              py: 2,
              justifyContent: 'flex-start',
              gap: 1.5,
              borderColor: 'hsl(214 32% 91%)',
              color: 'hsl(222 47% 11%)',
              '&:hover': {
                borderColor: 'hsl(221 83% 53%)',
                background: 'hsl(221 83% 98%)',
              },
            }}
          >
            <Settings size={20} />
            Settings
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              py: 2,
              justifyContent: 'flex-start',
              gap: 1.5,
              borderColor: 'hsl(214 32% 91%)',
              color: 'hsl(222 47% 11%)',
              '&:hover': {
                borderColor: 'hsl(221 83% 53%)',
                background: 'hsl(221 83% 98%)',
              },
            }}
          >
            <Shield size={20} />
            Security
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{
              py: 2,
              justifyContent: 'flex-start',
              gap: 1.5,
              borderColor: 'hsl(0 84% 90%)',
              color: 'hsl(0 84% 55%)',
              '&:hover': {
                borderColor: 'hsl(0 84% 60%)',
                background: 'hsl(0 84% 98%)',
              },
            }}
          >
            <LogOut size={20} />
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
