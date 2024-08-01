import Home from './pages/home';
import Login from './pages/login';
import Order from './pages/order';
import Signup from './pages/signup';
import useAuthentication from './hooks/use-authentication';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  const { autoLogin } = useAuthentication();
  autoLogin();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
