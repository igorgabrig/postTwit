var express = require('express');
var router = express.Router();
var userModel = require('../model/User');
var postModel = require('../model/Post');


exports.create_post = function (req, res) {
    let post = req.body.post, remetente = req.session.key;

    if (req.session && req.session.key) {
        userModel.findOne({ "usuario": remetente }, function (err, doc) {
            if (err || doc === null) {
                return res.send('[' + JSON.stringify({ message: "Erro no BD" }) + ']');
            }

            if (post.length > 0) {
                postModel.create({ remetente: doc.id, post: post }, function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });
                res.send('[' + JSON.stringify({ message: "Post enviado." }) + ']');
            }
            else {
                res.send('[' + JSON.stringify({ message: "Preencha o campo de posts." }) + ']');
            }
        });
    }
    else {
        res.redirect('/');
    }
};



exports.post = function (req, res) {
    if (req.session && req.session.key) {
        userModel.findOne({ "usuario": req.session.key }, function (err, doc) {
            if (err || doc === null) {
                return res.send('[' + JSON.stringify({ message: "Erro no BD" }) + ']');
            }
            res.render('post', { logado: req.session.key });
        });
    }
    else {
        res.redirect('/');
    }
};
