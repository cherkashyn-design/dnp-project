#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
MANIFEST="$ROOT/.upload-manifest.tsv"

if [[ -f "$MANIFEST" ]] && [[ "${1:-}" != "--force" ]]; then
  lines=$(wc -l < "$MANIFEST" | tr -d ' ')
  if [[ "$lines" -gt 50 ]]; then
    echo "Manifest already has $lines entries. Use --force to re-upload."
    exit 0
  fi
fi

: > "$MANIFEST"

upload_file() {
  local f="$1"
  local rel="${f#$ROOT/}"
  local resp url
  resp=$(curl -sf -F "files[]=@${f}" "https://uguu.se/upload")
  url=$(python3 -c "import json,sys; print(json.load(sys.stdin)['files'][0]['url'])" <<<"$resp")
  printf '%s\t%s\n' "$rel" "$url" >> "$MANIFEST"
  echo "$rel"
}

export -f upload_file
export ROOT MANIFEST

find "$ROOT" -type f \( -iname '*.png' -o -iname '*.mp4' \) ! -path '*/.*' | sort | while read -r f; do
  upload_file "$f"
done

echo "Done. $(wc -l < "$MANIFEST") files in $MANIFEST"
