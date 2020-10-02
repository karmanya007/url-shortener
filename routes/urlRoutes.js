const express = require('express');
const urlController = require('./../controllers/urlController');

const router = express.Router();

router.route('/').post(urlController.createUrl);

router.route('/:id').delete(urlController.deleteUrl);

router.route('/checkSlug/:slug').get(urlController.checkSlug);

module.exports = router;
