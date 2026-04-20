import { Tabs } from 'expo-router';
import { Home, Plus, Search, User } from 'lucide-react-native';
import { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export const unstable_settings = {
  initialRouteName: 'feeds',
};

function CenterAddButton(props: BottomTabBarButtonProps): ReactElement {
  return (
    <Pressable
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      accessibilityRole="button"
      accessibilityLabel="에피그램 작성"
      className="-top-2 flex-1 items-center justify-center"
    >
      <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-md">
        <Plus size={28} color="#ffffff" strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

export default function TabLayout(): ReactElement {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#454545',
        tabBarInactiveTintColor: '#abb8ce',
        tabBarLabelStyle: { fontFamily: 'Pretendard', fontSize: 12 },
        tabBarStyle: { height: 64, paddingBottom: 4, paddingTop: 12 },
      }}
    >
      <Tabs.Screen
        name="feeds"
        options={{
          title: '피드',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '검색',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="addepigram"
        options={{
          title: '',
          tabBarButton: (props) => <CenterAddButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
