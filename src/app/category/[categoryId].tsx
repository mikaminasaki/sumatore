import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { LevelCard } from "@/components/level-card";
import { accents, colors } from "@/constants/theme";
import { getCategory, getLevelsByCategory } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";

// カテゴリ内のレベル一覧 (例: 拡大・縮小 レベル 1〜5)
export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { isCleared } = useProgress();
  const category = getCategory(categoryId);
  const levels = getLevelsByCategory(categoryId);
  const accent = accents[category?.course ?? "basic"];
  const nextId = levels.find((l) => !isCleared(l.id))?.id;

  return (
    <View style={styles.container}>
      <AppHeader
        title={category?.title ?? ""}
        leftButton="back"
        accent={accent}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {levels.map((level) => (
          <LevelCard
            key={level.id}
            level={level.level}
            cleared={isCleared(level.id)}
            isNext={level.id === nextId}
            accent={accent}
            onPress={() => router.push({ pathname: "/lesson/[levelId]", params: { levelId: level.id } })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14 },
});
