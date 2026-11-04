import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { MenuButton } from "@/components/menu-button";
import { colors } from "@/constants/theme";
import { courses, getCategoriesByCourse, type CourseId } from "@/data/lessons";

// 基本操作編・実践編のメニュー画面。中身は lessons.ts のカテゴリから作る
export function CourseMenu({ course }: { course: CourseId }) {
  return (
    <View style={styles.container}>
      <AppHeader title={courses[course].title} showHomeButton />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.picture}>
          {/* パズル画像は #7 で差し替える */}
          <Ionicons name="extension-puzzle" size={96} color={colors.green} />
        </View>
        {getCategoriesByCourse(course).map((category) => (
          <MenuButton
            key={category.id}
            title={category.title}
            disabled={!category.available}
            onPress={() => router.push({ pathname: "/category/[categoryId]", params: { categoryId: category.id } })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.greenPale },
  content: { padding: 20, gap: 24 },
  picture: {
    alignSelf: "center",
    width: 150,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
});
