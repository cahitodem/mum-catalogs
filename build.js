const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const catalogRoot = path.join(root, 'catalog');
const metaRoot = path.join(root, 'meta');

function fail(message) {
  console.error(`Catalog validation failed: ${message}`);
  process.exitCode = 1;
}

fs.rmSync(catalogRoot, { recursive: true, force: true });
fs.rmSync(metaRoot, { recursive: true, force: true });

for (const catalog of manifest.catalogs) {
  if (!['movie', 'series'].includes(catalog.type)) {
    fail(`Unsupported type "${catalog.type}" in ${catalog.id}`);
    continue;
  }
  if (!/^[a-z0-9-]+$/.test(catalog.id)) {
    fail(`Unsafe catalog id "${catalog.id}"`);
    continue;
  }

  const dataPath = path.join(root, 'data', `${catalog.id}.json`);
  if (!fs.existsSync(dataPath)) {
    fail(`Missing data file: data/${catalog.id}.json`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in data/${catalog.id}.json: ${error.message}`);
    continue;
  }

  if (!Array.isArray(data.items)) {
    fail(`data/${catalog.id}.json must contain an items array`);
    continue;
  }

  const seen = new Set();
  const metas = [];
  for (const [index, item] of data.items.entries()) {
    if (!item || typeof item !== 'object') {
      fail(`Item ${index + 1} in ${catalog.id} must be an object`);
      continue;
    }
    if (!/^tt\d+$/.test(item.id || '')) {
      fail(`Item ${index + 1} in ${catalog.id} needs a valid IMDb ID (tt followed by digits)`);
      continue;
    }
    if (typeof item.name !== 'string' || !item.name.trim()) {
      fail(`Item ${item.id} in ${catalog.id} needs a non-empty name`);
      continue;
    }
    if (seen.has(item.id)) {
      fail(`Duplicate IMDb ID ${item.id} in ${catalog.id}`);
      continue;
    }
    seen.add(item.id);

    const poster = item.poster || `https://images.metahub.space/poster/medium/${item.id}/img`;
    if (typeof poster !== 'string' || !poster.startsWith('https://')) {
      fail(`Item ${item.id} in ${catalog.id} needs an HTTPS poster URL`);
      continue;
    }

    const meta = { id: item.id, type: catalog.type, name: item.name.trim(), poster };
    if (Number.isInteger(item.year) && item.year > 1800 && item.year < 2200) meta.year = item.year;
    metas.push(meta);

    // Meta resource detayları
    const metaDetails = {
      id: item.id,
      type: catalog.type,
      name: item.name.trim(),
      poster: poster,
      background: item.background || poster,
      description: item.description || `${catalog.name} orijinal içeriği.`,
      genres: item.genres || [catalog.type === 'movie' ? 'Film' : 'Dizi', catalog.name.split(' ')[0]]
    };
    if (meta.year) metaDetails.year = meta.year;

    const metaDirs = [
      path.join(root, 'meta', catalog.type),
      path.join(catalogRoot, 'meta', catalog.type)
    ];
    for (const mDir of metaDirs) {
      fs.mkdirSync(mDir, { recursive: true });
      fs.writeFileSync(
        path.join(mDir, `${item.id}.json`),
        `${JSON.stringify({ meta: metaDetails }, null, 2)}\n`,
        'utf8'
      );
    }
  }

  const outputDir = path.join(catalogRoot, catalog.type);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, `${catalog.id}.json`),
    `${JSON.stringify({ metas }, null, 2)}\n`,
    'utf8'
  );
}

if (!process.exitCode) {
  console.log(`Built ${manifest.catalogs.length} catalogs and metadata endpoints: ${manifest.catalogs.map(({ id }) => id).join(', ')}`);
}
