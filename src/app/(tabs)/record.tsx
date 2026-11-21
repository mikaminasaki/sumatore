import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { PuzzleBoard } from "@/components/puzzle-board";
import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";
import { courses, getCategoriesByCourse, getLevelsByCategory, type CourseId } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";

export default function RecordScreen() {
  const { recordPreview } = useLocalSearchParams<{ recordPreview?: string }>();
  const preview = __DEV__ && recordPreview === "1";
  const [course, setCourse] = useState<CourseId>("basic");
  const [puzzleSize, setPuzzleSize] = useState(0);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);
  const progress = useProgress();
  const loaded = preview || progress.loaded;
  // 確認用URLでは表示だけを置き換える。進捗の保存・削除は行わない。
  const isCleared = preview
    ? (id: string) => id.startsWith("zoom-") || id.startsWith("photo-")
    : progress.isCleared;
  const categories = getCategoriesByCourse(course);
  const categoryProgress = categories.map((category) => {
    const levels = getLevelsByCategory(category.id);
    const clearedLevels = levels.filter((level) => isCleared(level.id));
    return { category, levels, clearedLevels };
  });
  const collectedCategoryIds = categoryProgress
    .filter(({ levels, clearedLevels }) => loaded && levels.length > 0 && clearedLevels.length === levels.length)
    .map(({ category }) => category.id);
  const clearedGroups = categoryProgress.filter(({ clearedLevels }) => clearedLevels.length > 0);

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
          {preview && (
            <View style={styles.previewNotice}>
              <Text style={styles.levelText}>表示確認用の記録です。保存されません。</Text>
              <Pressable accessibilityRole="button" onPress={() => router.replace("/record")} style={styles.previewExit}>
                <Text style={styles.categoryTitle}>自分の記録に戻る</Text>
              </Pressable>
            </View>
          )}
          <View style={[styles.panel, { borderColor: accents[course].main, backgroundColor: accents[course].pale }]}>
            <View style={styles.puzzleFrame} accessible accessibilityLabel={loaded ? `${courses[course].title}のパズル、${collectedCategoryIds.length} / ${categories.length} ピース獲得` : "パズルの記録を読み込み中"}>
              <View style={styles.puzzleCanvas} onLayout={(event) => setPuzzleSize(event.nativeEvent.layout.width)}>
                {loaded && puzzleSize > 0 && (
                  <PuzzleBoard course={course} collectedCategoryIds={collectedCategoryIds} size={puzzleSize} />
                )}
              </View>
            </View>
            <Text style={styles.summary} accessibilityLiveRegion="polite">
              {loaded ? `獲得したピース ${collectedCategoryIds.length} / ${categories.length} 枚` : "記録を読み込み中"}
            </Text>
            <Text accessibilityRole="header" style={styles.heading}>クリアした練習</Text>

            {!loaded ? (
              <ActivityIndicator color={colors.clearGreen} accessibilityLabel="記録を読み込み中" style={styles.loading} />
            ) : clearedGroups.length === 0 ? (
              <View style={styles.emptyRow}>
                <Ionicons name="checkmark-circle-outline" size={32} color={colors.gray} accessible={false} />
                <Text style={styles.emptyText}>練習を完了すると、ここに記録が表示されます</Text>
              </View>
            ) : (
              clearedGroups.map(({ category, levels, clearedLevels }) => {
                const complete = clearedLevels.length === levels.length;
                const expanded = expandedCategoryIds.includes(category.id);
                return (
                  <View key={category.id} style={complete && [styles.categoryGroup, { borderColor: accents[course].main }]}>
                    {complete && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${category.title}、全${levels.length}レベルクリア`}
                        accessibilityHint="クリアしたレベルの一覧を開閉します"
                        accessibilityState={{ expanded }}
                        onPress={() => setExpandedCategoryIds((ids) => expanded
                          ? ids.filter((id) => id !== category.id)
                          : [...ids, category.id])}
                        style={({ pressed }) => [styles.groupHeader, pressed && styles.pressed]}
                      >
                        <Ionicons name="checkmark-circle" size={32} color={colors.clearGreen} accessible={false} />
                        <View style={styles.rowText}>
                          <Text style={styles.categoryTitle}>{category.title}</Text>
                          <Text style={styles.levelText}>全{levels.length}レベルクリア</Text>
                          <View style={[styles.disclosure, { borderColor: accents[course].main }]}>
                            <Text style={[styles.disclosureText, { color: accents[course].dark }]}>{expanded ? "レベルを閉じる" : "レベルを見る"}</Text>
                            <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={22} color={accents[course].main} accessible={false} />
                          </View>
                        </View>
                      </Pressable>
                    )}
                    {(!complete || expanded) && (
                      <View style={complete && [styles.levelList, { borderTopColor: accents[course].main, backgroundColor: accents[course].pale }]}>
                        {complete && <Text accessibilityRole="header" style={[styles.listHeading, { color: accents[course].dark }]}>クリアしたレベル</Text>}
                        {clearedLevels.map((level) => (
                          <View key={level.id} style={[styles.row, complete && styles.detailRow]} accessible accessibilityLabel={`${category.title}、レベル${level.level}、クリア済み`}>
                            <Ionicons name="checkmark-circle" size={32} color={colors.clearGreen} accessible={false} />
                            <View style={styles.rowText}>
                              {!complete && <Text style={styles.categoryTitle}>{category.title}</Text>}
                              <Text style={complete ? styles.categoryTitle : styles.levelText}>レベル {level.level}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })
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
  panel: { width: "100%", maxWidth: 480, padding: 18, borderWidth: 2, borderRadius: 16 },
  puzzleFrame: { width: "100%", maxWidth: 320, aspectRatio: 1, alignSelf: "center", padding: 12, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  puzzleCanvas: { flex: 1, borderRadius: 8, backgroundColor: colors.background },
  summary: { marginTop: 12, marginBottom: 16, fontSize: fontSize.small, textAlign: "center", color: colors.textSub },
  heading: { marginBottom: 12, fontSize: fontSize.body, fontWeight: "bold", color: colors.text },
  row: { flexDirection: "row", alignItems: "center", minHeight: minTouchSize, gap: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, borderRadius: 30, borderWidth: 1, borderColor: colors.textSub, backgroundColor: colors.white },
  rowText: { flex: 1, gap: 3 },
  categoryGroup: { marginBottom: 12, borderWidth: 2, borderRadius: 16, overflow: "hidden", backgroundColor: colors.white },
  groupHeader: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, minHeight: minTouchSize },
  disclosure: { flexDirection: "row", alignSelf: "flex-start", alignItems: "center", gap: 6, marginTop: 6, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderRadius: 10, backgroundColor: colors.white },
  disclosureText: { fontSize: fontSize.small, fontWeight: "bold", flexShrink: 1 },
  levelList: { borderTopWidth: 1, padding: 12, gap: 8 },
  listHeading: { fontSize: fontSize.small, fontWeight: "bold", marginBottom: 2 },
  detailRow: { marginBottom: 0, borderRadius: 10, borderColor: colors.border },
  previewNotice: { width: "100%", maxWidth: 480, marginBottom: 12, gap: 4 },
  previewExit: { minHeight: 48, justifyContent: "center", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10 },
  categoryTitle: { fontSize: fontSize.body, color: colors.text },
  levelText: { fontSize: fontSize.small, color: colors.textSub },
  emptyRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: minTouchSize, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 26, borderWidth: 1, borderColor: colors.textSub, backgroundColor: colors.white },
  emptyText: { flex: 1, fontSize: fontSize.small, lineHeight: 25, color: colors.textSub },
  loading: { paddingVertical: 18 },
});
