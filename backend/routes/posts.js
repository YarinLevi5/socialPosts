const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const multer = require("multer");
const storage = require("../utils/mimeIsValid");

router.get("/", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
      });
    }
    return res.status(200).json({
      message: "Post found",
      post,
    });
  });
});

router.post(
  "/",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imagePath: url + "/images/" + req.file.filename,
    });
    post.save().then((createdPost) => {
      let { _id, title, content, imagePath } = createdPost;
      res.status(201).json({
        message: "Post added successfully",
        post: { _id, title, content, imagePath },
      });
    });
  }
);

router.put("/:id", (req, res, next) => {
  const { title, content } = req.body;
  const post = new Post({
    _id: req.body.id,
    title,
    content,
  });
  Post.updateOne({ _id: req.params.id }, post).then(() => {
    res.status(200).json({
      message: "Post Updated",
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({
      message: "Post deleted",
    });
  });
});

module.exports = router;
