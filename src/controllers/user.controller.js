import jwt from "jsonwebtoken";
import userService from "../services/user.service.js";

// CRIAR
const create = async (req, res) => {
  try {
    let {
      nomeCompleto,
      username,
      email,
      telefone,
      cpf,
      idade,
      genero,
      nomeMae,
      municipio,
      codMunIBGE,
      estado,
      olimpiada,
      faixaOlimpiada,
      priEstudante,
      stsRevEstd,
      password,
      avatar,
      background,
      isAdmin
    } = req.body;

    if (
      !nomeCompleto ||
      !username ||
      !email ||
      !telefone ||
      !cpf ||
      !idade ||
      !genero ||
      !nomeMae ||
      !municipio ||
      !codMunIBGE ||
      !estado ||
      !olimpiada ||
      !faixaOlimpiada ||
      !priEstudante ||
      !stsRevEstd ||
      !password ||
      !avatar ||
      !background
    ) {
      res.status(400).send({ message: "Preencha todos os campos" });
    }
    else {
      email = email.toLowerCase();
      console.log(email)
    }

    const user = await userService.create(req.body);

    if (!user) {
      return res.status(400).send({ message: "Deu pau na hora de criar ai" });
    }

    res.status(201).send({
      message: "usuário criado com sucesso!",
      user: {
        id: user._id,
        nomeCompleto,
        username,
        email,
        telefone,
        cpf,
        idade,
        genero,
        nomeMae,
        municipio,
        codMunIBGE,
        estado,
        olimpiada,
        faixaOlimpiada,
        priEstudante,
        stsRevEstd,
        password,
        avatar,
        background
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//BUCAR TODOS
const buscarTodos = async (req, res) => {
  try {
    const users = await userService.buscarService();

    if (users === 0) {
      return res.status(400).send({ message: "Nenhum usuário encontrado!" });
    }
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// BUSCAR POR ID
const buscarId = async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// BUSCAR POR NOME - VERIFICAR NECESSIDADE
const buscarPorNome = async (req,res) => {
  try {
    const { nomeCompleto } = req.query;
    const user = await searchByTitleService(nomeCompleto);

    if (user.length === 0) {
      return res
        .status(400)
        .send({ message: "Não há nenhum usuário com este nome" });
    }

    return res.send({
      results: user.map((item) => ({
          id: item._id,
          nomeCompleto: item.nomeCompleto,
          email: item.email,
          telefone: item.telefone,
          cpf: item.cpf,
          idade: item.idade,
          genero: item.genero,
          nomeMae: item.nomeMae,
          municipio: item.municipio,
          codMunIBGE: item.codMunIBGE,
          estado: item.estado,
          olimpiada: item.olimpiada,
          faixaOlimpiada: item.faixaOlimpiada,
          priEstudante: item.priEstudante,
          stsRevEstd: item.stsRevEstd,
        })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

// ALTERAR
const alterarUsuario = async (req, res) => {
  const {
    nomeCompleto,
    username,
    email,
    telefone,
    cpf,
    idade,
    genero,
    nomeMae,
    municipio,
    codMunIBGE,
    estado,
    olimpiada,
    faixaOlimpiada,
    priEstudante,
    stsRevEstd,
    password,
    avatar,
    background
  } = req.body;

  try {
    const { authorization } = req.headers;

    const parts = authorization.split(" ");
    const token = parts;

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
      const users = await userService.buscarIdService(decoded.id);
      
      if(users.isAdmin == true || req.params.id === decoded.id){
        try {
          if (
            !nomeCompleto &&
            !username &&
            !email &&
            !telefone &&
            !cpf &&
            !idade &&
            !genero &&
            !nomeMae &&
            !municipio &&
            !codMunIBGE &&
            !estado &&
            !olimpiada &&
            !faixaOlimpiada &&
            !priEstudante &&
            !stsRevEstd &&
            !password &&
            !avatar &&
            !background
          ) {
            res
              .status(400)
              .send({ message: "Preencha pelo menos 1 campo para atualizar" });
          }

          const { id } = req;

            await userService.alterarService(
              id,
              nomeCompleto,
              username,
              email,
              telefone,
              cpf,
              idade,
              genero,
              nomeMae,
              municipio,
              codMunIBGE,
              estado,
              olimpiada,
              faixaOlimpiada,
              priEstudante,
              stsRevEstd,
              password,
              avatar,
              background
            );

            return res.send({ message: "Usuário alterado com sucesso!" });
        } catch (err) {
          res.status(500).send({ message: err.message });
        }
      }else {
        res.send({ message: "Não Autorizado!" })
      }
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }

};

export { create, buscarTodos, buscarId, buscarPorNome, alterarUsuario };
