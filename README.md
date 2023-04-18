# My Wallet Backend

O backend do projeto My Wallet é uma API RESTful desenvolvida em Node.js utilizando o framework Express. A API é responsável por gerenciar as transações financeiras dos usuários, permitindo o cadastro de novos usuários, autenticação de usuários, registro de transações de entrada e saída, e consulta do histórico de transações com acesso à visualização do saldo.

## Tecnologias utilizadas

- **Node.js**: plataforma de desenvolvimento JavaScript no servidor.
- **Express**: framework web para criação de APIs RESTful.
- **MongoDB**: banco de dados NoSQL utilizado para armazenamento das transações e informações dos usuários.
- **Joi**: biblioteca de validação de dados utilizada para validação dos dados recebidos pela API.

## Endpoints

A API possui os seguintes endpoints:

- `/cadastro` (POST): endpoint para o cadastro de novos usuários. Recebe os dados de nome, email e senha do usuário e realiza a validação dos dados. Em caso de sucesso, realiza o cadastro do usuário no banco de dados.

- `/login` (POST): endpoint para autenticação de usuários cadastrados. Recebe os dados de email e senha do usuário, realiza a validação dos dados e verifica a existência do usuário no banco de dados. Em caso de sucesso, retorna um status 200 indicando que a autenticação foi realizada com sucesso.

- `/nova-transacao/:tipo` (POST): endpoint para registro de novas transações de entrada ou saída. Recebe o tipo de transação (entrada ou saída) como parâmetro na URL e o valor da transação no corpo da requisição. Realiza a validação dos dados e, em caso de sucesso, registra a transação no banco de dados.

- `/nova-transacao` (GET): endpoit para exibição das transações realizadas e visualização do saldo final do usuário na tela de `/home`.

## Validação de dados

A API utiliza a biblioteca Joi para realizar a validação dos dados recebidos nas requisições. São realizadas validações nos seguintes endpoints:

- `/cadastro`: valida os campos de nome, email e senha do usuário.
- `/login`: valida os campos de email e senha do usuário.
- `/nova-transacao/:tipo`: valida o campo de valor da transação.

Em caso de falha na validação, a API retorna um status 422 com uma lista de mensagens de erro indicando os campos inválidos.

## Tratamento de erros

A API utiliza códigos de status HTTP para indicar o resultado das requisições. Em caso de erro, a API retorna um status 4xx ou 5xx, juntamente com uma mensagem de erro indicando o motivo do erro. Os principais erros tratados são:

- Erros de validação de dados: retornam um status 422 com as mensagens de erro indicando os campos inválidos.
- Erros de autenticação: retornam um status 401 em caso de falha na autenticação do usuário.
- Erros de conexão com o banco de dados: retornam um status 500 indicando um erro interno no servidor.

O objetivo do tratamento de erros e, principalmente, da exibição das mensagens é simplificar o processo de resolução de problemas para o desenvolvedor responsável pelo front-end.