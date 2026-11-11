"""パズル素材 (assets/images/puzzles) から、アプリで使う軽い画像を作る。

- 台座: 720px の JPEG
- ピース: 完成図をマスク (SVG の path) で切り抜いた透過 PNG。ピースの範囲だけに切り詰める
- 各ピースの位置 (台座に対する割合) を src/data/puzzle-pieces.generated.ts に書き出す

使い方 (Pillow が必要):  python3 scripts/make-puzzle-pieces.py
"""
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/images/puzzles"
OUT = SRC / "app"
CANVAS = 1254  # 素材の座標の大きさ
SIZE = 720  # アプリで使う大きさ
SUPER = 2  # マスクの縁をなめらかにするため、いったん大きく描く


def bezier(p0, p1, p2, p3, steps=24):
    pts = []
    for i in range(1, steps + 1):
        t = i / steps
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def path_points(d):
    tokens = re.findall(r"[MCZ]|-?\d+(?:\.\d+)?", d)
    pts, i, cur = [], 0, None
    while i < len(tokens):
        t = tokens[i]
        if t == "M":
            cur = (float(tokens[i + 1]), float(tokens[i + 2]))
            pts.append(cur)
            i += 3
        elif t == "C":
            i += 1
            while i < len(tokens) and tokens[i] not in "MCZ":
                c = [float(v) for v in tokens[i : i + 6]]
                p1, p2, p3 = (c[0], c[1]), (c[2], c[3]), (c[4], c[5])
                pts += bezier(cur, p1, p2, p3)
                cur = p3
                i += 6
        else:
            i += 1
    return pts


def make_course(course):
    OUT.mkdir(parents=True, exist_ok=True)
    complete = Image.open(SRC / f"{course}-complete.png").convert("RGBA")
    board = Image.open(SRC / f"{course}-empty-preview.png").convert("RGB")
    board.resize((SIZE, SIZE), Image.LANCZOS).save(OUT / f"{course}-board.jpg", quality=82)

    pieces = {}
    for svg in sorted((SRC / f"{course}-masks").glob("*.svg")):
        d = re.search(r'd="([^"]+)"', svg.read_text()).group(1)
        big = CANVAS * SUPER
        mask = Image.new("L", (big, big), 0)
        ImageDraw.Draw(mask).polygon([(x * SUPER, y * SUPER) for x, y in path_points(d)], fill=255)
        mask = mask.resize((CANVAS, CANVAS), Image.LANCZOS)
        piece = complete.copy()
        piece.putalpha(mask)
        box = mask.getbbox()
        piece = piece.crop(box)
        scale = SIZE / CANVAS
        w, h = round(piece.width * scale), round(piece.height * scale)
        piece.resize((w, h), Image.LANCZOS).save(OUT / f"{course}-{svg.stem}.png", optimize=True)
        left, top, right, bottom = box
        pieces[svg.stem] = {
            "left": round(left / CANVAS, 4),
            "top": round(top / CANVAS, 4),
            "width": round((right - left) / CANVAS, 4),
            "height": round((bottom - top) / CANVAS, 4),
        }
    return pieces


layout = {course: make_course(course) for course in ["basic", "practice"]}

lines = [
    "// scripts/make-puzzle-pieces.py で自動生成。手で書き換えない。",
    "// 各ピースの位置と大きさ (台座の幅・高さに対する割合)",
    "",
    "export const pieceLayout = " + json.dumps(layout, indent=2, ensure_ascii=False) + " as const;",
    "",
]
(ROOT / "src/data/puzzle-pieces.generated.ts").write_text("\n".join(lines))
print("done")
