import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/f2c31b2b-25d0-4970-9cb8-3b2e33dd39f1';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.error('PAGE ERROR:', err));

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  // 1. Capture Preloader early state
  await new Promise((r) => setTimeout(r, 600));
  const preloaderPath = path.join(ARTIFACT_DIR, '01-preloader.png');
  await page.screenshot({ path: preloaderPath });
  console.log('Saved Preloader screenshot:', preloaderPath);

  // 2. Wait for preloader to finish counting and wipe away
  console.log('Waiting for preloader exit sequence...');
  await new Promise((r) => setTimeout(r, 3400));

  // 3. Capture Hero revealed
  const heroPath = path.join(ARTIFACT_DIR, '02-hero.png');
  await page.screenshot({ path: heroPath });
  console.log('Saved Hero screenshot:', heroPath);

  // 4. Hover over CTA button to check interactive cursor and glow
  await page.hover('a[data-cursor="UNLOCK"]');
  await new Promise((r) => setTimeout(r, 500));
  const heroHoverPath = path.join(ARTIFACT_DIR, '03-hero-hover.png');
  await page.screenshot({ path: heroHoverPath });
  console.log('Saved Hero Hover screenshot:', heroHoverPath);

  // 5. Scroll down to test 3D shackle separation
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: 'smooth' }));
  await new Promise((r) => setTimeout(r, 800));
  const scrollPath = path.join(ARTIFACT_DIR, '04-hero-scroll.png');
  await page.screenshot({ path: scrollPath });
  console.log('Saved Hero Scroll screenshot:', scrollPath);

  await browser.close();
  console.log('Browser tests completed successfully!');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
