const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul class='navList'>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles"> ' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildDetailView = async function (data) {
  let miles = data.inv_miles;
  let formattedMiles = new Intl.NumberFormat("en-US").format(miles);
  return `<div class="detailViewContainer">
  <img class="detailsImg" src="${data.inv_img}" alt="Image of ${
    data.inv_make
  } ${data.inv_model}"/>
  <div class="detailInfoContainer">
  <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
  <p><span class="bold">Price: </span> $${new Intl.NumberFormat("en-US").format(
    data.inv_price
  )}</p>
  <p><span class="bold">Description: </span> ${data.inv_description}</p>
  <p><span class="bold">Color: </span> ${data.inv_color}</p>
  <p><span class="bold">Miles: </span> ${formattedMiles} </p>
  </div>
  </div>`;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

Util.buildLoginForm = (account_firstname) => {
  return `<form class="loginForm" method="POST" action="/account/login">
  <label for="account_email">Email</label>
  <input type="email" id="account_email" name="account_email" required value="${
    account_firstname || ""
  }"/>
  <label for="account_password">Password</label>
  <input type="password" id="account_password" name="account_password" required />
  <p class="password-requirements">Passwords must be at least 12 characters and contain at least 1 capital letter, at least 1 number, and at least 1 special character</p>
  <button type="submit" id="loginBtn" name="loginBtn">LOGIN</button>
  <p>No account? <a href="/account/register">Sign up</a></p>
  </form>`;
};

//Registration form
Util.buildRegistrationForm = (
  account_firstname,
  account_lastname,
  account_email
) => {
  return `<form class="registrationForm" method="POST" action="/account/register">
  <label for="account_firstname">First Name</label>
  <input type="text" id="account_firstname" name="account_firstname" required value="${account_firstname}"/>
  <label for="account_lastname">Last Name</label>
  <input type="text" id="account_lastname" name="account_lastname" required value="${account_lastname}"/>
  <label for="account_email">Email</label>
  <input type="email" id="account_email" name="account_email" required value="${account_email}"/>
  <label for="account_password">Password</label>
  <p class="password-requirements">Passwords must be at least 12 characters and contain at least 1 capital letter, at least 1 number, and at least 1 special character</p>
  <input type="password" id="account_password" name="account_password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" required />
  <button type="submit" id="regBtn" name="regBtn">REGISTER</button>
  </form>`;
};

Util.buildManagement = () => {
  return `
    <p>
      <a
        href="/inv/add-classification"
        title="Add New Classification"
      >
        Add Classification
      </a>
    </p>
    <p>
      <a
        href="/inv/delete-classification"
        title="Remove Classification"
      >
        Migrate Data and Remove Classification
      </a>
    </p>
    <p>
      <a
        href="/inv/add-inventory"
        title="Add Vehicle"
      >
        Add New Vehicle
      </a>
    </p>`;
};

Util.buildAddClassificationForm = () => {
  return `
    <div class="add-classification-form-container">
    <p>Field is Required</p>
    <form method="POST" action="/inv/add-classification">
      <label for="classification_name">Classification Name</label>
      <input type="text" id="classification_name" name="classification_name" required pattern="^[A-Za-z0-9]+$"/>
      <p>Classification Name cannot contain a space or special character</p>
      <button type="submit" id="addClassificationBtn" name="addClassificationBtn">ADD CLASSIFICATION</button>
    </form>
    </div>`;
};

Util.buildRemoveClassificationForm = async (classification_id) => {
  const selectList1 = await Util.buildClassificationList2(
    "classRemove",
    "classRemove"
  );
  const selectList2 = await Util.buildClassificationList2(
    "classMigrate",
    "classMigrate"
  );
  return `
  <div class="removeClassificationFormContainer">
  
  <form method="POST" action="/inv/delete-classification">
    <p>Select a Classification to Remove</p>
    <label for="classRemove">Classification Name</label>
    ${selectList1}
    <p>Migrate all data into classification:</p>
    ${selectList2}
    <p>Warning! All data in the selected first classification will be merged into the selected second classification.</p>
    <button type="submit" id="migrateDataBtn" name="migrateDataBtn">CONTINUE</button>
  </form>
  </div>
  `;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

Util.buildClassificationList2 = async function (name, id) {
  let data = await invModel.getClassifications();
  let classificationList = `<select name="${name}" id="${id}" required>`;
  classificationList += `<option value=""></option>`;
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}">${row.classification_name}</option>`;
  });
  classificationList += "</select>";
  return classificationList;
};

