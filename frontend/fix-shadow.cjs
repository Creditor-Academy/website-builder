const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components', 'sections');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let total = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Replace hardcoded boxShadow: '...' with boxShadow: 'var(--shadow, ...)'
  newContent = newContent.replace(/boxShadow:\s*'([^']+)'/g, (match, val) => {
    if (val.startsWith('var(')) return match;
    return 'boxShadow: \'var(--shadow, ' + val + ')\'';
  });
  
  // Also inline assignments e.g. e.currentTarget.style.boxShadow = '...'
  newContent = newContent.replace(/boxShadow\s*=\s*'([^']+)'/g, (match, val) => {
    if (val.startsWith('var(')) return match;
    return 'boxShadow = \'var(--shadow, ' + val + ')\'';
  });

  // Similarly for transition speeds, we want transition to use var(--animation-speed)
  // Let's find transition inline styles. The user says "like color palattes make global fx control and fx presets working"
  // If we just add 'global-transition' class where there are standard cards, it's easier.

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Fixed shadows in', file);
    total++;
  }
});

console.log('Total files fixed:', total);
