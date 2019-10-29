var express = require('express');
var router = express.Router();
var userController = require('../controller/UserController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/cadastrar', function(req, res, next){
  res.render('cadastrar', {title: "Cadastro"});
});

router.get('/unfollow', userController.unfollow);
router.get('/add', userController.follow);
router.get('/busca', userController.buscar);
router.get('/amigos', userController.list_friends);
router.get('/sair', userController.sair);
router.post('/cadastrar', userController.create_user);
router.post('/verificar', userController.login);

module.exports = router;
