#!/usr/bin/env python3
"""Draw public/og-image.png — the card people actually see when the site is shared.

The link card is the most-read piece of copy on the site: it shows up in
Discord, Slack, iMessage, X and every preview embed, usually to people who
will never scroll the page. So it is generated from the same palette and the
same type as the site rather than being a screenshot, and it is committed so
the crawler has something to fetch on the first request.

It also has to stay inside the COPY RULE in src/config/links.js: no story.

Run:  python scripts/make-og-image.py
Needs: pillow, and network access the first time (it caches the two Google
fonts under .cache/fonts/).
"""

import math
import os
import random
import urllib.request

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, ".cache", "fonts")
OUT = os.path.join(ROOT, "public", "og-image.png")

W, H = 1200, 630

# Straight out of src/style/index.css.
INK_DEEP = (6, 8, 13)
INK = (11, 14, 20)
EMBER = (232, 163, 61)
EMBER_HOT = (247, 206, 132)
VERDIGRIS = (95, 182, 168)
BONE = (237, 230, 216)
BONE_DIM = (156, 150, 137)

FONTS = {
    "cormorant": "https://raw.githubusercontent.com/google/fonts/main/ofl/"
                 "cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "inter": "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/"
             "Inter%5Bopsz%2Cwght%5D.ttf",
}


def font_file(name):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, name + ".ttf")
    if not os.path.exists(path):
        request = urllib.request.Request(FONTS[name], headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=90) as response:
            open(path, "wb").write(response.read())
    return path


def cormorant(size, weight=600):
    face = ImageFont.truetype(font_file("cormorant"), size)
    face.set_variation_by_axes([weight])
    return face


def inter(size, weight=600):
    face = ImageFont.truetype(font_file("inter"), size)
    face.set_variation_by_axes([32, weight])
    return face


