import foodModel from "../models/foodModel.js";

//add food item
export const addFood = async (req, res) => { 
  try {
    //req.file.path contains the uploaded Cloudinary URL
    const imageUri = req.file ? req.file.path : '';
    

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imageUri, //saving full cloudinary URL
    });
    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (err) {
    console.error('Cloudinary upload/ save error:',err);
    res.json({ success: false, message: "Error while saving food item" });
  }
};

// list food items
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});

    res.json({ success: true, data: foods });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "No food found" });
  }
};

//remove food item
export const removeFood = async (req, res) => {
  try { 
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error removing food item" });
  }
};
