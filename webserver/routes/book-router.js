'use strict';

const express = require('express');
const checkJwt = require('../controllers/session/check-jwt-token');
const addBook = require('../controllers/books/add-book-controller');
const getLibrary = require('../controllers/books/get-library-controller');
const getLibraryByUuid = require('../controllers/books/get-library-by-uuid-controller');
const uploadCover = require('../controllers/books/upload-cover');
const getStock = require('../controllers/books/get-stock-controller');
const deleteBook = require('../controllers/books/delete-book-controller');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.post('/book', checkJwt, addBook);
router.get('/library', checkJwt, getLibrary);
router.get('/librarybyuuid', checkJwt, getLibraryByUuid);
router.post('/cover', checkJwt, upload.single('cover'), uploadCover);
router.get('/stock', checkJwt, getStock);
router.delete('/delete/:id', checkJwt, deleteBook);
module.exports = router;