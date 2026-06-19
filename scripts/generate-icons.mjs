import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/icons");

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#7c3aed"/>
  <circle cx="256" cy="256" r="80" fill="none" stroke="white" stroke-width="24"/>
  <circle cx="256" cy="256" r="24" fill="white"/>
  <path d="M256 96 L256 176 M256 336 L256 416 M96 256 L176 256 M336 256 L416 256" stroke="white" stroke-width="20" stroke-linecap="round"/>
</svg>`;

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(outDir, `icon-${size}.png`));
}

console.log("Icons generated");
