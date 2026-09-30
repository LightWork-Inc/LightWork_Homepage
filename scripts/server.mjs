import http from 'node:http';
import { watch } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const project = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const isPreview = process.argv.includes('--dist');
const root = isPreview ? path.join(project, 'dist') : project;
const port = Number(process.env.PORT || (isPreview ? 4173 : 8501));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const clients = new Set();
const session = Date.now().toString(36);
let revision = 0;
let reloadTimer;
let watcher;
const publicFile = (relative) => ['index.html', 'styles.css', 'app.js', 'theme.js'].includes(relative)
  || (/^assets\/[a-zA-Z0-9_./-]+$/.test(relative)
    && !relative.split('/').some((segment) => segment === '.' || segment === '..'))
  || (!isPreview && ['design/reference.preview.html', 'design/reference.fragment.html'].includes(relative));
const reloadMessage = () => `data: ${JSON.stringify(`${session}:${revision}`)}\n\n`;
const reloadScript = `<script>
(() => {
  const updates = new EventSource('/__dev/events');
  let revision;
  updates.onmessage = (event) => {
    if (revision !== undefined && revision !== event.data) {
      updates.close();
      location.reload();
    }
    revision = event.data;
  };
})();
</script>`;

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!isPreview && pathname === '/__dev/events') {
      response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
      if (request.method === 'HEAD') return response.end();
      clients.add(response);
      response.write(reloadMessage());
      const heartbeat = setInterval(() => response.write(': keep-alive\n\n'), 20000);
      response.on('close', () => { clearInterval(heartbeat); clients.delete(response); });
      return;
    }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    // Only serve the public site and the two original design references.
    const allowed = publicFile(relative);
    const filename = path.resolve(root, relative);
    if (!allowed || !filename.startsWith(root + path.sep)) {
      response.writeHead(404).end('Not found');
      return;
    }
    let body = await readFile(filename);
    if (!isPreview && path.extname(filename) === '.html') {
      const html = body.toString('utf8');
      body = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${reloadScript}</body>`) : html + reloadScript;
    }
    response.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Unable to serve this request');
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Set PORT to another local port.` : error.message);
  process.exitCode = 1;
});
// Development is reachable by IP for feedback; built previews remain local.
server.listen(port, isPreview ? '127.0.0.1' : '0.0.0.0', () => {
  console.log(`LIGHTWORK ${isPreview ? 'preview' : 'development'}: http://localhost:${port}`);
  if (!isPreview) {
    watcher = watch(project, { recursive: true }, (_event, filename) => {
      if (!filename || !publicFile(filename.toString().replaceAll('\\', '/'))) return;
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => {
        revision += 1;
        for (const client of clients) client.write(reloadMessage());
      }, 150);
    });
    watcher.on('error', (error) => console.error('Live reload:', error.message));
    console.log('Live reload enabled: save a site file to refresh connected browsers.');
  }
});
server.on('close', () => { watcher?.close(); clearTimeout(reloadTimer); });
