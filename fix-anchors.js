const fs = require('fs');
const filesToFix = [
  'src/app/cashier/dashboard/page.tsx',
  'src/app/inventory/dashboard/page.tsx',
  'src/app/inventory/suppliers/page.tsx',
  'src/app/franchise/inventory/page.tsx',
  'src/app/manager/dashboard/page.tsx',
  'src/app/customer/orders/page.tsx',
  'src/app/customer/bookings/page.tsx',
  'src/app/customer/book/page.tsx',
];
const base = 'c:/Users/Home/Desktop/madusudan sir/hotelPOS/sns-hotel-pos/';
filesToFix.forEach(function(f) {
  var p = base + f;
  if (!fs.existsSync(p)) { console.log('SKIP:', f); return; }
  var c = fs.readFileSync(p, 'utf8');
  var orig = c;
  
  // Need to ensure useRouter is imported
  if (c.includes('<a href=') && !c.includes('useRouter')) {
    if (c.includes('next/navigation')) {
      c = c.replace(/import\s+\{([^}]+)\}\s+from\s+['"]next\/navigation['"]/, 'import { $1, useRouter } from "next/navigation"');
    } else {
      c = c.replace(/import React(?:[^;]+)?;\r?\n/, '$&\nimport { useRouter } from "next/navigation";\n');
    }
  }

  // Find the component function and add router if it doesn't exist
  if (c !== orig && !c.includes('const router = useRouter()')) {
    c = c.replace(/(function \w+\([^\)]*\)\s*\{)/, '$1\n  const router = useRouter();');
  }

  // Replace <a href="PATH"><button.../></button></a> with <button... onClick={() => router.push('PATH')}></button>
  c = c.replace(/<a\s+href=["']([^"']+)["'](?:[^>]*)>\s*(<button[^>]+(?:class|className)=["'][^"']*["'][^>]*)>\s*(.*?)\s*<\/button>\s*<\/a>/g, function(match, url, buttonStart, innerHTML) {
    if (buttonStart.includes('onClick=')) {
        return buttonStart + ' onClick={() => { ' + buttonStart.match(/onClick=\{([^}]+)\}/)[1] + '; router.push("' + url + '"); }}>' + innerHTML + '</button>';
    } else {
        return buttonStart + ' onClick={() => router.push("' + url + '")}>' + innerHTML + '</button>';
    }
  });

  if (c !== orig) {
    fs.writeFileSync(p, c, 'utf8');
    console.log('FIXED ANCOR:', f);
  } else {
    console.log('NO CHANGE:', f);
  }
});
console.log('All done');
