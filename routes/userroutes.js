const express = require('express');
const { getUserDetails, addUser } = require('../controllers/usercontroller');

const router = express.Router();

router.get('/user/:id', getUserDetails);
router.post('/user', addUser); // Add new user route

module.exports = router;
