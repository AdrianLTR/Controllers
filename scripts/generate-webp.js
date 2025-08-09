#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'images');
const targetExts = ['.jpg', '.jpeg', '.png'];

async function convertImage(file) {
  const ext = path.extname(file).toLowerCase();
  if(!targetExts.includes(ext)) return;
  const base = path.basename(file, ext);
  const inputPath = path.join(imagesDir, file);
  const outputPath = path.join(imagesDir, base + '.webp');
  if(fs.existsSync(outputPath)) {
    console.log('Skip (exists):', outputPath);
    return;
  }
  try {
    await sharp(inputPath)
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);
    const orig = fs.statSync(inputPath).size;
    const webp = fs.statSync(outputPath).size;
    const saving = (((orig - webp) / orig) * 100).toFixed(1);
    console.log(`OK: ${file} -> ${path.basename(outputPath)} (${saving}% ahorro)`);
  } catch (e) {
    console.error('Error converting', file, e.message);
  }
}

(async ()=> {
  const files = fs.readdirSync(imagesDir);
  for(const f of files) {
    await convertImage(f);
  }
})();
