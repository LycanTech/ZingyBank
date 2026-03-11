import React from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  KeyRound,
  Smartphone,
  LogOut,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const ProfilePage: React.FC = () => {
  const { firstName, email, roles, userId } = useAuthStore();
  const logoutMutation = useLogout();

  const handleChangePassword = () => {
    toast.info('Change password feature coming soon.');
  };

  const handleEnableMFA = () => {
    toast.info('MFA setup feature coming soon.');
  };

  const handleSignOut = () => {
    logoutMutation.mutate();
  };

  const initials = firstName
    ? firstName.charAt(0).toUpperCase()
    : email
      ? email.charAt(0).toUpperCase()
      : 'U';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-bank-text">Profile</h1>
        <p className="text-sm text-bank-muted mt-0.5">Manage your account settings</p>
      </div>

      {/* User info card */}
      <div className="bg-white rounded-xl border border-bank-border shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-zingy-600 text-white flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-bank-text">{firstName || 'User'}</h2>
            <p className="text-sm text-bank-muted">ZingyBank Member</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 py-2.5 border-b border-bank-border">
            <Mail className="w-5 h-5 text-bank-muted flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-bank-muted">Email</p>
              <p className="text-sm font-medium text-bank-text">{email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2.5 border-b border-bank-border">
            <Phone className="w-5 h-5 text-bank-muted flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-bank-muted">Phone</p>
              <p className="text-sm font-medium text-bank-text">Not provided</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2.5 border-b border-bank-border">
            <Shield className="w-5 h-5 text-bank-muted flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-bank-muted">Roles</p>
              <div className="flex gap-1.5 mt-0.5">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <Badge key={role} status="active">{role}</Badge>
                  ))
                ) : (
                  <Badge status="active">USER</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2.5">
            <Calendar className="w-5 h-5 text-bank-muted flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-bank-muted">Member Since</p>
              <p className="text-sm font-medium text-bank-text">2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Section */}
      <div className="bg-white rounded-xl border border-bank-border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-bank-text mb-4">Identity Verification</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-bank-text">KYC Status</p>
            <p className="text-xs text-bank-muted">Your identity has been verified</p>
          </div>
          <Badge status="completed">Verified</Badge>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl border border-bank-border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-bank-text mb-4">Security</h3>
        <div className="space-y-3">
          <button
            onClick={handleChangePassword}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-bank-muted" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-bank-text">Change Password</p>
              <p className="text-xs text-bank-muted">Update your account password</p>
            </div>
          </button>

          <button
            onClick={handleEnableMFA}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-bank-muted" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-bank-text">Enable MFA</p>
              <p className="text-xs text-bank-muted">Add an extra layer of security</p>
            </div>
          </button>
        </div>
      </div>

      {/* Sign out */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleSignOut}
        loading={logoutMutation.isPending}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfilePage;
