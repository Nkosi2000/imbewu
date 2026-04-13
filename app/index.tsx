/**
 * @fileoverview Landing page - redirects based on auth status
 */

import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import type { UserRole } from '@/types';

const roleRoutes: Record<UserRole, string> = {
  admin: '/admin',
  coordinator: '/coordinator',
  student: '/student',
  independent: '/independent',
};

export default function Index() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-earth-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  const route = user ? roleRoutes[user.role] : '/auth/login';
  return <Redirect href={route as any} />;
}
