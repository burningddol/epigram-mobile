import { useCallback, useEffect, useRef, type RefObject } from "react";
import {
  FlatList,
  Keyboard,
  TextInput,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

const DEFAULT_BREATHING_ROOM = 24;

interface UseScrollToFocusedInputResult {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function useScrollToFocusedInput<T>(
  listRef: RefObject<FlatList<T> | null>,
  breathingRoom: number = DEFAULT_BREATHING_ROOM,
): UseScrollToFocusedInputResult {
  const scrollOffsetRef = useRef(0);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
      scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", (event) => {
      const focusedInput = TextInput.State.currentlyFocusedInput?.();
      if (!focusedInput?.measureInWindow) return;

      const keyboardTopY = event.endCoordinates.screenY;

      focusedInput.measureInWindow((_x, y, _w, height) => {
        const list = listRef.current;
        if (!list) return;

        const inputBottomY = y + height;
        const overlap = inputBottomY - keyboardTopY + breathingRoom;
        if (overlap <= 0) return;

        list.scrollToOffset({
          offset: scrollOffsetRef.current + overlap,
          animated: true,
        });
      });
    });
    return () => subscription.remove();
  }, [listRef, breathingRoom]);

  return { onScroll };
}
