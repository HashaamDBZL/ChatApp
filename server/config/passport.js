// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const { User } = require("../models/index");
const { DataTypes } = require("sequelize");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (issuer, profile, done) => {
      try {
        const existingUser = await User.findOne({
          where: { email: profile.emails[0].value },
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          //TEMP IMAGE PLACEHOLDER LINK, CHANGE TO USERS ACTUAL IMAGE URL FROM GOOGLE RESPONSE LATER
          image: "https://pasteboard.co/E0lym14pCt4a.jpg",
          password:
            "$2b$10$sCErTWu/8zenqiOxY6.AreYvidWW6aL0nAVBsqAXVVcYQtOoP2krq",
        });

        return done(null, newUser);
      } catch (error) {
        console.error("Error during Google authentication:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
