// scripts/make-puzzle-pieces.py で自動生成。手で書き換えない。
// 各ピースの位置と大きさ (台座の幅・高さに対する割合)

export const pieceLayout = {
  "basic": {
    "dried-fish": {
      "left": 0.626,
      "top": 0.4091,
      "width": 0.3397,
      "height": 0.5295
    },
    "hijiki": {
      "left": 0.2695,
      "top": 0.3884,
      "width": 0.4402,
      "height": 0.563
    },
    "salt-soft-serve": {
      "left": 0.4665,
      "top": 0.0335,
      "width": 0.4904,
      "height": 0.512
    },
    "sweets": {
      "left": 0.0327,
      "top": 0.4219,
      "width": 0.3628,
      "height": 0.5191
    },
    "wagyu": {
      "left": 0.0295,
      "top": 0.0343,
      "width": 0.5885,
      "height": 0.508
    }
  },
  "practice": {
    "cedars": {
      "left": 0.3325,
      "top": 0.5997,
      "width": 0.3445,
      "height": 0.3533
    },
    "historic-building": {
      "left": 0.6116,
      "top": 0.6164,
      "width": 0.3517,
      "height": 0.3285
    },
    "isaribi-railway": {
      "left": 0.5925,
      "top": 0.3469,
      "width": 0.3708,
      "height": 0.3174
    },
    "kanrin-maru": {
      "left": 0.5064,
      "top": 0.0311,
      "width": 0.4569,
      "height": 0.3676
    },
    "misogi": {
      "left": 0.0303,
      "top": 0.0303,
      "width": 0.5375,
      "height": 0.3724
    },
    "roadside-station": {
      "left": 0.0263,
      "top": 0.6108,
      "width": 0.4003,
      "height": 0.3397
    },
    "shinkansen": {
      "left": 0.2911,
      "top": 0.3397,
      "width": 0.3604,
      "height": 0.3285
    },
    "tulips": {
      "left": 0.0319,
      "top": 0.3405,
      "width": 0.3142,
      "height": 0.3445
    }
  }
} as const;
