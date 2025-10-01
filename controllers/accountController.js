const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  const content = utilities.buildLoginForm();
  res.render("account/login", {
    title: "Login",
    nav,
    content,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */

async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_firstname = "",
    account_lastname = "",
    account_email = "",
  } = req.body ?? {};

  let content = utilities.buildRegistrationForm(
    account_firstname,
    account_lastname,
    account_email
  );

  console.log("### Account Controller - buildRegistration");

  res.render("account/register", {
    title: "Register",
    nav,
    content,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  console.log("### Account Controller - registerAccount");

  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const registerContent = utilities.buildRegistrationForm(
    account_firstname,
    account_lastname,
    account_email
  );

  let hashedPassword;
  try {
    //regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    console.log("### Account Controller - error hashing password", error);

    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );

    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      content: registerContent,
      errors: null,
    });
    return;
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    console.log("### Account Controller - successful registration");

    const loginContent = utilities.buildLoginForm();
    req.flash(
      "notice",
      `Congratulations, you're registered, ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      content: loginContent,
    });
  } else {
    console.log("### Account Controller - registration failed");

    req.flash("notice", "Sorry, the registration failed.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      content: registerContent,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  const content = utilities.buildLoginForm();
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      content,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        content,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
};
