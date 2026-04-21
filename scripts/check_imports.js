const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir).filter(x => !x.startsWith('.'));
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const root = 'c:/Users/Home/Desktop/madusudan sir/hotelPOS/sns-hotel-pos/src/app';
const files = walk(root);

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('useData(') && !content.includes('import { useData }')) {
    console.log(`MISSING_IMPORT: ${f}`);
  }
});
