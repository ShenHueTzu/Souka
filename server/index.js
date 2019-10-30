const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const { parse } = require('url');
const { join } = require('path');

// const nextI18NextMiddleware = require('next-i18next/middleware');
// const nextI18next = require('../i18n');

const port = parseInt(process.env.PORT, 10) || 3000;
const isDev = process.env.ENV !== 'production' && process.env.ENV !== 'preparing';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  // server.use(nextI18NextMiddleware(nextI18next));

  server.use(compression());
  server.use(cookieParser());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));


  server.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const rootStaticFiles = ['/robots.txt', '/sitemap.xml', '/favicon.ico'];
    if (rootStaticFiles.indexOf(parsedUrl.pathname) > -1) {
      const path = join(__dirname, '../static', parsedUrl.pathname);
      res.redirect(path);
    } else {
      handle(req, res, parsedUrl);
    }
  });

  await server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> 🚀 Ready on http://localhost:${port}`);
  });
})();
