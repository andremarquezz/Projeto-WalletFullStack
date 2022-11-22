import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IUser from '../interfaces/IUser';
import { authenticationUser } from '../services/user';
import ERROR from '../utils/typesErrors';

export default function Login() {
  const [{ username, password }, setUser] = useState<IUser>({
    username: '',
    password: '',
  });
  const [alert, setAlert] = useState<string>('');

  const navigate = useNavigate();

  const newSession = async () => {

    try {
      const response = await authenticationUser({ username, password });
      localStorage.setItem('user', JSON.stringify(response));
      navigate('/account');
    } catch (error) {
      const err = error as AxiosError;
      switch (err.response?.status) {
        case ERROR.NOT_FOUND:
          return setAlert('Usuário não encontrado!');
        case ERROR.UNAUTHORIZED:
          return setAlert('Senha incorreta!');
        default:
          return setAlert('Aconteceu algum problema, tente novamente!');
      }
    }
  };

  return (
    <div className="form-group d-flex flex-column justify-content-center m-5">
      <h1 className="text-center p-2">Login</h1>
      <form className="form-group d-flex flex-column align-items-center mx-auto">
        <label htmlFor="username">
          <input
            type="text"
            placeholder="Usuário"
            name="username"
            className="form-control w-100 mx-auto m-2"
            id="username"
            onChange={(event) => setUser({ username: event.target.value, password })}
            value={username}
          />
        </label>
        <label htmlFor="password">
          <input
            type="password"
            name="password"
            className="form-control w-100 mx-auto m-2"
            id="password"
            placeholder="Senha"
            onChange={(event) => setUser({ username, password: event.target.value })}
          />
        </label>
        <button
          className="btn btn-outline-primary m-2"
          type="button"
          onClick={newSession}
        >
          Entrar
        </button>
      </form>
      <button
        type="button"
        className="btn btn-outline-dark mx-auto"
        onClick={() => navigate('/register')}
      >
        Criar conta
      </button>
      {alert && <p>{alert}</p>}
    </div>
  );
}
