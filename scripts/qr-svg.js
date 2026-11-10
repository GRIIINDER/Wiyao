#!/usr/bin/env node
"use strict";

/**
 * QR code en SVG, sans dépendance npm (2026-11-10, affiche pour les lycées).
 *
 * Encodage octet, niveau de correction Q (25 % du code peut être abîmé ou
 * sali sans gêner la lecture, utile pour une affiche), version choisie au
 * plus petit, masque choisi par les pénalités de la norme ISO/IEC 18004.
 * Construction calquée sur le générateur de référence de Project Nayuki
 * (licence MIT), réécrite ici.
 *
 * Avant d'écrire le SVG, le script relit le code produit indépendamment de
 * la construction : informations de format (code BCH), syndromes
 * Reed-Solomon de chaque bloc, puis décodage des données, qui doivent
 * redonner exactement le texte de départ. Sinon : code de sortie 1.
 * Scanner quand même le résultat avec un téléphone avant d'imprimer.
 *
 * Usage : node scripts/qr-svg.js "https://wiyao.vercel.app/test-orientation.html" > qr.svg
 * Options : --color=#0b3a2c (couleur des modules, vert nuit par défaut)
 */

const ECC_Q = { name: "Q", formatBits: 3 };
// Norme, tableaux 9 et 13 : octets de correction par bloc et nombre de blocs (niveau Q).
const ECC_PER_BLOCK_Q = [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24];
const NUM_BLOCKS_Q = [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8];

function getBit(x, i) {
  return ((x >>> i) & 1) !== 0;
}

function numRawDataModules(ver) {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

function numDataCodewords(ver) {
  return Math.floor(numRawDataModules(ver) / 8) - ECC_PER_BLOCK_Q[ver] * NUM_BLOCKS_Q[ver];
}

// Corps de Galois GF(2^8), polynôme 0x11D.
function gfMul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function rsDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data, divisor) {
  const result = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    divisor.forEach((coef, i) => {
      result[i] ^= gfMul(coef, factor);
    });
  }
  return result;
}

