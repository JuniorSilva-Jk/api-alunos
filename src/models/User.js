import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({   
    nomeCompleto:{ type:String, required:true },
    username: { type:String, required:true, unique:true },
    email:{ type:String, required:true , unique:true },
    telefone: { type:Number, required:true, unique:true },
    cpf:{ type:String, required:true, unique:true },
    idade:{ type: Number, required:true },
    genero: { type: String, require: true, defalut:"" },
    nomeMae:{ type: String, required:true },
    municipio: { type: String, require: true},
    codMunIBGE: { type: Number, require: true},
    estado: { type: String, require: true},
    olimpiada: { type: String , default: ""},
    faixaOlimpiada: { type: String , default: ""},
    priEstudante: { type: Number, defalut: "" },
    stsRevEstd: { type: String, require: true},
    password:{ type: String, required:true, select: false },
    avatar: { type: String, required: true },
    background: { type: String, required: true },
    isAdmin:{ type:Boolean, default:false },
},
{timestamps:true})

UserSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

const User = mongoose.model("User", UserSchema)

export default User