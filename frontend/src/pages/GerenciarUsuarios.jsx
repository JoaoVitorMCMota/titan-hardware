import { useState, useEffect } from 'react';

import api from '../services/api';

function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [salvandoRole, setSalvandoRole] = useState(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('usuario');
  const [criando, setCriando] = useState(false);

  const carregarUsuarios = async () => {
    setCarregando(true);
    setErro('');

    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error(error);
      setErro('Erro ao carregar usuários.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const criarUsuario = async (e) => {
    e.preventDefault();
    setCriando(true);
    setErro('');

    try {
      await api.post('/usuarios', { nome, email, senha, role });
      alert('Usuário criado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setRole('usuario');
      await carregarUsuarios();
    } catch (error) {
      const mensagemApi = error.response?.data?.error;
      setErro(mensagemApi || 'Erro ao criar usuário.');
    } finally {
      setCriando(false);
    }
  };

  const alterarRole = async (usuario) => {
    setSalvandoRole(usuario._id);
    setErro('');

    try {
      await api.put(`/usuarios/${usuario._id}`, {
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      });
      alert('Role atualizada com sucesso!');
    } catch (error) {
      const mensagemApi = error.response?.data?.error;
      setErro(mensagemApi || 'Erro ao atualizar role.');
      await carregarUsuarios();
    } finally {
      setSalvandoRole(null);
    }
  };

  const handleRoleChange = (id, novaRole) => {
    setUsuarios((lista) =>
      lista.map((u) => (u._id === id ? { ...u, role: novaRole } : u))
    );
  };

  return (
    <div className="container">
      <h1>Gerenciar Usuários</h1>

      <section className="users-section">
        <h2>Criar novo usuário</h2>
        <form className="form" onSubmit={criarUsuario}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
          >
            <option value="usuario">Usuário</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={criando}>
            {criando ? 'Criando...' : 'Criar Usuário'}
          </button>
        </form>
      </section>

      <section className="users-section">
        <h2>Usuários cadastrados</h2>

        {carregando && <p>Carregando usuários...</p>}

        {!carregando && usuarios.length === 0 && (
          <p className="home-empty">Nenhum usuário cadastrado.</p>
        )}

        {!carregando && usuarios.length > 0 && (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <select
                        value={usuario.role}
                        onChange={(e) => handleRoleChange(usuario._id, e.target.value)}
                        className="form-select"
                        disabled={salvandoRole === usuario._id}
                      >
                        <option value="usuario">Usuário</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => alterarRole(usuario)}
                        disabled={salvandoRole === usuario._id}
                      >
                        {salvandoRole === usuario._id ? 'Salvando...' : 'Salvar role'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {erro && <p className="form-error">{erro}</p>}
    </div>
  );
}

export default GerenciarUsuarios;
