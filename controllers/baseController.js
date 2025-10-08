const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  const accountData = utilities.getAccountData(res);
  res.render("index", {
    title: "Home",
    nav,
    accountData,
  });
};

module.exports = baseController;
