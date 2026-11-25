export const photos = [
  require("../../../assets/images/photo-practice/10.jpg"),
  require("../../../assets/images/photo-practice/11.jpg"),
  require("../../../assets/images/photo-practice/12.jpg"),
  require("../../../assets/images/photo-practice/13.jpg"),
  require("../../../assets/images/photo-practice/15.jpg"),
  require("../../../assets/images/photo-practice/16.jpg"),
  require("../../../assets/images/photo-practice/17.jpg"),
  require("../../../assets/images/photo-practice/18.jpg"),
  require("../../../assets/images/photo-practice/19.jpg"),
  require("../../../assets/images/photo-practice/28.jpg"),
  require("../../../assets/images/photo-practice/237.jpg"),
  require("../../../assets/images/photo-practice/29.jpg"),
  require("../../../assets/images/photo-practice/30.jpg"),
  require("../../../assets/images/photo-practice/31.jpg"),
  require("../../../assets/images/photo-practice/32.jpg"),
  require("../../../assets/images/photo-practice/33.jpg"),
  require("../../../assets/images/photo-practice/34.jpg"),
  require("../../../assets/images/photo-practice/35.jpg"),
  require("../../../assets/images/photo-practice/36.jpg"),
  require("../../../assets/images/photo-practice/37.jpg"),
  require("../../../assets/images/photo-practice/38.jpg"),
  require("../../../assets/images/photo-practice/39.jpg"),
  require("../../../assets/images/photo-practice/1025.jpg"),
  require("../../../assets/images/photo-practice/40.jpg"),
  require("../../../assets/images/photo-practice/20.jpg"),
  require("../../../assets/images/photo-practice/1080.jpg"),
  require("../../../assets/images/photo-practice/292.jpg"),
  require("../../../assets/images/photo-practice/1084.jpg"),
];

export const dogPhotoIndex = 10;

export const riverPhotoIndex = 9;
export const snowPhotoIndex = 11;
export const meadowPhotoIndex = 7;
export const beachPhotoIndex = 2;

export const blanketDogPhotoIndex = 22;

// 保存済みのお気に入りは元の配列番号を使うため、photosの番号は変えない。
// 似た海岸・森・草むらや、別の犬の写真を除き、被写体が異なる18枚を出す。
export const albumPhotoIndices = [2, 24, 9, 11, 12, 25, 13, 14, 26, 16, 17, 18, 20, 21, 27, 6, 22, 23];

// 一覧と下の小さな写真には、256×192の専用画像を使う。
export const photoThumbnails: Record<number, number> = {
  2: require("../../../assets/images/photo-practice/thumbnails/12.jpg"),
  6: require("../../../assets/images/photo-practice/thumbnails/17.jpg"),
  9: require("../../../assets/images/photo-practice/thumbnails/28.jpg"),
  11: require("../../../assets/images/photo-practice/thumbnails/29.jpg"),
  12: require("../../../assets/images/photo-practice/thumbnails/30.jpg"),
  13: require("../../../assets/images/photo-practice/thumbnails/31.jpg"),
  14: require("../../../assets/images/photo-practice/thumbnails/32.jpg"),
  16: require("../../../assets/images/photo-practice/thumbnails/34.jpg"),
  17: require("../../../assets/images/photo-practice/thumbnails/35.jpg"),
  18: require("../../../assets/images/photo-practice/thumbnails/36.jpg"),
  20: require("../../../assets/images/photo-practice/thumbnails/38.jpg"),
  21: require("../../../assets/images/photo-practice/thumbnails/39.jpg"),
  22: require("../../../assets/images/photo-practice/thumbnails/1025.jpg"),
  23: require("../../../assets/images/photo-practice/thumbnails/40.jpg"),
  24: require("../../../assets/images/photo-practice/thumbnails/20.jpg"),
  25: require("../../../assets/images/photo-practice/thumbnails/1080.jpg"),
  26: require("../../../assets/images/photo-practice/thumbnails/292.jpg"),
  27: require("../../../assets/images/photo-practice/thumbnails/1084.jpg"),
};
