function sendSuccessResponse(res, message) {
    res.writeHead(201, { 'Content-Type': 'text/plain', 'Connection': 'close' });
    res.end(message);
}

function sendErrorResponse(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain', 'Connection': 'close' });
    res.end(message);
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
}