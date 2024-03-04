import Global from './styles/global';
import { Routes } from './routes';
import { AuthProvider } from './hooks/useAuth';

export function App() {
  return (
    <>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <Global />
    </>
  );
}
