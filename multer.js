const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/book_cover",
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      `${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
