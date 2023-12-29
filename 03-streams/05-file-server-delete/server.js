const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');
const { fileExists, hasNestedFolders } = require('./file-helpers');
const { sendErrorResponse } = require('./send-response');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (req.method !== 'DELETE') {
    return sendErrorResponse(res, 400, 'Bad Request.');
  }

  if (hasNestedFolders(pathname)) {
    return sendErrorResponse(res, 400, 'Nested folders are not supported.');
  }

  if (!fileExists(filepath)) {
    return sendErrorResponse(res, 404, 'File does not exist');
  }

  fs.unlink(filepath, (error) => {
    if (error) {
      return sendErrorResponse(res, 500, 'Internal Server Error');
    }

    res.statusCode = 200;
    res.end('File has been deleted successfully')
  });
});

module.exports = server;
