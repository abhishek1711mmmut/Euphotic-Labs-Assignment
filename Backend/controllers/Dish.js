const Dish = require("../models/Dish");
const { notifyClients } = require("../config/web-socket");

// Add new dish
exports.addNewDIsh = async (req, res) => {
  try {
    const { dishId, dishName, imageUrl, isPublished } = req.body;

    // Validate input
    if (!dishId || !dishName || !imageUrl) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newDish = new Dish({
      dishId, // Generate a unique dishId
      dishName,
      imageUrl,
      isPublished: isPublished || false,
    });

    const savedDish = await newDish.save();
    return res.status(200).json({
      success: true,
      message: "Dish added successfully",
      data: savedDish,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Fetch add dishes
exports.fetchAllDish = async (req, res) => {
  try {
    const dishes = await Dish.find();
    return res.status(200).json({
      success: true,
      message: "Dish fetched successfully",
      data: dishes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle the dish
exports.toggleDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const dish = await Dish.findOne({ dishId });

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // Toggle the isPublished status
    dish.isPublished = !dish.isPublished;
    const updatedDish = await dish.save();

    notifyClients(updatedDish);

    return res.status(200).json({
      success: true,
      message: "Dish toggled successfully",
      data: updatedDish,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
