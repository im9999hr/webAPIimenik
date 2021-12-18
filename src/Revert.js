import React from "react";
import * as Icon from 'react-bootstrap-icons';

export default function Revert ({icn}) {

  return (
    icn? <Icon.Square disabled={true} color="green"/> : <Icon.Back color="green"/>
  );
}