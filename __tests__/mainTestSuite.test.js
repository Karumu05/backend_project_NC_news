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
  it('should respond with an array of every article in decending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      const {articles} = response.body
      expect(articles).toBeSortedBy('created_at', {descending: true})
    })
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  it('should respond with an array of comments for a given article ', () => {
    return request(app)
    .get('/api/articles/3/comments')
    .expect(200)
    .then((response) => {
      const body = response.body
      expect(body.comments.length).toBe(2)
      body.comments.forEach((comment) => {
        expect(typeof comment.comment_id).toBe('number')
        expect(typeof comment.votes).toBe('number')
        expect(typeof comment.created_at).toBe('string')
        expect(typeof comment.author).toBe('string')
        expect(typeof comment.body).toBe('string')
        expect(comment.article_id).toBe(3)
      })
    })
  })
  it('should respond with an empty array when there are no comments on the given article_id', () => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then((response) => {
      expect(response.body.comments.length).toBe(0)
      expect(Array.isArray(response.body.comments)).toBe(true)
    })

  });
  it('"should respond with an appropriate error message when given a valid but non-existent id"', () => {
    return request(app)
    .get('/api/articles/9999/comments')
    .expect(404)
    .then((result) => {
      expect(result.body.msg).toBe("Not found");
    })
  });
  it('should respond with an appropriate error message when given an invalid id', () => {
    return request(app)
    .get('/api/articles/mushroom/comments')
    .expect(400)
    .then((result) => {
      expect(result.body.msg).toBe("Bad request");
    })
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  it('should add a new comment to an article referenced by its id', () => {
    return request(app)
    .post('/api/articles/2/comments')
    .send({
      username: 'butter_bridge',
      body: 'Commenting, commenting everyone loves to comment'
    })
    .expect(201)
    .then((result) => {
      const body = result.body
      expect(body.addedComment.length).toBe(1)
      body.addedComment.forEach((comment) => {
        expect(typeof comment['author']).toBe('string')
        expect(typeof comment['body']).toBe('string')
      })
    })
  });
  it('should respond with an appropriate error message when given a valid but non-existent id', () => {
    return request(app)
    .post('/api/articles/99999/comments')
    .send({
      username: 'butter_bridge',
      body: 'Commenting, commenting everyone loves to comment'
    })
    .expect(404)
    .then((result) => {
      expect(result.body.msg).toBe('Not found')
    })
  });
  it('should respond with an appropriate error message when given an invalid id ', () => {
      return request(app)
      .post('/api/articles/mushrooom/comments')
      .send({
        username: 'butter_bridge',
        body: 'Commenting, commenting everyone loves to comment'
      })
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe('Bad request')
      })
  });
  it('should respond with an appropriate error message when needed input data is missing', () => {
    return request(app)
    .post('/api/articles/2/comments')
    .send({
      body: 'Commenting, commenting everyone loves to comment'
    })
    .expect(400)
    .then((result) => {
      expect(result.body.msg).toBe('Bad request')
    })
  });
  it('should respond with the appropriate error message when a non valid username is being inputted', () => {
    return request(app)
    .post('/api/articles/2/comments')
    .send({
      username: 'IAMaCommentor',
      body: 'Commenting, commenting everyone loves to comment'
    })
    .expect(404)
    .then((result) => {
      expect(result.body.msg).toBe('Not found')
    })
  });
});

describe('PATCH /api/articles/:article_id', () => {
  it('should respond with an updated article changing the number of votes', () => {
    return request(app)
    .patch('/api/articles/3')
    .send({
      inc_votes: 5
    })
    .expect(201)
    .then((result) => {
      const {body} = result
      expect(body.article[0]['votes']).toBe(5)
      expect(body.article[0]['article_id']).toBe(3)
    })
  });
  it('should respond with an appropriate error message when given a valid but non-existent id', () => {
    return request(app)
    .patch('/api/articles/999999')
    .send({
      inc_votes: 5
    })
    .expect(404)
    .then((result) => {
      expect(result.body.msg).toBe('Not found')
    })
  });
  it('should respond with an appropriate error message when given an invalid id', () => {
    return request(app)
    .patch('/api/articles/mushroom')
    .send({
      inc_votes: 5
    })
    .expect(400)
    .then((result) => {
      expect(result.body.msg).toBe('Bad request')
    })
  });
  it('should respond with an appropriate error message when needed input data is missing', () => {
    return request(app)
    .patch('/api/articles/3')
    .send({
      smilingBlobfish: 9999
    })
    .expect(400)
    .then((result) => {
      expect(result.body.msg).toBe('Bad request')
    })
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  it('should respond with an appropriate status code with no content', () => {
      return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then((result) => {
        const {body} = result
        expect(body).toEqual({})
        return db.query('SELECT * FROM comments')
      }).then((result) => {
        expect(result.rows.length).toBe(17)
      })
  });
  it('should respond with code 404 when given a valid but non-existant ID', () => {
    return request(app)
    .delete('/api/comments/9999')
    .expect(404)
    .then((result) => {
      expect(result.body.msg).toBe('Not found')
    })
  });
  it('should respond with a code of 400 when given an invalid ID', () => {
      return request(app)
      .delete('/api/comments/mushroom')
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe('Bad request')
      })
  });
});