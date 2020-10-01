const express = require('express');
const urlController = require('./../controllers/urlController');

const router = express.Router();

router.route('/').post(urlController.getUrl);

router.route('/:id').delete(urlController.deleteUrl);

router.route('/slug/:slug').get(urlController.redirect);

router.route('/slug/checkSlug/:slug').get(urlController.checkSlug);

module.exports = router;
