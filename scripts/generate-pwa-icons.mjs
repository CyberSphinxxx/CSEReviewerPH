import fs from "fs";
import path from "path";
import zlib from "zlib";

const publicDir = path.resolve(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate an SVG icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <!-- Gold Award Shield -->
  <path d="M256 90 L370 140 V260 C370 340 315 410 256 440 C197 410 142 340 142 260 V140 Z" fill="none" stroke="url(#gold)" stroke-width="24" stroke-linejoin="round"/>
  <!-- Star in Center -->
  <polygon points="256,180 278,226 328,233 292,268 300,318 256,295 212,318 220,268 184,233 234,226" fill="url(#gold)"/>
  <!-- Text Label -->
  <text x="256" y="375" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">CSE PH</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, "icon.svg"), svgIcon, "utf8");

// Pure Node.js function to generate a simple RGBA PNG buffer
function createPngBuffer(width, height) {
  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: 13 bytes
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk("IHDR", ihdrData);

  // Raw image data: filter byte (0) + width * 4 bytes per row
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    rawData[rowStart] = 0; // No filter

    // Calculate distance from center for a circle/shield shape
    const cy = y - height / 2;
    for (let x = 0; x < width; x++) {
      const cx = x - width / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      const isInner = dist < width * 0.4;
      const isGoldBadge = dist < width * 0.22;

      const pxOffset = rowStart + 1 + x * 4;
      if (isGoldBadge) {
        rawData[pxOffset] = 234; // Gold R
        rawData[pxOffset + 1] = 179; // Gold G
        rawData[pxOffset + 2] = 8; // Gold B
        rawData[pxOffset + 3] = 255; // Alpha
      } else if (isInner) {
        rawData[pxOffset] = 3; // Brand Blue R
        rawData[pxOffset + 1] = 105; // Brand Blue G
        rawData[pxOffset + 2] = 161; // Brand Blue B
        rawData[pxOffset + 3] = 255;
      } else {
        rawData[pxOffset] = 15; // Slate Dark R
        rawData[pxOffset + 1] = 23; // Slate Dark G
        rawData[pxOffset + 2] = 42; // Slate Dark B
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk("IDAT", compressedData);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, "ascii");
  const payload = Buffer.concat([typeBuffer, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(payload), 0);

  return Buffer.concat([length, payload, crc]);
}

// Standard CRC32 table & calculation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Write 192x192 and 512x512 PWA icons
const icon192 = createPngBuffer(192, 192);
fs.writeFileSync(path.join(publicDir, "icon-192.png"), icon192);

const icon512 = createPngBuffer(512, 512);
fs.writeFileSync(path.join(publicDir, "icon-512.png"), icon512);

console.log("PWA icons generated successfully in public/ directory.");
