import { Router } from 'express'
const router = Router()
import { login, loginAdmin } from '../controllers/auth.controller.js'

router.post('/', login)
router.post('/admin', loginAdmin)

export default router 