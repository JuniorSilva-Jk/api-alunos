import userService from '../services/user.service.js'
import {
  findByIdService,
} from "../services/news.service.js";
import mongoose from 'mongoose'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const validarId = (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "ID inválido" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const validarUsuario = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await userService.buscarIdService(id);

    if (!user) {
      return res.status(400).send({ message: "Usuário não encontrado" });
    }

    req.id = id;
    req.user = user;

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


export const validarAdmin = async (req, res, next) => {
   try {
    const { authorization } = req.headers;

    const parts = authorization.split(" ");
    const [schema, token] = parts;

    const { id } = req.params;

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
      const users = await userService.buscarIdService(decoded.id);
      const news = await findByIdService(id);

      if(users.isAdmin == true || String(news.user._id) === decoded.id) {
        
      } 
       else {
        return res.send({message: "Usuário não permitido"})
      }

      return next();
    });
  } catch (err) {
    res.sendStatus(500).send({ message: err.message });
  }
}