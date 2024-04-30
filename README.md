## RUN MIGRATION

`npx sequelize-cli db:migrate`

## UNDO MIGRATION

`npx sequelize-cli db:migrate:undo`

## CREATE MIGRATION

Example: `npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`

## CREATE A SEED

`npx sequelize-cli seed:generate --name demo-user`

## RUN SEED

`npx sequelize-cli db:seed:all`

## UNDO SEED

`npx sequelize-cli db:seed:undo`

## ENV VARIABLES

`NODE_ENV`:
Example: development

`API_URL`:
Example: http://localhost:8082
