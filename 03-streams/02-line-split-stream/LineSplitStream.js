const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #buffer = '';

  _transform(chunk, encoding, callback) {
    this.#buffer += chunk.toString();

    const lines = this.#buffer.split(os.EOL);

    this.#buffer = lines.pop();
    lines.forEach(line => this.push(line));

    callback();
  }

  _flush(callback) {
    if (this.#buffer) {
      this.push(this.#buffer);
      this.#buffer = '';
    }

    callback();
  }
}

module.exports = LineSplitStream;
