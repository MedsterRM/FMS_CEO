// FMS CEO · junta src/ en un único index.html (CSS, JS, imágenes y fuentes incluidos)
//   node scripts/build.js          -> escribe index.html
//   node scripts/build.js --check  -> solo comprueba que index.html está al día
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'index.html');
const MIME = { '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };

function build(){
  let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  // {{include:css/x.css}} ocupa una línea entera y se sustituye por el archivo tal cual
  html = html.replace(/^\{\{include:([^}]+)\}\}\n/gm, (_, f) => fs.readFileSync(path.join(SRC, f), 'utf8'));
  // {{asset:faces/x.jpg}} -> data:image/jpeg;base64,...
  html = html.replace(/\{\{asset:([^}]+)\}\}/g, (_, f) => {
    const mime = MIME[path.extname(f)];
    if (!mime) throw new Error(`Tipo de archivo no soportado: ${f}`);
    return `data:${mime};base64,` + fs.readFileSync(path.join(SRC, 'assets', f)).toString('base64');
  });
  return html;
}

const html = build();
if (process.argv.includes('--check')) {
  const same = fs.existsSync(OUT) && fs.readFileSync(OUT, 'utf8') === html;
  console.log(same ? 'index.html está al día.' : 'index.html no coincide con src/: ejecuta "npm run build".');
  process.exit(same ? 0 : 1);
}
fs.writeFileSync(OUT, html);
console.log(`index.html generado (${(Buffer.byteLength(html) / 1048576).toFixed(1)} MB).`);
