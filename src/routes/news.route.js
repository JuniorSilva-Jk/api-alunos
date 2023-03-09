import { Router } from "express";
const router = Router();

import {
  create,
  findAll,
  topNews,
  findById,
  searchByTitle,
  byUser,
  update,
  erase,
  likeNews,
  addComment,
  deleteComment,
} from "../controllers/news.controller.js";
import { authMiddleware } from '../middlewares/auth.middlewares.js'
import {validarAdmin} from '../middlewares/global.middlewares.js'


router.post("/", authMiddleware, create);
router.get("/", findAll);
router.get("/top", topNews);
router.get("/search", searchByTitle);
router.get("/byUser", authMiddleware, byUser);

router.get("/:id", authMiddleware, findById);
router.patch("/:id", authMiddleware, validarAdmin, update);
router.delete("/:id", authMiddleware, validarAdmin, erase);
router.patch("/like/:id", authMiddleware, likeNews);
router.patch("/comment/:id", authMiddleware, addComment);
router.patch("/comment/:idNews/:idComment", authMiddleware, deleteComment);

export default router;
