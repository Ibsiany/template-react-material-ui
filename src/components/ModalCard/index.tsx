import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import OutlinedInput from "@mui/material/OutlinedInput";
import { darken } from 'polished';
import { columns } from '../../pages/Home/columns';
import { styleCard } from '../../pages/Home/styles/StyleCard';
import { ModalCreateCardInterface } from './interfaces/ModalCreateCardInterface';

const ModalCard = ({
    open,
    handleClose,
    handleSubmitCreateCard,
    selectedCategories,
    setSelectedCategories,
    categories,
    handleDeleteCategory,
    handleOpenCategory,
    status,
    type,
    cardModal,
    handleSubmitUpdateCard
}: ModalCreateCardInterface) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <Box component="form" noValidate onSubmit={type === 'create' ? handleSubmitCreateCard : handleSubmitUpdateCard} sx={styleCard}>
      <Typography component="text" variant="overline" style={{ textAlign: 'start'}}>
        {type === 'create' ? 'Criação de card' :'Atualização de card'}
      </Typography>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <FormControl fullWidth required style={{ display: 'flex',alignItems:'center',  flexDirection: 'row'}}>
              <InputLabel id="category">Categorias</InputLabel>
              <Select
                labelId="category"
                id="category"
                name="category"
                style={{ width: '80%' }}
                value={selectedCategories}
                onChange={(event) => setSelectedCategories(Array.isArray(event.target.value) ? event.target.value : [event.target.value])}
                multiple
                input={
                  <OutlinedInput id="select-category" label="Categoria" />
                }
              >
                {categories?.length > 0  && categories.map((category) => {
                  return <MenuItem value={category.id} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                  }}>
                    {category.name}
                    <Button
                      style={{ margin: '0', padding: '0' }}
                      onClick={() => {
                        handleDeleteCategory(category.id);
                      }}
                    >
                      <ClearIcon style={{ color: darken(0.9,'#9CA3AD')}}/>
                    </Button>
                  </MenuItem>
                })}
              </Select>
              <Button
                  onClick={handleOpenCategory}
                  style={{
                    padding: '8px',
                    color: '#9CA3AD',
                    backgroundColor: 'transparent',
                    background:'none',
                    textTransform: 'none',
                    width: '20%',
                  }}
                >
                  <AddIcon/>
                </Button>
            </FormControl>   
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="title"
            label="Titulo"
            name="title"
            defaultValue={type !== 'create' ? cardModal?.title: ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="description"
            type="textarea"
            label="Descrição"
            name="description"
            multiline
            rows={4}
            defaultValue={type !== 'create' ? cardModal?.description: ''}
          />
          </Grid>
          <Grid item xs={12}>
          {status !== '' ?
              <TextField
              required
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
                input={
                  <OutlinedInput id="select-status" label="Status" />
                }
                defaultValue={type !== 'create' ? cardModal?.status: ''}
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
        {type === 'create' ? 'Criar' :'Atualizar'}
      </Button>
    </Box>
    </Modal>
  )
}

export default ModalCard;