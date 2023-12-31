const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Product = require("../models/productModel");
const Profile = require("../models/profileModel");
const { default: mongoose } = require("mongoose");


//controller for signup (get)
const signup = (req, res) => {
  res.render("signup", { message: req?.session?.message });
};



//userHome
const userHome = (req, res) => {
  if (req.session.user) {
    res.render("userHome", { message: req?.session?.username });
  } else {
    res.redirect("/login");
  }
};



//Login
const Login = (req, res) => {
  if (!req.session.user) {
    res.render("login", { message: req?.session?.message });
  } else if (!req.session.isAdmin) {
    res.redirect("/userHome");
  } else {
    res.redirect("/adminHome");
  }
};



// Route to create a new user
const createUser = async (req, res) => {
  const { username, email, password} = req.body;

  try {
    // Check if the user already exists by username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      // User already exists
      req.session.message = "Username or email already exists";
      return res.redirect("/");
    }
    //encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // If user doesn't exist, create a new one
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    req.session.user = username;
    // req.session.username = username
    res.redirect("/userHome");
  } catch (error) {
    res.status(500).send(`Error creating user: ${error.message}`);
  }
};




//userLogin
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      req.session.message = "Invalid email or password";
      return res.redirect("/login");
    }

    // Compare hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      req.session.message = "Invalid email or password";
      return res.redirect("/login");
    }

    // Set user session
    req.session.user = user.username;
    // Check user type
    if (user.userType === "admin") {
      req.session.isAdmin = true;
      return res.redirect("/adminHome"); // Redirect to admin home page
    } else {
      req.session.isAdmin = false;
      req.session.username = user.username;
      return res.redirect("/userHome"); // Redirect to regular user home page
    }
  } catch (error) {
    res.status(500).send(`Error during login: ${error.message}`);
  }
};




//controller for logout (get)
const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.sendStatus(500);
    } else {
      res.redirect("/login");
    }
  });
};




//productlist
const productList = async (req, res) => {
  try {
    if (req.session.user) {
      // Fetch all products from the database
      const products = await Product.find();

      // Render the product list page with the products
      res.render("allProducts", { products });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    // Handle any errors (e.g., log them or render an error page)
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

//product details
const productDetails = async (req, res) => {
  try {
    if (req.session.user) {
      const productId = req.params.productId;

      // Fetch the product from the database by ID
      const product = await Product.findById(productId);

      // Render the product details page with the product
      res.render("productDetails", { product });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

//user profile
const userProfile = async (req, res) => {
  try {
    if (req.session.user) {
      // Fetch user details from the database
      const user = await User.findOne({ username: req.session.user });

      // fetch user profile from profile collection
      const profile = await User.aggregate([
        {$match:{_id: new mongoose.Types.ObjectId(user._id)}},
        {
          $lookup:{
            from:'profiles',
            localField:'_id',
            foreignField:'userId',
            as:'profileDetails'
          }
        }
      ]);
      console.log(profile);
      // Render the user profile page with user details
      res.render("userProfile", { user , profile });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



//edit profile page
const editProfilepage = async (req, res) => {
  try {
    if (req.session.user) {
      // Fetch user details from the database
      const user = await User.findOne({ username: req.session.user });
      const profile = await User.aggregate([
        {$match:{_id: new mongoose.Types.ObjectId(user._id)}},
        {
          $lookup:{
            from:'profiles',
            localField:'_id',
            foreignField:'userId',
            as:'profileDetails'
          }
        }
      ]);
      console.log(profile);

      // Render the edit profile page with user details
      res.render("editProfile", { user ,profile });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



//edit profile
const editProfile = async (req, res) => {
  try {
    if (req.session.user) {
      // Update user details in the database
      const { username, email, address, phone,pin} = req.body;
      await User.updateOne(
        { username: req.session.user },
        { $set: { username, email, address } }
      );

      const user=await User.findOne({username:req.session.user})
      const userId=user._id

      // Check if the user has an existing profile
      // const existingProfile = await Profile.findOne({ userId });

      // if (existingProfile) {
      //   // If an existing profile is found, update the details
      //   await Profile.updateOne(
      //     { userId },
      //     { $set: { address, phone, pin } }
      //   );
      // } else {
      //   // If no existing profile is found, create a new profile
      //   const newProfile = new Profile({
      //     userId,
      //     address,
      //     phone,
      //     pin,
      //   });

      //   // Save the new profile
      //   await newProfile.save();
      // }

      // Use upsert to update or insert the profile details
      await Profile.updateOne(
        { userId },
        { $set: { userId, address, phone, pin } },
        { upsert: true }
      );

      // Redirect to the user profile page after updating
      res.redirect("/user/profile");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  signup,
  createUser,
  Login,
  userHome,
  userLogin,
  Logout,
  productList,
  productDetails,
  userProfile,
  editProfile,
  editProfilepage,
};
