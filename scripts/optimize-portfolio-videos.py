#!/usr/bin/env python3
"""Downscale oversized portfolio WebMs for mobile Safari memory safety.

For each .webm under portfolio/ (skipping *.mobile.*):
  1. Re-encode in place when wider than DESKTOP_MAX or larger than SIZE_TRIGGER
     → max width DESKTOP_MAX, VP9 CRF DESKTOP_CRF (no audio; case videos are muted).
  2. Always write a sibling *.mobile.webm at MOBILE_MAX / MOBILE_CRF when missing
     or older than the source.

Requires ffmpeg + ffprobe on PATH.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "portfolio"
DESKTOP_MAX = 1280
MOBILE_MAX = 720
DESKTOP_CRF = 34
MOBILE_CRF = 36
# Re-encode desktop source when file exceeds this even if already ≤ DESKTOP_MAX
SIZE_TRIGGER = 2_500_000


def probe(path: Path) -> dict:
    raw = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-show_entries",
            "format=size,duration",
            "-of",
            "json",
            str(path),
        ],
        text=True,
    )
    data = json.loads(raw)
    stream = (data.get("streams") or [{}])[0]
    fmt = data.get("format") or {}
    return {
        "width": int(stream.get("width") or 0),
        "height": int(stream.get("height") or 0),
        "size": int(fmt.get("size") or path.stat().st_size),
        "duration": float(fmt.get("duration") or 0),
    }


def encode(src: Path, dest: Path, max_width: int, crf: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False, dir=dest.parent) as tmp:
        tmp_path = Path(tmp.name)

    vf = f"scale='min({max_width},iw)':-2:flags=lanczos"
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(src),
        "-vf",
        vf,
        "-c:v",
        "libvpx-vp9",
        "-b:v",
        "0",
        "-crf",
        str(crf),
        "-row-mt",
        "1",
        "-deadline",
        "good",
        "-cpu-used",
        "2",
        "-an",
        str(tmp_path),
    ]
    print(f"  ffmpeg → {dest.name} (max {max_width}px, crf {crf})")
    subprocess.check_call(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    tmp_path.replace(dest)


def mobile_path_for(path: Path) -> Path:
    return path.with_name(f"{path.stem}.mobile{path.suffix}")


def should_skip(path: Path) -> bool:
    name = path.name.lower()
    return ".mobile." in name or path.suffix.lower() != ".webm"


def main() -> int:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        print("ffmpeg/ffprobe required", file=sys.stderr)
        return 1

    sources = sorted(p for p in ROOT.rglob("*.webm") if p.is_file() and not should_skip(p))
    print(f"Scanning {len(sources)} WebMs under {ROOT}...")

    for src in sources:
        info = probe(src)
        print(
            f"\n{src.relative_to(ROOT)}  "
            f"{info['width']}x{info['height']}  {info['size'] / 1e6:.1f}MB"
        )

        needs_desktop = info["width"] > DESKTOP_MAX or info["size"] > SIZE_TRIGGER
        if needs_desktop:
            before = info["size"]
            encode(src, src, DESKTOP_MAX, DESKTOP_CRF)
            after = src.stat().st_size
            print(f"  desktop: {before / 1e6:.1f}MB → {after / 1e6:.1f}MB")
            info = probe(src)

        mobile = mobile_path_for(src)
        if not mobile.exists() or mobile.stat().st_mtime < src.stat().st_mtime:
            encode(src, mobile, MOBILE_MAX, MOBILE_CRF)
            print(f"  mobile:  {mobile.stat().st_size / 1e6:.1f}MB → {mobile.name}")
        else:
            print(f"  mobile:  up to date ({mobile.stat().st_size / 1e6:.1f}MB)")

    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
