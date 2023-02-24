import axios from 'axios';
import express from 'express';
import * as cheerio from 'cheerio';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Free 3dIcons API' });
});

app.get('/search', async (req, res) => {
  const { q } = req.query;
  const response = await axios(`https://iconscout.com/3ds/${q}`);
  const html = await response.data;
  const $ = cheerio.load(html);
  let length = 10;
  const imgLinks = [];
  $('.linkBlock_iq0Zu>picture>img', html).each((_, e) => {
    if (length === 0) return;
    const link = $(e).attr('src');
    imgLinks.push(link);
    length--;
  });
  res.send({ imgLinks });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
