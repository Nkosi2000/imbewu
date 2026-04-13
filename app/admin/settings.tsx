/**
 * @fileoverview Admin settings screen
 */

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LogOut, Shield, Bell, Database, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/auth';
import { signOut } from '@/services/supabase';
import { useRouter } from 'expo-router';

export default function AdminSettingsScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const settingsItems = [
    { icon: Shield, label: 'Security Settings', onPress: () => {} },
    { icon: Bell, label: 'Notifications', onPress: () => {} },
    { icon: Database, label: 'Data Management', onPress: () => {} },
  ];

  return (
    <LinearGradient colors={['#faf5ff', '#fafaf9']} className="flex-1">
      <View className="pt-14 px-5 pb-4">
        <Text className="text-2xl font-bold text-earth-800">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-violet-600 items-center justify-center mb-4">
            <Shield size={40} color="white" />
          </View>
          <Text className="text-xl font-bold text-earth-800">
            {user?.first_name} {user?.last_name}
          </Text>
          <Text className="text-earth-500 capitalize">Administrator</Text>
        </View>

        <View className="px-5">
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={item.onPress}
                  className={`flex-row items-center px-4 py-4 ${
                    index < settingsItems.length - 1 ? 'border-b border-earth-100' : ''
                  }`}
                >
                  <Icon size={20} color="#7c3aed" />
                  <Text className="flex-1 ml-3 text-earth-800">{item.label}</Text>
                  <ChevronRight size={20} color="#a8a29e" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="px-5 mt-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-red-50 rounded-xl px-4 py-4"
          >
            <LogOut size={20} color="#dc2626" />
            <Text className="flex-1 ml-3 text-red-600 font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
