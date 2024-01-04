const express = require("express");

const router = express.Router();

const postsController = require('../Controllers/postsController')
const authController = require('../Controllers/authController')

// route name == posts
// Route for get all posts  ==> GET
// Route for create new post  ==> POST
router.route('/')
.get(authController.protect, postsController.getPosts)
.post(postsController.createPosts)

// route name == posts/id
// Route for get one post  ==> GET
// Route for delete on post  ==> DELETE
// Route for update on post  ==> PUT
router.route('/post/:id')
.get(postsController.getPost)
.put(postsController.updatePost)
.delete(postsController.deletePost)



module.exports = router;
