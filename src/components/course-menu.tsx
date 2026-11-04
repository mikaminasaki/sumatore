import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { CategoryCard } from "@/components/category-card";
import { ProgressCard } from "@/components/progress-card";
import { colors, fontSize } from "@/constants/theme";
import { courses, getCategoriesByCourse, getLevelsByCategory, type CourseId } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";

// 基本操作編・実践編のメニュー画面。中身は lessons.ts のカテゴリから作る
export function CourseMenu({ course }: { course: CourseId }) {
  const { isCleared } = useProgress();
  const categories = getCategoriesByCourse(course);

  // カテゴリ内のレベルを全部クリアしたら、そのカテゴリはクリア
  const isCategoryCleared = (categoryId: string) => {
    const levels = getLevelsByCategory(categoryId);
    return levels.length > 0 && levels.every((l) => isCleared(l.id));
  };
  const clearedCount = categories.filter((c) => isCategoryCleared(c.id)).length;
  const nextId = categories.find((c) => c.available && !isCategoryCleared(c.id))?.id;

  return (
    <View style={styles.container}>
      <AppHeader title={courses[course].title} leftButton="back" />
      <ScrollView contentContainerStyle={styles.content}>
        <ProgressCard cleared={clearedCount} total={categories.length} />
        <Text style={styles.lead}>れんしゅうを えらんでください</Text>
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            number={index + 1}
            title={category.title}
            description={category.description}
            cleared={isCategoryCleared(category.id)}
            isNext={category.id === nextId}
            disabled={!category.available}
            onPress={() => router.push({ pathname: "/category/[categoryId]", params: { categoryId: category.id } })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  lead: { fontSize: fontSize.small, fontWeight: "bold", color: colors.text, marginTop: 8 },
});
