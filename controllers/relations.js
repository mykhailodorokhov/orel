let relationsService = require('../services/relations.js');
let organizationsValidator = require('./validation/relations.js');

exports.getRelationsByPage = (request, response) => {
    let organizationName = request.query.orgname;
    let page = request.params.page;

    // If no page is specified, showing the page number 1
    if (page === undefined || page === null) page = 1;

    // Validating request parameters
    let validationErrors = organizationsValidator.getRelationsByPageValidate(request);
    if (validationErrors.length > 0) {
        response.status(400).json({ errors: validationErrors });
        return;
    }

    relationsService.getRelationsByPage(organizationName, page).then((relationsDto) => {
        if (relationsDto.length > 0){
            // Responding with a DTO object
            response.status(200).json(relationsDto);
        } else {
            // If the organization is not found or the page number exceeded the range responding with 404
            response.status(404).end();
        }
    }).catch((error) => {
        // Something bad happened
        console.log(error);
        response.status(500).json({
            error: "An error happened while trying to get the list of " +
                "relations of the following organization: " + organizationName
        });
    });
};