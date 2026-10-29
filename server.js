// Jalankan: node server.js  →  buka http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Hanya file ini yang boleh diakses dari browser
const FILES = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/style.css': ['style.css', 'text/css; charset=utf-8'],
  '/script.js': ['script.js', 'application/javascript; charset=utf-8'],
};

// Gambar (png/jpg/webp/svg) di folder yang sama boleh diakses, mis. kotak.png
const IMAGES = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  let entry = FILES[url];
  if (!entry) {
    let name = '';
    try { name = decodeURIComponent(url.slice(1)); } catch (e) {}
    const type = IMAGES[path.extname(name).toLowerCase()];
    // hanya nama file langsung (tanpa folder) supaya aman
    if (type && name === path.basename(name)) entry = [name, type];
  }

  if (!entry) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 - Halaman tidak ditemukan');
  }

  fs.readFile(path.join(__dirname, entry[0]), (err, data) => {
    if (err && err.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 - File tidak ditemukan');
    }
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('500 - Gagal membaca file');
    }
    res.writeHead(200, { 'Content-Type': entry[1] });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});