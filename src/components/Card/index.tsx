import { MoreVert } from '@mui/icons-material';
import {
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { lighten } from 'polished';
import { Draggable } from 'react-beautiful-dnd';
import { RequestCardInterface } from './interfaces/RequestCard';

const Card = ({
    cards,
    column,
    handleOpenCardUpdated,
    handleClick,
    anchorEl,
    openClick,
    handleClickClose,
    handleDeleteCard,
}: RequestCardInterface) => {
  return (
    <div style={{ 
      height: '70vh', 
      overflowY: 'auto', 
    }}>
      {cards.map((card, index) => {
      if(card.status === column.status) return (
      <Draggable draggableId={card.id} index={index} key={card.id}>
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
        onClick={() => handleOpenCardUpdated(card)}
      >
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', width: '100%' }} key={card.id}>
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
                <div key={card.id} onClick={(event) => {
                  event.stopPropagation()
                }}>
               <IconButton aria-label="settings" onClick={(event) => {
                  event.stopPropagation();
                  handleClick(event, card);
                }}>
                  <MoreVert />
                </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={openClick}
                    onClose={handleClickClose}
                    >
                    <MenuItem onClick={() => {handleOpenCardUpdated()}
                    }>
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => {handleDeleteCard()}}>
                      Excluir
                    </MenuItem>
                  </Menu>
                </div>
            </div> 
          
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'start', gap: '8px', marginBottom: '1rem', flexDirection: 'row' }}>
              {card?.categories && card?.categories.map((category) => {
              return (
                <h5 style={{
                  width: 'auto',
                  height: '24px',
                  padding: '0.5rem',
                  borderRadius: '100px',
                  gap: '8px',
                  background: lighten(0.5, category.color),
                  color: category.color,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {category.name}
                </h5>
              )
            })}
          </div>
          <text style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '1rem'
            }}>
              {card.description}
            </text>
        </div>
      )}
      </Draggable>
    )})}
      </div>
  );
}

export default Card;