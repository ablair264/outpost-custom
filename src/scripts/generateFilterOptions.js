const fs = require('fs');
const path = require('path');

// Common fabric materials to extract
const COMMON_MATERIALS = [
  'Cotton', 'Polyester', 'Wool', 'Denim', 'Fleece', 'Canvas',
  'Merino', 'Terry Cloth', 'Jersey', 'Teddy', 'Corduroy', 'Leather',
  'Twill', 'French Terry', 'Silk', 'Linen', 'Nylon', 'Viscose',
  'Acrylic', 'Spandex', 'Elastane', 'Polyamide', 'Modal', 'Bamboo',
  'Cashmere', 'Velvet', 'Satin', 'Chiffon', 'Organza', 'Tulle',
  'Lycra', 'Rayon', 'Hemp', 'Alpaca', 'Angora', 'Mohair',
  'Polypropylene', 'Gore-Tex', 'Neoprene', 'Mesh', 'Taffeta',
  'Suede', 'PU', 'PVC', 'EVA', 'Ripstop', 'Microfibre',
  'Softshell', 'Hardshell', 'Sherpa', 'Velour', 'Camel', 'Tricot',
  'Ottoman', 'Piqué', 'Chambray', 'Oxford', 'Poplin', 'Gabardine',
  'Scuba', 'Ponte', 'Crepe', 'Georgette', 'Brocade', 'Damask'
];

function extractMaterialsFromCSV(csvPath) {
  const materials = new Set();
  
  try {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const fabricText = line.toLowerCase();
      
      COMMON_MATERIALS.forEach(material => {
        // Check if the material appears in the fabric description
        const regex = new RegExp(`\\b${material.toLowerCase()}\\b`, 'i');
        if (regex.test(fabricText)) {
          materials.add(material);
        }
      });
      
      // Special cases for compound materials
      if (fabricText.includes('organic cotton')) {
        materials.add('Organic Cotton');
      }
      if (fabricText.includes('recycled polyester')) {
        materials.add('Recycled Polyester');
      }
      if (fabricText.includes('recycled cotton')) {
        materials.add('Recycled Cotton');
      }
      if (fabricText.includes('merino wool')) {
        materials.add('Merino Wool');
      }
      if (fabricText.includes('french terry')) {
        materials.add('French Terry');
      }
      if (fabricText.includes('terry cloth')) {
        materials.add('Terry Cloth');
      }
    });
  } catch (error) {
    console.error('Error reading fabric CSV:', error);
  }
  
  return Array.from(materials).sort();
}

function extractCategoriesFromCSV(csvPath) {
  const categories = new Set();
  
  try {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      // Split by pipe character
      const cats = line.split('|');
      
      cats.forEach(cat => {
        const trimmedCat = cat.trim();
        if (trimmedCat && trimmedCat.length > 2) {
          // Filter out very specific or promotional categories
          if (!trimmedCat.includes('Top 1000') && 
              !trimmedCat.includes('DM') &&
              !trimmedCat.includes('Raladeal') &&
              !trimmedCat.includes('Edge -') &&
              !trimmedCat.includes('New in') &&
              !trimmedCat.includes('New Styles') &&
              !trimmedCat.includes('New Colours') &&
              !trimmedCat.includes('New Sizes') &&
              !trimmedCat.includes('Latest Additions') &&
              !trimmedCat.includes('Must Haves') &&
              !trimmedCat.includes('Exclusives') &&
              !trimmedCat.includes('On Raladeal') &&
              !trimmedCat.includes('Whole Style') &&
              !trimmedCat.includes('Just Arrived') &&
              !trimmedCat.match(/^\d+/) && // Skip numeric categories
              !trimmedCat.includes(' - ')) { // Skip categories with dashes (usually subcategories)
            categories.add(trimmedCat);
          }
        }
      });
    });
  } catch (error) {
    console.error('Error reading categorisation CSV:', error);
  }
  
  return Array.from(categories).sort();
}

// Run the extraction
const fabricPath = path.join(__dirname, '../../fabric.csv');
const categorisationPath = path.join(__dirname, '../../categorisation.csv');

const materials = extractMaterialsFromCSV(fabricPath);
const categories = extractCategoriesFromCSV(categorisationPath);

console.log('\n=== EXTRACTED MATERIALS ===');
console.log(JSON.stringify(materials, null, 2));
console.log(`\nTotal materials: ${materials.length}`);

console.log('\n\n=== EXTRACTED CATEGORIES ===');
console.log(JSON.stringify(categories, null, 2));
console.log(`\nTotal categories: ${categories.length}`);

// Write to a JSON file for easy import
const output = {
  materials,
  categories
};

fs.writeFileSync(
  path.join(__dirname, '../../src/data/filterOptions.json'),
  JSON.stringify(output, null, 2)
);

console.log('\n\nFilter options saved to src/data/filterOptions.json');