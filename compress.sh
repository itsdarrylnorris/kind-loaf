#!/bin/sh
# Usage: ./compress.sh <photo.jpeg> <name>
# Makes (in img/):
#   <name>-sq160.webp / -sq320.webp / -sq480.webp   square crops for cards, cart and upsell
#   <name>-960.webp                                  full photo for the enlarged view
# Needs macOS (sips) and cwebp (brew install webp).
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
sips -s format png -Z 960 "$tmp/src.jpg" --out "$tmp/960.png" >/dev/null
w=$(sips -g pixelWidth "$tmp/960.png" | awk '/pixelWidth/{print $2}')
h=$(sips -g pixelHeight "$tmp/960.png" | awk '/pixelHeight/{print $2}')
cwebp -quiet -q 68 -m 6 -sharp_yuv -metadata none "$tmp/960.png" -o "$out/$name-960.webp"
# square center crop, then sizes
s=$w; [ "$h" -lt "$s" ] && s=$h
sips -c "$s" "$s" "$tmp/960.png" --out "$tmp/sq.png" >/dev/null
for n in 160 320 480; do
  sips -z "$n" "$n" "$tmp/sq.png" --out "$tmp/sq$n.png" >/dev/null
  cwebp -quiet -q 62 -m 6 -sharp_yuv -metadata none "$tmp/sq$n.png" -o "$out/$name-sq$n.webp"
done
rm -rf "$tmp"
echo "$name: ${w}x${h}"
