import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/f2c31b2b-25d0-4970-9cb8-3b2e33dd39f1';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Login to admin
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1500));

  // 2. Visit Inquiries inbox
  await page.goto('http://localhost:3000/admin/messages', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  const inboxPath = path.join(ARTIFACT_DIR, '15-admin-inbox-authenticated.png');
  await page.screenshot({ path: inboxPath });
  console.log('Saved authenticated inbox screenshot:', inboxPath);

  await browser.close();
}

run().catch(console.error);