function alignmentPositions(ver, size) {
  if (ver === 1) return [];
  const numAlign = Math.floor(ver / 7) + 2;
  const step = Math.floor((ver * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2;
  const result = [];
  for (let i = 0; i < numAlign - 1; i++) result.push(size - 7 - i * step);
  result.push(6);
  return result.reverse();
}

function encode(text) {
  const bytes = Array.from(Buffer.from(text, "utf8"));
  // Versions 1 à 6 seulement : à partir de la 7, la norme ajoute un bloc
  // « informations de version » que ce générateur ne dessine pas. La
  // version 6 au niveau Q contient 74 octets, bien assez pour une adresse.
  let ver = 1;
  for (; ver <= 6; ver++) {
    if (4 + 8 + bytes.length * 8 <= numDataCodewords(ver) * 8) break;
  }
  if (ver > 6) throw new Error("Texte trop long pour ce générateur (74 octets au plus).");
  const size = ver * 4 + 17;
  const capacityBits = numDataCodewords(ver) * 8;

  // Flux de bits : mode octet (0100), longueur sur 8 bits, données, terminateur, remplissage.
  const bits = [];
  const push = (val, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  push(0x4, 4);
  push(bytes.length, 8);
  bytes.forEach((b) => push(b, 8));
  push(0, Math.min(4, capacityBits - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) push(pad, 8);
  const dataCodewords = [];
  for (let i = 0; i < bits.length; i += 8) dataCodewords.push(parseInt(bits.slice(i, i + 8).join(""), 2));

  // Blocs, correction Reed-Solomon et entrelacement.
  const numBlocks = NUM_BLOCKS_Q[ver];
  const blockEccLen = ECC_PER_BLOCK_Q[ver];
  const rawCodewords = Math.floor(numRawDataModules(ver) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);
  const divisor = rsDivisor(blockEccLen);
  const blocks = [];
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dat = dataCodewords.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
    k += dat.length;
    const block = dat.concat(rsRemainder(dat, divisor));
    if (i < numShortBlocks) block.splice(dat.length, 0, null); // case vide pour aligner les blocs courts
    blocks.push(block);
  }
  const allCodewords = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block) => {
      if (block[i] !== null) allCodewords.push(block[i]);
    });
  }

  // Motifs fixes.
  const modules = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction = Array.from({ length: size }, () => new Array(size).fill(false));
  const setF = (x, y, dark) => {
    modules[y][x] = dark;
    isFunction[y][x] = true;
  };
  for (let i = 0; i < size; i++) {
    setF(6, i, i % 2 === 0);
    setF(i, 6, i % 2 === 0);
  }
  const finder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          setF(x, y, dist !== 2 && dist !== 4);
        }
      }
    }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);
  const align = alignmentPositions(ver, size);
  align.forEach((ay, i) => {
    align.forEach((ax, j) => {
      const corner = (i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0);
      if (corner) return;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) setF(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    });
  });
  const drawFormat = (mask) => {
    const data = (ECC_Q.formatBits << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const fbits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) setF(8, i, getBit(fbits, i));
    setF(8, 7, getBit(fbits, 6));
    setF(8, 8, getBit(fbits, 7));
    setF(7, 8, getBit(fbits, 8));
    for (let i = 9; i < 15; i++) setF(14 - i, 8, getBit(fbits, i));
    for (let i = 0; i < 8; i++) setF(size - 1 - i, 8, getBit(fbits, i));
    for (let i = 8; i < 15; i++) setF(8, size - 15 + i, getBit(fbits, i));
    setF(8, size - 8, true);
  };
  drawFormat(0); // réserve les cases ; les vraies valeurs viennent après le choix du masque

  // Placement des octets en zigzag, deux colonnes à la fois, de bas en haut puis de haut en bas.
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x] && bitIndex < allCodewords.length * 8) {
          modules[y][x] = getBit(allCodewords[bitIndex >>> 3], 7 - (bitIndex & 7));
          bitIndex++;
        }
      }
    }
  }

  const maskFn = [
    (x, y) => (x + y) % 2 === 0,
    (x, y) => y % 2 === 0,
    (x) => x % 3 === 0,
    (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
    (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ];
  const applyMask = (m) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!isFunction[y][x] && maskFn[m](x, y)) modules[y][x] = !modules[y][x];
      }
    }
  };

  const penalty = () => {
    let score = 0;
    const lines = [];
    for (let y = 0; y < size; y++) lines.push(modules[y].slice());
    for (let x = 0; x < size; x++) lines.push(modules.map((row) => row[x]));
    lines.forEach((line) => {
      let run = 1;
      for (let i = 1; i <= line.length; i++) {
        if (i < line.length && line[i] === line[i - 1]) run++;
        else {
          if (run >= 5) score += 3 + (run - 5);
          run = 1;
        }
      }
      const s = line.map((v) => (v ? "1" : "0")).join("");
      for (const pat of ["10111010000", "00001011101"]) {
        for (let i = s.indexOf(pat); i !== -1; i = s.indexOf(pat, i + 1)) score += 40;
      }
    });
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const c = modules[y][x];
        if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) score += 3;
      }
    }
    let dark = 0;
    modules.forEach((row) => row.forEach((v) => { if (v) dark++; }));
    const total = size * size;
    score += Math.floor(Math.abs(dark * 20 - total * 10) / total) * 10;
    return score;
  };

  let best = -1;
  let bestScore = Infinity;
  for (let m = 0; m < 8; m++) {
    applyMask(m);
    drawFormat(m);
    const s = penalty();
    if (s < bestScore) {
      bestScore = s;
      best = m;
    }
    applyMask(m); // annule (le masque est un ou exclusif)
  }
  applyMask(best);
  drawFormat(best);
  return { ver, size, mask: best, modules };
}

