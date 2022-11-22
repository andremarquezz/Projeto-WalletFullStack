import { Navigate, Route, Routes } from 'react-router-dom';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import TransactionRecord from './pages/TransactionRecord';
import TransactionRecordDetails from './pages/TransactionRecordDetails';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account/record" element={<TransactionRecord />} />
      <Route path="/account/record/:id" element={<TransactionRecordDetails />} />
      <Route path="/account" element={<Account />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}
export default App;
