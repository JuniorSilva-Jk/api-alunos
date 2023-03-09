import User from '../models/User.js'

const create = (body) => User.create(body);

const buscarService = () => User.find().sort({field: 'asc', _id: -1});

const buscarIdService = (id) => User.findById(id);

const buscarPorNomeService = (nomeCompleto) => User.find({ 
  nomeCompleto: { $regex: `${nomeCompleto || ""}`, $options: "i" },
}).sort({ _id: -1 }).populate("user");


const alterarService = (
      id,
      nomeCompleto,
      email,
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
      password
) =>
  User.findOneAndUpdate(
    { _id: id },
    {
      nomeCompleto,
      email,
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
      password
    }
  );

export default {
  create,
  buscarService,
  buscarIdService,
  buscarPorNomeService,
  alterarService,
}
