#!/usr/bin/env python3
"""Generate strongly compressed LQ JPEG placeholders for portfolio images."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "portfolio"
MAX_SIZE = (48, 48)
QUALITY = 28
SOURCE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def main() -> None:
    targets = [
        path
        for path in ROOT.rglob("*")
        if path.suffix.lower() in SOURCE_EXTS and ".lq." not in path.name.lower()
    ]

    print(f"Generating LQ for {len(targets)} images...")

    for src in targets:
        out = src.with_name(f"{src.stem}.lq.jpg")
        image = Image.open(src)

        if image.mode in {"RGBA", "P", "LA"}:
            background = Image.new("RGB", image.size, (227, 227, 227))
            rgba = image.convert("RGBA")
            background.paste(rgba, mask=rgba.split()[-1])
            image = background
        else:
            image = image.convert("RGB")

        image.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
        image.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        print(f"  {src.relative_to(ROOT)} -> {out.name} ({out.stat().st_size}B)")

    print("Done.")


if __name__ == "__main__":
    main()
