import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getBalance, fetchTransaction } from '../services/account';
import ITransaction from '../interfaces/ITransaction';
import IInfoTransaction from '../interfaces/IInfoTransaction';
import { AxiosError } from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ERROR from '../utils/typesErrors';

export default function Account() {
  const [balance, setBalance] = useState('');
  const [{ userCashIn, value }, setInfoTransaction] = useState<IInfoTransaction>({
    userCashIn: '',
    value: '',
  });
  const [transaction, setTransaction] = useState<ITransaction>();
  const [alert, setAlert] = useState<string>('');
  const [userReceived, setUserReceived] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const userStorage = localStorage.getItem('user') || 'notToken';
    if (userStorage === 'notToken') navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchBalance = async () => {
      const response = await getBalance();
      setBalance(response.balance);
    };
    fetchBalance();
  }, [balance]);

  const handleTransaction = async () => {
    try {
      const response = await fetchTransaction({ userCashIn, value });
      const { balance } = await getBalance();
      setUserReceived(userCashIn);
      setBalance(balance);
      setTransaction(response);
    } catch (error) {
      const err = error as AxiosError;
      switch (err.response?.status) {
        case ERROR.BAD_REQUEST:
          return setAlert('Usuário não encontrado!');
        case ERROR.UNAUTHORIZED:
          return setAlert('Saldo Insuficiente!');
        case ERROR.CONFLICT:
          return setAlert('Não é possivel transferir para a mesma conta!');
        default:
          return setAlert('Aconteceu algum problema, tente novamente!');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <p>Saldo: {balance}</p>
      <div>
        <h3>Realizar transferência</h3>
        <label htmlFor="userCashIn">
          <input
            type="text"
            name="userCashIn"
            placeholder="Transferir para"
            onChange={(event) =>
              setInfoTransaction({ userCashIn: event.target.value, value })
            }
          />
        </label>
        <label htmlFor="valueCashIn">
          <input
            type="number"
            name="valueCashIn"
            placeholder="Valor da transferência"
            onChange={(event) =>
              setInfoTransaction({ userCashIn, value: event.target.value })
            }
          />
        </label>
        <button onClick={handleTransaction}>Transferir</button>

        {alert && <p>{alert}</p>}
      </div>
      {transaction && (
        <div>
          <h2>Transferência Realizada!</h2>
          <p>Id da transação: {transaction.id}</p>
          <p>Nome do Recebedor: {userReceived}</p>
          <p>
            Data da transferência:{' '}
            {moment(new Date(transaction.createdAt)).format('DD/MM/YYYY')}
          </p>
          <p>Valor: {transaction.value}</p>
        </div>
      )}
    </div>
  );
}
