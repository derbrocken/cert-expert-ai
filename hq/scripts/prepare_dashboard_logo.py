#!/usr/bin/env python3
"""Erzeugt cert-expert-logo.png (zugeschnitten, transparent) für das HQ-Dashboard.

Master-Logo: hq/08_Vorlagen/Brand/cert-expert-logo-lockup-horizontal.png
→ Kopie nach html/assets/cert-expert-logo-source.png, dann dieses Skript.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

HQ = Path(__file__).resolve().parents[1]
BRAND_MASTER = HQ / "08_Vorlagen" / "Brand" / "cert-expert-logo-lockup-horizontal.png"
HTML_ASSETS = HQ / "00_Dashboard" / "html" / "assets"
SOURCE = HTML_ASSETS / "cert-expert-logo-source.png"
OUT = HTML_ASSETS / "cert-expert-logo.png"


def is_background(r: int, g: int, b: int) -> bool:
    return r <= 18 and g <= 18 and b <= 18


def main() -> None:
    if not SOURCE.is_file() and BRAND_MASTER.is_file():
        import shutil

        shutil.copy2(BRAND_MASTER, SOURCE)
        print(f"Kopiert Master → {SOURCE}")
    if not SOURCE.is_file():
        raise SystemExit(f"Quelle fehlt: {SOURCE} (oder {BRAND_MASTER})")
    img = Image.open(SOURCE).convert("RGBA")
    px = img.load()
    w, h = img.size

    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if not is_background(r, g, b):
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)

    pad = 12
    img = img.crop(
        (
            max(0, minx - pad),
            max(0, miny - pad),
            min(w, maxx + pad + 1),
            min(h, maxy + pad + 1),
        )
    )
    px = img.load()
    w, h = img.size

    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not seen[y][x] and is_background(*px[x, y][:3]):
            seen[y][x] = True
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and is_background(*px[nx, ny][:3]):
                seen[ny][nx] = True
                q.append((nx, ny))

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if r > 130 and g < 100 and b < 100:
                px[x, y] = (227, 6, 19, 255)
            elif max(r, g, b) < 100:
                px[x, y] = (35, 35, 38, 255)

    img.save(OUT, optimize=True)
    print(f"OK → {OUT} ({w}×{h})")


if __name__ == "__main__":
    main()
