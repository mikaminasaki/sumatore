import { Tabs } from "expo-router/tabs";

import { TabBar } from "@/components/tab-bar";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "ホーム" }} />
      <Tabs.Screen name="record" options={{ title: "きろく" }} />
    </Tabs>
  );
}
