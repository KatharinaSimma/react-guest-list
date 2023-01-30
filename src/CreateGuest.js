import { useState } from 'react';
import { baseUrl } from './config';

function CreateGuest(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  async function createGuest(first_name, last_name) {
    if (!first_name || !last_name) {
      alert('Please enter a full name!');
    } else {
      // create user
      await fetch(`${baseUrl}/guests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: first_name, lastName: last_name }),
      });
      setFirstName('');
      setLastName('');
      props.setRefetch(!props.refetch);
    }
  }

  return (
    <>
      <label htmlFor="firstName">First Name</label>
      <input
        value={firstName}
        onChange={(event) => setFirstName(event.currentTarget.value)}
        id="firstName"
        disabled={props.isLoading}
      />
      <br />
      <label htmlFor="lastName">Last Name</label>
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
            props.setRefetch(!props.refetch);
          }
        }}
      />
    </>
  );
}

export default CreateGuest;
