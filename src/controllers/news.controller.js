import {
    createService,
    findAllService,
    countNews,
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
    updateService,
    eraseService,
    likeNewsService,
    deleteLikeNewsService,
    addCommentService,
    deleteCommentService,
  } from "../services/news.service.js";
import userService from "../services/user.service.js";

// CRIAR NOTÍCIA
  export const create = async (req, res) => {
    try {
      const { title, text, banner } = req.body;
  
      if (!title || !banner || !text) {
        res.status(400).send({
          message: "Preencha todos os campos para postar uma notícia!",
        });
      }
  
      await createService({
        title,
        text,
        banner,
        user: req.userId,
      });
  
      res.send(201);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// BUSCAR TODAS AS NOTÍCIA
  export const findAll = async (req, res) => {
    try {
      let { limit, offset } = req.query;
  
      limit = Number(limit);
      offset = Number(offset);
  
      if (!limit) {
        limit = 5;
      }
  
      if (!offset) {
        offset = 0;
      }
  
      const news = await findAllService(offset, limit);
      const total = await countNews();
      const currentUrl = req.baseUrl;
  
      const next = offset + limit;
      const nextUrl =
        next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;
  
      const previous = offset - limit < 0  ? null : offset - limit;
      const previousUrl =
        previous != null
          ? `${currentUrl}?limit=${limit}&offset=${previous}`
          : null;
  
      if (news.length === 0) {
        return res.status(400).send({
          message: "Não existem notícias registradas",
        });
      }
      res.send({
        nextUrl,
        previousUrl,
        limit,
        offset,
        total,
  
        results: news.map((item) => ({
          id: item._id,
          title: item.title,
          text: item.text,
          banner: item.banner,
          likes: item.likes,
          comments: item.comments,
          name: item.user.nomeCompleto,
        //   userApelido: item.user.apelido,
        //   userAvatar: item.user.avatar,
        })), 
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// BUSCAR ÚLTIMA NOTÍCIA
  export const topNews = async (req, res) => {
    try {
      const news = await topNewsService();
  
      if (!news) {
        return res.status(400).send({ message: "Não há nenhum post registrado" });
      }
  
      res.send({
        news: {
          id: news._id,
          title: news.title,
          text: news.text,
          banner: news.banner,
          likes: news.likes,
          comments: news.comments,
          name: news.user.nomeCompleto,
        //   username: news.user.username,
        //   userAvatar: news.user.avatar,
        },
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// BUSCAR NOTÍCIA POR ID
  export const findById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const news = await findByIdService(id);
  
      return res.send({
        news: {
          id: news._id,
          title: news.title,
          text: news.text,
          banner: news.banner,
          likes: news.likes,
          comments: news.comments,
          name: news.user.nomeCompleto,
        //   username: news.user.username,
        //   userAvatar: news.user.avatar,
        },
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// BUSCAR NOTÍCIA POR TITLE
  export const searchByTitle = async (req, res) => {
    try {
      const { title } = req.query;
      const news = await searchByTitleService(title);
  
      if (news.length === 0) {
        return res
          .status(400)
          .send({ message: "Não há nenhuma notícia com este título" });
      }
  
      return res.send({
        results: news.map((item) => ({
            id: item._id,
            title: item.title,
            text: item.text,
            banner: item.banner,
            likes: item.likes,
            comments: item.comments,
            name: item.user.nomeCompleto,
          //   userApelido: item.user.apelido,
          //   userAvatar: item.user.avatar,
          })),
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// BUSCAR NOTÍCIA POR USUÁRIO
  export const byUser = async (req, res) => {
    try {
      const id = req.userId;
      const news = await byUserService(id);
  
      return res.send({
        results: news.map((item) => ({
          id: item._id,
          title: item.title,
          text: item.text,
          banner: item.banner,
          likes: item.likes,
          comments: item.comments,
          name: item.user.nomeCompleto,
        //   username: item.user.username,
        //   userAvatar: item.user.avatar,
        })),
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// ATUALIZAR NOTÍCIA
  export const update = async (req, res) => {
    try {
      const { title, text, banner } = req.body;
      const { id } = req.params;
  
      if (!title && !banner && !text) {
        res.status(400).send({
          message: "Preencha pelo menos um campo para atualizar esta notícia!",
        });
      }
  
      //const news = await findByIdService(id);
  
      // if (String(news.user._id) !== req.userId) {
      //   return res.status(400).send({
      //     message: "Você não pode atualizar esta notícia!",
      //   });
      // }
  
      await updateService(id, title, text, banner);
  
      return res.send({ message: "Notícia atualizada com sucesso!" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// APAGAR NOTÍCIA
  export const erase = async (req, res) => {
    try {
      const { id } = req.params;
  
      // const news = await findByIdService(id);
  
      // if (String(news.user._id) !== req.userId) {
      //   return res.status(400).send({
      //     message: "Você não tem permissão para apagar esta notícia!",
      //   });
      // }
  
      await eraseService(id);
  
      return res.send({ message: "Notícia deletada com sucesso!" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// CURTIR NOTÍCIA
  export const likeNews = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
  
      const newsLiked = await likeNewsService(id, userId);
  
      if (!newsLiked) {
        await deleteLikeNewsService(id, userId);
        return res.status(200).send({ message: "Curtida removida com sucesso!" });
      }
  
      res.send({ message: "Notícia curtida com sucesso" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// COMENTAR NOTÍCIA
  export const addComment = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const { comment } = req.body;
  
      if (!comment) {
        return res.status(400).send({ message: "Escreva uma mensagem para comentar!" });
      }
      
      await addCommentService(id, comment, userId);
  
      res.send({
        message: "Comentário feito com sucesso!",
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

// APAGAR COMENTÁRIO NOTÍCIA
  export const deleteComment = async (req, res) => {
    try {
      const { idNews, idComment } = req.params;
      const userId = req.userId;

      const news = await findByIdService(idNews)
      const teste = await userService.buscarIdService(userId)


      const retorno = {
        news: {
          admin: news.user.isAdmin,
        }
      }
      const userAdm = teste.isAdmin
      
      console.log(teste.isAdmin)

      const commentDeleted = await deleteCommentService(
        idNews,
        idComment,
        userId
      );

  
      const commentFinder = commentDeleted.comments.find(
        (comment) => comment.idComment === idComment
      );
  
      if (!commentFinder) {
        return res.status(404).send({ message: "Comentário não encontrado" });
      }
      
      if (userAdm == true || commentFinder.userId == userId) {
        
      }else {
        return res.status(400).send({ message: "Você não pode apagar este comentário" });
      }
  
      res.send({
        message: "Comentário removido com sucesso!",
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
  