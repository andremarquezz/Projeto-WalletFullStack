import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
