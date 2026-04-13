/**
 * @fileoverview Root layout with providers
 */

import { getCurrentUser, getProfile, supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/auth';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    async function initAuth() {
      try {
        const user = await getCurrentUser();
        if (isMountedRef.current) {
          if (user) {
            const profile = await getProfile(user.id);
            setUser(profile);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMountedRef.current) {
          setLoading(false);
        }
      } finally {
        if (isMountedRef.current) {
          setIsReady(true);
        }
      }
    }

    initAuth();
  }, [setUser, setLoading]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (!isMountedRef.current) return;
      
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (isMountedRef.current) {
          setUser(profile);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-earth-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="student" />
          <Stack.Screen name="coordinator" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="independent" />
        </Stack>
        <StatusBar style="dark" />
      </AuthProvider>
    </QueryClientProvider>
  );
}