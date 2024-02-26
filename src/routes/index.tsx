import { BrowserRouter, Route, Routes as Router } from 'react-router-dom';
// import { BetsInTheGame } from '../pages/BetsInTheGame';
// import { BetsInTheScore } from '../pages/BetsInTheScore';
// import { ConfigurationTheGame } from '../pages/ConfigurationTheGame';
// import { EditUser } from '../pages/EditUser';
import { Login } from '../pages/Login';
// import { MyBets } from '../pages/MyBets';
// import { Result } from '../pages/Result';
import { CreateAccount } from '../pages/CreateAccount';
import { PrivateRoute } from './Route';

export function Routes(): JSX.Element {
  return (

    <BrowserRouter>
      <Router>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/auth" element={<PrivateRoute />}>
          {/* <Route path="/auth/dashboard" element={<MyBets />} /> */}
          {/* <Route path="/auth/edit-user" element={<EditUser />} /> */}
          {/* <Route path="/auth/bets-play" element={<BetsInTheGame />} /> */}
          {/* <Route path="/auth/bets-score" element={<BetsInTheScore />} /> */}
          {/* <Route path="/auth/result" element={<Result />} /> */}
          {/* <Route path="/auth/setting" element={<ConfigurationTheGame />} /> */}
        </Route>
      </Router>
    </BrowserRouter>
  );
}
