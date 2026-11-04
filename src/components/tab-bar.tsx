import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "expo-router/tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize } from "@/constants/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const tabIcons: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: "home", inactive: "home-outline" },
  record: { active: "trophy", inactive: "trophy-outline" },
};

// 画面下の「ホーム / きろく」タブ。選択中のタブはピンクの背景で強調する
export function TabBar({ state, descriptors, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = descriptors[route.key].options.title ?? route.name;
        const icons = tabIcons[route.name];
        const color = focused ? colors.burntOrange : colors.textSub;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            onPress={() => {
              if (!focused) navigateToTab(route.key);
            }}
            style={[styles.tab, focused && styles.tabFocused]}
          >
            {icons && <Ionicons name={focused ? icons.active : icons.inactive} size={30} color={color} />}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingHorizontal: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 24,
  },
  tabFocused: {
    backgroundColor: colors.pink,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: "bold",
    marginTop: 2,
  },
});
