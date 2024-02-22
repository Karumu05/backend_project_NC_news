const { removeComment } = require("../models/comments.model");
const { checkExists } = require("../../db/seeds/utils");

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;

  Promise.all([
    checkExists("comments", "comment_id", comment_id),
    removeComment(comment_id),
  ])
    .then((result) => {
      if (result[1].rowCount === 1) {
        response.status(204).end();
      }
    })
    .catch((error) => {
      next(error);
    });
};
