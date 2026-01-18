import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';

const otpSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { user, sendOtp, verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    setIsSending(true);
    try {
      await sendOtp();
      setSuccess('Verification code sent to your email!');
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = otpSchema.safeParse({ otp });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(otp);
      setSuccess('Email verified successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle={`We'll send a verification code to ${user?.email || 'your email'}`}>
      <form onSubmit={handleVerify}>
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
          <Button
            variant="outlined"
            fullWidth
            onClick={handleSendOtp}
            disabled={isSending || countdown > 0}
            sx={{ py: 1.5 }}
          >
            {isSending ? (
              <CircularProgress size={24} />
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              'Send Verification Code'
            )}
          </Button>

          <TextField
            fullWidth
            label="Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="Enter 4-digit code"
            inputProps={{ maxLength: 4, style: { letterSpacing: '0.5em', textAlign: 'center' } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading || otp.length !== 4}
            sx={{ mt: 1, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
          </Button>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;
