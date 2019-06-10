'use strict';

const express = require('express');
const activateAccount = require('../controllers/account/activate-account');
const createAccountController = require('../controllers/account/create-account-controller');
const login = require('../controllers/account/login-controller');

const router = express.Router();

router.post('/account', createAccountController);
router.post('/account/login', login);
router.get('/account/activate', activateAccount);


module.exports = router;
