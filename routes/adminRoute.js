const express = require("express");
const router = express.Router();
const adminContoller=require("../controllers/adminController")
const upload = require('../middlewares/multerConfig');


//homepage admin get
router.get("/adminHome",adminContoller.adminHome );

//admin/suer
router.get('/admin/users',adminContoller.userList);

// Delete user
router.post('/admin/users/:id', adminContoller.deleteUser);

//admin/products
router.get('/admin/products',adminContoller.productList);

//admin/addProduct
router.get('/admin/addProduct',adminContoller.newProductForm);

//adding new product
router.post('/admin/products', upload.single('productImage'),adminContoller.addNewProduct);

// update product form
router.get('/admin/products/:id/edit', adminContoller.productUpdateForm);

// updating product
router.post('/admin/products/:id', adminContoller.updateProduct);

// delete product 
router.post('/admin/deleteProduct/:id', adminContoller.deleteProduct);



module.exports=router