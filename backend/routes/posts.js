const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../utils/mimeIsValid");
const checkAuth = require("../middlewares/check-auth");
const postController = require("../controllers/postController");

router.get("/", postController.getPosts);
router.get("/:id", checkAuth, postController.getPostById);
router.post(
  "/",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.createPost
);
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.updatePost
);
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
