const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Digi Dice Roller - Asset Generator Utility (2026)
 * 
 * Usage: node scripts/generate-assets.js <path-to-logo>
 * Example: node scripts/generate-assets.js ./dicelogo.png
 */

const LOGO_INPUT = process.argv[2];
const ASSETS_DIR = path.join(__dirname, '../assets/images');

// Standard Expo/Play Store required dimensions
const TARGETS = [
  { name: 'icon.png', size: 1024 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'splash-icon.png', size: 200 },
  { name: 'favicon.png', size: 48 },
];

function generateAssets() {
  if (!LOGO_INPUT) {
    console.error('❌ Error: Please provide an input logo file path.');
    console.log('Usage: node scripts/generate-assets.js <path-to-logo>');
    process.exit(1);
  }

  if (!fs.existsSync(LOGO_INPUT)) {
    console.error(`❌ Error: Input file "${LOGO_INPUT}" not found.`);
    process.exit(1);
  }

  // Ensure assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log(`📂 Creating assets directory: ${ASSETS_DIR}`);
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  console.log('🚀 Starting Digi Dice Roller Asset Generation...');
  console.log('--------------------------------------------');

  try {
    // Check if ffmpeg is installed
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch (err) {
    console.error('❌ Error: ffmpeg is not installed or not in your PATH.');
    process.exit(1);
  }

  TARGETS.forEach((target) => {
    const outputPath = path.join(ASSETS_DIR, target.name);
    console.log(`🎨 Generating ${target.name} (${target.size}x${target.size})...`);
    
    try {
      // Use lanczos scaling for high quality upscaling/downscaling
      const cmd = `ffmpeg -i "${LOGO_INPUT}" -vf "scale=${target.size}:${target.size}" -sws_flags lanczos -hide_banner -loglevel error -y "${outputPath}"`;
      execSync(cmd);
      console.log(`   ✅ Success: ${target.name}`);
    } catch (err) {
      console.error(`   ❌ Failed: ${target.name}`);
      console.error(err.message);
    }
  });

  console.log('--------------------------------------------');
  console.log('✨ All assets generated successfully in assets/images/');
}

generateAssets();
