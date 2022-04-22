const express = require('express');
const app = express();
const mysql =require('mysql');
const bookRouter = require('./controllers/books');
require('dotenv/config');
require('dotenv').config()
const {DB_PORT} = process.env
//Routes
//Base Route
const router= express.Router();
//Book Route
const bookRoute = bookRouter;


//Middleware
//Base MiddleWare
app.use("/api/v1", router);
//book middleware
router.use(bookRoute);
app.listen(DB_PORT,()=>{
    console.log(`Server Running at ${DB_PORT}`);
});