const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components', 'sections');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let totalUpdated = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Revert the messed up ones 
  // e.g. 'var(--radius, c:/Users/nihar/OneDrive/Documents/GitHub/website-builder/frontend/src1)'
  // We want to just find any `var(--radius, c:/...src1)` and replace it with `var(--radius, 16px)` as a general fallback
  content = content.replace(/var\(--radius,\s*c:[^)]+\)/g, "var(--radius, 16px)");

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + file);
    totalUpdated++;
  }
});

console.log('Done! Total fixed:', totalUpdated);
