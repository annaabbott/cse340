// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route for inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;
