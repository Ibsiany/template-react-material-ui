import AddIcon from '@mui/icons-material/Add';
import { Button, Chip, Container, Grid, IconButton, ThemeProvider, Typography, createTheme } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../../components/Header';
import { api } from '../../services/api';

const defaultTheme = createTheme();

export function Home() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (!data.get('email') || !data.get('password')) {
      toast.error('Preencha todos os campos!');

      return;
    }

    try {
      await api.post('/user',data);
  
    } catch (error) {
      toast.error('Usuário ou senha incorreto(s)!');
    }
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Toaster position="top-right" reverseOrder={false} />
      <Header param='home' />
      <Container component="main" maxWidth="xs">

      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color="text.secondary">Chameleon Stack</Typography>
        <Button variant="contained" color="primary" onClick={() => ''}>
          Nova Task
        </Button>
      </Grid>
      <Grid container>
        {/* {headers.map((header) => ( */}
          <Grid item xs={12} sm={6} md={4} lg={3} key={'header'}>
            <Typography variant="h6" color="text.secondary">
              Card 1
              {/* <Chip label={getCardsByStatus(header).length} /> */}
              <Chip label={3} />
            </Typography>
            <IconButton onClick={() => ''}>
              <AddIcon />
              <Typography>Nova task</Typography>
            </IconButton>
            <div>
              {/* {getCardsByStatus(header).map((item) => ( */}
                {/* <TaskCard task={'1'} key={'1'} />  */}
              {/* ))} */}
            </div>
          </Grid>
        {/* ))} */}
        </Grid>
        
      </Container>
    </ThemeProvider>
  );
};
