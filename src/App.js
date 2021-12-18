import React, {useState, useEffect} from 'react';
import User from './User';

let usersDb = [], usersNew = [], usersBeforeChecked = [];
const ALLUSERS = "https://teston.website/Contacts/";
const alphabetLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OTHER"];

function App() {
  const [users, setUsers] = useState (null);
  const [clickedLetter, setClickedLetter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  useEffect(() => {
    fetch(ALLUSERS)
    .then(response => response.json())
    .then(data => handleData(data))
    .catch(err => console.log(err));

    function handleData (data) {
      usersDb = [...data]
      usersNew = usersDb.map(obj => {return {...obj}}); // users that change after every input change
      usersNew.forEach(element => {
      element["iconChange"] = true;
      });
      setUsers(usersNew);
      usersBeforeChecked = usersDb.map(obj => {return {...obj}}); // users that change only after 'check icon' clicked
    }
  },[]);

  const filterUsers = letter => {
    const filtered = users.filter(u => u.surname.toUpperCase().startsWith(letter));
    setClickedLetter(letter);   
    if (letter === "OTHER") {
      for (let i = 0; i < users.length; i++) {
        const firstLetter = users[i].surname.toUpperCase()[0];
        if (!alphabetLetters.includes(firstLetter)) {
          filtered.push(users[i]);
        }
      }
    }
    setFilteredUsers(filtered);
  };
  
  const handleInputChange = (event, id, arg) => {
    const newUsers = [...users];
    let str = event.target.value.trimStart();
    for (let i = 0; i < newUsers.length; i++) {
      if (newUsers[i].id === id) {
        newUsers[i][arg] = str;
        break;
      }
    }
    setUsers(newUsers);
  }

  const handleIconChange = (event,id) => {
    const arry = event.currentTarget.parentNode.children; // children of div element (input elements, but also other elements like buttons)
    const newUsers = [...users];
    const successData = (data, i) => {
      usersBeforeChecked[i].name = data.name;
      usersBeforeChecked[i].surname = data.surname;
      usersBeforeChecked[i].mobile = data.mobile;
    } 
    for (let i = 0; i < newUsers.length; i++) {
      if (newUsers[i].id === id) {
        newUsers[i].iconChange = !newUsers[i].iconChange; // change icon from 'check icon' to 'pencil icon' and vice versa
        if (newUsers[i].iconChange === true) {
          let inputCount=0;
          let acceptEntries = true;
          for (let index = 0; index < arry.length; index++) {
            const element = arry[index];
            if (element.nodeName === "INPUT") {
              const str = element.value.trimEnd();
              if (str.length === 0) {
                acceptEntries = false;
                break;
              }
              inputCount++;
              switch (inputCount) {
                case 1:
                  newUsers[i].name = str;
                  break;
                case 2:
                  newUsers[i].surname = str;
                  break;
                case 3:
                  newUsers[i].mobile = str;
                  break;
                default:
                  break;
              }
            }
            else continue;
          }
          if (acceptEntries === true) {
            let uri = ALLUSERS + usersBeforeChecked[i].id;
            fetch(uri,
             {
              method: "PUT",
              headers: {'Content-Type': 'application/json', 'charset': 'utf-8'},
              body: JSON.stringify(
              {
                name: newUsers[i].name,
                surname: newUsers[i].surname,
                mobile: newUsers[i].mobile,
                addressId: null,
                address: null
              })
              })
            .then(response => response.json())
            .then(data => successData(data, i))
            .catch(err => console.log(err)); 
          }
          else {
            newUsers[i].iconChange = !newUsers[i].iconChange; // doesn't allow change icon from 'check icon' to 'pencil icon' for empty input
          }
        } 
        break;
      }
    }
    setUsers(newUsers);
  }

  const revertState = id => {
    const newUsers = [...users];
    for (let i = 0; i < newUsers.length; i++) {
      if (newUsers[i].id === id) {
        newUsers[i].iconChange = true;
        newUsers[i].name = usersBeforeChecked[i].name;
        newUsers[i].surname = usersBeforeChecked[i].surname;
        newUsers[i].mobile = usersBeforeChecked[i].mobile;
        break;
      }
    }
    setUsers(newUsers);
  }
  const handleDeleteUser = (id) => {
    const newUsers = users.filter(user => user.id !== id);
    const newFilteredUsers = filteredUsers.filter(user => user.id !== id);
    function successDelete (response) {
      if (response.status == 200 || response.status == 202) {
        setUsers(newUsers);
        setFilteredUsers(newFilteredUsers);
      }
    }
    let uri = ALLUSERS + id;
    fetch(uri,
     {
      method: "DELETE"
      })
    .then((response) => successDelete(response))
    .catch(err => console.log(err)); 
  }

  return (
    <div>
     {alphabetLetters.map(letter => 
      <button
        key={letter} 
        onClick={() => filterUsers(letter)}>{letter}
      </button>
     )}
     {clickedLetter && filteredUsers.map((user) => (
        <User
          key={user.id}
          name={user.name}
          surname={user.surname}
          mobile={user.mobile}
          onNameChange = {event => handleInputChange(event, user.id, "name")}
          onSurnameChange = {event => handleInputChange(event, user.id, "surname")}
          onTelChange = {event => handleInputChange(event, user.id, "mobile")}
          onIconClick = {(event) => handleIconChange(event, user.id)}
          editable={user.iconChange}
          onRevert ={() => revertState(user.id)}
          onDelete = {() => handleDeleteUser(user.id)}
        />
      ))}
    </div>
  );
}

export default App;
