import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Key,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading, logout, fetchProfile } = useAuthStore();

  useEffect(() => {
    // Refresh profile data on mount
    fetchProfile().catch(() => {
      // If profile fetch fails, user will be redirected by ProtectedRoute
    });
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      icon: User,
      label: 'User ID',
      value: user.userId,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mail,
      label: 'Email',
      value: user.email,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: user.isAccountVerified ? CheckCircle2 : AlertCircle,
      label: 'Verification Status',
      value: user.isAccountVerified ? 'Verified' : 'Not Verified',
      gradient: user.isAccountVerified ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-orange-500',
      badge: true,
    },
    {
      icon: Key,
      label: 'Auth Type',
      value: 'JWT Token',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary glow-primary-subtle">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold gradient-text">SecureAuth</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Welcome,</span>
              <span className="text-foreground font-medium">{user.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome back, <span className="gradient-text">{user.name}</span>
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your account details and verification status.
          </p>
        </motion.div>

        {/* Verification Alert */}
        {!user.isAccountVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-4 rounded-lg border border-warning/30 bg-warning/10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                <div>
                  <p className="font-medium text-warning">Account not verified</p>
                  <p className="text-sm text-warning/80">
                    Verify your email to access all features
                  </p>
                </div>
              </div>
              <Link to="/verify-account" className="sm:ml-auto">
                <Button
                  size="sm"
                  className="bg-warning text-warning-foreground hover:bg-warning/90"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Verify now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="stat-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${card.gradient}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                {card.badge && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isAccountVerified ? 'badge-verified' : 'badge-unverified'
                    }`}
                  >
                    {user.isAccountVerified ? 'Active' : 'Pending'}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className="text-foreground font-medium truncate" title={card.value}>
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Profile Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="text-foreground font-medium mt-1">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email Address</label>
                <p className="text-foreground font-medium mt-1">{user.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">User ID</label>
                <p className="text-foreground font-medium mt-1 font-mono text-sm">
                  {user.userId}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Account Status</label>
                <div className="mt-1 flex items-center gap-2">
                  {user.isAccountVerified ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-success font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="text-warning font-medium">Unverified</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Security</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/forgot-password">
                <Button variant="outline" size="sm" className="border-border">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </Link>
              {!user.isAccountVerified && (
                <Link to="/verify-account">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
