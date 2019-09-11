let express = require('express');
let router = express.Router();

let relationsController = require('../controllers/relations.js');

/**
 * @api {get} relations/:page?orgname=:organization-name
 * @apiName Get Relations
 * @apiGroup Relations
 *
 * @apiParam {Number} page      Page of a result
 * @apiParam {String} orgname   Name of the organization to search relations for
 *
 * @apiSuccess (201) {Object} JSON with an array that contains relations of the organization
 *
 * @apiError (400) {Object} Error message
 * @apiError (404) {Object} Error message
 */
router.get('/:page', relationsController.getRelationsByPage);

module.exports = router;