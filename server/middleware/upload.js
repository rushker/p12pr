// server/middleware/upload.js
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpe?g|png|gif/;
  const ext = allowed.test(file.mimetype.toLowerCase());
  if (ext) cb(null, true);
  else cb(new Error('Images only!'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
