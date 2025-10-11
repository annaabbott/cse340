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

//management add classification route
router.get(
  "/delete-classification",
  utilities.handleErrors(managementController.deleteClassification)
);

router.post(
  "/delete-classification",
  utilities.handleErrors(managementController.deleteClassificationPostback)
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

router.get(
  "/delete-inventory/:inv_id",
  utilities.handleErrors(managementController.deleteInventory)
);

router.post(
  "/delete-inventory",
  utilities.handleErrors(managementController.deleteInventoryPostback)
);

module.exports = router;
