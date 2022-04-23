const express = require('express');
const app = express();
const mysql =require('mysql');
const bookRouter = require('./controllers/books');
const userRouter = require('./controllers/users');
require('dotenv/config');
require('dotenv').config()
const {DB_PORT} = process.env
//Routes
//Base Route
const router= express.Router();
//Book Route
const bookRoute = bookRouter;
//Users Route
const userRoute = userRouter;


//Middleware
//Base MiddleWare
app.use("/api/v1", router);
//book middleware
router.use(bookRoute);
//user middleware
router.use(userRoute);
app.listen(DB_PORT,()=>{
    console.log(`Server Running at ${DB_PORT}`);
});