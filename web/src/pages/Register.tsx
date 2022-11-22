import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IUser from '../interfaces/IUser';
import { registerUser } from '../services/user';
import ERROR from '../utils/typesErrors';

export default function Register() {
  const [{ username, password }, setUser] = useState<IUser>({
    username: '',
    password: '',
  });
  const [disableBtnLogin, setDisableBtnLogin] = useState<boolean>(true);
  const [alert, setAlert] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const MIN_LENGTH_USERNAME = 3;
    const validateInputs = () => {
      const regexPassword = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/gm;
      if (regexPassword.test(password) && username.length >= MIN_LENGTH_USERNAME) {
        return setDisableBtnLogin(false);
      }
      return setDisableBtnLogin(true);
    };
    validateInputs();
  }, [username, password]);

  const createUser = async () => {
    try {
      const response = await registerUser({ username, password });
      localStorage.setItem('user', JSON.stringify(response));
      navigate('/account');
    } catch (error) {
      const err = error as AxiosError;

      switch (err.response?.status) {
        case ERROR.BAD_REQUEST:
          return setAlert('Você deve inserir informações validas!');
        case ERROR.CONFLICT:
          return setAlert('Este nome de usuário já existe!');
        default:
          return setAlert('Problema ao criar conta, tente novamente!');
      }
    }
  };

  return (
    <div className="form-group d-flex flex-column justify-content-center m-5 align-items-center">
      <h1>Criar conta</h1>
      <div>
        <ul>
          <li>É necessario que o nome de usuario contenha ao menos 3 caracteres</li>
          <li>É necessario que a senha contenha ao menos 8 caracteres</li>
          <li>É necessario que a senha contenha ao menos 1 letra maiúscula</li>
          <li>É necessario que a senha contenha ao menos 1 letra minúscula</li>
          <li>É necessario que o username contenha ao menos 3 caracteres</li>
        </ul>
      </div>
      <div></div>
      <form>
        <div className="input-group input-group-sm mb-3 d-flex">
          <div className="input-group-prepend">
            <span className="input-group-text" id="username">
              Usuário
            </span>
          </div>
          <input
            className="form-control"
            type="text"
            placeholder=""
            name="username"
            id="username"
            onChange={(event) => setUser({ username: event.target.value, password })}
            value={username}
          />
        </div>
        <div className="input-group input-group-sm mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text" id="password">
              Senha
            </span>
          </div>
          <input
            className="form-control"
            type="password"
            name="password"
            id="password"
            placeholder="Senha"
            onChange={(event) => setUser({ username, password: event.target.value })}
          />
        </div>
        <button
          type="button"
          className="btn btn-outline-success"
          disabled={disableBtnLogin}
          onClick={createUser}
        >
          Criar conta
        </button>
      </form>
      {alert && <p>{alert}</p>}
    </div>
  );
}
