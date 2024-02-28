import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Container, FormControl, Grid, InputBase, InputLabel, MenuItem, Modal, Select, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

const defaultTheme = createTheme();

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const columns = [
     {
      status: 'backlog',
      name: 'Backlog',
    },
    {
      status: 'develop',
      name: 'Desenvolvimento',
    },
    {
      status: 'done',
      name: 'Finalizado',
  },
];

type ICard = {
  id: "177f5cf2-ed0a-4e10-8160-a9c7d419f0c3",
  created_at: "2023-10-29T23:00:00.758Z",
  updated_at: "2023-10-29T23:00:00.758Z",
  description: "create crud",
  status: "10",
  title: "Create CRUD",
}

export function Home() {
  const [cards, setCards] = useState<ICard[]>([]);
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user } = useAuth();

  const onDragEnd = () => {
    api.get(`/card/${user.user.id}`).then(response => {
      setCards(response.data)
    })
  }
  
  // useEffect(() => {
  //   api.get(`/card/${user.user.id}`).then(response => {
  //     setCards(response.data)
  //   })
  // }, [user.user.id])

  const handleSubmitCreateCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    
    if (!data.get('title') || !data.get('status') || !data.get('description')) {
      toast.error('Preencha todos os campos!');
      
      return;
    }
    
    try {
      await api.post(`/card/${user.user.id}`, {
        title: data.get('title'),
        description: data.get('description'),
        status: data.get('status')
      });

      handleClose()
    } catch (error) {
      toast.error('Ocorreu um erro ao cadastrar card!');
    }
  };


  const searchCard = async (search:any) => {
    try {
      const response = await api.get(`/card/${user.user.id}`, {
        params: {
          description: search, 
        },
      });

      setCards(response.data)

    } catch (error) {
      console.log(error)
    }
  };

  const SearchInput = () => {
    const [search, setSearch] = useState('');
  
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        searchCard(search); 
      }
    };

    return (
      <InputBase  
        id="description" 
        name="description" 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        onKeyPress={handleKeyPress} 
        placeholder="Pesquisar" 
        style={{ width:'100%',paddingLeft: '40px',paddingTop:'3px', background:'white', borderRadius:'4px' }} 
      />
    );
  };

  const SearchBar = () => {
    return (
      <div style={{ width:'80%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{ width:'60%'}}>
          <div style={{ position: 'relative', borderRadius: '4px', backgroundColor: '#f1f1f1', width:'100%'}}>
            <SearchIcon style={{ position: 'absolute', margin: '5px', zIndex:'1'}} />
            <SearchInput />
          </div>
        </div>
      </div>
    );
  };

  const ModalComponent = () => {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box component="form" noValidate onSubmit={handleSubmitCreateCard} sx={style}>
          <Typography component="h1" variant="h5" style={{ textAlign: 'center', margin: '1rem'}}>
            Criação de card
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                label="Titulo"
                name="title"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                label="Descrição"
                name="description"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  name="status"
                >
                  {columns.map((column) => {
                    return <MenuItem value={column.status}>{column.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Criar
          </Button>
        </Box>
      </Modal>
    )
  }
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Toaster position="top-right" reverseOrder={false} />
      <Header param='home' searchBar={SearchBar} />
      <Container style={{marginTop: '2rem'}}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          Chameleon Stack - Kanban
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen} style={{ textTransform: 'none',}}>
          Nova Task
        </Button>
      </Grid>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => {
          return (
            <Droppable droppableId={column.status} key={column.status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ margin: '8px', border: '1px solid lightgrey', borderRadius: '2px', width: '220px', display: 'flex', flexDirection: 'column' }}
                >
                  <h3>{column.name}</h3>
                  {cards.map((card, index) => (
                    <Draggable draggableId={card.id} index={index} key={card.id}>
                              {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          style={{ userSelect: 'none', padding: '8px', margin: '0 0 8px 0', minHeight: '50px', backgroundColor: 'white', ...provided.draggableProps.style }}
                        >
                          {card.title}
                        </div>
                      )}
                    </Draggable>
                     ))}
                     {provided.placeholder}
                   </div>
                 )}
               </Droppable>
             );
           })}
         </DragDropContext>
      </Container>
     <ModalComponent />
    </ThemeProvider>
  );
};
