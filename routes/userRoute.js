const express = require("express");
const router = express.Router();
const userContoller=require("../controllers/userController")
const validateUserInput = require('../middlewares/userInputValidation');
const { productList } = require("../controllers/adminController");


//signup get
router.get("/", userContoller.signup);

//signup post
router.post("/signup",validateUserInput, userContoller.createUser);

//login get
router.get("/login", userContoller.Login);

//login post
router.post("/login", userContoller.userLogin);

//homepage user get
router.get("/userHome", userContoller.userHome);

//logout
router.get("/logout", userContoller.Logout);

//all product list
router.get('/user/productList',userContoller.productList)

//product details
router.get('/productDetails/:productId',userContoller.productDetails)

//user profile
router.get('/user/profile', userContoller.userProfile);

// Edit profile route get
router.get('/user/editProfile', userContoller.editProfilepage);

// Edit profile route post
router.post('/user/editProfile', userContoller.editProfile);

module.exports=router;