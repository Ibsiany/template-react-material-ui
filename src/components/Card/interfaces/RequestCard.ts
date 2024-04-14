import { CardInterface } from "../../../pages/Home/interfaces/CardInterface";

export type RequestCardInterface  = {
    cards: CardInterface[];
    column: any;
    handleOpenCardUpdated: any;
    handleClick: any;
    anchorEl: any;
    openClick: any;
    handleClickClose: any;
    handleDeleteCard: any;
}