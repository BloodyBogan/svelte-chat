const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const now = Date.now();
    const fileExtension = path.extname(file.originalname);
    const filename = `${randomBytes}${now}${fileExtension}`;

    req.on('aborted', () => {
      fs.unlink(
        path.join(__dirname, '..', 'public', 'uploads', `${filename}`),
        () => {}
      );
    });

    cb(null, filename);
  },
});

const limits = {
  fileSize: 1 * 1000 * 1000,
};

const upload = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
      cb(new Error('You can only upload an image'), false);
    }

    cb(null, true);
  },
}).single('photo');

module.exports = upload;
