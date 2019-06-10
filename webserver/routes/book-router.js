'use strict';

const express = require('express');
const checkJwt = require('../controllers/session/check-jwt-token');
const addBook = require('../controllers/books/add-book-controller');
const router = express.Router();

router.post('/book', checkJwt, addBook);

module.exports = router;