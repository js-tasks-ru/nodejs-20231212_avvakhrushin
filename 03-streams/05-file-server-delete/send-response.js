function sendErrorResponse(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain', 'Connection': 'close' });
    res.end(message);
}

module.exports = {
    sendErrorResponse
}