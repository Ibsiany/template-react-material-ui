import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import userDefault from '../../assets/user.jpeg';
import { useAuth } from '../../hooks/useAuth';


const Header = ({ param, searchBar }: { param: string | undefined, searchBar?:any }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const SearchBar = searchBar;

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

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#F6F7F9 !important", borderTop:'1px solid', boxShadow: 'none' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
            <img src={logo} alt="Chameleon Stack - Kanban" style={{ height: '30px' }} />
        </IconButton>

        {param !== 'home' &&
          <>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
            </Typography>
            <Button color="inherit" onClick={navigateHeader}>{param === 'register' ? 'Entrar' : 'Cadastrar'}</Button>
          </>}
        
        {param === 'home' &&
          <>
            <SearchBar />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar alt="User Profile" src={user?.user?.photo || userDefault} />
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginLeft: 2, gap:0 }}>
                <Typography variant="overline" sx={{color:"#2A2A35"}}>
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
          </>
        } 
      </Toolbar>
    </AppBar>
  );
}

export default Header;