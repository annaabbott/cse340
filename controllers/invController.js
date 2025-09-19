const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByInvId = async function (req, res, next) {
  const product_id = req.params.productId;
  const data = await invModel.getInventoryByInvId(product_id); // 👈👈👈
  const content = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  //const className = data[0].classification_name;
  const vehicleMakeModel = `${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleMakeModel,
    nav,
    content,
  });
};

module.exports = invCont;
