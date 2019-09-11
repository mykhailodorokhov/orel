const {Organization, Relation} = require('../models/index');
const Op = require('../models/index').Sequelize.Op;

module.exports.getRelationsByPage = getRelationsByPage;

const PAGE_SIZE = 100;

async function getRelationsByPage(organizationName, page) {
    // Getting relations of the given organization
    let relationsDto = await getRelations(organizationName);

    // Paginating results
    return relationsDto.slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page);
}

async function getRelations(organizationName) {
    let relations = [];

    // Finding parents
    let parentNames = await findParentNamesOf(organizationName);

    // Finding daughters
    let daughterNames = await findDaughterNamesOf(organizationName);

    // Finding sisters. It has no sense to search for sisters
    // if a company has no parent, i.e. is a "root" company.
    let sisterNames = [];
    if (parentNames !== undefined && parentNames.length !== 0) {
        sisterNames = await findSisterNamesOf(organizationName, parentNames);
    }

    // Postprocessing to match output structure
    parentNames.forEach(x => relations.push({
        relationship_type: "parent", org_name: x
    }));
    daughterNames.forEach(x => relations.push({
        relationship_type: "daughter", org_name: x
    }));
    sisterNames.forEach(x => relations.push({
        relationship_type: "sister", org_name: x
    }));

    // Sorting the relatives by their name
    relations.sort((a,b) => {
        if (a.org_name.toLowerCase() < b.org_name.toLowerCase()) return -1;
        if (a.org_name.toLowerCase() > b.org_name.toLowerCase()) return 1;
        return 0;
    });

    return relations;
}

async function findParentNamesOf(organizationName) {
    let parents = await Relation.findAll({
        include: [{
            model: Organization, as: 'parent', attributes: ['name']
        }, {
            model: Organization, as: 'daughter', attributes: ['name'],
            where: {name: organizationName}
        }]
    });

    return parents.map(x => x.parent.name);
}

async function findDaughterNamesOf(organizationName) {
    let daughters = await Relation.findAll({
        include: [{
            model: Organization, as: 'parent', attributes: ['name'],
            where: {name: organizationName}
        }, {
            model: Organization, as: 'daughter', attributes: ['name']
        }]
    });

    return daughters.map(x => x.daughter.name);
}

async function findSisterNamesOf(organizationName, parentNames) {
    let sisters = await Relation.findAll({
        attributes: [],
        include: [{
            model: Organization, as: 'parent', attributes: [],
            where: {
                name: { [Op.or]: parentNames },
            }
        },{
            model: Organization, as: 'daughter', attributes: ['name'],
            where: {
                name: { [Op.ne]: organizationName },
            }
        }]
    });

    let sisterNames = sisters.map(x => x.daughter.name);

    let uniqueSisterNames = [];
    sisterNames.forEach( (x) => {
        if (uniqueSisterNames.indexOf(x) === -1) {
            uniqueSisterNames.push(x);
        }
    });

    return uniqueSisterNames;
}