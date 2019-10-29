var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        usuario: { type: String,
                lowercase: true,
                trim: true, 
                required: [true, "Digite um nome de usuário."],
                unique: [true, "Este usuário já está cadastrado."]
            },
        email: { type: String,
                required: [true, "Digite um e-mail."],
                unique: [true, "Este e-mail já está cadastrado."]
        },
        senha: { type: String, 
                required: [true, "Digite uma senha."]
            },
        friends: [{type: Schema.Types.ObjectId, ref: 'User'}]
    }
);

module.exports = mongoose.model('User', UserSchema);