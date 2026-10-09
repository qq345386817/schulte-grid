import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4187);
const types = { '.html': 'text/html', '.css': 'text/css', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.md': 'text/markdown', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.split('/').some(part => part.startsWith('.') || ['scripts', 'tests', 'content', 'package.json'].includes(part))) throw new Error('Private path');
    if (pathname.endsWith('.html') && !pathname.includes('google')) {
      const redirect = pathname.endsWith('/index.html') ? pathname.slice(0, -10) : pathname.slice(0, -5);
      res.writeHead(308, { Location: redirect + url.search }); res.end(); return;
    }
    let relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    if (!path.extname(relative)) {
      try {
        if ((await stat(path.join(root, relative))).isDirectory()) {
          res.writeHead(308, { Location: pathname + '/' + url.search }); res.end(); return;
        }
      } catch { /* The clean path may correspond to an HTML file. */ }
      relative += '.html';
    }
    const file = path.resolve(root, `.${relative}`);
    if (!file.startsWith(root) || !types[path.extname(file)]) throw new Error('Unknown file');
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': `${types[path.extname(file)]}; charset=utf-8`, 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Schulte Grid: http://127.0.0.1:${port}`));
