import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, type ComponentRef, type ReactNode } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureDetector, usePinchGesture } from "react-native-gesture-handler";

import { colors, fontSize, minTouchSize } from "@/constants/theme";

import { dogPhotoIndex, photos, riverPhotoIndex, snowPhotoIndex } from "./photos";

const thumbnailSize = minTouchSize;
const thumbnailGap = 4;

type AlbumProps = {
  initialPhoto?: number;
  referencePhoto?: number;
  zoomPhoto?: number;
  actions: (index: number, zoomed: boolean) => ReactNode;
};

function ZoomPhoto({ index, onZoom }: { index: number; onZoom: (zoomed: boolean) => void }) {
  const [scale, setScale] = useState(1);
  const base = useRef(1);
  const latest = useRef(1);
  const pinch = usePinchGesture({
    runOnJS: true,
    onUpdate: ({ scale: gestureScale }) => {
      const next = Math.max(1, Math.min(3, base.current * gestureScale));
      latest.current = next;
      setScale(next);
    },
    onDeactivate: ({ canceled }) => {
      if (canceled) {
        latest.current = base.current;
        setScale(base.current);
        return;
      }

      base.current = latest.current;
      onZoom(base.current >= 1.6);
    },
  });

  return (
    <GestureDetector gesture={pinch}>
      <View style={styles.zoomArea}>
        <Image source={photos[index]} style={[styles.image, { transform: [{ scale }] }]} resizeMode="contain" />
      </View>
    </GestureDetector>
  );
}

