import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ProgressProvider } from "@/hooks/use-progress";

export default function RootLayout() {
  return (
    // ピンチなどのジェスチャーを使うために、アプリ全体を包む
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProgressProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="clear" options={{ animation: "fade" }} />
        {/* ピースゲット画面は、クリア画面の上に重ねて出す */}
        <Stack.Screen name="piece" options={{ presentation: "transparentModal", animation: "fade" }} />
      </Stack>
      </ProgressProvider>
    </GestureHandlerRootView>
  );
}
