import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/f2c31b2b-25d0-4970-9cb8-3b2e33dd39f1';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  // iPhone 14 Pro viewport
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  const mobileHero = path.join(ARTIFACT_DIR, '17-mobile-hero.png');
  await page.screenshot({ path: mobileHero });
  console.log('Saved Mobile Hero screenshot:', mobileHero);

  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const mobileProjects = path.join(ARTIFACT_DIR, '18-mobile-projects.png');
  await page.screenshot({ path: mobileProjects });
  console.log('Saved Mobile Projects screenshot:', mobileProjects);

  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const mobileContact = path.join(ARTIFACT_DIR, '19-mobile-contact.png');
  await page.screenshot({ path: mobileContact });
  console.log('Saved Mobile Contact screenshot:', mobileContact);

  await browser.close();
}

run().catch(console.error);
