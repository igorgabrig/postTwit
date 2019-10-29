var express = require('express');
var router = express.Router();
var postController = require('../controller/PostController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/feed', postController.feed);
router.get('/post', postController.post);
router.post('/postar', postController.create_post);


module.exports = router;
