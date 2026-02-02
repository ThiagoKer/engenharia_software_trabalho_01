# 💻 Projeto de Fórum - Engenharia de Software I (CSI412)

### 🎯 1. Escopo do Sistema (Objetivo e Principais Features)

O sistema a ser desenvolvido consiste em uma plataforma web estruturada como um fórum de discussão dedicado ao universo dos jogos digitais. Seu principal objetivo é proporcionar um ambiente organizado, acessível e interativo, no qual os usuários possam compartilhar experiências, opiniões e análises sobre diversos títulos e temas relacionados ao cenário gamer. A solução permitirá a criação de postagens, incluindo reviews e tópicos de debate, possibilitando ainda a interação entre os participantes por meio de curtidas, comentários e respostas encadeadas. Além disso, o sistema buscará oferecer uma interface intuitiva, com navegação simplificada e mecanismos que favoreçam o engajamento e a troca de conhecimento entre os usuários. Dessa forma, pretende-se construir uma plataforma que incentive a participação ativa da comunidade, garantindo usabilidade, desempenho e clareza na organização das discussões.

### 👥 2. Membros da Equipe e Papéis

- Davi Zanotti Costa Melo — Desenvolvedor Back-End
- Ewerton Gomes Barcia — Engenheiro de Dados
- Gustavo Guimarães de Oliveira Dias — Desenvolvedor FullStack
- Tamires Franciele Silva Leandro — Desenvolvedora FrontEnd
- Thiago Ker Gama Nunes Carvalho — Desenvolvedor FullStack
- Tiago Henrique Souza Santos — Desenvolvedor FrontEnd
  

### ⚙️ 3. Tecnologias

- Linguagem: Python
- Frontend: HTML, CSS / JavaScript
- Banco de Dados: PostgreSQL
- Frameworks: Flask, Figma


### 📋 4. Backlog do Produto (Product Backlog)

1.	Como usuário, eu gostaria de me cadastrar e realizar login no sistema.
2.	Como usuário, eu gostaria de editar e excluir meu próprio perfil.
3.	Como usuário, eu gostaria de criar e excluir tópicos no fórum.
4.	Como usuário, eu gostaria de editar meus tópicos após a publicação.
5.	Como usuário, eu gostaria de comentar e curtir postagens de outros usuários.
6.	Como usuário, eu gostaria de visualizar a página inicial com os tópicos mais recentes.
7.	Como usuário, eu gostaria de navegar por categorias de jogos organizadas por tema.
8.	Como usuário, eu gostaria de pesquisar tópicos por título, categoria ou palavra-chave.
9.	Como admin, eu gostaria de gerenciar categorias, criando, editando ou removendo-as.
10.	Como admin, eu gostaria de excluir tópicos, comentários ou usuários que violem regras.


### 🗓️ 5. Backlog da Sprint (Sprint Backlog)

**Sprint 1 – Estrutura Inicial e Autenticação**

História #1: Como usuário, eu gostaria de me cadastrar e realizar login no sistema<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Configurar o ambiente Flask e PostgreSQL – Thiago (Back-End)<br>
  &nbsp;&nbsp;○ Criar o modelo de usuário (tabela e autenticação) – Davi (Back-End)<br>
  &nbsp;&nbsp;○ Implementar rotas de cadastro e login – Gustavo (FullStack)<br>
  &nbsp;&nbsp;○ Criar formulários de login e cadastro – Tamires (Front-End)<br>
  &nbsp;&nbsp;○ Testar autenticação e fluxo completo – Tiago (Front-End)<br>
  
História #6: Como usuário, eu gostaria de visualizar a página inicial com os tópicos mais recentes<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Desenvolver layout da página inicial – Tiago (Front-End)<br>
  &nbsp;&nbsp;○ Criar rota para listar tópicos recentes – Thiago (Back-End)<br>
  &nbsp;&nbsp;○ Integrar backend e frontend – Gustavo (FullStack)<br>
  &nbsp;&nbsp;○ Testar visualização e carregamento – Ewerton (Eng. Dados)<br>

**Sprint 2 – Estrutura dos Tópicos**

