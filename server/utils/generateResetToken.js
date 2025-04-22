// server/utils/generateResetToken.js
const crypto = require('crypto');

module.exports = function generateResetToken() {
  // 20 bytes → hex string
  const resetToken = crypto.randomBytes(20).toString('hex');
  // store hashed
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
  // expire in 10m
  const expire = Date.now() + 10 * 60 * 1000;
  return { resetToken, hashed, expire };
};
