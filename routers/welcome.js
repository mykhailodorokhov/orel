let express = require('express');
let router = express.Router();

/**
 * @api {get} /
 * @apiName Welcome
 * @apiGroup Welcome
 *
 * @apiSuccess {Object} Welcome message
 */
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to OREL - (or)ganization (rel)ationships. Please use the following endpoints:",
        endpoints: [
            {
                http: "POST api/organizations",
                description: "adds organizations structure"
            },{
                http: "GET api/relations/:page?orgname=:name",
                description: "shows paginated information about relations of an organization"
            }
        ]
    });
});

module.exports = router;