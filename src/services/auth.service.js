import User from "../models/User.js";
import jwt from 'jsonwebtoken'

const loginService = (email) =>
  User.findOne({ email: { $regex: `${email || ""}`, $options: "i" } }).select("+password")

const gerarToken = (id) => jwt.sign({id: id}, process.env.SECRET_JWT, {expiresIn: 86400})

export { loginService, gerarToken };
