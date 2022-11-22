import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ITransaction from '../interfaces/ITransaction';
import {
  getAllTransactions,
  getTransactionsCashIn,
  getTransactionsCashOut,
} from '../services/account';

export default function TransactionRecord() {
  const [transactions, setTransactions] = useState<ITransaction[]>();

  useEffect(() => {
    const allTransactions = async () => {
      const response = await getAllTransactions();
      setTransactions(response);
    };
    allTransactions();
  }, []);

  const fetchTransaction = async (value: string) => {
    switch (value) {
      case 'all':
        return setTransactions(await getAllTransactions());
      case 'cashIn':
        return setTransactions(await getTransactionsCashIn());
      case 'cashOut':
        return setTransactions(await getTransactionsCashOut());
      default:
        break;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-group d-flex flex-column justify-content-center m-2 align-items-center">
        <h1>Registro de transações</h1>
        <div>
          <h4>Tipos de transação</h4>
          <select
            name="selectOperation"
            className="custom-select custom-select-sm"
            onChange={({ target }) => fetchTransaction(target.value)}
          >
            <option value="all">Todas</option>
            <option value="cashIn">Operações de entrada</option>
            <option value="cashOut">Operações de saida</option>
          </select>
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-center">
        {transactions &&
          transactions.map((transaction) => (
            <div className="card m-2">
              <div className="card-body">
                <h5 className="card-title">Id da transferência: {transaction.id}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Data da transferência:{' '}
                  {moment(new Date(transaction.createdAt)).format('DD/MM/YYYY')}
                </h6>
                <p className="card-text">Valor: {`R$ ${transaction.value}`}</p>
                <Link
                  to={`/account/record/${transaction.id}`}
                  className="card-link text-center "
                >
                  <button className="btn btn-outline-dark">Detalhes da operação</button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
