const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components', 'sections');
const files = fs.readdirSync(dir);
let count = 0;
files.forEach(f => {
  if (!f.endsWith('.tsx')) return;
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  let regex = /<([a-zA-Z0-9]+)([\s\S]*?contentEditable[\s\S]*?)>\s*\{([^{}<]+)\}\s*<\/\1>/g;
  let newC = c.replace(regex, '<$1$2 dangerouslySetInnerHTML={{ __html: $3 }} />');
  if (c !== newC) {
    fs.writeFileSync(p, newC);
    console.log('Updated ' + f);
    count++;
  }
});
console.log('Total files updated: ' + count);
