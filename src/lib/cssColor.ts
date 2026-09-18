const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB = /^rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/i;
const KEYWORDS = new Set(['transparent', 'currentcolor', 'inherit', 'initial', 'unset', 'none']);

function expandHex(value: string): string {
  if (value.length === 4) {
    const [, r, g, b] = value;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return value.slice(0, 7).toLowerCase();
}

function channelToHex(value: string): string {
  return Math.max(0, Math.min(255, Number(value))).toString(16).padStart(2, '0');
}

/** Native <input type="color"> only accepts #rrggbb. Keep keywords like transparent in stored CSS. */
export function toColorInputValue(value: unknown, fallback = '#ffffff'): string {
  const raw = String(value ?? '').trim();
  if (!raw || KEYWORDS.has(raw.toLowerCase())) return fallback;
  if (HEX.test(raw)) return expandHex(raw);
  const rgb = raw.match(RGB);
  if (rgb) return `#${channelToHex(rgb[1])}${channelToHex(rgb[2])}${channelToHex(rgb[3])}`;
  return fallback;
}
