import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Avatar, Box, Button, IconButton, InputBase, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import userDefault from '../../assets/user.jpeg';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ param }: { param: string | undefined }) => {
  const navigate = useNavigate();
  const { user, signOut} = useAuth();

  const navigateHeader = async () => {
    if (param === 'login') {
      navigate('/create');
    } else if(param === 'register') {
      navigate('/');
    } else if(param === 'home') {
      signOut()

      navigate('/');
    }
  };


  const SearchBar = () => {
    return (
      <div style={{ width:'80%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
         <div style={{ width:'60%'}}>
            <div style={{ position: 'relative', borderRadius: '4px', backgroundColor: '#f1f1f1', width:'100%'}}>
                <SearchIcon style={{ position: 'absolute', margin: '5px', zIndex:'1'}} />
                <InputBase placeholder="Pesquisar" style={{ width:'100%',paddingLeft: '40px',paddingTop:'3px', background:'white', borderRadius:'4px' }} />
            </div>
          </div>
      </div>
    );
  };

  return (
    <AppBar position="static" sx={{ height: '12vh' }} color='default'>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
            <img src={logo} alt="Chameleon Stack - Kanban" style={{ height: '30px' }} />
        </IconButton>

        {param === 'home' && <SearchBar />}

        {param === 'home' ? <>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt="User Profile" src={user?.user?.photo || userDefault} />
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginLeft: 2, gap:0 }}>
              <Typography variant="overline">
                {user?.user?.name || 'User Default'}
              </Typography>
              <Button
                color="info"
                onClick={navigateHeader}
                size="small"
                sx={{
                  textTransform: 'none',
                  padding: 0,
                  backgroundColor: 'transparent',
                  background:'none'
                }}
                style={{
                  width: '2px',
                  height: '2px'
                }}>
                sair
              </Button>
            </Box>
          </Box>
        </> : <Button color="inherit" onClick={navigateHeader}>{param === 'register' ? 'Entrar' : 'Cadastrar'}</Button>}
      </Toolbar>
    </AppBar>
  );
}

export default Header;