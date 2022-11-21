import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [{ username, password }, setUser] = useState({ username: '', password: '' });
  const [disableBtnLogin, setDisableBtnLogin] = useState(true);
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

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label htmlFor="username">
          <input
            type="text"
            placeholder="Username"
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
            placeholder="Password"
            onChange={(event) => setUser({ username, password: event.target.value })}
          />
        </label>
        <button type="button" disabled={disableBtnLogin}>
          Entrar
        </button>
      </form>
      <button type="button" onClick={() => navigate('/register')}>
        Registrar
      </button>
    </div>
  );
}