// ---- Relecture indépendante du code produit ----
function verify(qr, text) {
  const { size, modules } = qr;
  const ver = (size - 17) / 4;

  // 1. Format : 15 bits lus autour du repère en haut à gauche, comparés aux 32 mots BCH valides.
  let read = 0;
  const fmtCells = [];
  for (let i = 0; i <= 5; i++) fmtCells.push([8, i]);
  fmtCells.push([8, 7], [8, 8], [7, 8]);
  for (let i = 9; i < 15; i++) fmtCells.push([14 - i, 8]);
  fmtCells.forEach(([x, y], i) => { if (modules[y][x]) read |= 1 << i; });
  let fmt = null;
  for (let d = 0; d < 32; d++) {
    let rem = d;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    if ((((d << 10) | rem) ^ 0x5412) === read) fmt = d;
  }
  if (fmt === null) throw new Error("format illisible");
  if (fmt >> 3 !== ECC_Q.formatBits) throw new Error("niveau de correction inattendu");
  const mask = fmt & 7;

  // 2. Carte des motifs fixes, recalculée ici depuis la norme (pas reprise de l'encodeur).
  const fixed = Array.from({ length: size }, () => new Array(size).fill(false));
  const mark = (x0, y0, w, h) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (x >= 0 && y >= 0 && x < size && y < size) fixed[y][x] = true;
  };
  mark(0, 0, 9, 9);
  mark(size - 8, 0, 8, 9);
  mark(0, size - 8, 9, 8);
  mark(6, 0, 1, size);
  mark(0, 6, size, 1);
  const pos = alignmentPositions(ver, size);
  pos.forEach((ay) => pos.forEach((ax) => {
    if ((ax === 6 && ay === 6) || (ax === 6 && ay === size - 7) || (ax === size - 7 && ay === 6)) return;
    mark(ax - 2, ay - 2, 5, 5);
  }));
  const masks = [
    (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ];

  // 3. Lecture en zigzag, sans masque.
  const stream = [];
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    const upward = ((right + 1) & 2) === 0;
    for (let v = 0; v < size; v++) {
      const y = upward ? size - 1 - v : v;
      for (const x of [right, right - 1]) {
        if (!fixed[y][x]) stream.push(modules[y][x] !== masks[mask](x, y) ? 1 : 0);
      }
    }
  }
  const rawCodewords = Math.floor(numRawDataModules(ver) / 8);
  const codewords = [];
  for (let i = 0; i < rawCodewords; i++) codewords.push(parseInt(stream.slice(i * 8, i * 8 + 8).join(""), 2));

  // 4. Désentrelacement et syndromes Reed-Solomon (tous nuls si le bloc est intact).
  const numBlocks = NUM_BLOCKS_Q[ver];
  const ecc = ECC_PER_BLOCK_Q[ver];
  const numShort = numBlocks - (rawCodewords % numBlocks);
  const shortLen = Math.floor(rawCodewords / numBlocks);
  const dataLens = Array.from({ length: numBlocks }, (_, i) => shortLen - ecc + (i < numShort ? 0 : 1));
  const blocks = dataLens.map(() => []);
  let k = 0;
  const maxData = Math.max(...dataLens);
  for (let i = 0; i < maxData; i++) for (let b = 0; b < numBlocks; b++) if (i < dataLens[b]) blocks[b].push(codewords[k++]);
  for (let i = 0; i < ecc; i++) for (let b = 0; b < numBlocks; b++) blocks[b].push(codewords[k++]);
  let data = [];
  blocks.forEach((block, b) => {
    let alpha = 1;
    for (let s = 0; s < ecc; s++) {
      let acc = 0;
      block.forEach((c) => { acc = gfMul(acc, alpha) ^ c; });
      if (acc !== 0) throw new Error("syndrome non nul dans le bloc " + b);
      alpha = gfMul(alpha, 2);
    }
    data = data.concat(block.slice(0, dataLens[b]));
  });

  // 5. Données : mode octet, longueur, octets.
  const bits = data.map((c) => c.toString(2).padStart(8, "0")).join("");
  if (bits.slice(0, 4) !== "0100") throw new Error("mode inattendu");
  const len = parseInt(bits.slice(4, 12), 2);
  const out = [];
  for (let i = 0; i < len; i++) out.push(parseInt(bits.slice(12 + i * 8, 20 + i * 8), 2));
  const decoded = Buffer.from(out).toString("utf8");
  if (decoded !== text) throw new Error("texte relu différent : " + decoded);
  return { mask, decoded };
}

function toSvg(qr, color) {
  const quiet = 4;
  const dim = qr.size + quiet * 2;
  let path = "";
  qr.modules.forEach((row, y) => row.forEach((dark, x) => {
    if (dark) path += `M${x + quiet},${y + quiet}h1v1h-1z`;
  }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges" role="img">` +
    `<rect width="${dim}" height="${dim}" fill="#ffffff"/><path d="${path}" fill="${color}"/></svg>\n`;
}

if (require.main === module) {
  const text = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const colorArg = process.argv.find((a) => a.startsWith("--color="));
  const color = colorArg ? colorArg.slice(8) : "#0b3a2c";
  if (!text) {
    console.error('Usage : node scripts/qr-svg.js "texte ou adresse" [--color=#0b3a2c] > qr.svg');
    process.exit(1);
  }
  const qr = encode(text);
  try {
    const check = verify(qr, text);
    console.error(`QR version ${qr.ver} (${qr.size}×${qr.size}), niveau Q, masque ${qr.mask} : relu « ${check.decoded} ».`);
  } catch (e) {
    console.error("Relecture du QR code en échec : " + e.message);
    process.exit(1);
  }
  process.stdout.write(toSvg(qr, color));
}

module.exports = { encode, verify, toSvg };
