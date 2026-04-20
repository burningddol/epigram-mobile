import { Search } from "lucide-react-native";
import { type ReactElement } from "react";
import { Pressable, TextInput, View } from "react-native";

interface SearchBarProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSearch: (keyword: string) => void;
}

export function SearchBar({
  inputValue,
  onInputChange,
  onSearch,
}: SearchBarProps): ReactElement {
  function handleSubmit(): void {
    onSearch(inputValue);
  }

  return (
    <View className="flex-row items-center border-b-2 border-blue-300 pb-2">
      <TextInput
        value={inputValue}
        onChangeText={onInputChange}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        placeholder="검색어를 입력하세요"
        placeholderTextColor="#abb8ce"
        autoCorrect={false}
        autoCapitalize="none"
        className="h-10 flex-1 font-sans text-base text-black-900"
      />
      <Pressable
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel="검색"
        className="ml-2 h-10 w-10 items-center justify-center active:opacity-70"
      >
        <Search size={20} color="#abb8ce" />
      </Pressable>
    </View>
  );
}
