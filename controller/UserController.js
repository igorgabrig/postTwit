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

