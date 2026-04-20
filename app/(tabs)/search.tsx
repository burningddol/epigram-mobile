import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-screen-x">
        <Text className="font-sans text-2xl font-bold text-black-900">검색</Text>
        <Text className="mt-2 font-sans text-sm text-blue-400">에피그램·태그 검색</Text>
      </View>
    </SafeAreaView>
  );
}
