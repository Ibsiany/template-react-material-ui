import { CategoriesInterface } from "../../../pages/Home/interfaces/CategoriesInterface";

export type ModalCreateCardInterface = {
    open: any;
    handleClose: any; 
    handleSubmitCreateCard: any; 
    selectedCategories: any; 
    setSelectedCategories: any; 
    categories: CategoriesInterface[]; 
    handleDeleteCategory: any; 
    handleOpenCategory: any; 
    cardModal: any; 
    handleSubmitUpdateCard: any; 
    status?: string; 
    type?: string; 
}