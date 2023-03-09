import bcrypt from 'bcrypt'
import { loginService, gerarToken } from '../services/auth.service.js'

const login = async (req,res) => {
    const {email, password} = req.body

    try{
        const user = await loginService(email)

        if(!user){
            return res.status(404).send({message: "Usuário ou Senha inválidos"})
        }

        const passwordIsValid = await bcrypt.compare(password, user.password)
        

        if(!passwordIsValid){
            return res.status(404).send({message: "Usuário ou Senha inválidos"})
        }

        const token = gerarToken(user.id)

        res.send({token})
    }catch(err){
        res.status(500).send(err.message)
    }
}

const loginAdmin = async (req,res) => {
    const {email, password} = req.body

    try{
        const user = await loginService(email)

        if(!user){
            return res.status(404).send({message: "Usuário e ou Senha inválidos!"})
        }

        const passwordIsValid = await bcrypt.compare(password, user.password)
        

        if(!passwordIsValid){
            return res.status(404).send({message: "Usuário ou Senha inválidos"})
        }

        if(user.isAdmin == false){
           return res.status(404).send({message: "Usuário não tem permissão para acessar esse serviço!"})
        }
        
        const token = gerarToken(user.id)

        res.send({token})
    }catch(err){
        res.status(500).send(err.message)
    }
}

export {login, loginAdmin}