Util.buildAddInventoryForm = async (classification_id) => {
  const selectList = await Util.buildClassificationList(classification_id);
  return `
  <div class="add-inventory-form-container">
  <p>All Fields are Required</p>
  <form method="POST" action="/inv/add-inventory">
    <label for="classificationList">Classification Name</label>
    ${selectList}
    <label for="inv_make">Make</label>
    <input type="text" id="inv_make" name="inv_make" pattern=".{3,}" placeholder="Min of 3 characters" required />
    <label for="inv_model">Model</label>
    <input type="text" id="inv_model" name="inv_model" pattern=".{3,}" placeholder="Min of 3 characters" required />
    <label for="inv_description">Description</label>
    <textarea id="inv_description" name="inv_description" required></textarea>
    <label for="inv_image">Image Path</label>
    <input type="text" id="inv_image" name="inv_image" placeholder="/images/vehicles/no-image.png" pattern="^/images/[A-Za-z0-9/_-]+\.(png|jpg|jpeg|gif|webp)$" required />
    <label for="inv_thumbnail">Thumbnail Path</label>
    <input type="text" id="inv_thumbnail" name="inv_thumbnail" placeholder="/images/vehicles/no-image.png" pattern="^/images/[A-Za-z0-9/_-]+\.(png|jpg|jpeg|gif|webp)$" required />
    <label for="inv_price">Price</label>
    <input type="text" id="inv_price" name="inv_price" placeholder="Decimal or Integer" required />
    <label for="inv_year">Year</label>
    <input type="text" id="inv_year" name="inv_year" pattern="^\d{4}$" placeholder="4-digit year" required />
    <label for="inv_miles">Miles</label>
    <input type="number" id="inv_miles" name="inv_miles" placeholder="Digits only" required />
    <label for="inv_color">Color</label>
    <input type="text" id="inv_color" name="inv_color" required />
    <button type="submit" id="addInventoryBtn" name="addInventoryBtn">ADD VEHICLE</button>
  </form>
  </div>`;
};

Util.buildDeleteInventoryForm = async (classification_id) => {
  const selectList = await Util.buildClassificationList(classification_id);
  return `
  <div class="add-inventory-form-container">
  <p>All Fields are Required</p>
  <form method="POST" action="/inv/delete-inventory">
    <label for="classificationList">Classification Name</label>
    ${selectList}
    <label for="inv_make">Make</label>
    <input type="text" id="inv_make" name="inv_make" pattern=".{3,}" placeholder="Min of 3 characters" readonly required />
    <label for="inv_model">Model</label>
    <input type="text" id="inv_model" name="inv_model" pattern=".{3,}" placeholder="Min of 3 characters" readonly required />
vehicles/no-image.png" pattern="^/images/[A-Za-z0-9/_-]+\.(png|jpg|jpeg|gif|webp)$" required />
    <label for="inv_price">Price</label>
    <input type="text" id="inv_price" name="inv_price" placeholder="Decimal or Integer" readonly required />
    <label for="inv_year">Year</label>
    <input type="text" id="inv_year" name="inv_year" pattern="^\d{4}$" placeholder="4-digit year" readonly required />
    <p>Confirm Deletion - The delete is permanent.</p>
   <button type="submit" id="deleteInventoryBtn" name="deleteInventoryBtn">DELETE VEHICLE</button>
  </form>
  </div>`;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        next();
      }
    );
  } else {
    next();
  }
};

Util.getAccountData = function (res) {
  const accountData = res.locals.accountData ?? null;
  console.log("Account Data: ", accountData);
  return accountData;
};

/* ****************************************
 *  Check Login
 * ************************************ */

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in");
    return res.redirect("/account/login");
  }
};

Util.buildAccountManagement = (accountData) => {
  let content = `
    <h2>Welcome, ${accountData.account_firstname}</h2>
    <p>You're logged in.</p>
    <a href="/account/edit">Edit Account Information</a>`;

  if (
    accountData.account_type == "employee" ||
    accountData.account_type == "admin"
  ) {
    content += `
      <h3>Inventory Management</h3>
      <a href="/inv/management">Manage Inventory</a>`;
  }

  return content;
};

Util.buildEditAccount = (accountData) => {
  return `<form class="editAccountForm" method="POST" action="/account/edit">
  <label for="account_firstname">First Name</label>
  <input type="text" id="account_firstname" name="account_firstname" required value="${accountData.account_firstname}"/>
  <label for="account_lastname">Last Name</label>
  <input type="text" id="account_lastname" name="account_lastname" required value="${accountData.account_lastname}"/>
  <label for="account_email">Email</label>
  <input type="email" id="account_email" name="account_email" required value="${accountData.account_email}"/>
  <input type="hidden" id="account_id" name="account_id" value="${accountData.account_id}"/>
  <button type="submit" id="updateBtn" name="updateBtn">UPDATE</button>
  </form>
  <form class="updatePasswordForm" method="POST" action="/account/edit-password">
  <label for="account_password">New Password</label>
  <input type="password" id="account_password" name="account_password" required />
  <p>Passwords must be at least 12 characters and contain at least 1 capital letter, at least 1 number, and at least 1 special character</p>
  <input type="hidden" id="account_id" name="account_id" value="${accountData.account_id}"/>
  <button type="submit" id="updatePasswordBtn" name="updatePasswordBtn">CHANGE PASSWORD</button>;
  </form>`;
};

module.exports = Util;
