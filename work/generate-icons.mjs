import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(here, "../outputs/kana-card/icons");
mkdirSync(outputDirectory, { recursive: true });

const COLORS = {
  background: [23, 42, 46, 255],
  accent: [217, 91, 70, 255],
  white: [255, 255, 255, 255],
  teal: [143, 208, 204, 255]
};

function mixPixel(target, offset, color, alpha = 1) {
  const inverse = 1 - alpha;
  target[offset] = Math.round(target[offset] * inverse + color[0] * alpha);
  target[offset + 1] = Math.round(target[offset + 1] * inverse + color[1] * alpha);
  target[offset + 2] = Math.round(target[offset + 2] * inverse + color[2] * alpha);
  target[offset + 3] = Math.max(target[offset + 3], Math.round(255 * alpha));
}

function createCanvas(size) {
  return {
    size,
    pixels: new Uint8ClampedArray(size * size * 4)
  };
}

function isInsideRoundedRect(x, y, left, top, right, bottom, radius) {
  const closestX = Math.max(left + radius, Math.min(x, right - radius));
  const closestY = Math.max(top + radius, Math.min(y, bottom - radius));
  const dx = x - closestX;
  const dy = y - closestY;
  return dx * dx + dy * dy <= radius * radius;
}

function paintRoundedRect(canvas, left, top, right, bottom, radius, color) {
  for (let y = Math.floor(top); y < Math.ceil(bottom); y += 1) {
    for (let x = Math.floor(left); x < Math.ceil(right); x += 1) {
      if (!isInsideRoundedRect(x + 0.5, y + 0.5, left, top, right, bottom, radius)) continue;
      mixPixel(canvas.pixels, (y * canvas.size + x) * 4, color);
    }
  }
}

function paintCircle(canvas, centerX, centerY, radius, color) {
  const left = Math.floor(centerX - radius - 1);
  const right = Math.ceil(centerX + radius + 1);
  const top = Math.floor(centerY - radius - 1);
  const bottom = Math.ceil(centerY + radius + 1);

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const dx = x + 0.5 - centerX;
      const dy = y + 0.5 - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > radius + 0.75) continue;
      const alpha = Math.max(0, Math.min(1, radius + 0.5 - distance));
      mixPixel(canvas.pixels, (y * canvas.size + x) * 4, color, alpha);
    }
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (!lengthSquared) return Math.hypot(px - x1, py - y1);

  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;
  return Math.hypot(px - closestX, py - closestY);
}

function paintLine(canvas, x1, y1, x2, y2, width, color) {
  const radius = width / 2;
  const left = Math.floor(Math.min(x1, x2) - radius - 1);
  const right = Math.ceil(Math.max(x1, x2) + radius + 1);
  const top = Math.floor(Math.min(y1, y2) - radius - 1);
  const bottom = Math.ceil(Math.max(y1, y2) + radius + 1);

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const distance = distanceToSegment(x + 0.5, y + 0.5, x1, y1, x2, y2);
      if (distance > radius + 0.75) continue;
      const alpha = Math.max(0, Math.min(1, radius + 0.5 - distance));
      mixPixel(canvas.pixels, (y * canvas.size + x) * 4, color, alpha);
    }
  }
}

function paintArc(canvas, centerX, centerY, radiusX, radiusY, start, end, width, color) {
  const segments = 48;
  let previous = null;

  for (let index = 0; index <= segments; index += 1) {
    const angle = start + ((end - start) * index) / segments;
    const point = {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY
    };

    if (previous) {
      paintLine(canvas, previous.x, previous.y, point.x, point.y, width, color);
    }
    previous = point;
  }
}

function drawIcon(size) {
  const supersample = 2;
  const canvasSize = size * supersample;
  const canvas = createCanvas(canvasSize);
  const scale = canvasSize / 512;

  paintRoundedRect(canvas, 0, 0, canvasSize, canvasSize, 108 * scale, COLORS.background);
  paintCircle(canvas, 398 * scale, 112 * scale, 42 * scale, COLORS.accent);

  const stroke = 42 * scale;
  paintLine(canvas, 110 * scale, 175 * scale, 264 * scale, 175 * scale, stroke, COLORS.white);
  paintArc(
    canvas,
    263 * scale,
    253 * scale,
    93 * scale,
    78 * scale,
    -Math.PI / 2,
    Math.PI / 2,
    stroke,
    COLORS.white
  );
  paintArc(
    canvas,
    263 * scale,
    330 * scale,
    93 * scale,
    77 * scale,
    -Math.PI / 2,
    Math.PI / 2,
    stroke,
    COLORS.white
  );
  paintLine(canvas, 143 * scale, 175 * scale, 143 * scale, 481 * scale, stroke, COLORS.white);
  paintLine(canvas, 217 * scale, 175 * scale, 217 * scale, 481 * scale, stroke, COLORS.white);
  paintLine(canvas, 119 * scale, 326 * scale, 275 * scale, 326 * scale, stroke, COLORS.teal);

  const output = new Uint8ClampedArray(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sums = [0, 0, 0, 0];

      for (let sy = 0; sy < supersample; sy += 1) {
        for (let sx = 0; sx < supersample; sx += 1) {
          const sourceX = x * supersample + sx;
          const sourceY = y * supersample + sy;
          const sourceOffset = (sourceY * canvasSize + sourceX) * 4;
          sums[0] += canvas.pixels[sourceOffset];
          sums[1] += canvas.pixels[sourceOffset + 1];
          sums[2] += canvas.pixels[sourceOffset + 2];
          sums[3] += canvas.pixels[sourceOffset + 3];
        }
      }

      const targetOffset = (y * size + x) * 4;
      const samples = supersample * supersample;
      output[targetOffset] = Math.round(sums[0] / samples);
      output[targetOffset + 1] = Math.round(sums[1] / samples);
      output[targetOffset + 2] = Math.round(sums[2] / samples);
      output[targetOffset + 3] = Math.round(sums[3] / samples);
    }
  }

  return output;
}

const crcTable = new Uint32Array(256);
for (let index = 0; index < 256; index += 1) {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  crcTable[index] = value >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const value of buffer) {
    crc = crcTable[(crc ^ value) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function encodePng(size, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  const rows = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    const rowOffset = y * (size * 4 + 1);
    rows[rowOffset] = 0;
    Buffer.from(pixels.buffer, pixels.byteOffset + y * size * 4, size * 4).copy(rows, rowOffset + 1);
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(rows, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

for (const [size, fileName] of [
  [180, "apple-touch-icon.png"],
  [192, "icon-192.png"],
  [512, "icon-512.png"]
]) {
  const pixels = drawIcon(size);
  writeFileSync(resolve(outputDirectory, fileName), encodePng(size, pixels));
}

console.log(`Generated icons in ${outputDirectory}`);
