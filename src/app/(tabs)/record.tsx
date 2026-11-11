import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { courses, getCategoriesByCourse, getLevelsByCategory, type CourseId } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";

export default function RecordScreen() {
  const [course, setCourse] = useState<CourseId>("basic");
  const { loaded, isCleared } = useProgress();
  const categories = getCategoriesByCourse(course);
  const clearedLevels = categories.flatMap((category) =>
    getLevelsByCategory(category.id)
      .filter((level) => isCleared(level.id))
      .map((level) => ({ ...level, categoryTitle: category.title })),
  );
  const clearedCategories = categories.filter((category) => {
    const levels = getLevelsByCategory(category.id);
    return levels.length > 0 && levels.every((level) => isCleared(level.id));
  }).length;

  return (
    <View style={styles.screen}>
      <AppHeader title="スマトレ" variant="logo" />
      <View style={styles.body}>
        <View pointerEvents="none" style={styles.landscape} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
        </View>

        <View accessibilityRole="tablist" style={styles.segment}>
          {(Object.keys(courses) as CourseId[]).map((id) => (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: course === id }}
              aria-selected={course === id}
              onPress={() => setCourse(id)}
              style={({ pressed }) => [styles.segmentItem, course === id && { backgroundColor: accents[id].main }, pressed && styles.pressed]}
            >
              <Text style={[styles.segmentText, course === id && styles.segmentTextActive]}>{courses[id].title}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView key={course} style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.panel}>
            {/* パズル画像を後から同じ正方形の領域に配置する。 */}
            <View style={styles.puzzleFrame} accessible accessibilityLabel="パズルの表示エリア">
              <View style={styles.puzzleCanvas} />
            </View>
            <Text style={styles.summary} accessibilityLiveRegion="polite">
              {loaded ? `クリアしたカテゴリ ${clearedCategories} / ${categories.length}` : "きろくを 読み込み中"}
            </Text>
            <Text accessibilityRole="header" style={styles.heading}>クリアした練習</Text>

            {!loaded ? (
              <ActivityIndicator color={colors.clearGreen} accessibilityLabel="きろくを読み込み中" style={styles.loading} />
            ) : clearedLevels.length === 0 ? (
              <View style={styles.emptyRow}>
                <Ionicons name="checkmark-circle-outline" size={32} color={colors.gray} accessible={false} />
                <Text style={styles.emptyText}>練習をクリアすると、ここに記録されます</Text>
              </View>
            ) : (
              clearedLevels.map((level) => (
                <View key={level.id} style={styles.row} accessible accessibilityLabel={`${level.categoryTitle}、レベル${level.level}、クリア済み`}>
                  <Ionicons name="checkmark-circle" size={32} color={colors.clearGreen} accessible={false} />
                  <View style={styles.rowText}>
                    <Text style={styles.categoryTitle}>{level.categoryTitle}</Text>
                    <Text style={styles.levelText}>レベル {level.level}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bluePale },
  body: { flex: 1, overflow: "hidden" },
  landscape: { ...StyleSheet.absoluteFill, overflow: "hidden" },
  hillBack: { position: "absolute", width: "160%", height: "65%", top: "10%", left: "-30%", borderRadius: 300, backgroundColor: colors.background, transform: [{ rotate: "-12deg" }] },
  hillFront: { position: "absolute", width: "160%", height: "50%", bottom: "-10%", right: "-40%", borderRadius: 300, backgroundColor: colors.practiceArea, transform: [{ rotate: "14deg" }] },
  segment: { flexDirection: "row", alignSelf: "center", width: "86%", maxWidth: 440, marginVertical: 14, padding: 4, borderRadius: 40, backgroundColor: colors.white, borderBottomWidth: 2, borderBottomColor: colors.border },
  segmentItem: { flex: 1, minHeight: minTouchSize, paddingHorizontal: 8, paddingVertical: 8, borderRadius: 36, justifyContent: "center", alignItems: "center" },
  segmentText: { fontSize: fontSize.body, color: colors.text, textAlign: "center" },
  segmentTextActive: { color: colors.white, fontWeight: "bold" },
  pressed: { opacity: 0.75 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 18, alignItems: "center" },
  panel: { width: "100%", maxWidth: 480, padding: 18, borderWidth: 2, borderRadius: 16, borderColor: colors.green, backgroundColor: colors.greenPale },
  puzzleFrame: { width: "100%", maxWidth: 320, aspectRatio: 1, alignSelf: "center", padding: 12, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  puzzleCanvas: { flex: 1, borderRadius: 8, backgroundColor: colors.background },
  summary: { marginTop: 12, marginBottom: 16, fontSize: fontSize.small, textAlign: "center", color: colors.textSub },
  heading: { marginBottom: 12, fontSize: fontSize.body, fontWeight: "bold", color: colors.text },
  row: { flexDirection: "row", alignItems: "center", minHeight: minTouchSize, gap: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, borderRadius: 30, borderWidth: 1, borderColor: colors.textSub, backgroundColor: colors.white },
  rowText: { flex: 1, gap: 3 },
  categoryTitle: { fontSize: fontSize.body, color: colors.text },
  levelText: { fontSize: fontSize.small, color: colors.textSub },
  emptyRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: minTouchSize, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 26, borderWidth: 1, borderColor: colors.textSub, backgroundColor: colors.white },
  emptyText: { flex: 1, fontSize: fontSize.small, lineHeight: 25, color: colors.textSub },
  loading: { paddingVertical: 18 },
});
