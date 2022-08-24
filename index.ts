import express from "express";
import "express-async-errors";
import {
  adminCategoryRouter,
  adminItemInBasketRouter,
  adminRouter,
  adminShopItemRouter,
  itemInBasketRouter,
  personalInfoRouter,
  shopItemRouter,
  testSessionUserRouter,
  userRouter,
} from "./routers";
import { categoryRouter } from "./routers";
import cors from "cors";
import { handleError } from "./utils/errors";
import "dotenv/config";
import { adminUserRouter } from "./routers/admin/adminUser";
import { adminPersonalInfoRouter } from "./routers/admin/adminPersonalInfo";
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json()); // Content-type: application/json
app.use(cookieParser());
app.use(session({ secret: "Your secret key" }));

app.use("/category", categoryRouter);
app.use("/shopItem", shopItemRouter);
app.use("/personalInfo", personalInfoRouter);
app.use("/itemInBasket", itemInBasketRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/admin/category", adminCategoryRouter);
app.use("/admin/shopItem", adminShopItemRouter);
app.use("/admin/user", adminUserRouter);
app.use("/admin/personalInfo", adminPersonalInfoRouter);
app.use("/admin/itemInBasket", adminItemInBasketRouter);

app.use("/testSessions", testSessionUserRouter);

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
  console.log("Listening on http://localhost:3001");
});

// normalne testy

// statystyki recordow

//react
//payload standarization
//catch mysql2 errors
//tokens in db
//cashe in db
//logout
//refresh token
//ciateczka

//TODO express validator
//TODO passport

//wlasne validatory szczegolowe
//nest
//angielski w db
