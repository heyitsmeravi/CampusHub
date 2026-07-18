const express = require('express');
const router = express.Router();
//controllers
const {getAllUsers,getMyProfile,getUser, updateMyProfile, deleteMyProfile} = require("../controllers/userController");
//middleware
const authMiddleware= require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/",authMiddleware,roleMiddleware(["admin"]),getAllUsers);
router.get("/profile",authMiddleware,roleMiddleware(["student","admin","faculty"]),getMyProfile);
router.patch("/profile",authMiddleware, roleMiddleware(["student","admin","faculty"]),updateMyProfile);
router.delete("/profile",authMiddleware,roleMiddleware(["student","faculty","admin"]),deleteMyProfile);
router.get("/:id",authMiddleware,roleMiddleware(["admin"]),getUser);
module.exports = router;