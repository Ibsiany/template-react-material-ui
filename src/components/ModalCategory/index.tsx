import { Box, Button, Grid, Input, InputLabel, Modal, TextField, Typography } from '@mui/material';
import { styleCategory } from '../../pages/Home/styles/StyleCategory';
import { ModalCreateCategoryInterface } from './interfaces/ModalCreateCategoryInterface';

const ModalCategory = ({
    openCategory,
    handleCloseCategory,
    handleSubmitCreateCategory
}: ModalCreateCategoryInterface) => {
    return (
        <Modal
        open={openCategory}
        onClose={handleCloseCategory}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box component="form" noValidate onSubmit={handleSubmitCreateCategory} sx={styleCategory}>
          <Typography component="text" variant="overline" style={{ textAlign: 'start'}}>
            Criação de categoria
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Nome"
                name="name"
              />
            </Grid>
            <Grid item xs={12} style={{display: 'flex',alignItems:'center',  flexDirection: 'row', gap:'1rem'}}>
              <InputLabel htmlFor="color">Cor</InputLabel>
              <Input
                required
                id="color"
                name="color"
                type="color"
                style={{ width: '2rem'}}  
              />
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

export default ModalCategory;