const palavroes = [
  'porra', 'caralho', 'merda', 'puta', 'fdp', 'filho da puta',
  'cu', 'buceta', 'pinto', 'pau', 'cacete', 'foda',
  'foder', 'fodido', 'pqp', 'desgraça', 'corno', 'viado',
  'bosta', 'piroca', 'rola', 'cabaço', 'babaca', 'otário',
  'arrombado', 'safado', 'vagabundo', 'imbecil', 'idiota',
  'burro', 'estúpido', 'retardado', 'escroto', 'nojento',
  'p0rra', 'c4ralho', 'm3rda', 'put4', 'f0d3r',
  'cuzão', 'cuzao', 'filho da mae', 'filha da puta',
  'prostituta', 'vadia', 'rameira', 'meretriz',
  'preto', 'negro', 'macaco', 'mongol', 'bicha',
  'gay', 'sapatao', 'traveco', 'viadão', 'viadao'
];
function verificarPalavroes(texto) {
  if (!texto) {
    return { contemPalavrao: false, palavrasEncontradas: [] };
  }

  const textoLowerCase = texto.toLowerCase();
  const palavrasEncontradas = [];

  for (const palavrao of palavroes) {
    const regex = new RegExp(`\\b${palavrao}\\b`, 'gi');
    if (regex.test(textoLowerCase)) {
      palavrasEncontradas.push(palavrao);
    }
  }

  return {
    contemPalavrao: palavrasEncontradas.length > 0,
    palavrasEncontradas: palavrasEncontradas
  };
}
function validarConteudo(req, res, next) {
  const { titulo_topico, conteudo_topico, titulo_post, conteudo_post, conteudo, conteudo_comentario } = req.body;
  
  const textos = [];
  
  if (titulo_topico) textos.push({ campo: 'título', texto: titulo_topico });
  if (conteudo_topico) textos.push({ campo: 'conteúdo', texto: conteudo_topico });
  if (titulo_post) textos.push({ campo: 'título', texto: titulo_post });
  if (conteudo_post) textos.push({ campo: 'conteúdo', texto: conteudo_post });
  if (conteudo) textos.push({ campo: 'comentário', texto: conteudo });
  if (conteudo_comentario) textos.push({ campo: 'comentário', texto: conteudo_comentario });

  for (const item of textos) {
    const resultado = verificarPalavroes(item.texto);
    
    if (resultado.contemPalavrao) {
      return res.status(400).json({
        message: `O ${item.campo} contém linguagem inapropriada. Por favor, revise o texto.`,
        palavrasProibidas: resultado.palavrasEncontradas.length
      });
    }
  }

  next();
}

module.exports = {
  verificarPalavroes,
  validarConteudo
};
