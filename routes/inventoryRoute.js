// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const managementController = require("../controllers/managementController");
const utilities = require("../utilities");

// Route for inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:productId",
  utilities.handleErrors(invController.buildByInvId)
);
router.get("/foobar", invController.foobar);

//management route
router.get(
  "/management",
  utilities.handleErrors(managementController.buildManagement)
);

//management add classification route
router.get(
  "/add-classification",
  utilities.handleErrors(managementController.addClassification)
);

router.post(
  "/add-classification",
  utilities.handleErrors(managementController.addClassificationPostback)
);

//management add inventory route
router.get(
  "/add-inventory",
  utilities.handleErrors(managementController.addInventory)
);

router.post(
  "/add-inventory",
  utilities.handleErrors(managementController.addInventoryPostback)
);

module.exports = router;
