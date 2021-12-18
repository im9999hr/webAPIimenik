import React from 'react';
import * as Icon from 'react-bootstrap-icons';
import ButtonIcon from "./ButtonIcon";
import Revert from "./Revert";

export default class User extends React.Component {
  render() {
    const {name, surname, mobile, onNameChange, onSurnameChange, onTelChange, onIconClick, editable, onRevert, onDelete} = this.props;
    return (
      <div>
        <input value={name} onChange = {onNameChange} disabled={editable}/>
         &nbsp;
        <input value={surname} onChange = {onSurnameChange} disabled={editable}/>
         &nbsp;
        <input value={mobile} onChange = {onTelChange} disabled={editable}/>
         &nbsp; &nbsp;
         <button onClick={onIconClick}>
          <ButtonIcon
            icn={editable}
          />
         </button>
         &nbsp;
         <button disabled={editable} onClick={onRevert}>
         <Revert
            icn={editable}
          />
         </button>
         &nbsp;
         <button onClick={onDelete}>
           <Icon.Trash color="red"/>
         </button>
      </div>
    );
  }
}