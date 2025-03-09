const fs = require('fs');
const path = require('path');
const svg2png = require('svg2png');

// Simple pixel art icon for calendar
// This is a very basic representation in text that we'll convert to an image
const iconTemplate = `
.....BBBBBB.....
...BBRRRRRRBB...
..BRRRRRRRRRRB..
.BRRRWWWWWWRRRB.
.BRWWBBBBBWWRB.
.BRWB.....BWRB.
.BRWB.....BWRB.
.BRWB..B..BWRB.
.BRWB.....BWRB.
.BRWB.....BWRB.
.BRWBBBBBBBWRB.
.BRWWWWWWWWWRB.
.BRRRRRRRRRRRB.
..BRRRRRRRRRRB..
...BBRRRRRRBB...
.....BBBBBB.....
`;

const trayIconTemplate = `
...BBBB...
..BRRRRB..
.BRWWWWRB.
.BRWBBWRB.
.BRW..WRB.
.BRW..WRB.
.BRWWWWRB.
.BRRRRRRB.
..BRRRRB..
...BBBB...
`;

// Function to convert text template to SVG
function generateSVG(template, filename, pixelSize = 10) {
  const lines = template.trim().split('\n');
  const width = lines[0].length * pixelSize;
  const height = lines.length * pixelSize;

  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Color mapping
  const colors = {
    '.': 'none',  // transparent
    'B': 'black', // black border
    'R': 'red',   // red background
    'W': 'white'  // white calendar paper
  };
  
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const color = colors[line[x]] || 'none';
      if (color !== 'none') {
        svgContent += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
      }
    }
  }
  
  svgContent += '</svg>';
  const svgPath = path.join(__dirname, filename);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Generated ${filename}`);
  
  return svgPath;
}

// Function to convert SVG to PNG
async function convertToPng(svgPath, pngFilename, scale = 1) {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    const pngBuffer = await svg2png(svgBuffer, { scale: scale });
    const pngPath = path.join(__dirname, pngFilename);
    fs.writeFileSync(pngPath, pngBuffer);
    console.log(`Generated ${pngFilename}`);
  } catch (err) {
    console.error('Error converting SVG to PNG:', err);
  }
}

// Generate SVGs and then convert to PNGs
async function generateIcons() {
  const iconSvgPath = generateSVG(iconTemplate, 'icon.svg', 10);
  const trayIconSvgPath = generateSVG(trayIconTemplate, 'tray-icon.svg', 10);
  
  // Create icons at different scales for different use cases
  await convertToPng(iconSvgPath, 'icon.png', 2);
  await convertToPng(trayIconSvgPath, 'tray-icon.png', 2);
  
  // Make additional sizes for app icon
  await convertToPng(iconSvgPath, 'icon@2x.png', 4);
  
  console.log('Icon generation complete.');
}

// Run the icon generator
generateIcons().catch(console.error); 
