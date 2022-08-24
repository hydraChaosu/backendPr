import express, { Router } from "express";
import { AuthRequest } from "../../types";

export const testSessionUserRouter = Router();

testSessionUserRouter
  .get("/", function (req, res) {
    res.send(
      '<form action="/testSessions/login" method="post">' +
        'Username: <input name="user"><br>' +
        'Password: <input name="pass" type="password"><br>' +
        '<input type="submit" text="Login"></form>'
    );
  })
  .post(
    "/login",
    express.urlencoded({ extended: false }),
    function (req: AuthRequest, res, next) {
      // login logic to validate req.body.user and req.body.pass
      // would be implemented here. for this example any combo works

      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err);

        // store user information in session, typically a user id
        req.session.user = req.body.user;
        console.log(req.session);
        console.log(req.session.user);
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err);
          res.redirect("/");
        });
      });
    }
  )

  .get("/logout", function (req: AuthRequest, res, next) {
    // logout logic

    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null;
    req.session.save(function (err) {
      if (err) next(err);

      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err);
        res.redirect("/");
      });
    });
  });
