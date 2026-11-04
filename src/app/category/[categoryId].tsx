import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { LevelCard } from "@/components/level-card";
import { colors } from "@/constants/theme";
import { getCategory, getLevelsByCategory } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";

// カテゴリ内のレベル一覧 (例: 拡大縮小編 Level 1〜5)
export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { isCleared } = useProgress();
  const category = getCategory(categoryId);

  return (
    <View style={styles.container}>
      <AppHeader title={category?.title ?? ""} showHomeButton />
      <ScrollView contentContainerStyle={styles.content}>
        {getLevelsByCategory(categoryId).map((level) => (
          <LevelCard
            key={level.id}
            level={level.level}
            description={level.description}
            cleared={isCleared(level.id)}
            onPress={() => router.push({ pathname: "/lesson/[levelId]", params: { levelId: level.id } })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.greenPale },
  content: { padding: 20, gap: 16 },
});
