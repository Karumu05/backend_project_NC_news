const request = require("supertest");
const app = require("../app/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");


beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
});

describe('GET /api/topics', () => {
    it('should respond with an array of all topics ', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            const body = response.body
            expect(body.topics.length).toBe(3)
            body.topics.forEach((topic) => {
                expect(typeof topic['description']).toBe('string')
                expect(typeof topic['slug']).toBe('string')
            })
            expect(body.topics[0]['slug']).toBe('mitch')
        })
    });
    it('should respond with a status code of 200', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
    });
});

describe('GET /api', () => {
    it('should respond with an accurate JSON describing other endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            const data = response.body.endpoints
            expect(Object.keys(data)).toEqual(['GET /api', 'GET /api/topics', 'GET /api/articles'])
            const endpointKeys = ['description', 'queries', 'exampleResponse']
            for (endpoint in data){
                const item = data[endpoint]
                expect(Object.keys(item)).toEqual(endpointKeys)

            }
        })
    });
});