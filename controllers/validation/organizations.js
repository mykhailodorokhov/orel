module.exports.getRelationsByPageValidate = (request) => {
    let body = request.body;

    validationErrors = [];

    // If no data is present in POST request, respond with error message
    if (body.org_name === undefined || body.org_name === null) {
        validationErrors.push("No JSON is supplied with a POST request or its content-type is incorrect (should be application-json)");
    }

    return validationErrors;
};