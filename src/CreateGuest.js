import { useState } from 'react';
import { baseUrl } from './config';

function CreateGuest(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  async function createGuest(createdFirstName, createdLastName) {
    if (!createdFirstName || !createdLastName) {
      alert('Please enter a full name!');
    } else {
      // create user
      const response = await fetch(`${baseUrl}/guests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: createdFirstName,
          lastName: createdLastName,
        }),
      });
      const createdGuest = await response.json();
      setFirstName('');
      setLastName('');
      props.setGuestList([...props.guestList, createdGuest]);
    }
  }

  return (
    <>
      <label htmlFor="firstName">First name</label>
      <input
        value={firstName}
        onChange={(event) => setFirstName(event.currentTarget.value)}
        id="firstName"
        disabled={props.isLoading}
      />
      <br />
      <label htmlFor="lastName">Last name</label>
      <input
        value={lastName}
        onChange={(event) => setLastName(event.currentTarget.value)}
        id="lastName"
        disabled={props.isLoading}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            createGuest(firstName, lastName).catch((error) =>
              console.log(error),
            );
          }
        }}
      />
    </>
  );
}

export default CreateGuest;
