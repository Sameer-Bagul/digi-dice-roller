const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../assets/screenshots');
const APP_URL = 'http://localhost:8081'; 

const SCREENSHOT_CONFIGS = [
  { 
    name: 'Phone_1_Die', 
    device: devices['iPhone 14 Pro Max'],
    actions: async (page) => {
      // Just a base state
    }
  },
  { 
    name: 'Phone_4_Dice', 
    device: devices['iPhone 14 Pro Max'],
    actions: async (page) => {
      // Use getByText for more robust matching
      const diceButton = page.getByText(/DIE|DICE/).first();
      await diceButton.click();
      await page.waitForTimeout(500);
      await page.getByText('4 DICE').click();
    }
  },
  { 
    name: 'Tablet_7inch_Portrait', 
    device: devices['iPad Mini'],
    actions: async (page) => {
       const diceButton = page.getByText(/DIE|DICE/).first();
       await diceButton.click();
       await page.waitForTimeout(500);
       await page.getByText('2 DICE').click();
    }
  },
  { 
    name: 'Tablet_10inch_Epic_3_Dice', 
    device: devices['iPad Pro 11'],
    actions: async (page) => {
       const diceButton = page.getByText(/DIE|DICE/).first();
       await diceButton.click();
       await page.waitForTimeout(500);
       await page.getByText('3 DICE').click();
    }
  },
  { 
    name: 'Tablet_Landscape_Gaming', 
    device: devices['iPad Pro 11 landscape'],
    actions: async (page) => {
       // Just a clean landscape shot
    }
  }
];

async function captureAdvancedScreenshots() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('🚀 Starting ROBUST Digi Dice Roller Screenshot Capture...');
  console.log('--------------------------------------------');
  
  const browser = await chromium.launch({ headless: false, slowMo: 800 });

  for (const config of SCREENSHOT_CONFIGS) {
    console.log(`📸 Processing: ${config.name}...`);
    
    const context = await browser.newContext({
      ...config.device,
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();
    
    try {
      await page.goto(APP_URL, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(3000); // Give it time to load the 3D dice

      // 1. CLEAN UI
      await page.evaluate(() => {
        const adContainers = Array.from(document.querySelectorAll('div, view')).filter(el => {
            const style = window.getComputedStyle(el);
            return style.position === 'absolute' && style.bottom === '0px' && style.height === '60px';
        });
        adContainers.forEach(el => el.style.display = 'none');
      });

      // 2. RUN CUSTOM ACTIONS
      await config.actions(page);
      await page.waitForTimeout(1000);

      // 3. CAPTURE START STATE
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${config.name}_Start.png`) });

      // 4. INTERACT: ROLL
      // Google LOVES gameplay shots. It shows the app is a game, not just a menu!
      const rollButton = page.getByText('ROLL').last();
      if (await rollButton.isVisible()) {
        await rollButton.click();
        console.log(`   🎲 Rolling dice for ${config.name}...`);
        await page.waitForTimeout(2000); // Animation time
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${config.name}_Result.png`) });
      }
      
      console.log(`   ✅ Success: ${config.name} screenshots saved.`);
      
    } catch (err) {
      console.error(`   ❌ Failed: ${config.name} - ${err.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('--------------------------------------------');
  console.log('✨ All Robust Screenshots saved in assets/screenshots/');
}

captureAdvancedScreenshots();
