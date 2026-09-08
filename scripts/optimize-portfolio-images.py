#!/usr/bin/env python3
"""Convert portfolio rasters to WebP and downscale oversized assets.

- Case Preview.* → max edge 2048 (2K)
- Other full slides → max edge 2048
- Nav thumbs / already-small images → WebP only (no upscale)
- Skips *.lq.*, figma*, notion*
- Removes original jpg/png after a successful WebP write
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "portfolio"
PREVIEW_MAX = 2048
SLIDE_MAX = 2048
WEBP_QUALITY = 80
SKIP_NAME_PARTS = (".lq.", "figma", "notion")


def should_skip(path: Path) -> bool:
    name = path.name.lower()
    if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        return True
    return any(part in name for part in SKIP_NAME_PARTS)


def max_edge_for(path: Path) -> int | None:
    stem = path.stem.lower()
    # Homepage / hero case previews
    if stem == "preview":
        return PREVIEW_MAX
    # Nav thumbnails live under Previews/ and are already small
    if "previews" in {p.lower() for p in path.parts}:
        return None
    return SLIDE_MAX


def convert(path: Path) -> Path | None:
    out = path.with_suffix(".webp")
    image = Image.open(path)

    if image.mode in {"RGBA", "P", "LA"}:
        if path.suffix.lower() == ".png" and "A" in image.getbands():
            image = image.convert("RGBA")
        else:
            background = Image.new("RGB", image.size, (227, 227, 227))
            rgba = image.convert("RGBA")
            background.paste(rgba, mask=rgba.split()[-1])
            image = background
    elif image.mode != "RGB":
        image = image.convert("RGB")

    max_edge = max_edge_for(path)
    if max_edge and max(image.size) > max_edge:
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)

    save_kwargs = {
        "format": "WEBP",
        "quality": WEBP_QUALITY,
        "method": 6,
    }
    if image.mode == "RGBA":
        save_kwargs["exact"] = True

    image.save(out, **save_kwargs)
    return out


def main() -> int:
    targets = sorted(p for p in ROOT.rglob("*") if p.is_file() and not should_skip(p))
    print(f"Converting {len(targets)} images under {ROOT}...")

    before = sum(p.stat().st_size for p in targets)
    after = 0
    converted = 0

    for src in targets:
        try:
            out = convert(src)
        except Exception as exc:  # noqa: BLE001
            print(f"  FAIL {src.relative_to(ROOT)}: {exc}", file=sys.stderr)
            continue

        if out is None:
            continue

        src_size = src.stat().st_size
        out_size = out.stat().st_size
        after += out_size
        converted += 1
        rel = src.relative_to(ROOT)
        print(
            f"  {rel} -> {out.name} "
            f"({src_size / 1024:.0f}KB -> {out_size / 1024:.0f}KB)"
        )
        src.unlink()

    # Drop stale LQ jpegs for removed sources; regenerate separately
    for lq in ROOT.rglob("*.lq.jpg"):
        stem_base = lq.name[: -len(".lq.jpg")]
        has_full = any(lq.with_name(f"{stem_base}{ext}").exists() for ext in (".webp", ".jpg", ".jpeg", ".png"))
        if not has_full:
            lq.unlink()
            print(f"  removed stale {lq.relative_to(ROOT)}")

    print(
        f"Done. {converted} files. "
        f"{before / 1024 / 1024:.1f}MB -> {after / 1024 / 1024:.1f}MB "
        f"({(1 - after / before) * 100:.0f}% smaller)"
        if before
        else "Done."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