História #3: Como usuário, eu gostaria de criar e excluir tópicos no fórum<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Criar modelo de tópicos – Davi (Back-End)<br>
  &nbsp;&nbsp;○ Implementar rotas de criação e exclusão – Thiago (Back-End)<br>
  &nbsp;&nbsp;○ Criar formulário de criação de tópicos – Tamires (Front-End)<br>
  &nbsp;&nbsp;○ Testar criação/exclusão – Tiago (Front-End)<br>

História #4: Como usuário, eu gostaria de editar meus tópicos após a publicação<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Implementar rota de edição de tópicos – Gustavo (FullStack)<br>
  &nbsp;&nbsp;○ Criar interface de edição – Tamires (Front-End)<br>
  &nbsp;&nbsp;○ Validar permissões (autor) – Ewerton (Eng. Dados)<br>
  &nbsp;&nbsp;○ Testar edição – Davi (Back-End)<br>

**Sprint 3 – Interações e Pesquisa**

História #5: Como usuário, eu gostaria de comentar e curtir postagens de outros usuários<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Criar modelo de comentários e curtidas – Ewerton (Eng. Dados)<br>
  &nbsp;&nbsp;○ Implementar rotas de comentários e curtidas – Davi (Back-End)<br>
  &nbsp;&nbsp;○ Integrar comentários/curtidas na interface – Tiago (Front-End)<br>
  &nbsp;&nbsp;○ Testar interações – Gustavo (FullStack)<br>

História #7: Como usuário, eu gostaria de navegar por categorias organizadas por tema<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Criar modelo de categorias – Ewerton (Eng. Dados)<br>
  &nbsp;&nbsp;○ Implementar lista de categorias – Thiago (Back-End)<br>
  &nbsp;&nbsp;○ Criar interface de categorias – Tamires (Front-End)<br>
  &nbsp;&nbsp;○ Integrar filtro por categorias – Gustavo (FullStack)<br>

História #8: Como usuário, eu gostaria de pesquisar tópicos por título, categoria ou palavra-chave<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Implementar mecanismo de busca backend – Davi (Back-End)<br>
  &nbsp;&nbsp;○ Criar barra de pesquisa – Tiago (Front-End)<br>
  &nbsp;&nbsp;○ Integrar resultados à listagem – Gustavo (FullStack)<br>
  &nbsp;&nbsp;○ Testar diferentes filtros – Tamires (Front-End)<br>

**Sprint 4 – Administração e Moderação** 

História #2: Como usuário, eu gostaria de editar e excluir meu próprio perfil<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Criar rotas de edição e exclusão de perfil – Thiago (Back-End)<br>
  &nbsp;&nbsp;○ Implementar página de edição – Tamires (Front-End)<br>
  &nbsp;&nbsp;○ Validar permissões – Davi (Back-End)<br>
  &nbsp;&nbsp;○ Testar fluxo completo – Tiago (Front-End)<br>

História #9: Como admin, eu gostaria de gerenciar categorias (criar, editar, remover)<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Criar rotas administrativas – Gustavo (FullStack)<br>
  &nbsp;&nbsp;○ Desenvolver interface admin – Tamires (Front-End)<br>
  &nbsp;&nbsp;○ Aplicar regras de autorização – Thiago (Back-End)<br>
  &nbsp;&nbsp;○ Testar gerenciamento – Ewerton (Eng. Dados)<br>

História #10: Como admin, eu gostaria de excluir tópicos, comentários ou usuários que violem regras<br>
● Tarefas e responsáveis:<br>
  &nbsp;&nbsp;○ Implementar rotas de moderação – Davi (Back-End)<br>
  &nbsp;&nbsp;○ Criar painel administrativo – Tiago (Front-End)<br>
  &nbsp;&nbsp;○ Implementar regras de autorização admin – Gustavo (FullStack)<br>
  &nbsp;&nbsp;○ Testar moderação – Ewerton (Eng. Dados)<br>

📐 Diagramas UML
- Casos de Uso: 
- Atividades: [Acessar diagramas](https://drive.google.com/drive/u/2/folders/1s2DSJpiMd8iAnja1EsHybBJs1vpzpqyp?hl=pt-br)
- Classes: 

🎨 Protótipo (Figma)<br>
[Link do Portfólio](https://www.figma.com/design/FByx9Tgtp1EXZZ4UCXyuWm/Untitled?node-id=0-1&t=KQobaFsNs6aVj0Mp-1)
