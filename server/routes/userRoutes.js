const express = require('express');
const router = express.Router();
//controllers
const {getAllUsers,getMyProfile,getUser, updateMyProfile} = require("../controllers/userController");
//middleware
const authMiddleware= require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/",authMiddleware,roleMiddleware(["admin"]),getAllUsers);
router.get("/profile",authMiddleware,roleMiddleware(["student","admin","faculty"]),getMyProfile);
router.get("/:id",authMiddleware,roleMiddleware(["admin"]),getUser);
router.patch("/profile",authMiddleware, roleMiddleware(["student","admin","faculty"]),updateMyProfile);
module.exports = router;