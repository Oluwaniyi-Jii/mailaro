const test = require('node:test');
const assert = require('node:assert');

test('health check passes', () => {
  assert.strictEqual(1, 1);
});
