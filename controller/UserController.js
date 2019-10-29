var express = require('express');
var router = express.Router();
var userModel = require('../model/User');

exports.create_user = function (req, res) {

    let usuario = req.body.usuario, email = req.body.email, senha = req.body.senha;

    userModel.create({ usuario: usuario, email: email, senha: senha }, function (err) {
        if (err) {
            var erros = '[', i = 0;
            for (let ind in err.errors) {
                if (i > 0)
                    erros += ', ';
                erros += JSON.stringify(err.errors[ind]);
                i++;
            }
            if (err.code === 11000) {
                if (i > 0)
                    erros += ', ';
                erros += JSON.stringify({ message: "O usuário ou o email já estão cadastrados." });
            }
            erros += ']';
            res.send(erros);
            return console.log(err);
        }
        res.send('[' + JSON.stringify({ message: "Usuário cadastrado." }) + ']');
    });
};


exports.list_friends = function (req, res) {
    if (req.session && req.session.key) {
        userModel.findOne({ "usuario": req.session.key }, function (err, doc) {
            if (err || doc === null) {
                return res.send('[' + JSON.stringify({ message: "Erro no BD" }) + ']');
            }

            amigos({ _id: { $in: doc.friends } }).then(function (listaAmigos) {
                res.render('friends', {logado: req.session.key, amigos: listaAmigos });
            });
        });

    }
    else {
        res.redirect('/');
    }
};

const amigos = async function (params) {
    try {
        return await userModel.find(params)
    } catch (err) { console.log(err) }
}

exports.login = function (req, res) {
    let usuario = req.body.usuario, senha = req.body.senha;

    if (usuario.length === 0 || senha.length === 0) {
        return res.send('[{"message": "Nenhum campo pode estar vazio"}]');
    }

    userModel.findOne({ "usuario": usuario }, function (err, doc) {
        if (err || doc === null) {
            return res.send('[' + JSON.stringify({ message: "Dados incorretos" }) + ']');
        }
        if (doc.senha === senha) {
            req.session.key = usuario;
            res.send('[' + JSON.stringify({ message: "Sucesso" }) + ']')
        }
        else {
            return res.send('[' + JSON.stringify({ message: "Dados incorretos" }) + ']');
        }
    });
};

exports.sair = function (req, res) {
    req.session.destroy();
    return res.redirect('/');
};

exports.buscar = function (req, res) {
    let search = req.query.q;
    userModel.find({ usuario: { $not: { $regex: req.session.key }, $regex: '.*' + search + '.*', $options: 'i' } }, function (err, doc) {
        if (err) console.log(err);
        
        if (doc == undefined) {
            return res.send('<p style="color:#fff;">Nada encontrado</p>');
        }

        res.render('search', { resultados: doc, layout: 'search' });
    }).limit(10);
};

exports.follow = function (req, res) {
    let id = req.query.id;
    if (req.session && req.session.key) {

        userModel.findOne({ "usuario": req.session.key }, function (err, doc) {
            if (err || doc === null) {
                return res.send('[' + JSON.stringify({ message: "Erro no BD" }) + ']');
            }

            doc.friends.push({ _id: id });

            doc.save(function () {
                res.send('<p style="color:#fff;">Você agora segue essa pessoa</p>');
            });
        });
    }
    else {
        res.redirect('/');
    }
}

exports.unfollow = function(req, res){
    var usuario = req.session.key, unFriend = req.query.id;
    if(unFriend == null){
        return res.redirect('/');
    }
    userModel.findOne({usuario: usuario}, function(err, doc){

        doc.friends.pull({ _id: unFriend });
        doc.save(function () {
            res.send('<p style="color:#fff;">Você não segue mais essa pessoa</p>');
        });
    });
 };
