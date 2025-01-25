import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

interface Subscription {
  plan: string;
  status: string;
  next_billing: string;
  features: string[];
}

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const planFeatures = {
  '3 Months': [
    'AI Resume Analysis',
    'Basic Template Access',
    'Email Support',
    '2 Resume Versions'
  ],
  '6 Months': [
    'Everything in 3 Months',
    'Premium Templates',
    'Priority Support',
    'Unlimited Resume Versions',
    'Cover Letter Generator'
  ],
  'Yearly': [
    'Everything in 6 Months',
    'Custom Branding',
    '24/7 Support',
    'LinkedIn Profile Optimization',
    'Interview Preparation Tools'
  ]
};

const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    useEffect(() => {
        async function fetchSubscription() {
            try {
                if (!user) return;
                
                // For now, let's set a default subscription for testing
                setSubscription({
                    plan: 'Free Trial',
                    status: 'active',
                    next_billing: new Date().toISOString(),
                    features: ['Basic Resume Creation', 'Limited Template Access']
                });
                
                /* Uncomment this when the subscriptions table is ready
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching subscription:', error);
                    return;
                }

                if (data) {
                    setSubscription({
                        plan: data.plan,
                        status: data.status,
                        next_billing: data.next_billing,
                        features: planFeatures[data.plan as keyof typeof planFeatures] || []
                    });
                }
                */
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSubscription();
    }, [user]);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        try {
            setIsChangingPassword(true);

            // First verify the current password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user?.email as string,
                password: passwordForm.currentPassword
            });

            if (signInError) {
                setError('Current password is incorrect');
                return;
            }

            // Update to new password
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordForm.newPassword
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            // Success
            setShowChangePassword(false);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            alert('Password updated successfully');

        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while changing your password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleForgotPassword = async () => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                user?.email as string,
                {
                    redirectTo: `${window.location.origin}/reset-password`,
                }
            );

            if (error) {
                setError(error.message);
                return;
            }

            alert('Password reset link has been sent to your email');
            setShowChangePassword(false);

        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while sending reset email');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.'
        );

        if (confirmed) {
            try {
                setIsDeleting(true);
                
                // Delete user from Supabase Auth
                const { error } = await supabase.auth.admin.deleteUser(user?.id as string);
                
                if (error) {
                    console.error('Error deleting account:', error);
                    alert('Failed to delete account. Please try again or contact support.');
                    return;
                }

                // Sign out the user
                await signOut();
                
                // Redirect to home page
                navigate('/');
                
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting your account. Please try again.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-80px)] pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your profile</h2>
                    <Link to="/signin" className="text-purple-400 hover:text-purple-300">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Profile Overview</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Manage your profile settings and view your subscription details.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/30 text-white/90 rounded-2xl p-6 backdrop-blur-md border border-white/[0.08]">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-white/60">Name</span>
                    <span>{user?.user_metadata?.full_name || 'Not set'}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-white/60">Email</span>
                    <span>{user?.email}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-white/60">Member Since</span>
                    <span>{formatDate(user?.created_at || '')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/30 text-white/90 rounded-2xl p-6 backdrop-blur-md border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Current Plan</h3>
                  {subscription ? (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      {subscription.status}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      Free Trial
                    </span>
                  )}
                </div>
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-purple-400 mb-2">
                    {subscription ? subscription.plan : 'Free Trial'}
                  </h4>
                  {subscription && subscription.next_billing && (
                    <p className="text-white/60 text-sm">
                      Next billing date: {formatDate(subscription.next_billing)}
                    </p>
                  )}
                </div>
                <div>
                  <h5 className="text-sm font-medium text-white/80 mb-3">Plan Features:</h5>
                  <ul className="space-y-2">
                    {(subscription?.features || ['Basic Resume Creation', 'Limited Template Access']).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-6 border-t border-white/[0.08]">
                  <Link
                    to="/pricing"
                    className="block w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-colors text-sm text-center"
                  >
                    {subscription ? 'Upgrade Plan' : 'Choose a Plan'}
                  </Link>
                </div>
              </div>

              <div className="bg-black/30 text-white/90 rounded-2xl p-6 backdrop-blur-md border border-white/[0.08]">
                <h3 className="text-xl font-semibold mb-4">Resume Stats</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-white/60">Resumes Created</span>
                    <span>0</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-white/60">Enhancements Used</span>
                    <span>0</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-white/60">Templates Accessed</span>
                    <span>0</span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/30 text-white/90 rounded-2xl p-6 backdrop-blur-md border border-white/[0.08]">
                <h3 className="text-xl font-semibold mb-4">Account Security</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => setShowChangePassword(true)}
                    className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm text-left"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                  >
                    <span>Delete Account</span>
                    {isDeleting && (
                      <svg className="animate-spin h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Modal */}
          {showChangePassword && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-black/80 p-6 rounded-2xl border border-white/[0.08] w-full max-w-md mx-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {error && (
                            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({
                                    ...prev,
                                    currentPassword: e.target.value
                                }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(prev => ({
                                    ...prev,
                                    newPassword: e.target.value
                                }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({
                                    ...prev,
                                    confirmPassword: e.target.value
                                }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-purple-400 hover:text-purple-300 text-sm"
                            >
                                Forgot Password?
                            </button>
                            <div className="space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowChangePassword(false)}
                                    className="px-4 py-2 text-white/70 hover:text-white text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isChangingPassword ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Changing...
                                        </>
                                    ) : (
                                        'Change Password'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
          )}
        </div>
    );
};

export default Profile;
