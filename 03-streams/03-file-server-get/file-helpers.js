const fs = require('node:fs');
const path = require('node:path');

function hasNestedFolders(filename) {
    return filename.includes('/') || filename.includes('\\');
}

function fileExists(filepath) {
    return fs.existsSync(filepath);
}

function getFileExtension(filename) {
    return path.parse(filename)?.ext;
}

module.exports = {
    hasNestedFolders,
    fileExists,
    getFileExtension
}