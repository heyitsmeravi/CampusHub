const express = require('express');
const router = express.Router();
const {registerUser,loginUser,changePassword} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/register",registerUser);
router.post("/login",loginUser);
router.patch("/change-password",authMiddleware,changePassword);
module.exports = router;