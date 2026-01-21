import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogOut, 
  User, 
  Mail, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  Bell,
  Settings,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const quickActions = [
    { icon: User, label: 'Profile Settings', description: 'Update your personal information' },
    { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
    { icon: Settings, label: 'Account Settings', description: 'Security and privacy options' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Account Verification Banner */}
          {!user?.isAccountVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Verify your email</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please verify your email address to access all features.
                </p>
                <button
                  onClick={() => navigate('/verify-otp')}
                  className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Verify now →
                </button>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 border border-border shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="text-lg font-semibold text-foreground">{user?.name}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card rounded-xl p-6 border border-border shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-semibold text-foreground truncate max-w-[180px]">
                    {user?.email}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border shadow-card sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  user?.isAccountVerified ? 'bg-success/10' : 'bg-warning/10'
                }`}>
                  <Shield className={`h-6 w-6 ${
                    user?.isAccountVerified ? 'text-success' : 'text-warning'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    {user?.isAccountVerified ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-lg font-semibold text-success">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <span className="text-lg font-semibold text-warning">Unverified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {quickActions.map((action, index) => (
                <button
                  key={action.label}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left ${
                    index !== quickActions.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <action.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{action.label}</p>
                    <p className="text-sm text-muted-foreground truncate">{action.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
