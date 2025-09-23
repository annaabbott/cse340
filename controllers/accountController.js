const utilities = require("../utilities");
const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */

async function buildLogin(req, res, next) {
  console.log("######## SUCCESS");
  let nav = await utilities.getNav();
  const content = utilities.buildLoginForm();
  res.render("account/login", {
    title: "Login",
    nav,
    content,
  });
}

async function buildRegistration(req, res, next) {
  console.log("######## SUCCESS");
  let nav = await utilities.getNav();
  const content = utilities.buildRegistrationForm();
  res.render("account/register", {
    title: "Register",
    nav,
    content,
    errors: null,
  });
}

module.exports = { buildLogin, buildRegistration };
