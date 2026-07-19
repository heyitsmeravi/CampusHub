const express = require("express");
const router = express.Router();
const {getAllStudents,getStudent,updateStudent,deleteStudent,createStudent} = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.post("/",authMiddleware, roleMiddleware(["admin"]), createStudent);
router.get("/",authMiddleware,roleMiddleware(["admin","faculty"]),getAllStudents);
router.get("/:id",authMiddleware, roleMiddleware(["admin","faculty"]),getStudent);
module.exports = router;
