import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Container, FormControl, Grid, InputBase, InputLabel, MenuItem, Modal, Select, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { darken } from 'polished';
import { useEffect, useState } from 'react';
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
  id: string,
  description: string,
  status:string,
  title: string,
  categories:ICategories[]
}

type ICategories = {
  id: string,
  color: string,
  name: string,
}

export function Home() {
  const [cards, setCards] = useState<ICard[]>([]);
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setStatus('')
  };

  const { user } = useAuth();

  const onDragEnd = (result:any) => {
    const { draggableId, destination } = result;
    
    if (!destination) {
      return;
    }
  
    api.patch(`/card/${draggableId}`, {
      status: destination.droppableId,
    }).then(response => {
      const getCards = cards.filter(card => card.id !== draggableId)
      console.log([...getCards,response.data])

      setCards([...getCards,response.data])
    })
  }

  useEffect(() => {
    api.get(`/card/${user.user.id}`).then(response => {
      setCards(response.data)
    })
  },[user.user.id])

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
              {status !== '' ?
                 <TextField
                 required
                 fullWidth
                 id="status"
                 label="Status"
                  name="status"
                  value={status}
                  disabled
               />
                :
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
                }
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
      <Container style={{marginTop: '2rem', maxWidth: '1220px'}}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          Chameleon Stack - Kanban
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen} style={{ textTransform: 'none',}}>
          Nova Task
        </Button>
      </Grid>
      <DragDropContext onDragEnd={onDragEnd}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              overflowX: 'auto',
              justifyContent: 'center',
              alignItems: 'start', 
              gap: '8px'
            }}> 
            {columns.map((column) => {
            return (
              <Droppable
                droppableId={column.status}
                key={column.status}
                direction="horizontal"
              >
              {(provided) => (
                <div
                {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      marginTop: '1rem',
                      width: '100%',
                      backgroundColor: '#F6F7F9',
                      color: '#9CA3AD',
                      textTransform: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection:'column',
                      borderRadius: '4px',
                      paddingBottom: '1rem',
                    }}
                >
                  <h3
                    style={{
                      background: 'white',
                      width: '100%',
                      padding: '0',
                      margin: '0'
                    }}
                  >
                      {column.name}
                  </h3>
                  <Button
                    onClick={() => (setStatus(column.status), handleOpen())}
                    style={{
                      padding: '8px',
                      backgroundColor: '#F6F7F9',
                      color: '#9CA3AD',
                      textTransform: 'none',
                      display: 'flex',
                      alignItems: 'start',
                      justifyContent: 'start',
                    }}
                  >
                    <AddIcon/>
                    Nova Task
                  </Button>
                    {cards.map((card, index) => {
                    if(card.status === column.status) return (
                    <Draggable draggableId={card.id} index={index+1} key={card.id} >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          style={{
                            ...provided.draggableProps.style,
                            padding: '8px',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            width: '23rem',
                            textTransform: 'none',
                            border: '1px solid #EFF1F3',
                            boxShadow: '0px 4px 8px 0px #14141B14',
                            height: '11rem',
                            marginBottom: '1rem',
                          }}
                        >
                          <h4 style={{
                            color: 'black',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '25ch',
                            marginBottom: '1rem'
                          }}>
                            {card.title}
                          </h4>
                          
                          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'start', gap: '8px', marginBottom: '1rem', flexDirection: 'row' }}>
                            {card?.categories && card?.categories.map((card) => {
                              <h5 style={{
                                width: 'auto',
                                height: '24px',
                                padding: '4px',
                                borderRadius: '100px',
                                gap: '8px',
                                background: card.color,
                                color: darken(0.5, card.color),
                              }}>{card.name}</h5>
                            })}
                          </div>
                          <text style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginBottom: '1rem'
                          }}>{card.description}</text>
                        </div>
                      )}
                    </Draggable>
                )})}
                {provided.placeholder}
                </div>
                )}
              </Droppable>
              );
          })}
        </div>
      </DragDropContext>
      </Container>
     <ModalComponent />
    </ThemeProvider>
  );
};
