import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/AuthLayout';
import { authApi } from '@/lib/api';
import { Loader2, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isAccountVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const validation = otpSchema.safeParse({ otp });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }
    
    setIsLoading(true);
    try {
      await authApi.verifyOtp(otp);
      setSuccess('Email verified successfully!');
      await refreshUser();
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsResending(true);
    try {
      await authApi.sendVerifyOtp();
      setSuccess('New OTP sent to your email');
      setCountdown(60);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify your email" 
      subtitle={`We've sent a verification code to ${user?.email || 'your email'}`}
    >
      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label htmlFor="otp" className="auth-label">Verification Code</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="auth-input pl-12 tracking-widest font-mono text-lg text-center"
              placeholder="000000"
              maxLength={6}
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-success" />
            <p className="text-sm text-success">{success}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {isLoading ? 'Verifying...' : 'Verify email'}
        </button>

        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending || countdown > 0}
            className="link-primary text-sm inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
