import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import user from '../../assets/user.jpeg';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

const defaultTheme = createTheme();

export function CreateAccount() {
  const { user: userAuth } = useAuth();
  
  const userLogged = userAuth.user

  const [photo, setPhoto] = React.useState<string>();
  const [preview, setPreview] = React.useState(userLogged?.photo || user);

  const handleFileChange = (event: any) => {
    setPreview(URL.createObjectURL(event.target.files[0]));

    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0] as Blob);

    reader.onloadend = function() {
      const base64String = (reader.result as string)?.split(',')[1];

      setPhoto(base64String);
    };
  };

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    
    if (!userLogged && (!data.get('name') || !data.get('email') || !data.get('password'))) {
      toast.error('Preencha todos os campos!');
      
      return;
    }
    
    if (userLogged && !data.get('password')) {
      toast.error('Informe a senha para realizar a edição!');
      
      return;
    }

    if (data.get('file')) {
      data.delete('file');
    }
    
    try {
      if (userLogged) {
        await api.patch(`/user/${userLogged.id}`, {
          name: data.get('name'),
          email: data.get('email'),
          password: data.get('password'),
          photo
        });
        
        navigate('/auth/home');

        return;
      }
      await api.post('/user',{
        name: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
        photo
      });
      
      navigate('/');
    } catch (error) {
      toast.error(`Ocorreu algum erro na ${userLogged ? 'edição' : 'criação'} do usuário!`);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Toaster position="top-right" reverseOrder={false} />
      <Header param='register' />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Criar usuário
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                Foto: 
                <label htmlFor="file" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="file"
                    name="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <img src={preview} alt="Adicionar foto" style={{ borderRadius:'100%', width: '5.5rem', height: '5.5rem' }} />
                </label>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={userLogged && true}
                  fullWidth
                  id="name"
                  label="Nome"
                  name="name"
                  defaultValue={userLogged?.name || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required={userLogged && true}
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  defaultValue={userLogged?.email || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {userLogged ? 'Editar' : 'Cadastrar'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}