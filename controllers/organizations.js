let organizationsService = require('../services/organizations.js');
let organizationsValidator = require('./validation/organizations.js');

exports.createOrganizationStructure = (request, response) => {
    let organizationsDto = request.body;

    // Validating request parameters
    let validationErrors = organizationsValidator.getRelationsByPageValidate(request);
    if (validationErrors.length > 0) {
        response.status(400).json({ errors: validationErrors });
        return;
    }

    organizationsService.createOrganizationStructure(organizationsDto).then(() => {
        // Responding with a happy 201 code
        response.status(201).json({message: "Organization structure is created."});
    }).catch((error) => {
        // Something bad happened
        console.log(error);
        response.status(500).json({
            error: "An error happened while trying to write organizational structure to database."
        });
    });
};