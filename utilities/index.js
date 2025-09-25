const invModel = require("../models/inventory-model");
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
  let grid;
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
  // TODO:
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
  // <pre>${JSON.stringify(data, undefined, 2)}</pre>;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

Util.buildLoginForm = () => {
  return `<form class="loginForm" method="POST" action="/account/login">
  <label for="account_email">Email</label>
  <input type="email" id="account_email" name="account_email" required />
  <label for="ccount_password">Password</label>
  <input type="password" id="account_password" name="account_password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" required />
  <p class="password-requirements">Passwords must be at least 12 characters and contain at least 1 capital letter, at least 1 number, and at least 1 special character</p>
  <button type="submit" id="loginBtn" name="loginBtn">LOGIN</button>
  <p>No account? <a href="/account/registration">Sign up</a></p>
  </form>`;
};

Util.buildRegistrationForm = () => {
  return `<form class="registrationForm" method="POST" action="/account/register">
  <label for="account_firstname">First Name</label>
  <input type="text" id="account_firstname" name="account_firstname" required />
  <label for="account_lastname">Last Name</label>
  <input type="text" id="account_lastname" name="account_lastname" required />
  <label for="account_email">Email</label>
  <input type="email" id="account_email" name="account_email" required />
  <label for="account_password">Password</label>
  <p class="password-requirements">Passwords must be at least 12 characters and contain at least 1 capital letter, at least 1 number, and at least 1 special character</p>
  <input type="password" id="account_password" name="account_password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" required />

  <button type="submit" id="regBtn" name="regBtn">REGISTER</button>

  </form>`;
};

module.exports = Util;
