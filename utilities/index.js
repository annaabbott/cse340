const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
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

module.exports = Util;

// const add = a => b => a + b;

// // function multiply(x) {
// //   return function (y) {
// //     return x * y;
// //   }
// // }

// function multiply(x) {
//   return y => x * y;
// }

// const multiplyBy2 = multiply(2);
// const multiplyBy100 = multiply(100);

// console.log(multiplyBy2(5)); // Outputs: 10
