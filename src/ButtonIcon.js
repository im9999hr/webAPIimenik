import React from "react";
import * as Icon from 'react-bootstrap-icons';

export default function ButtonIcon ({icn}) {

  return (
    icn? <Icon.Pencil color="green"/> : <Icon.Check color="green"/>
  );
}