const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 * Migrate classification data
 * ************************** */

async function migrateInventory(oldClassificationId, newClassificationId) {
  try {
    const data = `
      UPDATE inventory
      SET 
        classification_id = $1
      WHERE classification_id = $2
  `;
    const result = await pool.query(data, [
      newClassificationId,
      oldClassificationId,
    ]);
    console.log(
      `${result.rowCount} items migrated from ${oldClassificationId} to ${newClassificationId}`
    );
  } catch (error) {
    console.error("Inventory migration error: " + error);
  }
}

/* ***************************
 * Delete classification data
 * ************************** */
async function deleteClassification(classificationId) {
  try {
    const data = `
    DELETE FROM classification 
    WHERE classification_id = $1;
    `;
    await pool.query(data, [classificationId]);
  } catch (error) {
    console.error("Unable to delete inventory classification: " + error);
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
    return [];
  }
}

async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory  
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryByInvId error " + error);
  }
}

async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
      [classification_name]
    );
    return data.rows[0];
  } catch (error) {
    console.error("addClassification error " + error);
    return false;
  }
}

async function addInventory(
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
) {
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory 
      (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
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
      ]
    );
    return data.rows[0];
  } catch (error) {
    console.error("addInventory error " + error);
  }
}

async function deleteInventory(inv_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data;
  } catch (error) {
    console.error("deleteInventory error " + error);
  }
}

module.exports = {
  getClassifications,
  addClassification,
  addInventory,
  getInventoryByClassificationId,
  getInventoryByInvId,
  migrateInventory,
  deleteClassification,
};
