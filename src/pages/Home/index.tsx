import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Container, Grid, InputBase, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/Card';
import Header from '../../components/Header';
import ModalCard from '../../components/ModalCard';
import ModalCategory from '../../components/ModalCategory';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { columns } from './columns';
import { CardInterface } from './interfaces/CardInterface';
import { CategoriesInterface } from './interfaces/CategoriesInterface';

const defaultTheme = createTheme();

export function Home() {
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [categories, setCategories] = useState<CategoriesInterface[]>([]);
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [cardModal, setCardModal] = useState<CardInterface>();
  const [type, setType] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState(null);
    
  const openClick = Boolean(anchorEl);

  
  const handleClick = (event: any, card: CardInterface) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategories(card?.categories?.map(category => category.id) || [])
    setCardModal(card)
  };
  
  const handleClickClose = () => {
    setAnchorEl(null);
  };
  
  const handleOpen = () => {
    setOpen(true)
    setType('create');
    handleClickClose()
  };
  
  const handleClose = () => {
    setSelectedCategories([])
    setType('create');
    setOpen(false)
    setStatus('')
  };
  
  const handleOpenCategory = () => setOpenCategory(true);
  const handleCloseCategory = () => setOpenCategory(false);
  
  const handleOpenCardUpdated = () => {
    setOpen(true)
    handleClickClose();
    setType('update');
  };

  const handleCloseCardUpdated = () => {
    setSelectedCategories([])
    setCardModal(undefined)
    handleClickClose()
    setOpen(false)
    setType('update');
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

      setCards([...getCards,response.data])
    })
  }

  useEffect(() => {
    api.get(`/card/${user.user.id}`).then(response => {
      setCards(response.data)
    })

    api.get(`/category/${user.user.id}`).then(response => {
      setCategories(response.data)
    })
  },[user.user.id])

  const handleSubmitCreateCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    
    if (!data.get('title') || (!data.get('status') && !status) || !data.get('description')) {
      toast.error('Preencha todos os campos!');
      
      return;
    }

    try {
      const card = await api.post<CardInterface>(`/card/${user.user.id}`, {
        title: data.get('title'),
        description: data.get('description'),
        status: data.get('status') || status,
        category_ids:selectedCategories
      });

      setCards([...cards, card.data])

      handleClose()
    } catch (error) {
      toast.error('Ocorreu um erro ao cadastrar card!');
    }
  };

  const handleDeleteCard = async () => {
    handleCloseCardUpdated()

    if (!cardModal || !cardModal.id) {
      toast.error('Ocorreu um erro ao deletar card!');
    }
    
    try {
      await api.delete(`/card/${cardModal?.id}`);

      setCards(cards.filter(card => card.id !== cardModal?.id));

    } catch (error) {
      toast.error('Ocorreu um erro ao deletar card!');
    }
  };

  const handleSubmitUpdateCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (!cardModal) {
      toast.error('Ocorreu um erro ao atualizar card!');
    }
    
    try {
      const cardUPdated = await api.patch(`/card/${cardModal?.id}`, {
        title: data.get('title'),
        description: data.get('description'),
        status: data.get('status'),
        category_ids:selectedCategories
      });

      const cardsOld = cards.filter(card => card.id !== cardModal?.id)

      setCards([...cardsOld, cardUPdated.data])

      handleCloseCardUpdated()
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar card!');
    }
  };

  const handleDeleteCategory = async (id:string) => {
    if (!id) {
      toast.error('Ocorreu um erro ao deletar category!');
    }
    
    try {
      await api.delete(`/category/${id}`);

      setCategories(categories.filter(category => category.id !== id));

    } catch (error) {
      toast.error('Ocorreu um erro ao deletar category!');
    }
  };

  const handleSubmitCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    
    if (!data.get('name') || !data.get('color')) {
      toast.error('Preencha todos os campos!');
      
      return;
    }
    
    try {
      const category = await api.post(`/category/${user.user.id}`, {
        name: data.get('name'),
        color: data.get('color'),
      });

      setCategories([...categories, category.data])

      handleCloseCategory()
    } catch (error) {
      toast.error('Ocorreu um erro ao cadastrar card!');
    }
  };

  const searchCard = async (search:any) => {
    try {
      const response = await api.get(`/card/${user.user.id}`, {
        params: {
          title: search, 
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
          <div style={{
            position: 'relative',
            borderRadius: '4px',
            backgroundColor: '#F6F7F9',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}>
            <SearchIcon style={{ position: 'absolute', margin: '5px', zIndex:'1', color: '#9CA3AD'}} />
            <SearchInput />
          </div>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Toaster position="top-right" reverseOrder={false} />
      <Header param='home' searchBar={SearchBar} />
      <Container style={{marginTop: '2rem', maxWidth: '1220px'}}>
      <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" style={{
            fontFamily: 'Poppins',
            fontSize: '24px',
            fontWeight: '500',
            lineHeight: '32px',
            textAlign: 'left'
          }}>
          Chameleon Stack
        </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}
            style={{textTransform: 'none'}}>
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
              gap: '8px',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: '600',
              lineHeight: '24px',
              textAlign: 'left'
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
                    <div
                      style={{
                        background: 'white',
                        width: '100%',
                        padding: '0',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'start',
                        flexDirection: 'row',
                        paddingBottom: '1rem',
                      }}
                    >
                      <h3>
                      {column.name}

                      </h3>
                      <div style={{
                        padding: '0.8rem',
                        marginLeft: '0.5rem',
                        backgroundColor: '#F6F7F9',
                        color: '#9CA3AD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%', 
                        width: '1.5rem', 
                        height: '1.5rem',
                      }}>
                        {cards.filter(card => card.status === column.status).length}
                      </div>
                    </div>
                  <Button
                    onClick={() => (setStatus(column.name), handleOpen())}
                    style={{
                      backgroundColor: '#F6F7F9',
                      color: '#9CA3AD',
                      textTransform: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'start',
                      width: '100%',
                    }}
                  >
                    <AddIcon style={{
                      height: '1rem',
                      width: '1rem',
                      marginRight: '0.5rem',
                      marginBottom: '0.2rem',
                    }}/>
                    Nova Task
                  </Button>
                      <Card
                        cards={cards}
                        column={column}
                        handleDeleteCard={handleDeleteCard}
                        handleOpenCardUpdated={handleOpenCardUpdated}
                        openClick={openClick}
                        handleClick={handleClick}
                        anchorEl={anchorEl}
                        handleClickClose={handleClickClose}
                      />
                {provided.placeholder}
                </div>
                )}
              </Droppable>
              );
          })}
        </div>
      </DragDropContext>
      </Container>
      <ModalCard
          open={open}
          handleClose={handleClose}
          handleSubmitCreateCard={handleSubmitCreateCard}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categories={categories}
          handleDeleteCategory={handleDeleteCategory}
          handleOpenCategory={handleOpenCategory}
          status={status}
          type={type}
          cardModal={cardModal}
          handleSubmitUpdateCard={handleSubmitUpdateCard}
      />
      <ModalCategory
          openCategory={openCategory}
          handleCloseCategory={handleCloseCategory}
          handleSubmitCreateCategory={handleSubmitCreateCategory}
      />
    </ThemeProvider>
  );
};
