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
    xit('GET:404 sends an appropriate status and response message when there is nothing in the data base' , () => {
        db.query(`DELETE FROM topics`)
        return request(app)
        .get('/api/topics')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('No topics exist')
        })
    });
});