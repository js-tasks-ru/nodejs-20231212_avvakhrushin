const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { sendErrorResponse, sendSuccessResponse } = require('./send-response');
const { hasNestedFolders, fileExists, deleteFile, createDirectoryIfNotExists } = require('./file-helpers');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (req.method === 'POST') {
    if (hasNestedFolders(pathname)) {
      return sendErrorResponse(res, 400, 'Nested folders are not supported.');
    }

    if (fileExists(filepath)) {
      return sendErrorResponse(res, 409, 'File already exists.');
    }

    createDirectoryIfNotExists(path.join(__dirname, 'files'));

    const writeStream = fs.createWriteStream(filepath);
    const limitStream = new LimitSizeStream({ limit: 1024 * 1024 });

    req.pipe(limitStream).pipe(writeStream);

    // Проверяем на ошибки в стриме request (напр. когда соединение разорвано)
    req.on('error', () => {
      deleteFile(filepath);
      sendErrorResponse(res, 500, 'Internal Server Error.');
      limitStream.end();
      writeStream.end();
    });

    // Проверяем на ошибки в limitStream (напр. когда файл больше 1МБ)
    limitStream.on('error', (error) => {
      deleteFile(filepath);
      limitStream.end();
      writeStream.end();

      if (error instanceof LimitExceededError) {
        sendErrorResponse(res, 413, 'File size exceeds the limit of 1MB.');
      } else {
        sendErrorResponse(res, 500, 'Internal Server Error.');
      }
    });

    // Проверяем на ошибки в writeStream
    writeStream.on('error', (error) => {
      deleteFile(filepath);
      writeStream.end();
      sendErrorResponse(res, 500, 'Internal Server Error.');
    });

    // Проверяем, если стрим writeStream был завершен, и не возникло ошибок - отвечаем 201
    writeStream.on('finish', () => {
      if (!req.errored && !limitStream.errored && !writeStream.errored) {
        sendSuccessResponse(res, 'File uploaded successfully.');
      }
    });
  } else {
    sendErrorResponse(res, 400, 'Bad Request.');
  }
});

module.exports = server;
