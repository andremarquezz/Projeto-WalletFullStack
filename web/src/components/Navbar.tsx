import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="d-flex justify-content-around navbar navbar-expand-lg navbar-light bg-light">
      <nav>
        <Link to={'/account'} className="p-4 text-decoration-none m-5 text-dark ">
          Realizar Transação
        </Link>
        <Link to={'/account/record'} className="p-4 text-decoration-none m-5 text-dark">
          Todas as Transações
        </Link>
        <Link
          to="/login"
          onClick={() => localStorage.removeItem('user')}
          className="p-4 text-decoration-none text-danger"
        >
          Sair
        </Link>
      </nav>
    </div>
  );
}
