#!/usr/bin/env python3
"""Recolor Eldertree logo icon for eldertree-docs (VitePress indigo / periwinkle)."""

from __future__ import annotations

import colorsys
import sys
from collections import deque
from pathlib import Path

from PIL import Image

# VitePress default dark brand (indigo) — matches docs.eldertree.local
BRAND_DARK = (62, 99, 221)  # #3e63dd — vp-c-indigo-3 dark
BRAND_MID = (92, 115, 231)  # #5c73e7 — vp-c-indigo-2 dark
BRAND_LIGHT = (168, 177, 255)  # #a8b1ff — vp-c-indigo-1 dark
BRAND_HIGHLIGHT = (199, 210, 254)  # #c7d2fe — highlights on charcoal bg


def lerp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    t = max(0.0, min(1.0, t))
    return (
        int(a[0] + (b[0] - a[0]) * t),
        int(a[1] + (b[1] - a[1]) * t),
        int(a[2] + (b[2] - a[2]) * t),
    )


def brand_rgb(value: float, saturation: float) -> tuple[int, int, int]:
    v = max(0.0, min(1.0, value))
    if v < 0.30:
        base = lerp(BRAND_DARK, BRAND_MID, v / 0.30)
    elif v < 0.55:
        base = lerp(BRAND_MID, BRAND_LIGHT, (v - 0.30) / 0.25)
    else:
        base = lerp(BRAND_LIGHT, BRAND_HIGHLIGHT, (v - 0.55) / 0.45)
    if saturation < 0.25:
        return lerp(base, BRAND_MID, 0.4)
    return base


def is_green_family(h: float, s: float, v: float) -> bool:
    if s < 0.05 or v < 0.04:
        return False
    return 0.10 <= h <= 0.62


def is_background_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 12:
        return True
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    if v >= 0.78 and s <= 0.20:
        return True
    if min(r, g, b) >= 200 and s <= 0.14:
        return True
    return False


def recolor_pixel(r: int, g: int, b: int, a: int) -> tuple[int, int, int, int]:
    if a < 8:
        return r, g, b, 0
    if is_background_pixel(r, g, b, a):
        return 0, 0, 0, 0

    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    if not is_green_family(h, s, v):
        if v > 0.72 and s < 0.22:
            return 0, 0, 0, 0
        return r, g, b, a

    tr, tg, tb = brand_rgb(v, s)
    blend = 0.9
    nr = int(r * (1 - blend) + tr * blend)
    ng = int(g * (1 - blend) + tg * blend)
    nb = int(b * (1 - blend) + tb * blend)
    return nr, ng, nb, a


def flood_clear_background(im: Image.Image) -> None:
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h:
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        idx = y * w + x
        if seen[idx]:
            continue
        seen[idx] = 1
        r, g, b, a = px[x, y]
        if not is_background_pixel(r, g, b, a):
            continue
        px[x, y] = (0, 0, 0, 0)
        push(x - 1, y)
        push(x + 1, y)
        push(x, y - 1)
        push(x, y + 1)


def clean_light_fringe(im: Image.Image) -> None:
    w, h = im.size
    px = im.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            hv, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if v > 0.68 and s < 0.28:
                greenness = max(0.0, min(1.0, (g - max(r, b)) / 80.0))
                if greenness < 0.08:
                    px[x, y] = (0, 0, 0, 0)
                    continue
                tr, tg, tb = brand_rgb(0.55, 0.35)
                alpha = int(a * greenness * 0.85)
                px[x, y] = (tr, tg, tb, max(0, min(255, alpha)))


def icon_crop(full: Image.Image, output_px: int = 512) -> Image.Image:
    """Circuit-tree mark only — crop above the eldertree wordmark."""
    w, h = full.size
    mark = full.crop((int(w * 0.10), int(h * 0.02), int(w * 0.90), int(h * 0.68)))
    bbox = mark.getbbox()
    if bbox:
        pad = max(4, int(min(bbox[2] - bbox[0], bbox[3] - bbox[1]) * 0.04))
        x0, y0, x1, y1 = bbox
        mark = mark.crop(
            (max(0, x0 - pad), max(0, y0 - pad), min(mark.size[0], x1 + pad), min(mark.size[1], y1 + pad))
        )
    side = max(mark.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - mark.size[0]) // 2
    oy = (side - mark.size[1]) // 2
    canvas.paste(mark, (ox, oy), mark)
    if side != output_px:
        canvas = canvas.resize((output_px, output_px), Image.Resampling.LANCZOS)
    return canvas


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "assets/logo-source.png"
    if not src.exists():
        print(f"source not found: {src}", file=sys.stderr)
        sys.exit(1)

    im = Image.open(src).convert("RGBA")
    px = im.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            px[x, y] = recolor_pixel(*px[x, y])
    flood_clear_background(im)
    clean_light_fringe(im)

    icon = icon_crop(im)
    out = root / "public" / "logo.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    icon.save(out, optimize=True, compress_level=6)
    print(f"wrote {out} ({icon.size[0]}x{icon.size[1]})")


if __name__ == "__main__":
    main()
