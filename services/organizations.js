const {Organization, Relation} = require('../models/index');

module.exports.createOrganizationStructure = createOrganizationStructure;

async function createOrganizationStructure(organizationsDto) {
    let organizationGraph = {
        organizationNames: [],
        adjacencyList: []
    };

    // Deleting the previous organization structure
    await Relation.destroy({ where: {}});
    await Organization.destroy({ where: {}});

    // Parsing the input JSON to a adjacency list and retrieving unique organization names
    // NB! Recursive function
    parseOrganizationGraph(organizationGraph, organizationsDto, null);

    // Writing organizations to the database, at once
    let organizations = await Organization.bulkCreate(
        organizationGraph.organizationNames.map( orgName => ({name: orgName}) ),
        { returning: true }
        );

    // We're going to use organizations[], returned from the bulkCreate(),
    // as a local cache not to query the database for IDs
    let findOrganizationIdByName = (organizations, organizationName) => {
        let organization = organizations.find(org => org.name == organizationName);
        return organization.id;
    };

    // Writing relations to the database, at once
    await Relation.bulkCreate(
        organizationGraph.adjacencyList.map( relation =>
            ({
                parentId: findOrganizationIdByName(organizations, relation.parent),
                daughterId: findOrganizationIdByName(organizations, relation.daughter)
            })
        ),
        { returning: false }
        );
}

function parseOrganizationGraph(organizationGraph, organizationDto, parentName) {
    let organizationName = organizationDto.org_name;

    // If the organization name is not in the unique organization names list, adding it
    if (organizationGraph.organizationNames.indexOf(organizationName) === -1) {
        organizationGraph.organizationNames.push(organizationName);
    }

    // Creating a relation row except if not "root" organization, i.e. the one that has no parent
    if (parentName !== null) {
        organizationGraph.adjacencyList.push({parent: parentName, daughter: organizationName});
    }

    // Checking whether an organization has daughters
    if (organizationDto.daughters !== undefined && organizationDto.daughters !== null) {
        // Running the function recursively for all the daughters
        organizationDto.daughters.forEach( (daughterOrganization) => {
            parseOrganizationGraph(organizationGraph, daughterOrganization, organizationName);
        });
    }
}

// Used when there is a need in a ForEach that wait for the execution
// of all the callback functions it started.
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}