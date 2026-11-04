import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ProgressProvider } from "@/hooks/use-progress";

export default function RootLayout() {
  return (
    <ProgressProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="clear" options={{ animation: "fade" }} />
      </Stack>
    </ProgressProvider>
  );
}
