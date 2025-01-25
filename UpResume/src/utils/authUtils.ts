import { supabase } from '../lib/supabaseClient';

export const updateUserMetadata = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log('No active session found');
      return;
    }

    const { user } = session;
    const { user_metadata } = user;
    
    console.log('Current user metadata:', user_metadata);
    console.log('User identities:', user.identities);

    // For Google sign-in, the picture URL is in the identity data
    const identityData = user.identities?.[0]?.identity_data;
    console.log('Identity data:', identityData);
    
    if (identityData?.picture || identityData?.avatar_url) {
      const avatarUrl = identityData.picture || identityData.avatar_url;
      console.log('Updating user metadata with picture:', avatarUrl);
      const { data, error } = await supabase.auth.updateUser({
        data: {
          avatar_url: avatarUrl,
          full_name: identityData.full_name || identityData.name,
          updated_at: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Error updating user metadata:', error);
      } else {
        console.log('Successfully updated user metadata:', data.user.user_metadata);
      }
    } else {
      console.log('No picture URL found in identity data');
    }
  } catch (error) {
    console.error('Error in updateUserMetadata:', error);
  }
};

// Call this function when the app starts and after sign-in
export const initializeAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await updateUserMetadata();
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      await updateUserMetadata();
    }
  });
};
