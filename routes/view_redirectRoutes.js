const express = require('express');
const viewsController = require('../controllers/viewsController');
const urlController = require('../controllers/urlController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/error/:slug', viewsController.getError);

router.route('/:slug').get(urlController.redirect);
router.route('/:slug/:privateSlug').get(urlController.redirect);

module.exports = router;
