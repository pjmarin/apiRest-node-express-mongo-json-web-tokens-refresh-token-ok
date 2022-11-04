import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";

// (1) para servidor https
// import https from "https";
// import fs from "fs";

const app = express();

app.use(cors({ origin:true, credentials:true }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '3mb'}))

app.use(function(req, res, next) {
  if(req.originalUrl.includes("api") || req.originalUrl.includes("html")) {
    console.log(`pasamos por aqui - todas las peticiones - ${req.originalUrl} - ${new Date(Date.now()).toISOString()}`);
  }
  
  next();
});

app.use("/api/v1/auth", authRoutes);

app.use(express.static("public"));

app.use(function(err, req, res, next) {
  console.error("err.stack", err.stack);
  return res.send(500, { message: err.message });
});

// (1) para servidor https
// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("😍😍😲 http://localhost:" + PORT));

// (1) para servidor https
// https.createServer(options, app).listen(PORT, console.log(`server runs on port ${PORT}`));
