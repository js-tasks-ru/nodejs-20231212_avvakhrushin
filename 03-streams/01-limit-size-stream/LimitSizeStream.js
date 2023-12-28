const stream = require('stream');
const { Buffer } = require('node:buffer');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #passedBytes = 0;

  constructor(options) {
    super(options);

    if (!options?.limit) {
      throw new Error('LimitSizeStream: The limit option is required');
    }

    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    // Наверняка приводим к типу "Buffer", потому что encoding может быть любым (например utf8), если установлено objectMode: true или decodeStrings: false
    const buffer = Buffer.from(chunk);

    this.#passedBytes += buffer.length;

    if (this.#passedBytes > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
