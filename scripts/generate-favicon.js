const fs = require("fs");
const path = require("path");

function createIco(sizes) {
  const numImages = sizes.length;
  const headerSize = 6 + numImages * 16;
  
  const entries = [];
  const imageBuffers = [];
  let currentOffset = headerSize;

  for (const size of sizes) {
    const width = size;
    const height = size;
    
    // BITMAPINFOHEADER (40 bytes)
    const bih = Buffer.alloc(40);
    bih.writeUInt32LE(40, 0); // biSize
    bih.writeInt32LE(width, 4); // biWidth
    bih.writeInt32LE(height * 2, 8); // biHeight (doubled for ICO)
    bih.writeUInt16LE(1, 12); // biPlanes
    bih.writeUInt16LE(32, 14); // biBitCount (32-bit BGRA)
    bih.writeUInt32LE(0, 16); // biCompression (BI_RGB)
    bih.writeUInt32LE(width * height * 4, 20); // biSizeImage
    bih.writeInt32LE(0, 24); // biXPelsPerMeter
    bih.writeInt32LE(0, 28); // biYPelsPerMeter
    bih.writeUInt32LE(0, 32); // biClrUsed
    bih.writeUInt32LE(0, 36); // biClrImportant

    // Pixel data (BGRA, bottom-up)
    const pixelData = Buffer.alloc(width * height * 4);
    const andMask = Buffer.alloc(Math.ceil((width * height) / 8)); // 0 = opaque

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.46;
    const innerRadius = width * 0.38;

    // Brand Colors:
    // Green: #1C3F3A -> B: 0x3A, G: 0x3F, R: 0x1C
    // Gold:  #C5A880 -> B: 0x80, G: 0xA8, R: 0xC5
    // Dark Green: #112825 -> B: 0x25, G: 0x28, R: 0x11

    for (let y = 0; y < height; y++) {
      // In BMP, row 0 is the bottom row
      const actualY = height - 1 - y;
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const dx = x - centerX;
        const dy = actualY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
          // Circle anti-aliasing edge
          const edgeAlpha = dist > radius - 1 ? Math.max(0, Math.min(1, radius - dist)) : 1.0;
          
          // Outer Gold Rim (thin circle)
          if (dist >= innerRadius + (width * 0.04)) {
            // Gold Border
            pixelData[idx + 0] = 0x80; // B
            pixelData[idx + 1] = 0xA8; // G
            pixelData[idx + 2] = 0xC5; // R
            pixelData[idx + 3] = Math.round(255 * edgeAlpha); // A
          } else {
            // Check if inside central Almond / "S" Leaf Motif
            // Almond shape centered vertically
            const ny = (actualY - centerY) / (radius * 0.75); // -1 to 1
            const nx = (x - centerX) / (radius * 0.5); // -1 to 1
            
            // Equation for almond / lens: nx^2 + (ny^2) <= 0.6 && custom shape
            const isAlmond = (nx * nx + ny * ny <= 0.6) && (Math.abs(nx) < (1 - ny * ny * 0.8) * 0.65);
            
            if (isAlmond) {
              // Gold almond center
              pixelData[idx + 0] = 0x80; // B
              pixelData[idx + 1] = 0xA8; // G
              pixelData[idx + 2] = 0xC5; // R
              pixelData[idx + 3] = Math.round(255 * edgeAlpha);
            } else {
              // Deep Forest Green background
              pixelData[idx + 0] = 0x3A; // B
              pixelData[idx + 1] = 0x3F; // G
              pixelData[idx + 2] = 0x1C; // R
              pixelData[idx + 3] = Math.round(255 * edgeAlpha);
            }
          }
        } else {
          // Transparent outside circle
          pixelData[idx + 0] = 0;
          pixelData[idx + 1] = 0;
          pixelData[idx + 2] = 0;
          pixelData[idx + 3] = 0;
        }
      }
    }

    const imageSize = bih.length + pixelData.length + andMask.length;
    const imageBuf = Buffer.concat([bih, pixelData, andMask]);
    imageBuffers.push(imageBuf);

    // ICONDIRENTRY (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width === 256 ? 0 : width, 0); // bWidth
    entry.writeUInt8(height === 256 ? 0 : height, 1); // bHeight
    entry.writeUInt8(0, 2); // bColorCount
    entry.writeUInt8(0, 3); // bReserved
    entry.writeUInt16LE(1, 4); // wPlanes
    entry.writeUInt16LE(32, 6); // wBitCount
    entry.writeUInt32LE(imageSize, 8); // dwBytesInRes
    entry.writeUInt32LE(currentOffset, 12); // dwImageOffset
    entries.push(entry);

    currentOffset += imageSize;
  }

  // ICONDIR header (6 bytes)
  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0); // idReserved
  iconDir.writeUInt16LE(1, 2); // idType (1 = ICO)
  iconDir.writeUInt16LE(numImages, 4); // idCount

  return Buffer.concat([iconDir, ...entries, ...imageBuffers]);
}

const icoBuffer = createIco([16, 32, 48, 64]);

// Write to src/app/favicon.ico and public/favicon.ico
fs.writeFileSync(path.join(__dirname, "../src/app/favicon.ico"), icoBuffer);
fs.writeFileSync(path.join(__dirname, "../public/favicon.ico"), icoBuffer);

// Copy SVG to public as well
const svgContent = fs.readFileSync(path.join(__dirname, "../src/app/icon.svg"));
fs.writeFileSync(path.join(__dirname, "../public/icon.svg"), svgContent);
fs.writeFileSync(path.join(__dirname, "../public/apple-icon.svg"), svgContent);

console.log("Successfully generated ShubhMewa favicon.ico and copied icon assets!");
