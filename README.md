## Descrição

Gerenciador de artigos acadêmicos, feito apenas para fins acadêmicos, então não possui todos os dados que um projeto real teria.

Existem três tipos de usuários com as seguintes permissões:

| Tarefa                                      | Autor | Administrador | Avaliador |
| ------------------------------------------- | ----- | ------------- | --------- |
| Fazer Login e Logout                        | X     | X             | X         |
| Submeter, editar e deletar seu(s) artigo(s) | X     |               |           |
| Cadastrar, deletar e editar usuário(s)      |       | X             |           |
| Deletar artigo(s) de qualquer usuário       |       | X             |           |
| Atribuir artigo(s) para avaliação           |       | X             |           |
| Avaliar artigo(s)                           |       |               | X         |
| Selecionar artigo(s) para publicação        |       | X             |           |

## Tecnologias

<div style="display: inline_block">
	<img align="center" alt="NodeJS" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
	<img align="center" alt="Sequelize" src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white" />
	<img align="center" alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
	<img align="center" alt="Handlebars" src="https://img.shields.io/badge/Handlebars-FFA500?style=for-the-badge&logoColor=white" />
</div>

## Execução

#### Sequelize

- <b>Rodar migration + Criar banco</b>

  `npm run migrate:database`

- <b>Undo migration</b>

  `npx sequelize-cli db:migrate:undo`

- <b>Criar migration</b>

  Exemplo: `npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`

- <b>Undo seed</b>

  `npx sequelize-cli db:seed:undo`

- <b>Criar seed</b>

  `npx sequelize-cli seed:generate --name demo-user`

- <b>Dropar banco</b>

  `npm run db:drop`

Para mais detalhes consulte [Migration](https://sequelize.org/docs/v6/other-topics/migrations/)

#### Variável de ambiente

    Criar arquivo .env na raiz do projeto, essas configurações ficam dentro dele.

- <b>NODE_ENV</b>

  Valores: `development, test, production`
  Example: `NODE_ENV=development`

- <b>API_URL</b>

  Example: `API_URL=http://localhost:8082`

#### Rodar projeto

Executar `npm install` para baixar as dependecias, seguido de um `npm start` dessa forma o projeto vai ser iniciado com o `nodemon` e considerando o arquivo `.env`
