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
# enc <in> <out> <quality> <max bytes>: normal quality, squeezed down only if it comes out over the cap
enc() {
  cwebp -quiet -q "$3" -m 6 -sharp_yuv -metadata none "$1" -o "$2"
  if [ "$(wc -c < "$2")" -gt "$4" ]; then cwebp -quiet -size "$4" -pass 6 -m 6 -sharp_yuv -metadata none "$1" -o "$2"; fi
}
sips -s format png -Z 960 "$tmp/src.jpg" --out "$tmp/960.png" >/dev/null
w=$(sips -g pixelWidth "$tmp/960.png" | awk '/pixelWidth/{print $2}')
h=$(sips -g pixelHeight "$tmp/960.png" | awk '/pixelHeight/{print $2}')
enc "$tmp/960.png" "$out/$name-960.webp" 68 45000
# square center crop, then sizes
s=$w; [ "$h" -lt "$s" ] && s=$h
sips -c "$s" "$s" "$tmp/960.png" --out "$tmp/sq.png" >/dev/null
# byte caps keep every photo small, even busy ones (granite counters, seeds)
for n in 160:3500 320:9000 480:16000; do
  px=${n%%:*}; bytes=${n##*:}
  sips -z "$px" "$px" "$tmp/sq.png" --out "$tmp/sq$px.png" >/dev/null
  enc "$tmp/sq$px.png" "$out/$name-sq$px.webp" 62 "$bytes"
done
rm -rf "$tmp"
echo "$name: ${w}x${h}"
