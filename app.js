const baseColorInput = document.getElementById("base-color");
const baseHexDisplay = document.getElementById("base-hex");
const schemeSelect = document.getElementById("scheme");
const paletteContainer = document.getElementById("palette");
const randomBtn = document.getElementById("random-btn");
const toast = document.getElementById("toast");

let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 1800);
}

function getTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111827" : "#F9FAFB";
}

async function copyHex(hex) {
  try {
    await navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex}`);
  } catch {
    showToast("Could not copy to clipboard");
  }
}

function renderPalette() {
  const baseHex = normalizeHex(baseColorInput.value);
  baseHexDisplay.textContent = baseHex;
  const colors = generatePalette(baseHex, schemeSelect.value);

  paletteContainer.innerHTML = "";

  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.setAttribute("aria-label", `Copy ${color.hex}, ${color.label}`);

    const swatchColor = document.createElement("div");
    swatchColor.className = "swatch-color";
    swatchColor.style.backgroundColor = color.hex;

    const info = document.createElement("div");
    info.className = "swatch-info";

    const hexEl = document.createElement("span");
    hexEl.className = "swatch-hex";
    hexEl.textContent = color.hex;
    hexEl.style.color = getTextColor(color.hex);

    const labelEl = document.createElement("span");
    labelEl.className = "swatch-label";
    labelEl.textContent = color.label;

    info.appendChild(hexEl);
    info.appendChild(labelEl);
    button.appendChild(swatchColor);
    button.appendChild(info);
    button.addEventListener("click", () => copyHex(color.hex));

    paletteContainer.appendChild(button);
  });
}

baseColorInput.addEventListener("input", renderPalette);
schemeSelect.addEventListener("change", renderPalette);

randomBtn.addEventListener("click", () => {
  baseColorInput.value = randomHex();
  renderPalette();
});

renderPalette();
