const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function drawIcon(canvas, size) {
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');

  // Rounded rectangle background
  const radius = size * 0.22;
  ctx.beginPath();
  roundRect(ctx, 0, 0, size, size, radius);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Chat bubble 1 (left, main)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  const b1x = size * 0.12;
  const b1y = size * 0.35;
  const b1w = size * 0.5;
  const b1h = size * 0.35;
  const b1r = size * 0.08;

  ctx.beginPath();
  roundRect(ctx, b1x, b1y, b1w, b1h, b1r);
  ctx.fill();

  // Bubble 1 tail
  ctx.beginPath();
  ctx.moveTo(b1x + size * 0.05, b1y + b1h - size * 0.02);
  ctx.lineTo(b1x - size * 0.02, b1y + b1h + size * 0.08);
  ctx.lineTo(b1x + size * 0.15, b1y + b1h - size * 0.02);
  ctx.fill();

  // Chat bubble 2 (right, secondary)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  const b2x = size * 0.38;
  const b2y = size * 0.22;
  const b2w = size * 0.5;
  const b2h = size * 0.35;
  const b2r = size * 0.08;

  ctx.beginPath();
  roundRect(ctx, b2x, b2y, b2w, b2h, b2r);
  ctx.fill();

  // Bubble 2 tail
  ctx.beginPath();
  ctx.moveTo(b2x + b2w - size * 0.05, b2y + b2h - size * 0.02);
  ctx.lineTo(b2x + b2w + size * 0.02, b2y + b2h + size * 0.08);
  ctx.lineTo(b2x + b2w - size * 0.15, b2y + b2h - size * 0.02);
  ctx.fill();

  // "Hi" text in bubble 1
  ctx.fillStyle = '#667eea';
  ctx.font = `bold ${size * 0.12}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Hi', b1x + b1w / 2, b1y + b1h / 2);

  // Hindi text in bubble 2
  ctx.fillStyle = '#764ba2';
  ctx.font = `bold ${size * 0.08}px Arial`;
  ctx.fillText('Hola', b2x + b2w / 2, b2y + b2h / 2);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

console.log('Generating PWA icons...\n');

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  drawIcon(canvas, size);

  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(outputDir, filename);
  const buffer = canvas.toBuffer('image/png');

  fs.writeFileSync(filepath, buffer);
  console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All icons generated successfully!');
console.log(`📁 Location: ${outputDir}`);
