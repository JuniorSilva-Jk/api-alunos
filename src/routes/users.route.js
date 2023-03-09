import { Router } from 'express'
import { create, buscarTodos, buscarId,   alterarUsuario } from '../controllers/user.controller.js'
import {validarId, validarUsuario} from '../middlewares/global.middlewares.js'
import { authMiddleware } from '../middlewares/auth.middlewares.js'

const router = Router()

router.post("/", create)
router.get("/", buscarTodos)
router.get("/:id", validarId, validarUsuario, buscarId)
router.patch("/:id", validarId, validarUsuario,  authMiddleware , alterarUsuario)


export default router