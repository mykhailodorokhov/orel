let express = require('express');
let router = express.Router();

let organizationsController = require('../controllers/organizations.js');

/**
 * @api {get} relations/:page?orgname=:organization-name
 * @apiName Create organizations structure
 * @apiGroup Organizations
 *
 * @apiParam {Object} organizations     JSON with an organization structure
 *
 * @apiSuccess (200) {Object} Success message
 *
 * @apiError (400) {Object} Error message
 */
router.post('/', organizationsController.createOrganizationStructure);

module.exports = router;