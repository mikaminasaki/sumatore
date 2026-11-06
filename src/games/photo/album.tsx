import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureDetector, usePanGesture, usePinchGesture, useSimultaneousGestures } from "react-native-gesture-handler";

import { colors, fontSize, minTouchSize } from "@/constants/theme";

import { dogPhotoIndex, photos, riverPhotoIndex, snowPhotoIndex } from "./photos";

const thumbnailSize = minTouchSize;
const thumbnailGap = 4;

type AlbumProps = {
  initialPhoto?: number;
  referencePhoto?: number;
  allowZoom?: boolean;
  actions: (index: number, zoomed: boolean, selection: { isFavorite: boolean; fromFavorites: boolean }) => ReactNode;
};

type PhotoTransform = { scale: number; x: number; y: number };
const originalTransform: PhotoTransform = { scale: 1, x: 0, y: 0 };
const favoritesKey = "photo-practice/favorites-v1";

function ZoomPhoto({ index, onZoom }: { index: number; onZoom: (scale: number) => void }) {
  const [transform, setTransform] = useState(originalTransform);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const current = useRef(originalTransform);
  const pinchStart = useRef(originalTransform);
  const panStart = useRef(originalTransform);

  function update(next: PhotoTransform) {
    const source = Image.resolveAssetSource(photos[index]);
    if (!source?.width || !source.height) return;
    const fit = Math.min(size.width / source.width, size.height / source.height);
    const maxX = Math.max(0, (source.width * fit * next.scale - size.width) / 2);
    const maxY = Math.max(0, (source.height * fit * next.scale - size.height) / 2);
    const clamped = {
      scale: next.scale,
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
    current.current = clamped;
    setTransform(clamped);
  }

  const pinch = usePinchGesture({
    runOnJS: true,
    onActivate: () => { pinchStart.current = current.current; },
    onUpdate: ({ scale }) => {
      const start = pinchStart.current;
      const next = Math.max(1, Math.min(4, start.scale * scale));
      const ratio = next / start.scale;
      update({ scale: next, x: start.x * ratio, y: start.y * ratio });
    },
    onDeactivate: ({ canceled }) => {
      if (canceled) update(pinchStart.current);
      onZoom(current.current.scale);
    },
  });
  const pan = usePanGesture({
    runOnJS: true,
    enabled: transform.scale > 1.01,
    maxPointers: 1,
    minDistance: 4,
    onActivate: () => { panStart.current = current.current; },
    onUpdate: ({ translationX, translationY }) => {
      const start = panStart.current;
      update({ scale: current.current.scale, x: start.x + translationX, y: start.y + translationY });
    },
  });
  const gesture = useSimultaneousGestures(pinch, pan);

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.zoomArea} onLayout={({ nativeEvent: { layout } }) => setSize({ width: layout.width, height: layout.height })}>
        <Image
          source={photos[index]}
          style={[styles.image, { transform: [{ translateX: transform.x }, { translateY: transform.y }, { scale: transform.scale }] }]}
          resizeMode="contain"
        />
      </View>
    </GestureDetector>
  );
}

