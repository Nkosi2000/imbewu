/**
 * @fileoverview Signup screen
 */

import { signUpWithEmail } from '@/services/supabase';
import { signupSchema } from '@/validators';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, Sprout, User } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'independent'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSignup = async () => {
    try {
      setErrors({});
      const validated = signupSchema.parse({
        firstName,
        lastName,
        email,
        password,
        role,
      });
      setIsLoading(true);

      const { data, error } = await signUpWithEmail(
        validated.email,
        validated.password,
        {
          first_name: validated.firstName,
          last_name: validated.lastName,
          role: validated.role,
        }
      );

      if (error) {
        Alert.alert('Signup Failed', error.message);
        return;
      }

      Alert.alert(
        'Account Created',
        'Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
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
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl bg-primary-600 items-center justify-center mb-3 shadow-lg">
              <Sprout size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold text-earth-800">Create Account</Text>
            <Text className="text-earth-500 mt-1">Start your learning journey</Text>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-xl">
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <View className="flex-row items-center bg-earth-50 rounded-xl px-4 py-3">
                  <User size={18} color="#78716c" />
                  <TextInput
                    className="flex-1 ml-2 text-earth-800"
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor="#a8a29e"
                  />
                </View>
                {errors.firstName && (
                  <Text className="text-red-500 text-xs mt-1">{errors.firstName}</Text>
                )}
              </View>
              <View className="flex-1 ml-2">
                <View className="flex-row items-center bg-earth-50 rounded-xl px-4 py-3">
                  <User size={18} color="#78716c" />
                  <TextInput
                    className="flex-1 ml-2 text-earth-800"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor="#a8a29e"
                  />
                </View>
                {errors.lastName && (
                  <Text className="text-red-500 text-xs mt-1">{errors.lastName}</Text>
                )}
              </View>
            </View>

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

            <View className="mb-4">
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

            <View className="mb-6">
              <Text className="text-earth-700 font-medium mb-2">I am a:</Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setRole('student')}
                  className={`flex-1 py-3 rounded-xl mr-2 items-center ${
                    role === 'student' ? 'bg-primary-600' : 'bg-earth-100'
                  }`}
                >
                  <Text className={role === 'student' ? 'text-white font-medium' : 'text-earth-600'}>
                    Student
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRole('independent')}
                  className={`flex-1 py-3 rounded-xl ml-2 items-center ${
                    role === 'independent' ? 'bg-primary-600' : 'bg-earth-100'
                  }`}
                >
                  <Text className={role === 'independent' ? 'text-white font-medium' : 'text-earth-600'}>
                    Independent Learner
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              className={`rounded-xl py-4 items-center ${
                isLoading ? 'bg-primary-400' : 'bg-primary-600'
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-earth-500">Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-600 font-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
