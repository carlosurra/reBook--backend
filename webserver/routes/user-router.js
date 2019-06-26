'use strict';

const express = require('express');
const multer = require('multer');
const checkJwtToken = require('../controllers/session/check-jwt-token');
const getUserProfile = require('../controllers/user/get-user-profile-controller');
const searchUsers = require('../controllers/user/search-user-controller');
const upload = multer();
const router = express.Router();

router.get('/user', checkJwtToken, getUserProfile);
router.get('/search', checkJwtToken, searchUsers);


module.exports = router;
