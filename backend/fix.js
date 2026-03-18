const fs = require('fs');
const files = [
  'src/controllers/admin.controller.ts',
  'src/controllers/auth.controller.ts',
  'src/controllers/order.controller.ts',
  'src/controllers/payment.controller.ts',
  'src/controllers/upload.controller.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/req\.body/g, '(req as any).body');
  content = content.replace(/req\.params/g, '(req as any).params');
  content = content.replace(/req\.query/g, '(req as any).query');
  content = content.replace(/req\.file/g, '(req as any).file');
  content = content.replace(/req\.admin/g, '(req as any).admin');
  content = content.replace(/req\.user/g, '(req as any).user');
  // Also we might have _req, we don't care it is unused.
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
});
