<img src="https://img.shields.io/github/issues/andremarquezz/Desafio-NgCash"/> <img src="https://img.shields.io/github/forks/andremarquezz/Desafio-NgCash"/> <img src="https://img.shields.io/github/stars/andremarquezz/Desafio-NgCash"/>

<h1 align="center">Aplicação Web FullStack</h1>
<p align="center">Aplicação onde os usuários consigam realizar transferências internas entre si.!</p>

# Sumário

</br>

• [Sobre o Projeto](#-sobre-o-projeto)

• [Tecnologias e Bibliotecas](#-tecnologias-e-bibliotecas-utilizadas-no-desenvolvimento-do-projeto)

• [Como executar o projeto](#-como-executar-o-projeto)

• [Sobre os Endpoints](#-sobre-os-endpoints)

• [Dicas de scripts prontos](#-dicas-de-scripts-prontos)

### 📃 Sobre o Projeto

---

<p>O objetivo da aplicação é possibilitar que usuários consigam realizar transferências internas entre si.
O projeto foi desenvolvido em containers docker utilizando a imagem node:16.14-alpine e uma imagem postgres:10.17, foi utilizado a arquitetura MSC, para realizar as requisições, é necessario estar autenticado com um token JWT, exceto login e registro.
</p>

---

### 🛠 Tecnologias e Bibliotecas utilizadas no desenvolvimento do projeto

- **[Node.js](https://nodejs.org/en/)**

- **[PostgreSQL](https://www.postgresql.org/)**

- **[Sequelize](https://sequelize.org/docs/v6/getting-started/)**

- **[Express](http://expressjs.com/pt-br/)**

- **[React](https://pt-br.reactjs.org/)**

  > Veja o arquivo [package.json do backEnd](https://github.com/andremarquezz/Desafio-NgCash/blob/main/api/package.json)


---


### ✒ Sobre os Endpoints

 - Todos os endpoints da API estão documentados com swagger e listados no endpoint ***/api-docs*** através dele é possivel consultar os métodos, corpo da requisição e respostas da API 
 
 _Exemplo de acesso_

⚠️Atenção: Este é um exemplo, a porta pode ser outra de acordo com a configuração da sua variavel de ambiente.

 ```json
 http://localhost:3001/api-docs/

```

---

### 🚀 Como executar o projeto

_Pré-requisitos_

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com),
[Node.js](https://nodejs.org/en/).

Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

---

_1- Clonar o repositorio_

```jsx
git@github.com:andremarquezz/Desafio-NgCash.git
```

---


<details>
  <summary><strong>:whale: Rodando no Docker</strong></summary><br />
  
  ## Com Docker
 
 
_Rode o serviço `node e postgreSQL` com o comando_

```jsx
docker-compose up -d
```

- Esse serviço irá inicializar dois containers chamados `db_ngcash e api_ngcash `, respectivamente.
  - A partir daqui você pode acessar o website pois a aplicação já esta online.

- Caso queira acessar o terminal do container :

_Via CLI use o comando_
```jsx
docker exec -it api_ngcash bash
```
- Ele te dará acesso ao terminal interativo do container api_ngcash (node) criado pelo compose, que está rodando em segundo plano.

⚠️Atenção: Caso opte por utilizar o Docker, TODOS os scripts disponíveis no package.json devem ser executados DENTRO do container, ou seja, no terminal que aparece após a execução do comando docker exec.
  
  </details>
  
---

