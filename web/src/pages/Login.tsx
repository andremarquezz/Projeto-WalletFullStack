import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IUser from '../interfaces/IUser';
import { authenticationUser } from '../services/user';

export default function Login() {
  const [{ username, password }, setUser] = useState<IUser>({
    username: '',
    password: '',
  });
  const [alert, setAlert] = useState<string>('');

  const navigate = useNavigate();

  const newSession = async () => {
    const ERROR_NOT_FOUND = 404;
    const ERROR_UNAUTHORIZED = 401;

    try {
      const response = await authenticationUser({ username, password });
      localStorage.setItem('user', JSON.stringify(response));
      navigate('/account');
    } catch (error) {
      const err = error as AxiosError;
      switch (err.response?.status) {
        case ERROR_NOT_FOUND:
          return setAlert('Usuário não encontrado!');
        case ERROR_UNAUTHORIZED:
          return setAlert('Senha incorreta!');
        default:
          return setAlert('Aconteceu algum problema, tente novamente!');
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label htmlFor="username">
          <input
            type="text"
            placeholder="Usuário"
            name="username"
            id="username"
            onChange={(event) => setUser({ username: event.target.value, password })}
            value={username}
          />
        </label>
        <label htmlFor="password">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Senha"
            onChange={(event) => setUser({ username, password: event.target.value })}
          />
        </label>
        <button type="button" onClick={newSession}>
          Entrar
        </button>
      </form>
      <button type="button" onClick={() => navigate('/register')}>
        Criar conta
      </button>
      {alert && <p>{alert}</p>}
    </div>
  );
}
