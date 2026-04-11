const fs = require('fs');
const filesToFix = [
  'src/app/client/anticipate/page.tsx',
  'src/app/client/occupancy/page.tsx',
  'src/app/client/dashboard/page.tsx',
  'src/app/admin/tenants/page.tsx',
  'src/app/admin/sales/page.tsx',
  'src/app/admin/inventory/page.tsx',
  'src/app/admin/audit/page.tsx',
  'src/app/admin/anticipate/page.tsx',
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
  // Remove standalone AuthProvider import line
  c = c.replace(/import \{ AuthProvider \} from '@\/lib\/auth';\r?\n/g, '');
  // Remove AuthProvider tags
  c = c.replace(/<AuthProvider>/g, '');
  c = c.replace(/<\/AuthProvider>/g, '');
  // Fix broken export lines that now have dangling parens: return ();
  c = c.replace(/return\s*\(\s*\);?\s*$(?![\s\S]*=)/gm, '');
  // Fix inline-export lines like: export default function Foo() { return <Comp />; }
  c = c.replace(/\{ return (<[^\n]+\/>); \}/g, '{ return $1; }');
  if (c !== orig) {
    fs.writeFileSync(p, c, 'utf8');
    console.log('FIXED:', f);
  } else {
    console.log('NO CHANGE:', f);
  }
});
console.log('All done');
