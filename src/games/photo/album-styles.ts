import { StyleSheet } from "react-native";

import { colors, fontSize, minTouchSize } from "@/constants/theme";

export const albumStyles = StyleSheet.create({
  screen: { flex: 1, alignSelf: "stretch", backgroundColor: colors.white },
  title: { padding: 12, fontSize: fontSize.large, fontWeight: "bold", color: colors.text },
  caption: { padding: 8, textAlign: "center", fontSize: fontSize.small, color: colors.text },
  viewer: { flex: 1, overflow: "hidden", justifyContent: "center", backgroundColor: colors.text },
  photo: { width: "100%", height: "100%" },
  button: { minHeight: minTouchSize, paddingHorizontal: 16, justifyContent: "center", alignItems: "center" },
  buttonText: { fontSize: fontSize.body, color: colors.blue, fontWeight: "bold" },
});
