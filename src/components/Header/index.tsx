import {
  AppBar, Avatar, Box, Button, IconButton, Menu,
  MenuItem, Toolbar, Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import userDefault from '../../assets/user.jpeg';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ param, searchBar }: { param: string | undefined, searchBar?: any }) => {
  const [anchorEl, setAnchorEl] = useState(null);

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

  const openClick = Boolean(anchorEl);

  const handleClickClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#F6F7F9 !important",
        borderTop: '1px solid',
        boxShadow: 'none',
        }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu" 
          disableRipple
          style={{
            width: '8rem',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center', 
            cursor: 'default',
          }}
        >
            <img src={logo} alt="Chameleon Stack - Kanban" style={{ height: '30px',cursor: 'pointer' }} onClick={() => navigate('/auth/home')}/>
        </IconButton>
  
        {param !== 'home' &&
          <Button variant="contained" onClick={navigateHeader}>{param === 'register' ? 'Entrar' : 'Cadastrar'}</Button>
        }
        
        {param === 'home' &&
          <SearchBar />
        }
          
        {param === 'home' &&
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={`data:image/jpeg;base64,${user?.user?.photo}` || userDefault}/>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginLeft: 2, gap: 0 }}>
              <div
                onClick={handleClick}
                style={{
                  cursor: "pointer",
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  justifyContent: 'center',
                  margin: '0',
                  padding: '0',
                  gap: '0',
                  height: '2rem',
                  width: '8rem'
                }}
              >
  
                <Typography
                  variant="overline"
                  sx={{ color: "#2A2A35" }}
                  style={{
                  fontFamily: 'Poppins',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textAlign: 'left',
                  margin: '0',
                  padding: '0',
                }}>
                    {user?.user?.name || ''}
                </Typography>
                <Typography
                  variant="overline"
                  sx={{ color: "#2A2A35" }}
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: '0.7rem',
                    fontWeight: '400',
                    textAlign: 'left',
                    margin: '0',
                    padding: '0',
                }}
                >
                    {user?.user?.email || ''}
                </Typography>
              </div>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  open={openClick}
                  onClose={handleClickClose}
                  style={{ marginLeft: '3rem',marginTop: '1rem' }}
                >
                  <MenuItem onClick={() => {navigate('/auth/edit')}}>
                      Editar
                  </MenuItem>
                  <MenuItem onClick={navigateHeader}>
                    Sair
                  </MenuItem>
                  </Menu>
              </Box>
            </Box>
        } 
      </Toolbar>
    </AppBar>
  );
}

export default Header;