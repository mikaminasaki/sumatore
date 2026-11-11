// Run against an untouched original asset directory; output is a separate directory.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require(process.env.PUZZLE_SHARP_PATH || 'sharp');

async function main() {
  const [source, destination] = process.argv.slice(2);
  if (!source || !destination || path.resolve(source) === path.resolve(destination)) {
    throw new Error('Usage: node scripts/export-puzzle-png.cjs <original-directory> <output-directory>');
  }
  const size = 1024;
  const options = { palette: true, colours: 256, quality: 90, dither: 0.7, compressionLevel: 9 };
  await fs.mkdir(destination, { recursive: true });
  for (const course of ['basic', 'practice']) {
    const original = await fs.readFile(path.join(source, `${course}-complete.png`));
    const image = await sharp(original).resize(size, size).ensureAlpha().png().toBuffer();
    for (const suffix of ['complete', 'empty-preview']) {
      await sharp(path.join(source, `${course}-${suffix}.png`))
        .resize(size, size).png(options).toFile(path.join(destination, `${course}-${suffix}.png`));
    }
    const masks = path.join(source, `${course}-masks`);
    const pieces = path.join(destination, `${course}-pieces`);
    await fs.mkdir(pieces, { recursive: true });
    for (const name of (await fs.readdir(masks)).filter(name => name.endsWith('.svg')).sort()) {
      const mask = await sharp(await fs.readFile(path.join(masks, name))).resize(size, size).png().toBuffer();
      const target = path.join(pieces, name.replace(/\.svg$/, '.png'));
      await sharp(image).composite([{ input: mask, blend: 'dest-in' }]).png(options).toFile(target);
      const { data, info } = await sharp(target).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let transparent = 0, visible = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) transparent++;
        if (data[i] > 0) visible++;
      }
      if (info.width !== size || info.height !== size || !transparent || !visible) {
        throw new Error(`Invalid transparent piece: ${target}`);
      }
      console.log(`${course}/${name}: ${info.width}x${info.height}, transparent=${transparent}`);
    }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
