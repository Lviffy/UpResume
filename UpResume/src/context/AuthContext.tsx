import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  avatarUrl: string | null
  userName: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  avatarUrl: null,
  userName: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  const updateUserData = (user: User | null) => {
    console.log('Updating user data:', user);
    setUser(user)
    if (user?.user_metadata) {
      const { avatar_url, full_name, name } = user.user_metadata
      console.log('Setting avatar URL:', avatar_url);
      console.log('Setting user name:', full_name || name || user.email?.split('@')[0]);
      setAvatarUrl(avatar_url ?? null)
      setUserName(full_name || name || user.email?.split('@')[0] || null)
    } else {
      console.log('No user metadata found, clearing avatar and name');
      setAvatarUrl(null)
      setUserName(user?.email?.split('@')[0] || null)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserData(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session?.user?.user_metadata)
      updateUserData(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAvatarUrl(null)
    setUserName(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, avatarUrl, userName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
