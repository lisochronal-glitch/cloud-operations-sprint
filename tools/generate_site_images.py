"""Generate favicon.ico and og-image.png for the portfolio site.

Typographic only - no photographs and no personal data beyond the name
already published on the site.
"""

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = Path(__file__).resolve().parent.parent
WEBSITE = REPO_ROOT / "website"
FALLBACK_ACCENT = "#2563eb"

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
]
REGULAR_FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
]


def read_accent() -> str:
    css = (WEBSITE / "style.css").read_text(encoding="utf-8")
    match = re.search(r"--accent:\s*(#[0-9a-fA-F]{3,8})", css)
    return match.group(1) if match else FALLBACK_ACCENT


def load_font(candidates, size):
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def centred(draw, text, font, box_width, y, fill):
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    draw.text(((box_width - (right - left)) / 2 - left, y), text, font=font, fill=fill)


def make_favicon(accent: str) -> None:
    size = 256
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=48, fill=accent)

    font = load_font(FONT_CANDIDATES, 132)
    left, top, right, bottom = draw.textbbox((0, 0), "SH", font=font)
    draw.text(
        ((size - (right - left)) / 2 - left, (size - (bottom - top)) / 2 - top),
        "SH",
        font=font,
        fill="white",
    )

    image.save(
        WEBSITE / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )
    print("wrote website/favicon.ico")


def make_og_image(accent: str) -> None:
    width, height = 1200, 630
    image = Image.new("RGB", (width, height), "#0f172a")
    draw = ImageDraw.Draw(image)

    draw.rectangle([0, 0, width, 12], fill=accent)

    name_font = load_font(FONT_CANDIDATES, 86)
    role_font = load_font(FONT_CANDIDATES, 44)
    detail_font = load_font(REGULAR_FONT_CANDIDATES, 27)

    centred(draw, "Sebastian Hoglund", name_font, width, 208, "#f8fafc")
    centred(draw, "AWS / Cloud Operations — Japan", role_font, width, 330, accent)
    centred(
        draw,
        "Private S3 + CloudFront  ·  Secure VPC Foundation  ·  Event-Driven Order Workflow",
        detail_font,
        width,
        432,
        "#94a3b8",
    )

    image.save(WEBSITE / "og-image.png", format="PNG", optimize=True)
    print("wrote website/og-image.png")


if __name__ == "__main__":
    accent_colour = read_accent()
    print(f"using accent {accent_colour}")
    make_favicon(accent_colour)
    make_og_image(accent_colour)
