import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item
export const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food added" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error while saving" });
  }
};

// list food items
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});

    res.json({ success: true, data: foods });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "No food found" });
  }
};

//remove food item
export const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};
