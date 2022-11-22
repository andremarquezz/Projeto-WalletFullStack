import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ITransaction from '../interfaces/ITransaction';
import { getAllTransactions } from '../services/account';

export default function TransactionRecord() {
  const [transactions, setTransactions] = useState<ITransaction[]>();

  useEffect(() => {
    const allTransactions = async () => {
      const response = await getAllTransactions();
      setTransactions(response);
    };
    allTransactions();
  }, []);

  const cashInTransactions = async () => {
    const response = await cashInTransactions();
    setTransactions(response);
  };
  const cashOutTransactions = async () => {
    const response = await cashInTransactions();
    setTransactions(response);
  };

  return (
    <div>
      <h1>Registro de transações</h1>
      <div>
        <h3>Tipos de transação</h3>
        <select name="selectOperation">
          <option value="all" selected>
            Todas
          </option>
          <option value="cashIn" onClick={}>
            Operações de entrada
          </option>
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
