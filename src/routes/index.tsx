import { BrowserRouter, Route, Routes as Router } from 'react-router-dom';
import { CreateAccount } from '../pages/CreateAccount';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { PrivateRoute } from './Route';

export function Routes(): JSX.Element {
  return (

    <BrowserRouter>
      <Router>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/auth" element={<PrivateRoute />}>
          <Route path="/auth/home" element={<Home />} />
        </Route>
      </Router>
    </BrowserRouter>
  );
}
