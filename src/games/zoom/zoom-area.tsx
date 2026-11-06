import { useRef, useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector, usePanGesture, usePinchGesture, useSimultaneousGestures } from "react-native-gesture-handler";

type Props = {
  minScale?: number;
  maxScale?: number;
  // ピンチの指を離したときに、今の大きさを受け取る
  onPinchEnd?: (scale: number) => void;
  // true なら、拡大中に指 1 本で動かせる (レベル 3〜5 用)
  pannable?: boolean;
  children: ReactNode;
};

// 中身を 2本指で拡大・縮小 (と、指 1 本で移動) できるエリア。拡大・縮小編のゲームで共通で使う
export function ZoomArea({ minScale = 0.5, maxScale = 4, onPinchEnd, pannable = false, children }: Props) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  // ジェスチャーの途中で読むための値。指を離すたびに base を更新して、次の操作に引き継ぐ
  const baseScale = useRef(1);
  const currentScale = useRef(1);
  const baseOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });

  // 拡大した分だけ動かせる。端より外には出さない
  const clampOffset = (x: number, y: number, s: number) => {
    const limitX = (Math.max(s - 1, 0) * size.width) / 2;
    const limitY = (Math.max(s - 1, 0) * size.height) / 2;
    return {
      x: Math.min(limitX, Math.max(-limitX, x)),
      y: Math.min(limitY, Math.max(-limitY, y)),
    };
  };

  const applyOffset = (next: { x: number; y: number }) => {
    currentOffset.current = next;
    setOffset(next);
  };

  const pinch = usePinchGesture({
    runOnJS: true,
    onUpdate: (e) => {
      const next = Math.min(maxScale, Math.max(minScale, baseScale.current * e.scale));
      currentScale.current = next;
      setScale(next);
      applyOffset(clampOffset(currentOffset.current.x, currentOffset.current.y, next));
    },
    onDeactivate: () => {
      baseScale.current = currentScale.current;
      baseOffset.current = currentOffset.current;
      onPinchEnd?.(currentScale.current);
    },
  });

  const pan = usePanGesture({
    runOnJS: true,
    enabled: pannable,
    maxPointers: 1,
    onUpdate: (e) => {
      applyOffset(
        clampOffset(baseOffset.current.x + e.translationX, baseOffset.current.y + e.translationY, currentScale.current),
      );
    },
    onDeactivate: () => {
      baseOffset.current = currentOffset.current;
    },
  });

  const gesture = useSimultaneousGestures(pinch, pan);

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={styles.area}
        onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      >
        <View
          style={[styles.content, { transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale }] }]}
        >
          {children}
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, alignSelf: "stretch", overflow: "hidden" },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
});
