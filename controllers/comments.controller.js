const commentsModel = require("../models/comments.model");

module.exports.postComment = async (req, res) => {
    console.log(req)
    const newComment = new commentsModel({
        movieId: req.body.movieId,
        commenter: req.body.commenter,
        message: req.body.message,
      });
  
    try {
        const comment = await newComment.save();
        return res.status(201).json(comment);
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  module.exports.getComments = (req, res) => {
    // commentsModel.find({movieId: req.params.id})
    commentsModel.find({movieId: req.params.id},(err, docs) => {
      if (!err) res.send(docs);
      else console.log("Error to get data : " + err);
    })
  }