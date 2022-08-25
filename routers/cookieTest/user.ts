import express, { Router } from "express";
import { AuthRequest } from "../../types";

export const testCookieRouter = Router();

testCookieRouter
  .get("/", function (req, res) {
    // console.log(document.cookie); use it in browser
    console.log("Cookies: ", req.cookies); // in node
    res.send(req.cookies);
  })
  .get("/set/:value", function (req, res, next) {
    const { value } = req.params;
    console.log(value);
    // @ts-ignore
    res.cookie("value", value, { expire: 360000 });
    res.send("set");
  })
  .get("/del", function (req, res, next) {
    res.clearCookie("value");
    res.send("cookie value cleared");
  });
