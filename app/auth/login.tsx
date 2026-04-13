/**
 * @fileoverview Login screen
 */

import { signInWithEmail } from '@/services/supabase';
import { useAuthStore } from '@/store/auth';
import { loginSchema } from '@/validators';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, Sprout } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleLogin = async () => {
    try {
      setErrors({});
      const validated = loginSchema.parse({ email, password });
      setIsLoading(true);

      const { data, error } = await signInWithEmail(validated.email, validated.password);

      if (error) {
        Alert.alert('Login Failed', error.message);
        return;
      }

      if (data.user) {
        const { getProfile } = await import('@/services/supabase');
        const profile = await getProfile(data.user.id);
        setUser(profile);
        router.replace('/');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const pathKey = issue.path[0]?.toString();
          if (pathKey) {
            fieldErrors[pathKey] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient
        colors={['#f0fdf4', '#dcfce7', '#bbf7d0']}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-2xl bg-primary-600 items-center justify-center mb-4 shadow-lg">
              <Sprout size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-earth-800">AgroLearn</Text>
            <Text className="text-earth-500 mt-2">Grow your knowledge</Text>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-xl">
            <Text className="text-2xl font-bold text-earth-800 mb-6">Welcome Back</Text>

            <View className="mb-4">
              <View className="flex-row items-center bg-earth-50 rounded-xl px-4 py-3">
                <Mail size={20} color="#78716c" />
                <TextInput
                  className="flex-1 ml-3 text-earth-800"
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#a8a29e"
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            <View className="mb-6">
              <View className="flex-row items-center bg-earth-50 rounded-xl px-4 py-3">
                <Lock size={20} color="#78716c" />
                <TextInput
                  className="flex-1 ml-3 text-earth-800"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#a8a29e"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#78716c" />
                  ) : (
                    <Eye size={20} color="#78716c" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`rounded-xl py-4 items-center ${
                isLoading ? 'bg-primary-400' : 'bg-primary-600'
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-earth-500">Don't have an account? </Text>
              <Link href="/auth/signup" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-600 font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
