const fs = require('fs');
const puppeteer = require('puppeteer-core');

const paths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = '';
for (const p of paths) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

if (!executablePath) {
  console.error("Could not find Google Chrome or Microsoft Edge installed on your Windows system.");
  process.exit(1);
}

const artifactDir = 'C:/Users/Thinkpad/.gemini/antigravity/brain/f9ca9f29-167d-4a25-aa6f-fd3745665f02';

(async () => {
  console.log("Launching browser to render chart...");
  const browser = await puppeteer.launch({
    executablePath: executablePath,
    headless: true,
    defaultViewport: { width: 1000, height: 600 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  
  // Resolve absolute file url for performance_chart.html
  const fileUrl = 'file:///C:/Users/Thinkpad/kopikeliling/scratch/performance_chart.html';
  console.log(`Navigating to ${fileUrl}...`);
  await page.goto(fileUrl, { waitUntil: 'load' });

  // Wait 1 second to ensure chart animation has finished
  await new Promise(r => setTimeout(r, 1500));

  console.log("Taking screenshot of the chart...");
  await page.screenshot({ path: artifactDir + '/performance_chart.png' });
  console.log("Performance testing chart screenshot saved successfully!");

  await browser.close();
})();
