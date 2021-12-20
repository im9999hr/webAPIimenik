import React from 'react';

export default class NewUser extends React.Component {
  state = {
    name: "",
    surname: "",
    mobile: "",
    adressId: null,
    address: null
  };
  handleChange =  (event, arg) => {
    let str = event.target.value.trimStart();
    switch (arg) {
      case "name":
        this.setState({name: str})
        break;
      case "surname":
        this.setState({surname: str})
        break;
      case "mobile":
      this.setState({mobile: str})
      break;
      default:
        break;
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    
    if (this.state.name && this.state.surname && this.state.mobile) {
      const {addUser} = this.props;
      addUser(this.state);
      this.setState(
        {
          name: '',
          surname: '',
          mobile: '',
        }
      )
    }
  };

  render() {
    const {name, surname, mobile} = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input placeholder='Ime' value={name} onChange={event => this.handleChange(event, "name")}></input>
        <input placeholder='Prezime' value={surname} onChange={event => this.handleChange(event, "surname")}></input>
        <input placeholder='Telefon' value={mobile} onChange={event => this.handleChange(event, "mobile")}></input>
        <input type="submit" value = "Dodaj u imenik"></input>
      </form>
    );
  }
}