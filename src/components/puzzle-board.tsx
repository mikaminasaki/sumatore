import { useEffect, useState } from "react";
import { Animated, Image, View } from "react-native";

import type { CourseId } from "@/data/lessons";
import { boards, pieces } from "@/data/puzzles";

type Props = {
  course: CourseId;
  // 持っているピースのカテゴリ ID
  collectedCategoryIds: string[];
  // もらったばかりのピース。ふわっと大きくなって はまる
  newCategoryId?: string;
  size: number;
};

// 台座の上に、持っているピースを重ねて表示する (ピースゲット画面・きろく画面で使う)
export function PuzzleBoard({ course, collectedCategoryIds, newCategoryId, size }: Props) {
  const [pop] = useState(() => new Animated.Value(newCategoryId ? 0 : 1));

  useEffect(() => {
    if (!newCategoryId) return;
    Animated.sequence([
      Animated.delay(400),
      Animated.spring(pop, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
    ]).start();
  }, [newCategoryId, pop]);

  return (
    <View style={{ width: size, height: size, borderRadius: 24, overflow: "hidden" }} accessibilityLabel="パズル">
      <Image source={boards[course]} style={{ position: "absolute", left: 0, top: 0, width: size, height: size }} />
      {pieces[course]
        .filter((p) => collectedCategoryIds.includes(p.categoryId) || p.categoryId === newCategoryId)
        .map((p) => {
          const isNew = p.categoryId === newCategoryId;
          return (
            <Animated.Image
              key={p.categoryId}
              source={p.image}
              accessibilityLabel={`${p.name}の ピース`}
              style={{
                position: "absolute",
                left: p.layout.left * size,
                top: p.layout.top * size,
                width: p.layout.width * size,
                height: p.layout.height * size,
                ...(isNew && {
                  opacity: pop,
                  transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [1.6, 1] }) }],
                }),
              }}
            />
          );
        })}
    </View>
  );
}
