function sum(a, b) {
  const firstIsNumber = typeof a === 'number';
  const secondIsNumber = typeof b === 'number';

  if (firstIsNumber && secondIsNumber) {
    return a + b;
  }

  throw new TypeError('Not a number');
}

module.exports = sum;
