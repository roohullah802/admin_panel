import {Route, BrowserRouter as Router, Routes, } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Cars from './pages/Cars';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import { SignupForm } from './auth/Signup';
import { VerificationCode } from './auth/EmailVerify';
import { ToastContainer } from 'react-toastify';
import { LoginForm } from './auth/Login';

function App() {


  return (
    <>
    <Router>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/users' element={<Users />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/transaction' element={<Transactions />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/verify-email' element={<VerificationCode />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
