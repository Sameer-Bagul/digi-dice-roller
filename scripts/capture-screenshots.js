const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../assets/screenshots');
const APP_URL = 'http://localhost:8081'; // Default Expo Web port

const DEVICES = [
  { name: 'Phone', width: 1080, height: 1920 },
  { name: 'Tablet_7inch', width: 1200, height: 1920 },
  { name: 'Tablet_10inch', width: 1600, height: 2560 },
];

async function captureScreenshots() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    console.log(`📂 Creating screenshots directory: ${SCREENSHOTS_DIR}`);
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('🚀 Starting Digi Dice Roller Automated Screenshot Capture...');
  console.log('--------------------------------------------');
  
  const browser = await chromium.launch();

  for (const device of DEVICES) {
    console.log(`📸 Capturing ${device.name} (${device.width}x${device.height})...`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: 2, // High resolution
    });

    const page = await context.newPage();
    
    try {
      await page.goto(APP_URL, { waitUntil: 'networkidle' });
      
      // Wait for the app to be ready (dice are visible)
      await page.waitForTimeout(3000); 

      // HIDE THE AD CONTAINER FOR CLEAN SCREENSHOTS
      await page.evaluate(() => {
        // Look for the ad container style we defined (position absolute, bottom 0)
        const adContainers = Array.from(document.querySelectorAll('div, view')).filter(el => {
            const style = window.getComputedStyle(el);
            return style.position === 'absolute' && style.bottom === '0px' && style.height === '60px';
        });
        
        adContainers.forEach(el => el.style.display = 'none');
      });

      // Capture a few variations (optional: you could trigger rolls here)
      // For now, we capture the main state
      const outputPath = path.join(SCREENSHOTS_DIR, `${device.name}_Main.png`);
      await page.screenshot({ path: outputPath });
      
      console.log(`   ✅ Success: ${device.name}_Main.png`);
      
    } catch (err) {
      console.error(`   ❌ Failed: ${device.name}`);
      console.error(err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('--------------------------------------------');
  console.log('✨ All screenshots saved in assets/screenshots/');
  console.log('💡 Note: Make sure your app is running at http://localhost:8081 before starting.');
}

captureScreenshots();
