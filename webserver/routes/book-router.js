'use strict';

const express = require('express');
const checkJwt = require('../controllers/session/check-jwt-token');
const addBook = require('../controllers/books/add-book-controller');
const getLibrary = require('../controllers/books/get-library-controller');
const uploadCover = require('../controllers/books/upload-cover');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.post('/book', checkJwt, addBook);
router.get('/library', checkJwt, getLibrary);
router.post('/cover', checkJwt, upload.single('cover'), uploadCover);
module.exports = router;