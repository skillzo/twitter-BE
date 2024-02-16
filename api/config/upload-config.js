const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `test ${file.originalname} `);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.minetype)) {
    cb(null, true);
  } else {
    cb(new Error("file type not allowed"), false);
  }
};

module.exports = { storage, fileFilter };
