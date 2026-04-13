import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function IndependentLearnScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-earth-800 mb-4">Learning Path</Text>
      <Text className="text-earth-500 text-center mb-6">
        This is the independent learning hub. Select a course from the Explore tab to begin.
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/independent/explore')}
        className="rounded-xl bg-cyan-600 px-5 py-3"
      >
        <Text className="text-white font-semibold">Browse Courses</Text>
      </TouchableOpacity>
    </View>
  );
}
