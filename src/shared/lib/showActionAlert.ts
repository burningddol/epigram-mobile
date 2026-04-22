import { Alert } from "react-native";

export interface ActionAlertItem {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export function showActionAlert(
  title: string,
  actions: ActionAlertItem[],
): void {
  Alert.alert(
    title,
    undefined,
    [
      ...actions.map((action) => ({
        text: action.label,
        style: action.destructive ? ("destructive" as const) : undefined,
        onPress: action.onPress,
      })),
      { text: "취소", style: "cancel" as const },
    ],
    { cancelable: true },
  );
}
