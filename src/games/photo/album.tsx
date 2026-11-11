import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureDetector, usePanGesture, usePinchGesture, useSimultaneousGestures } from "react-native-gesture-handler";

import { accents, colors, fontSize, minTouchSize } from "@/constants/theme";

import { blanketDogPhotoIndex, dogPhotoIndex, photos, riverPhotoIndex, snowPhotoIndex } from "./photos";

const thumbnailSize = minTouchSize;
const thumbnailGap = 4;
const allPhotoIndices = photos.map((_, index) => index);

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

function PhotoViewer({ initialPhoto, allowZoom, actions, onBack, favorites, onToggleFavorite, fromFavorites, photoIndices, favoritesLoaded }: Omit<AlbumProps, "referencePhoto" | "initialPhoto"> & {
  initialPhoto: number;
  onBack: () => void;
  favorites: number[];
  onToggleFavorite: (index: number) => void;
  fromFavorites: boolean;
  photoIndices: number[];
  favoritesLoaded: boolean;
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [index, setIndex] = useState(initialPhoto);
  const [scale, setScale] = useState(1);
  const pager = useRef<FlatList<number>>(null);
  const thumbnails = useRef<ComponentRef<typeof ScrollView>>(null);

  function selectPhoto(next: number) {
    if (next === index) return;
    setIndex(next);
    setScale(1);
    thumbnails.current?.scrollTo({ x: thumbnailOffset(photoIndices.indexOf(next), photoIndices.length, width), animated: true });
  }

  return (
    <View style={styles.viewer} accessibilityViewIsModal>
      <View style={styles.toolbar}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={accents.practice.dark} />
          <Text style={styles.actionText}>一覧へ</Text>
        </Pressable>
        <Text accessibilityRole="header" style={styles.viewerTitle}>{fromFavorites ? "お気に入り" : "すべての写真"}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorites.includes(index) ? "お気に入りから はずす" : "お気に入りに 入れる"}
          accessibilityState={{ selected: favorites.includes(index), disabled: !favoritesLoaded }}
          disabled={!favoritesLoaded}
          onPress={() => onToggleFavorite(index)}
          style={styles.favoriteButton}
        >
          <Ionicons name={favorites.includes(index) ? "heart" : "heart-outline"} size={28} color={favorites.includes(index) ? colors.homeRed : accents.practice.dark} />
        </Pressable>
      </View>

      <View style={styles.stage} onLayout={({ nativeEvent: { layout } }) => {
        setWidth(layout.width);
        setHeight(layout.height);
      }}>
        {width > 0 && height > 0 && (
          <FlatList
            key={width}
            ref={pager}
            data={photoIndices}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={photoIndices.indexOf(index)}
            getItemLayout={(_, itemIndex) => ({ length: width, offset: width * itemIndex, index: itemIndex })}
            keyExtractor={(photoIndex) => String(photoIndex)}
            scrollEnabled={scale <= 1.01}
            onMomentumScrollEnd={(event) => {
              const next = Math.round(event.nativeEvent.contentOffset.x / width);
              selectPhoto(photoIndices[Math.max(0, Math.min(photoIndices.length - 1, next))]);
            }}
            renderItem={({ item: photoIndex }) => (
              <View style={[styles.page, { width, height }]}>
                {allowZoom && photoIndex === index ? (
                  <ZoomPhoto index={photoIndex} onZoom={setScale} />
                ) : (
                  <Image source={photos[photoIndex]} style={styles.image} resizeMode="contain" />
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
            onContentSizeChange={() => thumbnails.current?.scrollTo({
              x: thumbnailOffset(photoIndices.indexOf(index), photoIndices.length, width),
              animated: false,
            })}
            contentContainerStyle={styles.thumbnails}
            showsHorizontalScrollIndicator={false}
          >
            {photoIndices.map((photoIndex, position) => (
              <Pressable
                key={photoIndex}
                accessibilityRole="button"
                accessibilityLabel={photoLabel(photoIndex)}
                accessibilityState={{ selected: index === photoIndex }}
                style={[styles.thumbnail, index === photoIndex && styles.selected]}
                onPress={() => {
                  pager.current?.scrollToIndex({ index: position, animated: false });
                  selectPhoto(photoIndex);
                }}
              >
                <Image source={photos[photoIndex]} style={styles.image} />
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
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const photoIndices = onlyFavorites ? allPhotoIndices.filter((index) => favorites.includes(index)) : allPhotoIndices;

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
      if (active) setFavoritesLoaded(true);
    });
    return () => { active = false; };
  }, []);

  function toggleFavorite(index: number) {
    if (!favoritesLoaded) return;
    const previous = favoritesRef.current;
    const next = previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index];
    // お気に入り内で解除したら、隣の写真へ。最後の1枚なら一覧へ戻る。
    if (onlyFavorites && previous.includes(index)) {
      const position = photoIndices.indexOf(index);
      setOpened(photoIndices[position + 1] ?? photoIndices[position - 1]);
    }
    favoritesRef.current = next;
    setFavorites(next);
    void AsyncStorage.setItem(favoritesKey, JSON.stringify(next)).catch(() => {});
  }

  return (
    <View style={styles.screen}>
      <View
        style={styles.screen}
        aria-hidden={opened !== undefined}
        accessibilityElementsHidden={opened !== undefined}
        importantForAccessibility={opened === undefined ? "auto" : "no-hide-descendants"}
      >
        <View style={styles.libraryBar}>
          <Text accessibilityRole="header" style={styles.title}>ライブラリ</Text>
        </View>
        <View accessibilityRole="tablist" style={styles.filters}>
          {[false, true].map((favoriteTab) => (
            <Pressable
              key={String(favoriteTab)}
              accessibilityRole="tab"
              aria-selected={onlyFavorites === favoriteTab}
              accessibilityState={{ selected: onlyFavorites === favoriteTab }}
              onPress={() => setOnlyFavorites(favoriteTab)}
              style={[styles.filter, onlyFavorites === favoriteTab && styles.activeFilter]}
            >
              <Text style={[styles.filterText, onlyFavorites === favoriteTab && styles.activeFilterText]}>{favoriteTab ? "お気に入り" : "すべての写真"}</Text>
            </Pressable>
          ))}
        </View>
        {referencePhoto !== undefined && (
          <View style={styles.reference}>
            <Image source={photos[referencePhoto]} accessibilityLabel={photoLabel(referencePhoto)} style={styles.referencePhoto} />
            <View style={styles.referenceText}>
              <Text style={styles.referenceTitle}>この写真を さがしましょう</Text>
              <Text style={styles.counter}>{photoLabel(referencePhoto)}</Text>
            </View>
          </View>
        )}
        <ScrollView contentContainerStyle={styles.grid}>
          {onlyFavorites && favoritesLoaded && favorites.length === 0 && <AlbumPrompt>お気に入りは まだ ありません。「すべての写真」で写真を開き、ハートを押すと登録できます。</AlbumPrompt>}
          {photoIndices.map((index) => (
            <Pressable key={index} accessibilityRole="button" accessibilityLabel={photoLabel(index)} style={styles.tile} onPress={() => setOpened(index)}>
              <Image source={photos[index]} style={styles.image} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {opened !== undefined && (
        <PhotoViewer
          key={`${onlyFavorites}:${photoIndices.join(",")}`}
          initialPhoto={opened}
          allowZoom={allowZoom}
          actions={actions}
          favorites={favorites}
          favoritesLoaded={favoritesLoaded}
          photoIndices={photoIndices}
          fromFavorites={onlyFavorites}
          onToggleFavorite={toggleFavorite}
          onBack={() => setOpened(undefined)}
        />
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

function thumbnailOffset(index: number, count: number, width: number) {
  return Math.max(0, Math.min(
    count * (thumbnailSize + thumbnailGap) - width,
    (index + 0.5) * (thumbnailSize + thumbnailGap) - width / 2,
  ));
}

function photoLabel(index: number) {
  if (index === blanketDogPhotoIndex) return "毛布を かぶった 犬の 写真";
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
  filters: { flexDirection: "row", marginHorizontal: 10, marginBottom: 10, padding: 4, gap: 4, borderRadius: 14, backgroundColor: colors.background },
  filter: { flex: 1, minHeight: minTouchSize, alignItems: "center", justifyContent: "center", paddingHorizontal: 6, borderRadius: 10, borderWidth: 2, borderColor: colors.border },
  activeFilter: { backgroundColor: accents.practice.main, borderColor: accents.practice.main },
  filterText: { color: accents.practice.dark, fontSize: fontSize.body, fontWeight: "bold", textAlign: "center" },
  activeFilterText: { color: colors.white },
  title: { paddingHorizontal: 12, paddingVertical: 8, fontSize: fontSize.large, fontWeight: "bold", color: colors.text },
  reference: { marginHorizontal: 10, marginBottom: 10, padding: 10, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 2, borderColor: accents.practice.main, borderRadius: 12, backgroundColor: accents.practice.pale },
  referencePhoto: { width: 112, height: 84, borderRadius: 6 },
  referenceText: { flex: 1, gap: 6 },
  referenceTitle: { color: accents.practice.dark, fontSize: fontSize.body, fontWeight: "bold" },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 12 },
  back: { minHeight: 48, paddingHorizontal: 8, flexDirection: "row", alignItems: "center" },
  viewerTitle: { flex: 1, textAlign: "center", fontSize: fontSize.body, fontWeight: "bold", color: colors.text },
  counter: { fontSize: fontSize.small, color: colors.textSub },
  stage: { flex: 1, backgroundColor: colors.text },
  page: { overflow: "hidden" },
  zoomArea: { flex: 1, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  strip: { height: thumbnailSize + 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  thumbnails: { gap: thumbnailGap, paddingHorizontal: 2, alignItems: "center" },
  thumbnail: { width: thumbnailSize, height: thumbnailSize, borderWidth: 3, borderColor: colors.white, borderRadius: 5, overflow: "hidden" },
  selected: { borderColor: accents.practice.main },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 4, padding: 4 },
  tile: { width: "32.5%", minHeight: minTouchSize, aspectRatio: 1, overflow: "hidden", backgroundColor: colors.background },
  prompt: { minHeight: 34, paddingHorizontal: 8, paddingTop: 6, textAlign: "center", fontSize: fontSize.body, color: colors.text },
  action: { minHeight: minTouchSize, flexShrink: 1, paddingHorizontal: 12, justifyContent: "center", alignItems: "center" },
  actionText: { fontSize: fontSize.body, color: accents.practice.dark, fontWeight: "bold" },
});
