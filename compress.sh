#!/bin/sh
# Usage: ./compress.sh <photo.jpeg> <name>
# Makes img/<name>-480.webp, img/<name>-960.webp and img/<name>-480.jpg (fallback)
set -e
src="$1"; name="$2"; out="$(cd "$(dirname "$0")" && pwd)/img"
tmp="$(mktemp -d)"
# iPhone photos store rotation as metadata; apply it to the pixels so it survives WebP conversion
rot=0
case "$(file "$src")" in
  *orientation=upper-right*) rot=90 ;;
  *orientation=lower-right*) rot=180 ;;
  *orientation=lower-left*)  rot=270 ;;
esac
cp "$src" "$tmp/src.jpg"
[ "$rot" != 0 ] && sips -r "$rot" "$tmp/src.jpg" >/dev/null
sips -s format jpeg -Z 960 "$tmp/src.jpg" --out "$tmp/960.jpg" >/dev/null
sips -s format jpeg -s formatOptions 60 -Z 480 "$tmp/src.jpg" --out "$tmp/480.jpg" >/dev/null
cwebp -quiet -q 70 -metadata none "$tmp/960.jpg" -o "$out/$name-960.webp"
cwebp -quiet -q 70 -metadata none "$tmp/480.jpg" -o "$out/$name-480.webp"
cp "$tmp/480.jpg" "$out/$name-480.jpg"
rm -rf "$tmp"
sips -g pixelWidth -g pixelHeight "$out/$name-480.jpg" | tail -2 | awk '{printf "%s ", $2}'; echo
