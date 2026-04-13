/**
 * @fileoverview Create new course screen
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '@/services/supabase';
import { useAuthStore } from '@/store/auth';

export default function CreateCourseScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not authenticated');
      return createCourse({
        title,
        description,
        cover_image: null,
        created_by: user.id,
        is_published: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      Alert.alert('Success', 'Course created successfully!');
      router.back();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to create course. Please try again.');
    },
  });

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    createMutation.mutate();
  };

  return (
    <View className="flex-1 bg-earth-50">
      <LinearGradient colors={['#7c3aed', '#6d28d9']} className="pt-14 pb-6 px-5">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">Create Course</Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-5 py-6">
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-earth-700 font-medium mb-2">Course Title</Text>
          <TextInput
            className="bg-earth-50 rounded-xl px-4 py-3 text-earth-800"
            placeholder="Enter course title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#a8a29e"
          />

          <Text className="text-earth-700 font-medium mb-2 mt-5">Description</Text>
          <TextInput
            className="bg-earth-50 rounded-xl px-4 py-3 text-earth-800"
            placeholder="Enter course description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
            placeholderTextColor="#a8a29e"
          />

          <Text className="text-earth-500 text-sm mt-5">
            After creating the course, you can add lessons and quizzes from the course detail page.
          </Text>
        </View>
      </ScrollView>

      <View className="px-5 py-6 bg-white border-t border-earth-200">
        <TouchableOpacity
          onPress={handleSave}
          disabled={createMutation.isPending}
          className={`rounded-xl py-4 items-center ${
            createMutation.isPending ? 'bg-violet-400' : 'bg-violet-600'
          }`}
        >
          <View className="flex-row items-center">
            <Save size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              {createMutation.isPending ? 'Creating...' : 'Create Course'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
