import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ITransaction from '../interfaces/ITransaction';
import { getOneTransaction } from '../services/account';
import { findUser } from '../services/user';

export default function TransactionRecordDetails() {
  const [transaction, setTransaction] = useState<ITransaction>();
  const [userDebited, setUserDebited] = useState<string>();
  const [userCredited, setUserCredited] = useState<string>();
  const { id } = useParams();

  useEffect(() => {
    const fetchTransaction = async () => {
      const response = await getOneTransaction(id);
      setTransaction(response);
    };
    fetchTransaction();

    const getUsers = async () => {
      if (transaction) {
        const userDebited = await findUser(transaction.debitedAccountId);
        setUserDebited(userDebited.user);
        const userCredited = await findUser(transaction.creditedAccountId);
        setUserCredited(userCredited.user);
      }
    };
    getUsers();
  }, [id, transaction]);

  return (
    <div>
      <Navbar />
      {transaction && (
        <div>
          <h1>Registro da transação</h1>
          <h3>Id da transferência: {transaction.id}</h3>
          <h4>
            Data da transferência:{' '}
            {moment(new Date(transaction.createdAt)).format('DD/MM/YYYY')}
          </h4>
          <p>Valor: {transaction.value}</p>
          <p>Usuario Debitado: {userDebited}</p>
          <p>Usuario Creditado: {userCredited}</p>
        </div>
      )}
    </div>
  );
}
