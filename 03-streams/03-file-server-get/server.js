const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { fileExists, hasNestedFolders, getFileExtension } = require('./file-helpers');
const { sendErrorResponse } = require('./send-response');
const extensions = require('./extensions');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const fileExtension = getFileExtension(pathname);

  if (req.method !== 'GET') {
    return sendErrorResponse(res, 400, 'Bad Request.');
  }

  if (hasNestedFolders(pathname)) {
    return sendErrorResponse(res, 400, 'Nested folders are not supported.');
  }

  if (!fileExists(filepath)) {
    return sendErrorResponse(res, 404, 'File does not exist');
  }

  const readFileStream = fs.createReadStream(filepath);

  res.setHeader('Content-type', extensions[fileExtension] || 'text/plain');
  readFileStream.pipe(res);

  readFileStream.on('error', () => {
    res.statusCode = 500;
    res.end('Internal Server Error');
  });
});

module.exports = server;
