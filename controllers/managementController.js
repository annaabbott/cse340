const utilities = require("../utilities");
const invModel = require("../models/inventory-model");
const managementController = {};

managementController.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  let content = utilities.buildManagement();
  //   req.flash("notice", "This is a flash message.");
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    content,
  });
};

managementController.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  let content = utilities.buildAddClassificationForm();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    content,
  });
};

managementController.addClassificationPostback = async function (req, res) {
  const { classification_name } = req.body;
  const success = await invModel.addClassification(classification_name);
  if (success) {
    req.flash("notice", `New classification has been created.`);
  } else {
    req.flash(
      "notice",
      "Sorry, the classification creation attempt failed. Please try again."
    );
  }
  let nav = await utilities.getNav();
  let content = utilities.buildAddClassificationForm();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    content,
  });
};

managementController.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let content = await utilities.buildAddInventoryForm();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    content,
  });
};

managementController.addInventoryPostback = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  const success = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );
  if (success) {
    req.flash("notice", `New vehicle has been added.`);
  } else {
    req.flash(
      "notice",
      "Sorry, the vehicle was not added to the database. Please try again."
    );
  }

  let nav = await utilities.getNav();
  let content = await utilities.buildAddInventoryForm();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    content,
  });
};

module.exports = managementController;
