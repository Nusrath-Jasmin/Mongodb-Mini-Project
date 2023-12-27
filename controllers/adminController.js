const User = require("../models/userModel");
const Product = require("../models/productModel");

//adminHome
const adminHome = (req, res) => {
  if (req.session.user && req.session.isAdmin) {
    req.session.message = "";
    res.render("adminHome");
  } else {
    res.redirect("/login");
  }
};

// Admin user list
const userList = async (req, res) => {

  try {
    if (req.session.user && req.session.isAdmin) {
    // Fetch all users from the database
    const users = await User.find();

    // Render the user list view with the obtained data
    res.render("userList", { users });
  }
    else{
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).send(`Error fetching user list: ${error.message}`);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    if (req.session.user && req.session.isAdmin) {
    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    // Redirect back to the user list after deletion
    res.redirect("/admin/users");
    }else{
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).send(`Error deleting user: ${error.message}`);
  }
};

//product list
const productList = async (req, res) => {
  try {
    if (req.session.user && req.session.isAdmin) {
    const products = await Product.find();
    res.render("productlist", { products });
    }
    else{
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//Add a new product
newProductForm = (req, res) => {
  if (req.session.user && req.session.isAdmin) {
  res.render("addProduct");
  }
  else{
    res.redirect("/login");
  }
};

//Adding new product
addNewProduct = async (req, res) => {
  if (req.session.user && req.session.isAdmin) {
  // Process the uploaded image and save the product with image URL
  const imageUrl = req.file ? `/uploads/${req.file.filename}`: "/default-image.jpg";
  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imageUrl,
  });

  try {
    const savedProduct = await newProduct.save();
    res.redirect("/admin/products"); // Redirect to the product list after successful creation
  } catch (err) {
    res.status(500).json({ error: err.message });
  }}
  else{
    res.redirect("/login");
  }
};

//update product form
productUpdateForm = async (req, res) => {
  try {
    if (req.session.user && req.session.isAdmin) {
    const productId = req.params.id;
    // Fetch the existing product details from the database
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      // Handle case where the product is not found
      return res.status(404).send("Product not found");
    }

    // Render the update product form with the existing product details
    res.render("updateProduct", { product: existingProduct });
  }
  else{
    res.redirect("/login");
  }

  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

//updating product
updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price } = req.body;

  try {
    if (req.session.user && req.session.isAdmin) {
    // Fetch the existing product from the database
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      // Handle case where the product is not found
      return res.status(404).send("Product not found");
    }

    // Update the product details
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.price = price;

    // If a new image file is uploaded, update the product image URL
    if (req.file) {
      existingProduct.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Save the updated product details
    await existingProduct.save();

    // Redirect to the product list page or show a success message
    res.redirect("/admin/products");
  }
  else{
    res.redirect("/login");
  }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    if (req.session.user && req.session.isAdmin) {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      // Handle case where the product is not found
      return res.status(404).send("Product not found");
    }

    // Redirect to the product list page or show a success message
    res.redirect("/admin/products");
    }
    else{
      res.redirect("/login");
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



module.exports = {
  adminHome,
  userList,
  deleteUser,
  productList,
  newProductForm,
  addNewProduct,
  productUpdateForm,
  updateProduct,
  deleteProduct
};
