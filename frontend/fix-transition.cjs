const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components', 'sections');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let total = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Replace hardcoded transition durations in inline styles
  // e.g. transition: 'transform 0.22s ease' -> transition: 'transform var(--animation-speed, 0.22s) ease'
  newContent = newContent.replace(/transition:\s*'([^']+)'/g, (match, val) => {
    if (val.includes('var(--animation-speed')) return match;
    // val might be "opacity 0.22s ease" or "transform 0.2s ease, opacity 0.3s"
    // Let's replace any \d\.\d+s or \ds with var(--animation-speed, $&)
    let newVal = val.replace(/\b\d*\.?\d+s\b/g, (duration) => `var(--animation-speed, ${duration})`);
    return `transition: '${newVal}'`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Fixed transitions in', file);
    total++;
  }
});

console.log('Total files fixed transitions:', total);
