import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div>
      <nav>
        <Link to={'/account'}>Realizar Transação</Link>
        <Link to={'/account/record'}>Transações Feitas</Link>
        <Link to="/login" onClick={() => localStorage.removeItem('user')}>
          Sair
        </Link>
      </nav>
      ;
    </div>
  );
}
