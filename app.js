const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const expressSessions = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const PORT = process.env.PORT || 5000;

// requiring passport from another file
require("./config/passport")(passport);

// mongoose connect
mongoose
  .connect("mongodb://localhost:27017/passportJs")
  .then(() => {
    console.log("connected to MongoDb");
  })
  .catch((err) => {
    console.log("Mongo connection error", err);
  });

//   Ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

// body parser
app.use(express.urlencoded({ extended: false }));

// express sessions
app.use(
  expressSessions({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// flash messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(PORT, console.log(`server started  on the ${PORT}`));
