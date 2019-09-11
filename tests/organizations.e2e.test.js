const request = require('supertest');

const app = require('../app');
const {Organization, Relation} = require('../models/index');

describe('testing GET /api/relations', () => {
    test('should respond with code 201 when relations are created', async () => {
        const response = await request(app).post('/api/organizations/').send(correctTestData).set("Content-type","application/json");
        expect(response.statusCode).toBe(201);
    });

    test('should respond with code 400 when JSON has incorrect syntax', async () => {
        const response = await request(app).post('/api/organizations/').send(incorrectTestData).set("Content-type","application/json");
        expect(response.statusCode).toBe(400);
    });

    test('should respond with code 400 when no JSON is provided', async () => {
        const response = await request(app).post('/api/organizations/');
        expect(response.statusCode).toBe(400);
    });

    afterAll( async () => {
        await Relation.destroy({ where: {}});
        await Organization.destroy({ where: {}});
    });
});

// An example of correct JSON
let correctTestData = {
    org_name: "Pipedrive",
    daughters: [{
        org_name: "Estonia",
        daughters: [{
            org_name: "Tallinn"
        },{
            org_name: "Tartu"
        }]
    }, {
        org_name: "England",
        daughters: [{
            org_name: "London"
        }]
    }, {
        org_name: "EU",
        daughters: [{
            org_name: "Tallinn"
        },{
            org_name: "Tartu"
        },{
            org_name: "London"
        }
        ]
    }]
};

// An example of incorrectly formatted JSON
let incorrectTestData = '{"org_name"::Pipedrive - "daughters":[daughter1, ... , daughterN]}';