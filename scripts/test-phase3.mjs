import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/f2c31b2b-25d0-4970-9cb8-3b2e33dd39f1';

async function run() {
  console.log('Launching browser for Phase 3 & 4 full suite verification...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.error('PAGE ERROR:', err));

  // 1. Visit Homepage
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  // 2. Scroll to Manifesto Section
  console.log('Scrolling to #manifesto...');
  await page.evaluate(() => {
    const el = document.getElementById('manifesto');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  const manifestoPath = path.join(ARTIFACT_DIR, '09-manifesto.png');
  await page.screenshot({ path: manifestoPath });
  console.log('Saved Manifesto screenshot:', manifestoPath);

  // 3. Scroll to Services Section
  console.log('Scrolling to #services...');
  await page.evaluate(() => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  const servicesPath = path.join(ARTIFACT_DIR, '10-services.png');
  await page.screenshot({ path: servicesPath });
  console.log('Saved Services screenshot:', servicesPath);

  // 4. Scroll to Process Section
  console.log('Scrolling to #process...');
  await page.evaluate(() => {
    const el = document.getElementById('process');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  const processPath = path.join(ARTIFACT_DIR, '11-process.png');
  await page.screenshot({ path: processPath });
  console.log('Saved Process screenshot:', processPath);

  // 5. Scroll to Stats Section
  console.log('Scrolling to #stats...');
  await page.evaluate(() => {
    const el = document.getElementById('stats');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  const statsPath = path.join(ARTIFACT_DIR, '12-stats.png');
  await page.screenshot({ path: statsPath });
  console.log('Saved Stats screenshot:', statsPath);

  // 6. Scroll to Contact Section & submit a test inquiry
  console.log('Scrolling to #contact...');
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1000));

  console.log('Submitting contact transmission...');
  await page.type('input[placeholder="Jane Doe"]', 'Marcus Vance');
  await page.type('input[placeholder="jane@company.com"]', 'marcus@vance-defense.com');
  await page.type('input[placeholder="Studio / Venture"]', 'Vance Autonomous');
  await page.type('textarea[placeholder*="Tell us what you are building"]', 'We require a sovereign multi-spectral WebGL command dashboard with custom shaders for real-time telemetry.');
  
  await page.click('button[data-cursor="TRANSMIT"]');
  await new Promise((r) => setTimeout(r, 1500));

  const contactPath = path.join(ARTIFACT_DIR, '13-contact-submitted.png');
  await page.screenshot({ path: contactPath });
  console.log('Saved Contact Submitted screenshot:', contactPath);

  // 7. Scroll to Footer
  console.log('Scrolling to Footer...');
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 1000));
  const footerPath = path.join(ARTIFACT_DIR, '14-footer.png');
  await page.screenshot({ path: footerPath });
  console.log('Saved Footer screenshot:', footerPath);

  // 8. Visit Admin Messages Inbox to verify the newly submitted inquiry!
  console.log('Navigating to Admin Messages Inbox...');
  await page.goto('http://localhost:3000/admin/messages', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  const adminMessagesPath = path.join(ARTIFACT_DIR, '15-admin-inbox.png');
  await page.screenshot({ path: adminMessagesPath });
  console.log('Saved Admin Inbox screenshot:', adminMessagesPath);

  // 9. Visit Admin Settings
  console.log('Navigating to Admin Settings...');
  await page.goto('http://localhost:3000/admin/settings', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  const adminSettingsPath = path.join(ARTIFACT_DIR, '16-admin-settings.png');
  await page.screenshot({ path: adminSettingsPath });
  console.log('Saved Admin Settings screenshot:', adminSettingsPath);

  await browser.close();
  console.log('Phase 3 & 4 full test suite finished successfully!');
}

run().catch((err) => {
  console.error('Phase 3 test failed:', err);
  process.exit(1);
});
