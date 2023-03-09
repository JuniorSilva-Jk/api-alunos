import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userService from "../services/user.service.js";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.sendStatus(401);
    }

    const parts = authorization.split(" ");
    const [schema, token] = parts;

    if (parts.length !== 2) {
      return res.sendStatus(401);
    }

    if (schema !== "Bearer") {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
      if (error) {
        return res.sendStatus(401).send({ message: "Token Inválido!" });
      }

      const user = await userService.buscarIdService(decoded.id);

      if (!user || !user.id) {
        return res.sendStatus(401).send({ message: "Token Inválido!" });
      }

      req.userId = user.id;

      return next();
    });
  } catch (err) {
    res.sendStatus(500).send({ message: err.message });
  }
};

export const authAdmin = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const parts = authorization.split(" ");
    const [schema, token] = parts;

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
      const users = await userService.buscarIdService(decoded.id);

      if (users.isAdmin == false) {
        res.sendStatus(401).send({ message: "Usuário não autorizado" });
      }
      return next();
    });
  } catch (err) {
    res.sendStatus(500).send({ message: err.message });
  }
};
