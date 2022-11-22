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
      <h1>Registro de transações</h1>
      <div>
        <h3>Tipos de transação</h3>
        <select
          name="selectOperation"
          onChange={({ target }) => fetchTransaction(target.value)}
        >
          <option value="all">Todas</option>
          <option value="cashIn">Operações de entrada</option>
          <option value="cashOut">Operações de saida</option>
        </select>
      </div>

      {transactions &&
        transactions.map((transaction) => (
          <Link to={`/account/record/${transaction.id}`}>
            <h3>Id da transferência: {transaction.id}</h3>
            <h4>
              Data da transferência:{' '}
              {moment(new Date(transaction.createdAt)).format('DD/MM/YYYY')}
            </h4>
            <p>Valor: {transaction.value}</p>
          </Link>
        ))}
    </div>
  );
}
