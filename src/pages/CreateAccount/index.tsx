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
import { api } from '../../services/api';

const defaultTheme = createTheme();

export function CreateAccount() {
  const [preview, setPreview] = React.useState(user);
  
  const handleFileChange = (event:any) => {
    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (!data.get('name') || !data.get('email') || !data.get('password')) {
      toast.error('Preencha todos os campos!');

      return;
    }

      try {
        await api.post('/user',data);
  
        navigate('/');
      } catch (error) {
        toast.error('Ocorreu algum erro na criação do usuário!');
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
                <label htmlFor="photo" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="photo"
                    name="photo"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <img src={preview} alt="Adicionar foto" style={{ borderRadius:'100%', width: '5.5rem', height: '5.5rem' }} />
                </label>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Nome"
                  name="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
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
              Cadastrar
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}