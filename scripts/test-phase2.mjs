import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/f2c31b2b-25d0-4970-9cb8-3b2e33dd39f1';

async function run() {
  console.log('Launching browser for Phase 2 verification...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.error('PAGE ERROR:', err));

  // 1. Visit Homepage & wait for preloader
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2600));

  // 2. Scroll into Projects Showcase section
  console.log('Scrolling to #projects showcase...');
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));

  const showcasePath = path.join(ARTIFACT_DIR, '05-projects-showcase.png');
  await page.screenshot({ path: showcasePath });
  console.log('Saved Projects Showcase screenshot:', showcasePath);

  // 3. Navigate to Case Study Page (/projects/kinetic-labs)
  console.log('Navigating to Case Study /projects/kinetic-labs...');
  await page.goto('http://localhost:3000/projects/kinetic-labs', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  const caseStudyPath = path.join(ARTIFACT_DIR, '06-case-study.png');
  await page.screenshot({ path: caseStudyPath });
  console.log('Saved Case Study screenshot:', caseStudyPath);

  // 4. Navigate to Admin Login
  console.log('Navigating to /admin/login...');
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
  await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 600));

  // Submit login form
  console.log('Submitting login credentials...');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 2000));

  const adminDashPath = path.join(ARTIFACT_DIR, '07-admin-dashboard.png');
  await page.screenshot({ path: adminDashPath });
  console.log('Saved Admin Dashboard screenshot:', adminDashPath);

  // 5. Navigate to Admin Projects CRUD
  console.log('Navigating to /admin/projects...');
  await page.goto('http://localhost:3000/admin/projects', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  const adminProjectsPath = path.join(ARTIFACT_DIR, '08-admin-projects.png');
  await page.screenshot({ path: adminProjectsPath });
  console.log('Saved Admin Projects CRUD screenshot:', adminProjectsPath);

  await browser.close();
  console.log('Phase 2 browser tests completed successfully!');
}

run().catch((err) => {
  console.error('Phase 2 test failed:', err);
  process.exit(1);
});
