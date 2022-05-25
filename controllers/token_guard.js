const bcrypt = require("bcryptjs/dist/bcrypt");
const pool = require("../sql_pool");
const db = "users";
function checkForToken(req,res,next) {
  const {token} = req.headers;
  console.log(token);
  if(token){
    pool.query(
      `SELECT * FROM ${db} WHERE token='${token}' LIMIT 1`,
      (err, rows, fields) => {
        console.log(`TOKEN => ${rows}`);
        console.log(`ERROR => ${err}`);
        if (err) {
          console.log(err);
          res.status(200).json({s:0,m:"Token Missing "+err});
          return;
        } else {
          // console.log(rows);
          if (rows.length > 0) {
            return next();
          }
          else{
            res.status(200).json({s:0,m:"Token Invalid"});
            return;
          }
          
        }
      }
    );
  }
  else{
    res.status(200).json({s:0,m:"Token Missing"});
    return;
  }
}

module.exports = checkForToken;
