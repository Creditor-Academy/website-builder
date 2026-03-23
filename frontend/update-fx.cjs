const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components', 'sections');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let totalUpdated = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace styles.borderRadius || '...px'  with  styles.borderRadius || 'var(--radius, ...px)'
  // using regex that handles different pixel values
  content = content.replace(/styles\.borderRadius\s*\|\|\s*'(\d+px)'/g, 'styles.borderRadius || \'var(--radius, $1)\'');
  
  // also handle standard cases where we want to map fallback string to var(--radius, string)
  content = content.replace(/styles\.borderRadius\s*\|\|\s*'([^']+)'/g, (match, p1) => {
    if (p1.startsWith('var(')) return match; // skip if already var
    return `styles.borderRadius || 'var(--radius, ${p1})'`;
  });

  // Ensure cardBackground colors map to global vars ? Optional.
  // We want glass effect everywhere based on a context flag, but DesignSystemPanel has 'glassmorphism'

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
    totalUpdated++;
  }
});

console.log('Done! Total updated:', totalUpdated);
