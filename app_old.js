const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = config.get("port");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./error_middleware/error_handling_middleware");
const logger = require('./services/logger.service');
const winston = require('winston');
const expressWinston = require("express-winston");

// require("dotenv").config({
//   path: `.env.${process.env.NODE_ENV}`,
// });
// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));


// process.on("uncaughtException", (exception) => {
//   console.log("uncaughtException", exception.message);
// });

// process.on("unhandledRejection", (rejection) => {
//   console.log("unhandledRejection", rejection);
// });

logger.log("info","Log Ma'lumotlar");
logger.error("Error Ma'lumotlar");
logger.debug("Debug Ma'lumotlar");
logger.warn("Warn Ma'lumotlar");
logger.info("Info Ma'lumotlar");
// console.trace("Trace Ma'lumotlar");
// console.table([1, 2, 3]);
// console.table([
//   ["Sobir", 22],
//   ["Qobil", 34],
//   ["Nodir", 28],
// ]);


const app = express();

app.use(express.json()); //parse json
app.use(cookieParser());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);

app.use("/api", mainRouter);

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.json()
    ),
  })
);

app.use(error_handling_middleware); //Error eng oxirida chaqiriladi

async function start() {
  try {
    await mongoose.connect(config.get("dbAtlasUri"));
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Ma'lumotlar bazasiga ulanishda xatolik");
  }
}

start();
