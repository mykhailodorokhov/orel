module.exports.getRelationsByPageValidate = (request) => {
    let organizationName = request.query.orgname;
    let page = request.params.page;

    validationErrors = [];

    // Can't produce a list or relation if an organization is not specified
    if (organizationName === undefined || organizationName === null) {
        validationErrors.push("Please specify organization name as 'orgname' in the query.");
    }

    // If page number is 0, negative, or not a number we reply with a corresponding message
    if (page < 1 || isNaN(page)) {
        validationErrors.push("Page number should be a natural number.");
    }

    return validationErrors;
}