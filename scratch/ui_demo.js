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
  console.log("Launching browser in headless mode...");
  const browser = await puppeteer.launch({
    executablePath: executablePath,
    headless: true, // running headlessly so it works smoothly in background sessions
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  
  console.log("Navigating to LoginPage...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'load' });

  // Wait for login inputs
  await page.waitForSelector('input[type="email"]');
  
  console.log("Typing login credentials...");
  await page.type('input[type="email"]', "customer@email.com");
  await page.type('input[type="password"]', "password123");

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: artifactDir + '/step1_login.png' });
  console.log("Step 1 Screenshot saved.");

  console.log("Clicking Sign In...");
  await page.click('button[type="submit"]');

  // Wait 3 seconds for Next.js SPA client-side login redirection
  console.log("Waiting for client-side login to complete...");
  await new Promise(r => setTimeout(r, 3000));
  
  console.log("Navigating to Menu page...");
  await page.goto('http://localhost:3000/menu', { waitUntil: 'load' });

  console.log("Waiting for menu items to load...");
  // Retry loop to wait for "Order" button to appear (max 15 seconds)
  let orderButton = null;
  for (let i = 0; i < 30; i++) {
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Order')) {
        orderButton = button;
        break;
      }
    }
    if (orderButton) break;
    await new Promise(r => setTimeout(r, 500)); // check every 500ms
  }

  if (!orderButton) {
    console.log("Could not find any 'Order' button on the menu page (Timeout). Taking screenshot...");
    await page.screenshot({ path: artifactDir + '/timeout_screenshot.png' });
    await browser.close();
    process.exit(1);
  }

  await page.screenshot({ path: artifactDir + '/step2_menu.png' });
  console.log("Step 2 Screenshot saved.");

  console.log("Adding first available coffee to cart...");
  // Scroll and trigger click using DOM element.click() for 100% reliability
  await page.evaluate(el => {
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
    el.click();
  }, orderButton);

  // Wait 2 seconds to let React update cart state and show toast
  await new Promise(r => setTimeout(r, 2000));

  console.log("Opening the Shopping Cart...");
  // Click on the cart button specifically by finding the ShoppingCart SVG
  const clicked = await page.evaluate(() => {
    const svg = document.querySelector('svg.lucide-shopping-cart') || document.querySelector('svg');
    if (svg) {
      const button = svg.closest('button');
      if (button) {
        button.click();
        return true;
      }
    }
    return false;
  });

  if (!clicked) {
    console.log("Could not find ShoppingCart icon. Falling back to clicking first nav button...");
    await page.click('nav button');
  }

  // Wait 3 seconds for cart sidebar to slide in and render
  await new Promise(r => setTimeout(r, 3000));

  console.log("Filling checkout details...");
  // Enter table number
  const tableInputSelector = 'input[placeholder="Enter table number (e.g. 5)..."]';
  await page.waitForSelector(tableInputSelector, { timeout: 10000 });
  await page.type(tableInputSelector, "5");

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: artifactDir + '/step3_cart.png' });
  console.log("Step 3 Screenshot saved.");

  console.log("Clicking 'Continue to Payment'...");
  const checkoutButtons = await page.$$('button');
  for (const btn of checkoutButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Continue to Payment')) {
      await btn.click();
      break;
    }
  }

  console.log("Waiting for Midtrans Snap iframe to load...");
  const iframeSelector = 'iframe#snap-midtrans';
  await page.waitForSelector(iframeSelector, { timeout: 15000 });
  const iframeElement = await page.$(iframeSelector);
  const frame = await iframeElement.contentFrame();

  console.log("Waiting for payment method list inside iframe...");
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: artifactDir + '/step4_snap_loaded.png' });

  console.log("Selecting Credit/Debit Card payment option...");
  await frame.evaluate(() => {
    const items = Array.from(document.querySelectorAll('*'));
    const cardItem = items.find(el => el.textContent && (el.textContent.toLowerCase().includes('credit/debit card') || el.textContent.toLowerCase().includes('kartu kredit')));
    if (cardItem) {
      const clickable = cardItem.closest('a') || cardItem.closest('button') || cardItem.closest('.list-primary') || cardItem;
      clickable.click();
    }
  });

  console.log("Waiting for card input fields...");
  await new Promise(r => setTimeout(r, 2000));

  // Enter card number details
  console.log("Entering test credit card credentials...");
  await frame.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const numInput = inputs.find(i => i.name === 'cardnumber' || i.id === 'card-number' || i.placeholder.includes('card') || i.placeholder.includes('kartu') || i.type === 'tel');
    if (numInput) {
      numInput.focus();
    }
  });
  // Press backspace a lot to make sure it's empty, then type number
  await page.keyboard.press('Backspace');
  await page.keyboard.type("4811111111111111", { delay: 50 });

  await frame.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const expInput = inputs.find(i => i.name === 'expiry' || i.id === 'card-expiry' || i.placeholder.includes('MM') || i.placeholder.includes('BB'));
    if (expInput) {
      expInput.focus();
    }
  });
  await page.keyboard.type("1228", { delay: 50 });

  await frame.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const cvvInput = inputs.find(i => i.name === 'cvv' || i.id === 'card-cvv' || i.placeholder.includes('123') || i.placeholder.includes('CVV'));
    if (cvvInput) {
      cvvInput.focus();
    }
  });
  await page.keyboard.type("123", { delay: 50 });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: artifactDir + '/step5_card_filled.png' });

  console.log("Clicking Pay Now button...");
  await frame.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button, a, input[type="button"]')).find(el => el.textContent && (el.textContent.toLowerCase().includes('pay') || el.textContent.toLowerCase().includes('bayar')));
    if (btn) btn.click();
  });

  console.log("Waiting for 3D Secure bank simulator OTP page...");
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: artifactDir + '/step6_3ds_loaded.png' });

  console.log("Submitting BNI/Mandiri 3DS simulator OTP form...");
  // Find the 3DS iframe inside the main iframe
  const innerIframeSelector = 'iframe';
  const innerIframeElement = await frame.$(innerIframeSelector);
  if (innerIframeElement) {
    const tdsFrame = await innerIframeElement.contentFrame();
    if (tdsFrame) {
      await tdsFrame.evaluate(() => {
        const submitBtn = document.querySelector('button[type="submit"]') || document.querySelector('input[type="submit"]') || document.querySelector('button') || document.querySelector('input[name="ok"]');
        if (submitBtn) submitBtn.click();
      });
    }
  } else {
    // Fallback: click anyway
    await frame.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]') || document.querySelector('input[type="submit"]') || document.querySelector('button') || document.querySelector('input[name="ok"]');
      if (submitBtn) submitBtn.click();
    });
  }

  console.log("Processing payment completion...");
  // Wait 8 seconds for transaction success redirect and callback toast
  await new Promise(r => setTimeout(r, 8000));
  await page.screenshot({ path: artifactDir + '/step7_payment_success.png' });
  console.log("Step 7 (Final Payment Success) Screenshot saved.");

  console.log("Closing browser. Demo completed!");
  await browser.close();
})();
