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

const artifactDir = 'C:/Users/Thinkpad/.gemini/antigravity/brain/f9ca9f29-167d-4a25-aa6f-fd3745665f02';

(async () => {
  console.log("Launching browser to render terminal...");
  const browser = await puppeteer.launch({
    executablePath: executablePath,
    headless: true,
    defaultViewport: { width: 850, height: 480 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///C:/Users/Thinkpad/kopikeliling/scratch/terminal_mock.html';
  
  await page.goto(fileUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: artifactDir + '/tool_usage_terminal.png' });
  console.log("Terminal screenshot saved successfully!");

  await browser.close();
})();
