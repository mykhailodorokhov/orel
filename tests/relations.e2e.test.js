const request = require('supertest');

const app = require('../app');
const {Organization, Relation} = require('../models/index');

describe('testing GET /api/relations', () => {
    beforeAll( async () => {
        await seedTestData();
    });

    test('should respond with code 200 when relations are found', async () => {
        const response = await request(app).get('/api/relations/1?orgname=Estonia');
        expect(response.statusCode).toBe(200);
    });

    test('should respond with right content when relations are found', async () => {
        const response = await request(app).get('/api/relations/1?orgname=Estonia');
        let responseJson = JSON.parse(response.text);
        expect(responseJson).toMatchObject([
            {relationship_type: "sister", org_name: "England"},
            {relationship_type: "sister", org_name: "EU"},
            {relationship_type: "parent", org_name: "Pipedrive"},
            {relationship_type: "daughter", org_name: "Tallinn"},
            {relationship_type: "daughter", org_name: "Tartu"}
        ]);
    });

    test('should respond with code 404 when asking for the page that does not exist', async () => {
        const response = await request(app).get('/api/relations/2?orgname=Estonia');
        expect(response.statusCode).toBe(404);
    });

    test('should respond with code 200 when relations are found', async () => {
        const response = await request(app).get('/api/relations/1?orgname=Pipedrive');
        expect(response.statusCode).toBe(200);
    });

    test('should respond with code 400 when no "orgname" parameter in query', async () => {
        const response = await request(app).get('/api/relations/1');
        expect(response.statusCode).toBe(400);
    });

    test('should respond with code 400  when the page number is 0(zero)', async () => {
        const response = await request(app).get('/api/relations/0?orgname=Pipedrive');
        expect(response.statusCode).toBe(400);
    });

    test('should respond with code 400 when the page number is negative', async () => {
        const response = await request(app).get('/api/relations/-2?orgname=Pipedrive');
        expect(response.statusCode).toBe(400);
    });

    test('should respond with 404 when no data is found', async () => {
        const response = await request(app).get('/api/relations/1?orgname=Parnu');
        expect(response.statusCode).toBe(404);
    });

    afterAll( async () => {
        await Relation.destroy({ where: {}});
        await Organization.destroy({ where: {}});
    });
});

async function seedTestData() {
    let organizations = await Organization.bulkCreate([
        { name: "Pipedrive"},
        { name: "Estonia"},
        { name: "Tallinn"},
        { name: "Tartu"},
        { name: "England"},
        { name: "London"},
        { name: "EU"}
    ]);

    let addRelation = (parentName, daughterName) => {
        let parent = organizations.find(org => org.name == parentName);
        let daughter = organizations.find(org => org.name == daughterName);
        return { parentId: parent.id, daughterId: daughter.id };
    };

    await Relation.bulkCreate([
            addRelation("Pipedrive", "Estonia"),
            addRelation("Estonia", "Tallinn"),
            addRelation("Estonia", "Tartu"),
            addRelation("Pipedrive", "England"),
            addRelation("England", "London"),
            addRelation("Pipedrive", "EU"),
            addRelation("EU", "Tallinn"),
            addRelation("EU", "Tartu"),
            addRelation("EU", "London"), // to review this after some time :)
        ],
        { returning: false }
    );
}