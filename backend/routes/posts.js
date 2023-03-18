const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const multer = require("multer");
const storage = require("../utils/mimeIsValid");
const checkAuth = require("../middleware/check-auth");

router.get("/", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Fetching posts failed",
      });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Post not found!",
        });
      }
      return res.status(200).json({
        message: "Post found",
        post,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Fetching post failed",
      });
    });
});

router.post(
  "/",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    post
      .save()
      .then((createdPost) => {
        let { _id, title, content, imagePath } = createdPost;
        res.status(201).json({
          message: "Post added successfully",
          post: { _id, title, content, imagePath },
        });
      })
      .catch(() => {
        res.status(500).json({
          message: "Creating a post failed",
        });
      });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const { title, content } = req.body;
    const post = new Post({
      _id: req.body.id,
      title,
      content,
      imagePath,
      creator: req.userData.userId,
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        if (result.nModified > 0) {
          return res.status(200).json({
            message: "Post Updated",
          });
        }
        return res.status(401).json({
          message: "Post not updated, not authorized!",
        });
      })
      .catch(() => {
        res.status(500).json({
          message: "Couldn't update post!",
        });
      });
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        return res.status(200).json({
          message: "Post deleted",
        });
      }
      return res.status(401).json({
        message: "Post not deleted, not authorized!",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "deleting post failed",
      });
    });
});

module.exports = router;
