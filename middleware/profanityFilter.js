// Lista de palavrões e termos ofensivos
const palavroes = [
  // Palavrões comuns em português
  'porra', 'caralho', 'merda', 'puta', 'fdp', 'filho da puta',
  'cu', 'buceta', 'pinto', 'pau', 'cacete', 'foda',
  'foder', 'fodido', 'pqp', 'desgraça', 'corno', 'viado',
  'bosta', 'piroca', 'rola', 'cabaço', 'babaca', 'otário',
  'arrombado', 'safado', 'vagabundo', 'imbecil', 'idiota',
  'burro', 'estúpido', 'retardado', 'escroto', 'nojento',
  // Variações escritas com caracteres especiais
  'p0rra', 'c4ralho', 'm3rda', 'put4', 'f0d3r',
  // Insultos
  'cuzão', 'cuzao', 'filho da mae', 'filha da puta',
  'prostituta', 'vadia', 'rameira', 'meretriz',
  // Termos racistas e discriminatórios
  'preto', 'negro', 'macaco', 'mongol', 'bicha',
  'gay', 'sapatao', 'traveco', 'viadão', 'viadao'
];

/**
 * Verifica se o texto contém palavrões
 * @param {string} texto - Texto a ser verificado
 * @returns {Object} - { contemPalavrao: boolean, palavrasEncontradas: array }
 */
function verificarPalavroes(texto) {
  if (!texto) {
    return { contemPalavrao: false, palavrasEncontradas: [] };
  }

  const textoLowerCase = texto.toLowerCase();
  const palavrasEncontradas = [];

  for (const palavrao of palavroes) {
    // Verifica palavra exata (com limites de palavra)
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

/**
 * Middleware para validar conteúdo de tópicos e comentários
 */
function validarConteudo(req, res, next) {
  const { titulo_topico, conteudo_topico, titulo_post, conteudo_post, conteudo, conteudo_comentario } = req.body;
  
  // Textos a serem validados
  const textos = [];
  
  if (titulo_topico) textos.push({ campo: 'título', texto: titulo_topico });
  if (conteudo_topico) textos.push({ campo: 'conteúdo', texto: conteudo_topico });
  if (titulo_post) textos.push({ campo: 'título', texto: titulo_post });
  if (conteudo_post) textos.push({ campo: 'conteúdo', texto: conteudo_post });
  if (conteudo) textos.push({ campo: 'comentário', texto: conteudo });
  if (conteudo_comentario) textos.push({ campo: 'comentário', texto: conteudo_comentario });

  // Verifica cada texto
  for (const item of textos) {
    const resultado = verificarPalavroes(item.texto);
    
    if (resultado.contemPalavrao) {
      return res.status(400).json({
        message: `O ${item.campo} contém linguagem inapropriada. Por favor, revise o texto.`,
        palavrasProibidas: resultado.palavrasEncontradas.length
      });
    }
  }

  // Se passou na validação, continua
  next();
}

module.exports = {
  verificarPalavroes,
  validarConteudo
};
