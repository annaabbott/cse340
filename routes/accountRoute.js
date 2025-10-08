// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../utilities/index");
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation.js");

//Route for 'my account' view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

//Route for 'registration' view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration)
);

// Process the registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

//default route upon login
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

module.exports = router;
