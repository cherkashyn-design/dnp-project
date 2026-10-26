#!/usr/bin/env python3
"""Generate OG link-preview assets: works slideshow GIF + static PNG.

Logo stays on the front; visible case previews cycle as the background.
"""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 1200, 630
HOLD_FRAMES = 10  # ~0.8s at 12fps per slide
CROSSFADE_FRAMES = 3
FPS = 12
LOGO_SIZE = 280
CASE_IMAGES = [
    ROOT / "redesign/src/assets/cases/yummo.webp",
    ROOT / "redesign/src/assets/cases/nodify.webp",
    ROOT / "redesign/src/assets/cases/sales-driver.webp",
    ROOT / "redesign/src/assets/cases/drumkit.webp",
]
FONT_PATH = ROOT / "scripts/fonts/InstrumentSerif-Regular.ttf"
OUT_DIRS = [ROOT / "public", ROOT / "redesign/public"]


def cover_crop(src: Image.Image, size: tuple[int, int]) -> Image.Image:
    tw, th = size
    sw, sh = src.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale + 0.5), int(sh * scale + 0.5)
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return resized.crop((left, top, left + tw, top + th)).convert("RGB")


def make_logo(size: int = LOGO_SIZE) -> Image.Image:
    """Black rounded DNP mark with white serif letters."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    radius = int(size * 0.18)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=(15, 15, 15, 255))

    font_size = int(size * 0.34)
    font = ImageFont.truetype(str(FONT_PATH), font_size)
    text = "DNP"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    # Instrument Serif sits a bit high; nudge down for optical center.
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1] + size * 0.02
    draw.text((x, y), text, font=font, fill=(255, 255, 255, 255))
    return canvas


def dim_overlay(base: Image.Image, amount: float = 0.28) -> Image.Image:
    """Slight dark veil so the logo stays readable on bright works."""
    overlay = Image.new("RGB", base.size, (20, 20, 20))
    return Image.blend(base, overlay, amount)


def soft_vignette(base: Image.Image) -> Image.Image:
    w, h = base.size
    vignette = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(vignette)
    # Radial-ish darkening via ellipse + blur.
    pad = int(min(w, h) * 0.08)
    draw.ellipse((-pad, -pad, w + pad, h + pad), fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=90))
    dark = Image.new("RGB", (w, h), (12, 12, 12))
    # Where vignette is bright (center), keep base; edges lean darker.
    return Image.composite(base, dark, vignette)


def compose_frame(background: Image.Image, logo: Image.Image) -> Image.Image:
    frame = soft_vignette(dim_overlay(background, 0.22))
    rgba = frame.convert("RGBA")
    lx = (WIDTH - logo.width) // 2
    ly = (HEIGHT - logo.height) // 2
    # Soft shadow under logo
    shadow = Image.new("RGBA", (logo.width + 40, logo.height + 40), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        (10, 14, logo.width + 30, logo.height + 34),
        radius=int(logo.width * 0.18),
        fill=(0, 0, 0, 90),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=18))
    rgba.alpha_composite(shadow, (lx - 20, ly - 16))
    rgba.alpha_composite(logo, (lx, ly))
    return rgba.convert("RGB")


def lerp_frames(a: Image.Image, b: Image.Image, steps: int) -> list[Image.Image]:
    if steps <= 0:
        return []
    out = []
    for i in range(1, steps + 1):
        t = i / (steps + 1)
        t = t * t * (3 - 2 * t)
        out.append(Image.blend(a, b, t))
    return out


def build_sequence(logo: Image.Image) -> list[Image.Image]:
    slides = [compose_frame(cover_crop(Image.open(path), (WIDTH, HEIGHT)), logo) for path in CASE_IMAGES]
    frames: list[Image.Image] = []
    for index, slide in enumerate(slides):
        # One master frame reused — GIF encoders pack identical hold frames well.
        frames.append(slide)
        for _ in range(HOLD_FRAMES - 1):
            frames.append(slide)
        nxt = slides[(index + 1) % len(slides)]
        frames.extend(lerp_frames(slide, nxt, CROSSFADE_FRAMES))
    return frames


def write_gif(frames: list[Image.Image], dest: Path) -> None:
    with tempfile.TemporaryDirectory(prefix="og-gif-") as tmp:
        tmp_path = Path(tmp)
        # Slightly downscale working frames for palette size, then scale back
        # in the filter graph only if needed — keep native 1200x630 output.
        for i, frame in enumerate(frames):
            frame.save(tmp_path / f"frame-{i:04d}.png", optimize=True)

        palette = tmp_path / "palette.png"
        gif_path = tmp_path / "og-image.gif"
        pattern = str(tmp_path / "frame-%04d.png")

        def encode(frame_glob: str, fps: str, colors: int, out_gif: Path) -> None:
            pal = tmp_path / f"palette-{colors}.png"
            gen = subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-framerate",
                    fps,
                    "-i",
                    frame_glob,
                    "-vf",
                    f"palettegen=max_colors={colors}:stats_mode=diff",
                    "-update",
                    "1",
                    str(pal),
                ],
                capture_output=True,
                text=True,
            )
            if gen.returncode != 0:
                raise RuntimeError(gen.stderr[-800:])
            use = subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-framerate",
                    fps,
                    "-i",
                    frame_glob,
                    "-i",
                    str(pal),
                    "-lavfi",
                    "paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle",
                    "-loop",
                    "0",
                    str(out_gif),
                ],
                capture_output=True,
                text=True,
            )
            if use.returncode != 0:
                raise RuntimeError(use.stderr[-800:])

        encode(pattern, str(FPS), 96, gif_path)
        size_kb = gif_path.stat().st_size / 1024
        if size_kb > 1800:
            thin_i = 0
            for i, frame in enumerate(frames):
                if i % 2 == 1:
                    continue
                frame.save(tmp_path / f"thin-{thin_i:04d}.png", optimize=True)
                thin_i += 1
            encode(str(tmp_path / "thin-%04d.png"), "8", 64, gif_path)

        for out_dir in OUT_DIRS:
            out_dir.mkdir(parents=True, exist_ok=True)
            target = out_dir / "og-image.gif"
            target.write_bytes(gif_path.read_bytes())
            print(f"wrote {target} ({target.stat().st_size / 1024:.0f} KB)")


def write_static(frame: Image.Image) -> None:
    for out_dir in OUT_DIRS:
        target = out_dir / "og-image.png"
        frame.save(target, format="PNG", optimize=True)
        print(f"wrote {target} ({target.stat().st_size / 1024:.0f} KB)")


def main() -> None:
    missing = [str(p) for p in CASE_IMAGES if not p.exists()]
    if missing:
        raise SystemExit(f"Missing case images: {missing}")
    if not FONT_PATH.exists():
        raise SystemExit(f"Missing font: {FONT_PATH}")

    logo = make_logo()
    frames = build_sequence(logo)
    write_gif(frames, OUT_DIRS[0] / "og-image.gif")
    write_static(frames[0])
    print(f"frames={len(frames)} duration≈{len(frames) / FPS:.1f}s")


if __name__ == "__main__":
    main()
