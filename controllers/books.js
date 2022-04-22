const mysql = require("mysql");
const upload = require("../multer");
const express = require("express");
const { route } = require("express/lib/application");
const sqlpool = require("../sql_pool");
const router = express.Router();
const db = "books";

router.post("/books/new", upload.single("cover"), function (req, res, next) {
  const { name, author, price, isbn } = req.body;
  console.log(req.file);
  sqlpool.query(
    `INSERT INTO ${db} (name,author,price,isbn,status,cover) VALUES (?,?,?,?,?,?)`,
    [name, author, price, isbn, 1, req.file.filename],
    (err, result,fields) => {
      console.log(err);
      if (err) {
        res.status(200).json({ e: "Somethings wrong" });
      } else {
        res.status(200).json({ m: "Inserted" });
      }
    }
  );
});

module.exports = router;
