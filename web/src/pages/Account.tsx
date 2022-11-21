import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getBalance, fetchTransaction } from '../services/account';
import ITransaction from '../interfaces/ITransaction';
import IInfoTransaction from '../interfaces/IInfoTransaction';
import { AxiosError } from 'axios';

export default function Account() {
  const [balance, setBalance] = useState('');
  const [{ userCashIn, value }, setInfoTransaction] = useState<IInfoTransaction>({
    userCashIn: '',
    value: '',
  });
  const [transaction, setTransaction] = useState<ITransaction>();

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
      setTransaction(response);
    } catch (error) {
      const err = error as AxiosError;
      console.log(err);
      // switch (err.response?.status) {
      //   case ERROR_NOT_FOUND:
      //     return setAlert('Usuário não encontrado!');
      //   case ERROR_UNAUTHORIZED:
      //     return setAlert('Senha incorreta!');
      //   default:
      //     return setAlert('Aconteceu algum problema, tente novamente!');
      // }
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
      </div>
      {transaction && (
        <div>
          <h2>Transferencia Realizada:</h2>
          <p>Nome do Recebedor: {userCashIn}</p>
          <p>Data da trans</p>
        </div>
      )}
    </div>
  );
}
