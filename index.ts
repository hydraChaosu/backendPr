import express from "express";
import "express-async-errors";
import {
  adminRouter,
  categoryRouter,
  itemInBasketRouter,
  personalInfoRouter,
  shopItemRouter,
  userRouter,
} from "./routers";
import cors from "cors";
import { handleError } from "./utils/errors";
import "dotenv/config";
import { authenticateToken, checkIfCorrectUserRole } from "./middleware/auth";

const winston = require("winston"),
  expressWinston = require("express-winston");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();

// app.use(
//   expressWinston.logger({
//     transports: [new winston.transports.Console()],
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.json()
//     ),
//     meta: true, // optional: control whether you want to log the meta data about the request (default to true)
//     msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
//     expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
//     colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
//     // ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
//   })
// );

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json()); // Content-type: application/json
app.use(cookieParser());
app.use(
  session({
    secret: "Your secret key",
    saveUninitialized: false,
    resave: false,
  })
);

app.use("/category", categoryRouter);
app.use("/shopItem", shopItemRouter);
app.use("/personalInfo", personalInfoRouter);
app.use("/itemInBasket", itemInBasketRouter);
app.use("/user", userRouter);
app.use(
  "/admin",
  [authenticateToken, checkIfCorrectUserRole([1])],
  adminRouter
);

app.use(handleError);

// app.use(
//   expressWinston.errorLogger({
//     transports: [new winston.transports.Console()],
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.json()
//     ),
//   })
// );

app.listen(3001, "0.0.0.0", () => {
  console.log("Listening on http://localhost:3001");
});
