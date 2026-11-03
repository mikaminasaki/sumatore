import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppHeader } from "@/components/app-header";
import { colors, fontSize } from "@/constants/theme";
import { courses, getCategoriesByCourse, getLevelsByCategory, type CourseId } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";

// きろく画面 (仮)。パズルの絵は #10 で仕上げる
export default function RecordScreen() {
  const [course, setCourse] = useState<CourseId>("basic");
  const { isCleared } = useProgress();

  const levels = getCategoriesByCourse(course).flatMap((c) =>
    getLevelsByCategory(c.id).map((l) => ({ ...l, categoryTitle: c.title })),
  );

  return (
    <View style={styles.container}>
      <AppHeader title="スマトレ" variant="logo" />
      <View style={styles.segment}>
        {(Object.keys(courses) as CourseId[]).map((id) => (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected: course === id }}
            onPress={() => setCourse(id)}
            style={[styles.segmentItem, course === id && styles.segmentItemActive]}
          >
            <Text style={[styles.segmentText, course === id && styles.segmentTextActive]}>
              {courses[id].title}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.heading}>クリアした練習</Text>
        {levels.map((l) => (
          <View key={l.id} style={styles.row}>
            <Ionicons
              name={isCleared(l.id) ? "checkmark-circle" : "ellipse-outline"}
              size={32}
              color={isCleared(l.id) ? colors.green : colors.gray}
            />
            <Text style={styles.rowText}>
              {l.categoryTitle} Level {l.level}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  segment: {
    flexDirection: "row",
    margin: 16,
    padding: 4,
    borderRadius: 24,
    backgroundColor: "#F0F0F0",
  },
  segmentItem: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: "center" },
  segmentItemActive: { backgroundColor: colors.green },
  segmentText: { fontSize: fontSize.body, color: colors.text },
  segmentTextActive: { color: colors.white, fontWeight: "bold" },
  list: { padding: 16, gap: 12 },
  heading: { fontSize: fontSize.body, fontWeight: "bold", color: colors.text },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.text,
  },
  rowText: { fontSize: fontSize.body, color: colors.text },
});
