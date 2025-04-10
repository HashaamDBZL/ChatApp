const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const { User, Message, Chat } = require("../models/index");
const jwt = require("jsonwebtoken");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Google OAuth routes
router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${req.user.id}`
    );
  }
);

module.exports = router;
