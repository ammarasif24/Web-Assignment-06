// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const User = require("../models/users");
// const passport = require("passport");

// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.get("/register", (req, res) => {
//   res.render("register");
// });

// router.post("/register", (req, res) => {
//   const { name, email, password, password2 } = req.body;

//   let errors = [];

//   if (!name || !email || !password || !password2) {
//     errors.push({ msg: "please fill all the fields" });
//   }

//   if (password !== password2) {
//     errors.push({ msg: "password dont match" });
//   }

//   if (password.length < 6) {
//     errors.push({ msg: "password should be atleast 6 digit" });
//   }
//   if (errors.length > 0) {
//     res.render("register", {
//       errors,
//       name,
//       email,
//       password,
//       password2,
//     });
//   } else {
//     User.findOne({ email: email }).then((user) => {
//       if (user) {
//         errors.push({ msg: "email already registered " });
//         res.render("register", {
//           errors,
//           name,
//           email,
//           password,
//           password2,
//         });
//       } else {
//         const newUser = new User({
//           name,
//           email,
//           password,
//         });
//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;

//             newUser.password = hash;

//             newUser
//               .save()
//               .then((user) => {
//                 req.flash("success_msg", "you are now registered");
//                 res.redirect("/users/login");
//               })
//               .catch((err) => {
//                 console.log(err);
//               });
//           });
//         });
//       }
//     });
//   }
// });

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/user/login",
//     failureFlash: true,
//   })(req, res, next);
// });

// module.exports = router;

// tAVERSY CODE

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/user");
const { forwardAuthenticated } = require("../config/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("register")
);

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// // Logout
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });

module.exports = router;
