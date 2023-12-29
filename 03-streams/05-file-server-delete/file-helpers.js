const fs = require('node:fs');

function hasNestedFolders(filename) {
    return filename.includes('/') || filename.includes('\\');
}

function fileExists(filepath) {
    return fs.existsSync(filepath);
}

module.exports = {
    hasNestedFolders,
    fileExists
}