function PhotoViewer({ initialPhoto, zoomPhoto, actions, onBack }: Omit<AlbumProps, "referencePhoto" | "initialPhoto"> & { initialPhoto: number; onBack: () => void }) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(initialPhoto);
  const [zoomed, setZoomed] = useState(false);
  const pager = useRef<FlatList<number>>(null);
  const thumbnails = useRef<ComponentRef<typeof ScrollView>>(null);

  function selectPhoto(next: number) {
    if (next === index) return;
    setIndex(next);
    setZoomed(false);
    thumbnails.current?.scrollTo({ x: thumbnailOffset(next, width), animated: true });
  }

  return (
    <View style={styles.viewer} accessibilityViewIsModal>
      <View style={styles.toolbar}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={colors.blue} />
          <Text style={styles.actionText}>一覧へ</Text>
        </Pressable>
        <Text accessibilityRole="header" style={styles.viewerTitle}>写真</Text>
        <Text style={styles.counter}>{index + 1} / {photos.length}</Text>
      </View>

      <View style={styles.stage} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 && (
          <FlatList
            key={width}
            ref={pager}
            data={photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={index}
            getItemLayout={(_, itemIndex) => ({ length: width, offset: width * itemIndex, index: itemIndex })}
            keyExtractor={(photo) => String(photo)}
            scrollEnabled={!zoomed}
            onMomentumScrollEnd={(event) => {
              const next = Math.round(event.nativeEvent.contentOffset.x / width);
              selectPhoto(Math.max(0, Math.min(photos.length - 1, next)));
            }}
            renderItem={({ item, index: itemIndex }) => (
              <View style={[styles.page, { width }]}>
                {itemIndex === zoomPhoto && itemIndex === index ? (
                  <ZoomPhoto index={itemIndex} onZoom={setZoomed} />
                ) : (
                  <Image source={item} style={styles.image} resizeMode="contain" />
                )}
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.strip}>
        {width > 0 && (
          <ScrollView
            ref={thumbnails}
            horizontal
            contentOffset={{ x: thumbnailOffset(initialPhoto, width), y: 0 }}
            contentContainerStyle={styles.thumbnails}
            showsHorizontalScrollIndicator={false}
          >
            {photos.map((photo, photoIndex) => (
              <Pressable
                key={photo}
                accessibilityRole="button"
                accessibilityLabel={photoLabel(photoIndex)}
                accessibilityState={{ selected: index === photoIndex }}
                style={[styles.thumbnail, index === photoIndex && styles.selected]}
                onPress={() => {
                  pager.current?.scrollToIndex({ index: photoIndex, animated: false });
                  selectPhoto(photoIndex);
                }}
              >
                <Image source={photo} style={styles.image} />
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
      {actions(index, zoomed)}
    </View>
  );
}

export function PhotoAlbum({ initialPhoto, referencePhoto, zoomPhoto, actions }: AlbumProps) {
  const [opened, setOpened] = useState<number | undefined>(initialPhoto);

  return (
    <View style={styles.screen}>
      <View
        style={styles.screen}
        accessibilityElementsHidden={opened !== undefined}
        importantForAccessibility={opened === undefined ? "auto" : "no-hide-descendants"}
      >
        <Text accessibilityRole="header" style={styles.title}>ライブラリ</Text>
        {referencePhoto !== undefined && (
          <View style={styles.reference}>
            <Image source={photos[referencePhoto]} accessibilityLabel={photoLabel(referencePhoto)} style={styles.referencePhoto} />
            <Text style={styles.counter}>さがす 写真</Text>
          </View>
        )}
        <ScrollView contentContainerStyle={styles.grid}>
          {photos.map((photo, index) => (
            <Pressable key={photo} accessibilityRole="button" accessibilityLabel={photoLabel(index)} style={styles.tile} onPress={() => setOpened(index)}>
              <Image source={photo} style={styles.image} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {opened !== undefined && (
        <PhotoViewer initialPhoto={opened} zoomPhoto={zoomPhoto} actions={actions} onBack={() => setOpened(undefined)} />
      )}
    </View>
  );
}

export function AlbumAction({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={styles.action} onPress={onPress}>
      <Text style={styles.actionText}>{title}</Text>
    </Pressable>
  );
}

function thumbnailOffset(index: number, width: number) {
  return Math.max(0, Math.min(
    photos.length * (thumbnailSize + thumbnailGap) - width,
    (index + 0.5) * (thumbnailSize + thumbnailGap) - width / 2,
  ));
}

function photoLabel(index: number) {
  if (index === dogPhotoIndex) return "黒い 犬の 写真";
  if (index === riverPhotoIndex) return "森の 川の 写真";
  if (index === snowPhotoIndex) return "雪山の 写真";
  return `写真 ${index + 1}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignSelf: "stretch", backgroundColor: colors.white },
  viewer: { ...StyleSheet.absoluteFill, backgroundColor: colors.white },
  title: { paddingHorizontal: 12, paddingVertical: 8, fontSize: fontSize.large, fontWeight: "bold", color: colors.text },
  reference: { paddingHorizontal: 12, paddingBottom: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  referencePhoto: { width: 60, height: 44, borderRadius: 4 },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 12 },
  back: { minHeight: minTouchSize, paddingHorizontal: 8, flexDirection: "row", alignItems: "center" },
  viewerTitle: { fontSize: fontSize.body, fontWeight: "bold", color: colors.text },
  counter: { fontSize: fontSize.small, color: colors.textSub },
  stage: { flex: 1, backgroundColor: colors.text },
  page: { height: "100%", overflow: "hidden" },
  zoomArea: { flex: 1, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  strip: { height: thumbnailSize + 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  thumbnails: { gap: thumbnailGap, paddingHorizontal: 2, alignItems: "center" },
  thumbnail: { width: thumbnailSize, height: thumbnailSize, borderWidth: 3, borderColor: colors.white, borderRadius: 5, overflow: "hidden" },
  selected: { borderColor: colors.blue },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 4, padding: 4 },
  tile: { width: "32.5%", minHeight: minTouchSize, aspectRatio: 1, overflow: "hidden", backgroundColor: colors.background },
  action: { minHeight: minTouchSize, flexShrink: 1, paddingHorizontal: 12, justifyContent: "center", alignItems: "center" },
  actionText: { fontSize: fontSize.body, color: colors.blue, fontWeight: "bold" },
});
