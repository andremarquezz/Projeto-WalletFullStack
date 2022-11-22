import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getBalance, createTransaction } from '../services/account';
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
  const [textAlert, setTextAlert] = useState<string>('');
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
      const response = await createTransaction({ userCashIn, value });
      const { balance } = await getBalance();
      setUserReceived(userCashIn);
      setBalance(balance);
      setTransaction(response);
      setTextAlert('');
    } catch (error) {
      const err = error as AxiosError;
      switch (err.response?.status) {
        case ERROR.BAD_REQUEST:
          return setTextAlert('Usuário não encontrado!');
        case ERROR.UNAUTHORIZED:
          return setTextAlert('Saldo Insuficiente!');
        case ERROR.CONFLICT:
          return setTextAlert('Não é possivel transferir para a mesma conta!');
        default:
          return setTextAlert('Aconteceu algum problema, tente novamente!');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-around navbar navbar-expand-lg navbar-light bg-light">
        <p className="navbar-brand mx-2">Saldo: {balance}</p>
        <Navbar />
      </div>
      <div className="form-group d-flex flex-column justify-content-center m-4">
        <h3 className="mx-auto">Realizar transferência</h3>
        <label htmlFor="userCashIn">
          <input
            type="text"
            name="userCashIn"
            className="form-control w-25 mx-auto m-2"
            placeholder="Transferir para"
            onChange={(event) =>
              setInfoTransaction({ userCashIn: event.target.value, value })
            }
          />
        </label>
        <div className="form-group d-flex flex-column justify-content-center">
          <label htmlFor="valueCashIn">
            <input
              className="form-control w-25 mx-auto m-2"
              type="number"
              name="valueCashIn"
              placeholder="Valor da transferência"
              onChange={(event) =>
                setInfoTransaction({ userCashIn, value: event.target.value })
              }
            />
          </label>
        </div>
        <button className="btn btn-primary mx-auto m-2" onClick={handleTransaction}>
          Transferir
        </button>

        {textAlert && <p className="alert alert-warning mx-auto m-1">{textAlert}</p>}
      </div>
      {transaction && (
        <div className="card text-justify mx-auto align-items-center w-50 text-center">
          <h2 className="card-header w-100 ">Transferência Realizada!</h2>
          <ul className="list-group list-group-flus w-100">
            <li className="list-group-item">Id da transação: {transaction.id}</li>
            <li className="list-group-item">Nome do Recebedor: {userReceived}</li>
            <li className="list-group-item">
              Data da transferência:{' '}
              {moment(new Date(transaction.createdAt)).format('DD/MM/YYYY')}
            </li>
            <li className="list-group-item">Valor: {`R$ ${transaction.value}`}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
