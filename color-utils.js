function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / delta + 2) / 6;
        break;
      default:
        h = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const light = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = c; g = x; b = 0;
  } else if (hue < 120) {
    r = x; g = c; b = 0;
  } else if (hue < 180) {
    r = 0; g = c; b = x;
  } else if (hue < 240) {
    r = 0; g = x; b = c;
  } else if (hue < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (value) => Math.round((value + m) * 255).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function normalizeHex(hex) {
  return hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
}

function rotateHue(h, degrees) {
  return ((h + degrees) % 360 + 360) % 360;
}

function generatePalette(baseHex, scheme) {
  const { h, s, l } = hexToHsl(normalizeHex(baseHex));
  const base = { hex: normalizeHex(baseHex), label: "Base" };

  switch (scheme) {
    case "complementary":
      return [
        base,
        { hex: hslToHex(rotateHue(h, 180), s, l), label: "Complement" },
      ];

    case "analogous":
      return [
        { hex: hslToHex(rotateHue(h, -30), s, l), label: "Analogous −30°" },
        base,
        { hex: hslToHex(rotateHue(h, 30), s, l), label: "Analogous +30°" },
      ];

    case "triadic":
      return [
        base,
        { hex: hslToHex(rotateHue(h, 120), s, l), label: "Triadic +120°" },
        { hex: hslToHex(rotateHue(h, 240), s, l), label: "Triadic +240°" },
      ];

    case "split-complementary":
      return [
        base,
        { hex: hslToHex(rotateHue(h, 150), s, l), label: "Split +150°" },
        { hex: hslToHex(rotateHue(h, 210), s, l), label: "Split +210°" },
      ];

    case "tetradic":
      return [
        base,
        { hex: hslToHex(rotateHue(h, 90), s, l), label: "Tetradic +90°" },
        { hex: hslToHex(rotateHue(h, 180), s, l), label: "Tetradic +180°" },
        { hex: hslToHex(rotateHue(h, 270), s, l), label: "Tetradic +270°" },
      ];

    case "monochromatic":
      return [
        { hex: hslToHex(h, s, Math.max(10, l - 25)), label: "Darker" },
        { hex: hslToHex(h, s, Math.max(10, l - 12)), label: "Dark" },
        base,
        { hex: hslToHex(h, s, Math.min(90, l + 12)), label: "Light" },
        { hex: hslToHex(h, s, Math.min(90, l + 25)), label: "Lighter" },
      ];

    default:
      return [base];
  }
}

function randomHex() {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, "0").toUpperCase()}`;
}
