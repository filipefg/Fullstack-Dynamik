import React, { useState, useEffect } from 'react';

function App() {
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [stack, setStack] = useState('');
  const [devs, setDevs] = useState([]);
  const [terms, setTerms] = useState('');
  const [total, setTotal] = useState(0);

  const API_URL = 'http://localhost:3001';

  const fetchDevs = async () => {
    let url = `${API_URL}/devs`;
    if (terms.trim()) {
      url += `?terms=${encodeURIComponent(terms)}`;
    }
    try {
      const res = await fetch(url);
      if (res.status === 400) {
        alert('É necessário informar um termo de busca.');
        return;
      }
      const data = await res.json();
      const totalCount = res.headers.get('X-Total-Count');
      setTotal(totalCount);
      setDevs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDevs();
  }, []);

  const handleCreate = async () => {
    const devData = {
      nickname,
      name,
      birth_date: birthDate,
      stack: stack.trim() === '' ? null : stack.split(',').map(s => s.trim()),
    };

    try {
      const res = await fetch(`${API_URL}/devs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(devData),
      });

      if (res.status === 201) {
        alert('Desenvolvedor criado!');
        setNickname('');
        setName('');
        setBirthDate('');
        setStack('');
        fetchDevs();
      } else {
        const error = await res.json();
        alert(`Erro: ${res.status} - ${error.error || JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    fetchDevs();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Registro de Desenvolvedores</h1>

      <h2>Criar Desenvolvedor</h2>
      <input
        placeholder="Nickname"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
      /><br />
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      /><br />
      <input
        placeholder="Birth Date (YYYY-MM-DD)"
        value={birthDate}
        onChange={e => setBirthDate(e.target.value)}
      /><br />
      <input
        placeholder="Stack (separado por vírgulas)"
        value={stack}
        onChange={e => setStack(e.target.value)}
      /><br />
      <button onClick={handleCreate}>Criar</button>

      <h2>Buscar Desenvolvedores</h2>
      <input
        placeholder="Termo de busca"
        value={terms}
        onChange={e => setTerms(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>

      <h2>Lista de Desenvolvedores (Total: {total})</h2>
      {devs.length === 0 ? (
        <p>Nenhum desenvolvedor encontrado.</p>
      ) : (
        <ul>
          {devs.map(dev => (
            <li key={dev.id}>
              <strong>ID:</strong> {dev.id} <br />
              <strong>Nickname:</strong> {dev.nickname} <br />
              <strong>Nome:</strong> {dev.name} <br />
              <strong>Data de Nascimento:</strong> {dev.birth_date} <br />
              <strong>Stack:</strong> {dev.stack ? dev.stack.join(', ') : 'Nenhuma'}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
