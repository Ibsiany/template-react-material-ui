import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';

const Header = ({ param }: { param: string | undefined }) => {
  const navigate = useNavigate();

  const navigateInInitialPage = async () => {
    if (param === 'login') {
      navigate('/create');
    } else if(param === 'register') {
      navigate('/');
    }
  };

  return (
    <AppBar position="static" sx={{ height: '10vh' }} color='default'>
      <Toolbar >
        <IconButton edge="start" color="inherit" aria-label="menu">
            <img src={logo} alt="Chameleon Stack - Kanban" style={{ height: '30px' }} />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
        </Typography>
        <Button color="inherit" onClick={navigateInInitialPage}>{ param === 'register'? 'Entrar':'Cadastrar'}</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;