function PhotoViewer({ initialPhoto, allowZoom, actions, onBack, favorites, onToggleFavorite, fromFavorites }: Omit<AlbumProps, "referencePhoto" | "initialPhoto"> & { initialPhoto: number; onBack: () => void; favorites: number[]; onToggleFavorite: (index: number) => void; fromFavorites: boolean }) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(initialPhoto);
  const [scale, setScale] = useState(1);
  const pager = useRef<FlatList<number>>(null);
  const thumbnails = useRef<ComponentRef<typeof ScrollView>>(null);

  function selectPhoto(next: number) {
    if (next === index) return;
    setIndex(next);
    setScale(1);
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorites.includes(index) ? "お気に入りから はずす" : "お気に入りに 入れる"}
          accessibilityState={{ selected: favorites.includes(index) }}
          onPress={() => onToggleFavorite(index)}
          style={styles.favoriteButton}
        >
          <Ionicons name={favorites.includes(index) ? "heart" : "heart-outline"} size={28} color={favorites.includes(index) ? colors.homeRed : colors.blue} />
        </Pressable>
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
            scrollEnabled={scale <= 1.01}
            onMomentumScrollEnd={(event) => {
              const next = Math.round(event.nativeEvent.contentOffset.x / width);
              selectPhoto(Math.max(0, Math.min(photos.length - 1, next)));
            }}
            renderItem={({ item, index: itemIndex }) => (
              <View style={[styles.page, { width }]}>
                {allowZoom && itemIndex === index ? (
                  <ZoomPhoto index={itemIndex} onZoom={setScale} />
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
      {actions(index, scale >= 1.6, { isFavorite: favorites.includes(index), fromFavorites })}
    </View>
  );
}

export function PhotoAlbum({ initialPhoto, referencePhoto, allowZoom, actions }: AlbumProps) {
  const [opened, setOpened] = useState<number | undefined>(initialPhoto);

  const [favorites, setFavorites] = useState<number[]>([]);
  const favoritesRef = useRef<number[]>([]);
  const loaded = useRef(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(favoritesKey).then((value) => {
      if (!active) return;
      const saved: unknown = value ? JSON.parse(value) : [];
      if (Array.isArray(saved)) {
        favoritesRef.current = saved.filter((item): item is number => Number.isInteger(item) && item >= 0 && item < photos.length);
        setFavorites(favoritesRef.current);
      }
    }).catch(() => {}).finally(() => {
      if (active) loaded.current = true;
    });
    return () => { active = false; };
  }, []);

  function toggleFavorite(index: number) {
    if (!loaded.current) return;
    const previous = favoritesRef.current;
    const next = previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index];
    favoritesRef.current = next;
    setFavorites(next);
    void AsyncStorage.setItem(favoritesKey, JSON.stringify(next)).catch(() => {});
  }

  return (
    <View style={styles.screen}>
      <View
        style={styles.screen}
        accessibilityElementsHidden={opened !== undefined}
        importantForAccessibility={opened === undefined ? "auto" : "no-hide-descendants"}
      >
        <View style={styles.libraryBar}>
          <Text accessibilityRole="header" style={styles.title}>{onlyFavorites ? "お気に入り" : "ライブラリ"}</Text>
          <Pressable accessibilityRole="button" onPress={() => setOnlyFavorites(!onlyFavorites)} style={styles.favoriteButton}>
            <Text style={styles.filterText}>{onlyFavorites ? "すべての 写真" : "お気に入り"}</Text>
          </Pressable>
        </View>
        {referencePhoto !== undefined && (
          <View style={styles.reference}>
            <Image source={photos[referencePhoto]} accessibilityLabel={photoLabel(referencePhoto)} style={styles.referencePhoto} />
            <Text style={styles.counter}>さがす 写真</Text>
          </View>
        )}
        <ScrollView contentContainerStyle={styles.grid}>
          {onlyFavorites && favorites.length === 0 && <AlbumPrompt>お気に入りの 写真は まだ ありません</AlbumPrompt>}
          {photos.map((photo, index) => (!onlyFavorites || favorites.includes(index)) && (
            <Pressable key={photo} accessibilityRole="button" accessibilityLabel={photoLabel(index)} style={styles.tile} onPress={() => setOpened(index)}>
              <Image source={photo} style={styles.image} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {opened !== undefined && (
        <PhotoViewer initialPhoto={opened} allowZoom={allowZoom} actions={actions} favorites={favorites} fromFavorites={onlyFavorites} onToggleFavorite={toggleFavorite} onBack={() => setOpened(undefined)} />
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

export function AlbumPrompt({ children }: { children: string }) {
  return <Text accessibilityLiveRegion="polite" style={styles.prompt}>{children}</Text>;
}

export function ConfirmPhoto({ correct, onCorrect }: { correct: boolean; onCorrect: () => void }) {
  const [tryAgain, setTryAgain] = useState(false);

  return (
    <View>
      <AlbumPrompt>{tryAgain ? "もういちど 写真を さがしてみましょう" : "見せたい 写真を えらびましょう"}</AlbumPrompt>
      <AlbumAction title="この 写真を 見せる" onPress={correct ? onCorrect : () => setTryAgain(true)} />
    </View>
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
  libraryBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 10 },
  favoriteButton: { minHeight: 48, minWidth: 48, paddingHorizontal: 8, alignItems: "center", justifyContent: "center" },
  filterText: { color: colors.blue, fontSize: fontSize.small, fontWeight: "bold" },
  title: { paddingHorizontal: 12, paddingVertical: 8, fontSize: fontSize.large, fontWeight: "bold", color: colors.text },
  reference: { paddingHorizontal: 12, paddingBottom: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  referencePhoto: { width: 60, height: 44, borderRadius: 4 },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 12 },
  back: { minHeight: 48, paddingHorizontal: 8, flexDirection: "row", alignItems: "center" },
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
  prompt: { minHeight: 34, paddingHorizontal: 8, paddingTop: 6, textAlign: "center", fontSize: fontSize.small, color: colors.text },
  action: { minHeight: minTouchSize, flexShrink: 1, paddingHorizontal: 12, justifyContent: "center", alignItems: "center" },
  actionText: { fontSize: fontSize.body, color: colors.blue, fontWeight: "bold" },
});
