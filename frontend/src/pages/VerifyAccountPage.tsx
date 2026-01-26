import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight, Mail, RefreshCw } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/stores/authStore';
import { authApi, getErrorMessage } from '@/lib/api';
import { toast } from 'sonner';

export default function VerifyAccountPage() {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      await authApi.sendVerificationOtp();
      setOtpSent(true);
      toast.success('Verification OTP sent to your email');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.verifyOtp({ otp });
      await fetchProfile(); // Refresh user data
      toast.success('Account verified successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already verified, redirect to dashboard
  if (user?.isAccountVerified) {
    navigate('/dashboard');
    return null;
  }

  return (
    <AuthLayout
      title="Verify your account"
      subtitle="Complete verification to access all features"
    >
      <div className="space-y-6">
        {/* User email display */}
        {user?.email && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border"
          >
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Verification will be sent to</p>
              <p className="font-medium text-foreground">{user.email}</p>
            </div>
          </motion.div>
        )}

        {!otpSent ? (
          /* Step 1: Send OTP */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground text-center">
              Click the button below to receive a verification code at your email address.
            </p>
            <Button
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="w-full h-11 gradient-primary glow-primary-subtle hover:opacity-90 transition-opacity font-medium"
            >
              {isSendingOtp ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send verification code
            </Button>
          </motion.div>
        ) : (
          /* Step 2: Enter OTP */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Enter verification code
              </Label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length !== 6}
              className="w-full h-11 gradient-primary glow-primary-subtle hover:opacity-90 transition-opacity font-medium"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Verify account
            </Button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isSendingOtp ? 'animate-spin' : ''}`} />
              Resend verification code
            </button>
          </motion.div>
        )}
      </div>
    </AuthLayout>
  );
}
