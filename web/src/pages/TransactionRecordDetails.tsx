import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
      <div className="form-group d-flex flex-column justify-content-center m-2 align-items-center">
        <h1>Informações da transação</h1>
        <Link to={'/account/record'}>
          <button className="btn btn-outline-dark">Voltar</button>
        </Link>
        {transaction && (
          <div className="card m-4">
            <div className="card-body">
              <h5 className="card-title">Id da transferência: {transaction.id}</h5>
              <p className="card-text">
                {' '}
                Data da transferência:{' '}
                {moment(new Date(transaction.createdAt)).format('DD/MM/YYYY')}
              </p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Valor: {transaction.value}</li>
              <li className="list-group-item">Usuario Debitado: {userDebited}</li>
              <li className="list-group-item">Usuario Creditado: {userCredited}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
