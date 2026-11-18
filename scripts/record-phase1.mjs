import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const FRAMES_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/f2c31b2b-25d0-4970-9cb8-3b2e33dd39f1/frames';

async function record() {
  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  }

  console.log('Launching browser for frame recording...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  let frameCount = 0;
  const captureFrame = async () => {
    const filename = path.join(FRAMES_DIR, `frame_${String(frameCount).padStart(4, '0')}.png`);
    await page.screenshot({ path: filename, type: 'png' });
    frameCount++;
  };

  // Phase A: Preloader counting up and clamping (0 to 1.8s)
  for (let i = 0; i < 18; i++) {
    await captureFrame();
    await new Promise((r) => setTimeout(r, 100));
  }

  // Phase B: Shutter wipe reveal into hero (1.8s to 2.8s)
  for (let i = 0; i < 12; i++) {
    await captureFrame();
    await new Promise((r) => setTimeout(r, 90));
  }

  // Phase C: Hero idle and mouse hovering toward CTA (2.8s to 4.2s)
  const steps = 12;
  for (let i = 0; i < steps; i++) {
    const x = 300 + (100 * i) / steps;
    const y = 300 + (250 * i) / steps;
    await page.mouse.move(x, y);
    await captureFrame();
    await new Promise((r) => setTimeout(r, 90));
  }

  // Phase D: Scrolling down to separate shackle (4.2s to 5.5s)
  for (let s = 1; s <= 10; s++) {
    const scrollY = s * 40;
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
    await captureFrame();
    await new Promise((r) => setTimeout(r, 90));
  }

  await browser.close();
  console.log(`Captured ${frameCount} frames successfully.`);
}

record().catch((err) => {
  console.error('Recording failed:', err);
  process.exit(1);
});
