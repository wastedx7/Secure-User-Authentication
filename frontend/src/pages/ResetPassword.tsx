import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';

const emailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

const resetSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const steps = ['Enter Email', 'Verify OTP', 'New Password'];

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { sendResetOtp, resetPassword } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await sendResetOtp(email.trim());
      setSuccess('Reset code sent to your email!');
      setActiveStep(1);
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeStep === 1) {
      const result = resetSchema.shape.otp.safeParse(otp);
      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }
      setActiveStep(2);
      return;
    }

    const result = resetSchema.safeParse({ otp, newPassword });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email.trim(), otp, newPassword);
      setSuccess('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      await sendResetOtp(email.trim());
      setSuccess('Reset code resent to your email!');
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (activeStep) {
      case 0:
        return 'Reset password';
      case 1:
        return 'Enter verification code';
      case 2:
        return 'Create new password';
      default:
        return 'Reset password';
    }
  };

  const getSubtitle = () => {
    switch (activeStep) {
      case 0:
        return "Enter your email and we'll send you a reset code";
      case 1:
        return `We sent a code to ${email}`;
      case 2:
        return 'Choose a strong password for your account';
      default:
        return '';
    }
  };

  return (
    <AuthLayout title={getTitle()} subtitle={getSubtitle()}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={activeStep === 0 ? handleSendOtp : handleVerifyAndReset}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {activeStep === 0 && (
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
            />
          )}

          {activeStep === 1 && (
            <>
              <TextField
                fullWidth
                label="Verification Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Enter 4-digit code"
                inputProps={{ maxLength: 4, style: { letterSpacing: '0.5em', textAlign: 'center' } }}
                autoFocus
              />
              <Button
                variant="text"
                onClick={handleResendOtp}
                disabled={isLoading || countdown > 0}
                sx={{ alignSelf: 'center' }}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </Button>
            </>
          )}

          {activeStep === 2 && (
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              helperText="At least 8 characters with letters and numbers"
              autoComplete="new-password"
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ mt: 1, py: 1.5 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === 0 ? (
              'Send Reset Code'
            ) : activeStep === 1 ? (
              'Verify Code'
            ) : (
              'Reset Password'
            )}
          </Button>
        </Box>
      </form>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          component={Link}
          to="/login"
          className="link-primary"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          Back to sign in
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default ResetPassword;
