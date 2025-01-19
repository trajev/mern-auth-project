const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors")
const userRouter = require("./routes/user.routes")
const cookieParser = require("cookie-parser")
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())

app.use( "/user", userRouter );

app.listen( process.env.PORT || 3000 , ()=>{
  connectDB();
  console.log("Server Started.");
} )