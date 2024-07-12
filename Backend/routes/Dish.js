// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers
const { addNewDIsh, fetchAllDish, toggleDish } = require("../controllers/Dish");

router.get("/", fetchAllDish);
router.post("/", addNewDIsh);
router.patch("/:dishId/toggle", toggleDish);

module.exports = router