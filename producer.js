const { createClient } = require('redis');

(async () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on('error', (err) => console.error('Redis Error', err));

  await client.connect();
  console.log('Connected to Redis');

  const message = JSON.stringify({ url: 'https://google.fr' });
  await client.rPush('screenshot_queue', message);
  console.log('Message envoyé dans Redis');
  
  await client.quit();
})();