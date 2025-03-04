const { createClient } = require('redis');
const puppeteer = require('puppeteer');

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️ ',
    success: '✅',
    error: '❌',
    waiting: '⏳',
    done: '🎯',
  };
  console.log(`[${new Date().toISOString()}] ${icons[type] || 'ℹ️ '} ${message}`);
}

(async () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on('error', (err) => log(`Redis Error: ${err}`, 'error'));
  await client.connect();
  log('Connected to Redis', 'success');

  log('Waiting for messages...', 'waiting');

  while (true) {
    try {
      const message = await client.lPop('screenshot_queue');
      if (message) {
        log(`Message reçu: ${message}`, 'info');
        const { url } = JSON.parse(message);

        log(`Démarrage de Puppeteer pour l'URL: ${url}`, 'waiting');
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url);
        await page.screenshot({ path: `screenshot.png` });
        log(`Capture d'écran prise pour ${url}`, 'success');
        await browser.close();
        log(`Terminé pour ${url}`, 'done');
      }
    } catch (err) {
      log(`Erreur: ${err.message}`, 'error');
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
})();