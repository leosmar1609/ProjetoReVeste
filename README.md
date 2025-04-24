Site (atualmente em desenvolvimento) para ser um site de doações
Atualmente só roda localmente. 
Está configurado para rodar na URL localhost:3000

Para poder utilizar o site é obrigatório que esteja instalado:
 - MySQL (Última versão);
 - MySQL Workbench (última versão, também);
 - Node JS;
 - Express.

Será necessário criar:
 - Um projeto no Workbench;
 - Uma base de dados chamada "Beneficiarios";
 - Uma nova pasta para rodar o projeto

Depois de criada a base de dados, rodar o arquivo .sql encontrado na raiz do projeto.
Sincronizar o repositório do GitHub na pasta criada para rodar
Renomear o arquivo "c.env" para ".env"
Fazer alterações necessárias nesse arquivo para configurar corretamente a base de dados.
Configurar o package.JSON, caso necessário 
Por fim, para rodar o projeto, é necessário rodar o comando "node server.js"
