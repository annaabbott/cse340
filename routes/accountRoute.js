// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../utilities/index");
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
// Route for inventory by classification view
// router.get("/type/:classificationId", invController.buildByClassificationId);
// router.get("/detail/:productId", invController.buildByInvId);

//Route for 'my account' view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegistration)
);
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
