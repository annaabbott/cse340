const utilities = require("../utilities");
const invModel = require("../models/inventory-model");
const managementController = {};

managementController.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  let content = utilities.buildManagement();
  //   req.flash("notice", "This is a flash message.");
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    accountData,
    content,
  });
};

managementController.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  let content = utilities.buildAddClassificationForm();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    accountData,
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
  const accountData = utilities.getAccountData(res);
  let content = utilities.buildAddClassificationForm();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    accountData,
    content,
  });
};

managementController.deleteClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  let content = await utilities.buildRemoveClassificationForm();
  res.render("./inventory/delete-classification", {
    title: "Delete Classification",
    nav,
    accountData,
    content,
  });
};

managementController.deleteClassificationPostback = async function (req, res) {
  const { classRemove, classMigrate } = req.body;
  if (classRemove === classMigrate) {
    req.flash(
      "notice",
      "Source and destination classifictions cannot be the same."
    );
  } else {
    await invModel.migrateInventory(classRemove, classMigrate);
    await invModel.deleteClassification(classRemove);

    req.flash("notice", "Classification has been removed.");
  }

  let content = await utilities.buildRemoveClassificationForm();
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);

  res.render("./inventory/delete-classification", {
    title: "Delete Classification",
    nav,
    accountData,
    content,
  });
};

managementController.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  let content = await utilities.buildAddInventoryForm();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    accountData,
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
  const accountData = utilities.getAccountData(res);
  let content = await utilities.buildAddInventoryForm();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    accountData,
    content,
  });
};

managementController.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  let content = await utilities.buildDeleteInventoryForm();
  res.render("./inventory/delete-inventory", {
    title: "Delete Existing Vehicle From Inventory",
    nav,
    accountData,
    content,
  });
};

managementController.deleteInventoryPostback = async function (req, res) {
  const { inv_id } = req.body;
  const success = await invModel.deleteInventory(inv_id);
  if (success) {
    req.flash("notice", `Vehicle has been deleted from the inventory.`);
  } else {
    req.flash(
      "notice",
      "Sorry, the vehicle was not deleted from the database. Please try again."
    );
  }

  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  let content = await utilities.buildAddInventoryForm();
  res.render("./inventory/delete-inventory", {
    title: "Delete Existing Vehicle From Inventory",
    nav,
    accountData,
    content,
  });
};

module.exports = managementController;
