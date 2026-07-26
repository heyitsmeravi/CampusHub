const express = require('express');
const router = express.Router();
const {createFaculty, getAllFaculties, getFaculty, updateFaculty, deleteFaculty} = require('../controllers/facultyController');

router.post('/', createFaculty);
router.get('/', getAllFaculties);
router.get("/:id",getFaculty);
router.patch("/:id",updateFaculty);
router.delete("/:id",deleteFaculty);

module.exports = router;