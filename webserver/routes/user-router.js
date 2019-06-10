'use strict';

const express = require('express');
const multer = require('multer');
const checkJwtToken = require('../controllers/session/check-jwt-token');
const getUserProfile = require('../controllers/user/get-user-profile-controller');

const upload = multer();
const router = express.Router();

router.get('/user', checkJwtToken, getUserProfile);


module.exports = router;
