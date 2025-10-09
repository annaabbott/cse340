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
  const accountData = utilities.getAccountData(res);
  const content = utilities.buildLoginForm();
  res.render("account/login", {
    title: "Login",
    nav,
    accountData,
    content,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */

async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
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
    accountData,
    content,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration Request
 * *************************************** */
async function registerAccount(req, res) {
  console.log("### Account Controller - registerAccount");

  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
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
      accountData,
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
      accountData,
      content: loginContent,
    });
  } else {
    console.log("### Account Controller - registration failed");

    req.flash("notice", "Sorry, the registration failed.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      accountData,
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
      res.status(200).render("account/manage", {
        title: "Account Management",
        nav,
        accountData,
        content: utilities.buildAccountManagement(accountData),
      });
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        accountData: null,
        errors: null,
        account_email,
        content,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */

async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  const content = utilities.buildAccountManagement(accountData);
  res.render("account/manage", {
    title: "Manage Account",
    nav,
    accountData,
    content,
  });
}

/* ****************************************
 *  Deliver update account view
 * *************************************** */

async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  const content = utilities.buildEditAccount(accountData);
  res.render("account/edit", {
    title: "Edit Account",
    nav,
    accountData,
    content,
  });
}

/* ****************************************
 *  Process Update Request
 * *************************************** */
async function updateAccount(req, res) {
  console.log("### Account Controller - updateAccount");

  let nav = await utilities.getNav();
  let accountData = utilities.getAccountData(res);

  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  try {
    const results = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    accountData = results.rows[0];
    console.log("### Account Controller - accountData", accountData);
    const content = utilities.buildEditAccount(accountData);

    req.flash(
      "notice",
      `Congratulations, your account has been updated, ${account_firstname}.`
    );

    res.status(200).render("account/edit", {
      title: "Edit Account",
      nav,
      accountData,
      content,
    });
  } catch (error) {
    console.log("### Account Controller - error updating account info", error);

    req.flash(
      "notice",
      "Sorry, there was an error updating your account info."
    );

    res.render("account/edit", {
      title: "Edit Account",
      nav,
      accountData,
      content,
    });

    return;
  }
}

/* ****************************************
 *  Process Change password Request
 * *************************************** */
async function changePassword(req, res) {
  console.log("### Account Controller - changePassword");

  let nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_id,
  } = req.body;

  const registerContent = utilities.buildEditAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );
  let hashedPassword;
  try {
    //regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    console.log("### Account Controller - error hashing password", error);
    req.flash("notice", "Sorry, there was an error changing your password.");
    res.status(500).render("account/edit", {
      title: "Edit Account",
      nav,
      accountData,
      content: registerContent,
      errors: null,
    });
    return;
  }
  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );
  if (regResult) {
    console.log("### Account Controller - successful password change");
    req.flash("notice", `Congratulations, your password has been changed.`);
    res.status(201).render("account/edit", {
      title: "Edit Account",
      nav,
      accountData,
      content: registerContent,
      errors: null,
    });
  } else {
    console.log("### Account Controller - password change failed");
    req.flash("notice", "Sorry, the password change failed.");
    res.status(500).render("account/edit", {
      title: "Edit Account",
      nav,
      accountData,
      content: registerContent,
      errors: null,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildEditAccount,
  updateAccount,
};
