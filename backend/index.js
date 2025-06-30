const express = require('express');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Array para armazenar devs em memória
const devs = [];

// Função para validar data YYYY-MM-DD
function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d) && d.toISOString().slice(0,10) === dateStr;
}

// POST /devs - cria desenvolvedor
app.post('/devs', (req, res) => {
  const { nickname, name, birth_date, stack } = req.body;

  // Validação tipo 400 (bad request): campos obrigatórios e tipos
  if (
    typeof nickname !== 'string' || nickname.length === 0 || nickname.length > 32 ||
    typeof name !== 'string' || name.length === 0 || name.length > 100 ||
    typeof birth_date !== 'string' || !isValidDate(birth_date) ||
    (stack !== null && stack !== undefined && !Array.isArray(stack))
  ) {
    return res.status(400).json({ error: 'Requisição sintaticamente inválida' });
  }

  // Se stack não for null, validar todos os elementos serem strings <=32 chars
  if (Array.isArray(stack)) {
    for (const tech of stack) {
      if (typeof tech !== 'string' || tech.length === 0 || tech.length > 32) {
        return res.status(400).json({ error: 'Stack inválida' });
      }
    }
  }

  // Validação 422 (unprocessable entity) - nickname único, nome e nickname não podem ser null ou duplicados
  if (devs.find(d => d.nickname.toLowerCase() === nickname.toLowerCase())) {
    return res.status(422).json({ error: 'Nickname já existe' });
  }

  // Cria dev
  const id = uuidv4();
  const newDev = {
    id,
    nickname,
    name,
    birth_date,
    stack: stack === null ? null : stack,
  };

  devs.push(newDev);

  // Retorna 201 Created com header Location
  res.status(201)
    .location(`/devs/${id}`)
    .json(newDev);
});

// GET /devs - lista devs, com ou sem termos de busca
app.get('/devs', (req, res) => {
  const { terms } = req.query;

  if (terms !== undefined) {
    // Se terms está presente, faz busca (case insensitive)
    if (typeof terms !== 'string' || terms.trim() === '') {
      return res.status(400).json({ error: 'terms é obrigatório para busca' });
    }
    const termLower = terms.toLowerCase();

    const filtered = devs.filter(dev => {
      if (dev.nickname.toLowerCase().includes(termLower)) return true;
      if (dev.name.toLowerCase().includes(termLower)) return true;
      if (Array.isArray(dev.stack)) {
        for (const tech of dev.stack) {
          if (tech.toLowerCase().includes(termLower)) return true;
        }
      }
      return false;
    });

    // Só os 20 primeiros
    res.setHeader('X-Total-Count', filtered.length);
    return res.status(200).json(filtered.slice(0, 20));
  }

  // Se não tem terms, lista os devs (máx 20)
  res.setHeader('X-Total-Count', devs.length);
  return res.status(200).json(devs.slice(0, 20));
});

// GET /devs/:id - detalhes do dev
app.get('/devs/:id', (req, res) => {
  const { id } = req.params;
  if (!uuidValidate(id)) return res.status(404).json({ error: 'ID inválido' });

  const dev = devs.find(d => d.id === id);
  if (!dev) return res.status(404).json({ error: 'Dev não encontrado' });

  res.status(200).json(dev);
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
