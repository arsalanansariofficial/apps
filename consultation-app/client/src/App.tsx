import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Appointment from './pages/appointment';
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/appointment/:doctorId" element={<Appointment />} />
      </Routes>
    </BrowserRouter>
  );
}
