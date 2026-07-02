import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = 'C:/Users/krishanathep.j/OneDrive - thairung.co.th/Desktop/my-projects/ltr-visa-dashboard/dist';
const port = 4173;
const host = '127.0.0.1';
const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.svg', 'image/svg+xml'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
]);

const server = http.createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.join(distDir, urlPath);
    const normalized = path.normalize(filePath);
    if (!normalized.startsWith(path.normalize(distDir))) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const data = await readFile(normalized);
    const ext = path.extname(normalized).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes.get(ext) || 'application/octet-stream' });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${distDir} at http://${host}:${port}/`);
});
