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

describe("GET /api/topics", () => {
  it("should respond with an array of all topics ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic["description"]).toBe("string");
          expect(typeof topic["slug"]).toBe("string");
        });
        expect(body.topics[0]["slug"]).toBe("mitch");
      });
  });
  it("should respond with a status code of 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
});

describe("GET /api", () => {
  it("should respond with an accurate JSON describing other endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const data = response.body.endpoints;
        const endpointKeys = ["description", "queries", "exampleResponse"];
        for (endpoint in data) {
          const item = data[endpoint];
          expect(Object.keys(item)).toEqual(endpointKeys);
        }
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should respond with an object containing the correct artile info depending on the give article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(typeof article[0]["author"]).toBe("string");
        expect(article[0]["author"]).toBe("butter_bridge");
        expect(article[0]["title"]).toBe("Living in the shadow of a great man");
        expect(article[0]["article_id"]).toBe(1);
        const articleKeys = [
          "article_id",
          "title",
          "topic",
          "author",
          "body",
          "created_at",
          "votes",
          "article_img_url",
        ];
        expect(Object.keys(article[0])).toEqual(articleKeys)
      });
  });
  it("should respond with an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  it("should respond with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/mushroom")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe('GET /api/articles', () => {
  it('should respond with a full array list of every article within the database', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      const body = response.body
      expect(body.articles.length).toBe(13)
      body.articles.forEach((article) => {
        expect(typeof article['author']).toBe('string')
        expect(typeof article['title']).toBe('string')
        expect(typeof article['article_id']).toBe('number')
        expect(typeof article['topic']).toBe('string')
        expect(typeof article['created_at']).toBe('string')
        expect(typeof article['votes']).toBe('number')
        expect(typeof article['article_img_url']).toBe('string')
        expect(typeof article['comment_count']).toBe('number')
        if (article['article_id'] === 1){
          expect(article['comment_count']).toBe(11)
        }
      })
    })
  });
  it('should respond with an array based on use with the author query', () => {
      return request(app)
      .get('/api/articles?author=rogersop')
      .expect(200)
      .then((response) => {
        const {articles} = response.body
        expect(articles.length).toBe(3)
        expect(articles).toBeSortedBy('author')
      })
  });
  it('should respond with an array based on use with the topic query', () => {
    return request(app)
    .get('/api/articles?topic=cats')
    .expect(200)
    .then((response) => {
      const {articles} = response.body
      expect(articles.lenth).toBe(1)
      expect(articles).toBeSortedBy('topic')
    })
  });
});

