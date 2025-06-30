## Desafio Fullstack Dynamik

Resumo

Sistema de registro de desenvolvedores conforme solicitado:

Backend em Node.js (Express) + SQLite (persistência relacional simples e performática)

Frontend em React (Vite)

Cumpre integralmente todos os endpoints, validações e fluxos exigidos no desafio.

Tecnologias utilizadas

Backend: Node.js, Express, SQLite, UUID

Frontend: React (Vite), Axios, Tailwind (opcional)

Escolha motivada por simplicidade, facilidade de setup e agilidade para demonstração.

Como correr o projeto

Clone o repositório

git clone https://github.com/filipefg/Fullstack-Dynamik

cd Fullstack-Dynamik

Instale as dependências

Backend:

cd backend

npm install

Frontend:

cd frontend

npm install

Corra o backend

npm start

A API ficará disponível em:

http://localhost:3000

Corra o frontend

cd frontend

npm run dev

A aplicação ficará disponível em:

http://localhost:5173

Endpoints disponíveis

POST /devs ➔ Cria desenvolvedor

GET /devs ➔ Lista desenvolvedores (máx 20) com X-Total-Count

GET /devs/:id ➔ Retorna desenvolvedor específico

GET /devs?terms=palavra ➔ Procura por nickname, name, stack

Com códigos de status 201, 200, 400, 404, 422 conforme regras do desafio.

Testes rápidos com curl

Criar desenvolvedor:

curl -X POST http://localhost:3000/devs -H "Content-Type: application/json" -d '{
  
  "nickname": "judit",
  
  "name": "Judit Polgar",
  
  "birth_date": "1976-07-23",
  
  "stack": ["Node", "C#"]
}'

Listar desenvolvedores:

curl http://localhost:3000/devs

Procurar desenvolvedor por termo:

curl http://localhost:3000/devs?terms=node

Procurar desenvolvedor por id:

curl http://localhost:3000/devs/<id>