def tracked(draw, text, font, y, colour, tracking, centre=W // 2, alpha=255):
    """Pillow has no letter-spacing, so the run is measured and set by hand."""
    widths = [draw.textlength(character, font=font) for character in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = centre - total / 2
    for character, width in zip(text, widths):
        draw.text((x, y), character, font=font, fill=colour + (alpha,))
        x += width + tracking
    return total


def centred(draw, text, font, y, colour, alpha=255):
    width = draw.textlength(text, font=font)
    draw.text((W // 2 - width / 2, y), text, font=font, fill=colour + (alpha,))
    return width


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def add(base, layer):
    """Light added to the scene, never subtracted — the way the page builds up."""
    return ImageChops.add(base, layer)


def build():
    card = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(card)

    # --- Sky. Blue hour: deepest overhead, warming as it nears the horizon. --
    horizon = int(H * 0.72)
    for y in range(H):
        if y < horizon:
            t = (y / horizon) ** 1.35
            colour = lerp(INK_DEEP, (16, 22, 34), t)
        else:
            t = (y - horizon) / (H - horizon)
            colour = lerp((16, 22, 34), (9, 11, 17), t)
        draw.line([(0, y), (W, y)], fill=colour)

    # --- The warmth sitting on the horizon, and a cool cast up top. ----------
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for step in range(46):
        t = step / 46
        rx, ry = 620 * (1 - t) + 120, 200 * (1 - t) + 40
        value = int(52 * (1 - t) ** 1.6)
        gdraw.ellipse(
            [W / 2 - rx, horizon - ry * 0.55, W / 2 + rx, horizon + ry],
            fill=(value, int(value * 0.62), int(value * 0.26)),
        )
    for step in range(30):
        t = step / 30
        rx, ry = 640 * (1 - t) + 120, 300 * (1 - t) + 70
        value = int(9 * (1 - t) ** 1.7)
        gdraw.ellipse(
            [180 - rx, -40 - ry, 180 + rx, -40 + ry],
            fill=(int(value * 0.4), int(value * 0.72), value),
        )
    card = add(card, glow.filter(ImageFilter.GaussianBlur(58)))
    draw = ImageDraw.Draw(card)

    # --- Embers. Warm, uneven, and denser low in the frame. ------------------
    random.seed(1104)
    ember_layer = Image.new("RGB", (W, H), (0, 0, 0))
    edraw = ImageDraw.Draw(ember_layer)
    for _ in range(150):
        x = random.uniform(0, W)
        y = random.uniform(70, H - 20)
        depth = (y / H) ** 1.5
        radius = random.uniform(0.8, 2.6) * (0.5 + depth)
        value = random.uniform(0.18, 0.85) * (0.35 + depth)
        colour = EMBER_HOT if random.random() > 0.65 else EMBER
        edraw.ellipse(
            [x - radius, y - radius, x + radius, y + radius],
            fill=tuple(int(c * value) for c in colour),
        )
    card = add(card, ember_layer.filter(ImageFilter.GaussianBlur(0.7)))
    card = add(card, ember_layer.filter(ImageFilter.GaussianBlur(5)))
    draw = ImageDraw.Draw(card)

    # --- Two ridges. The far one is lighter, which is the whole trick. -------
    def ridge(amplitude, base, period, phase, colour):
        points = [(x, base - amplitude * math.sin(x / period + phase)
                   - amplitude * 0.4 * math.sin(x / (period * 0.37) + phase * 2))
                  for x in range(0, W + 1, 4)]
        draw.polygon(points + [(W, H), (0, H)], fill=colour)
        return points

    ridge(26, horizon + 26, 190, 0.6, (17, 23, 35))
    front = ridge(34, horizon + 96, 260, 2.2, (7, 9, 15))

    # A few windows lit along the near ridge, so something lives down there.
    lights = Image.new("RGB", (W, H), (0, 0, 0))
    ldraw = ImageDraw.Draw(lights)
    random.seed(77)
    for centre_x, count in ((236, 7), (505, 4), (858, 6)):
        for _ in range(count):
            x = centre_x + random.gauss(0, 34)
            index = min(len(front) - 1, max(0, int(x / 4)))
            y = front[index][1] + random.uniform(16, 52)
            size = random.uniform(1.5, 2.8)
            value = random.uniform(0.4, 1.0)
            ldraw.rectangle(
                [x, y, x + size, y + size * 1.5],
                fill=tuple(int(c * value) for c in EMBER_HOT),
            )
    card = add(card, lights)
    card = add(card, lights.filter(ImageFilter.GaussianBlur(4)))

    draw = ImageDraw.Draw(card, "RGBA")

    # --- Type ----------------------------------------------------------------
    kicker_font = inter(17, 600)
    kicker = "EPIC MILLENNIUM"
    kicker_width = tracked(draw, kicker, kicker_font, 150, EMBER, 7.5)
    rule_y = 150 + 9
    for direction in (-1, 1):
        start = W / 2 + direction * (kicker_width / 2 + 24)
        end = start + direction * 46
        draw.line([(start, rule_y), (end, rule_y)], fill=EMBER + (110,), width=1)

    wordmark = cormorant(178, 600)
    centred(draw, "Waybound", wordmark, 196, BONE)

    tracked(draw, "ACTION RPG  ·  ROGUELIKE", inter(15, 600), 404, VERDIGRIS, 5.5)

    tagline = inter(25, 400)
    centred(draw, "One road out of the village, walked with a bow.", tagline, 452, BONE_DIM)

    tracked(draw, "WISHLIST ON STEAM", inter(14, 600), 528, EMBER, 4.5, alpha=225)

    # A hairline under the wishlist line, the same gesture the site uses.
    draw.line([(W / 2 - 46, 556), (W / 2 + 46, 556)], fill=EMBER + (90,), width=1)

    # --- A vignette, so the card sits down rather than glowing at the edges. -
    vignette = Image.new("L", (W, H), 0)
    vdraw = ImageDraw.Draw(vignette)
    vdraw.ellipse([-W * 0.28, -H * 0.42, W * 1.28, H * 1.42], fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(150))
    card = Image.composite(card, Image.new("RGB", (W, H), INK_DEEP), vignette)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    card.save(OUT, "PNG", optimize=True)
    print("wrote %s (%d x %d, %.0f kB)" % (OUT, W, H, os.path.getsize(OUT) / 1024))


def add(base, layer):
    """Screen-ish additive composite — light added to a scene, never subtracted."""
    return Image.blend(base, Image.new("RGB", base.size, (0, 0, 0)), 0.0) if layer is None else \
        Image.merge("RGB", [
            Image.eval(Image.merge("L", [b]).point(lambda v: v), lambda v: v)
            for b in base.split()
        ]) if False else _add(base, layer)


def _add(base, layer):
    from PIL import ImageChops
    return ImageChops.add(base, layer)


if __name__ == "__main__":
    build()
