const fs = require('node:fs');

function hasNestedFolders(filename) {
    return filename.includes('/') || filename.includes('\\');
}

function fileExists(filepath) {
    return fs.existsSync(filepath);
}

function deleteFile(filepath) {
    if (fileExists(filepath)) {
        fs.unlinkSync(filepath);
    }
}

function createDirectoryIfNotExists(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

module.exports = {
    hasNestedFolders,
    fileExists,
    deleteFile,
    createDirectoryIfNotExists
}