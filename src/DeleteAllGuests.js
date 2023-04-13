import { useState } from 'react';
import { baseUrl } from './config';

function DeleteAllGuests(props) {
  const [errorMessage, setErrorMessage] = useState('');
  const deleteAllGuests = async () => {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    if (allGuests) {
      await allGuests.forEach((guest) => {
        fetch(`${baseUrl}/guests/${guest.id}`, { method: 'DELETE' }).catch(
          (error) => setErrorMessage(error.message),
        );
      });
    }
  };
  return (
    <div>
      <button
        onClick={() => {
          deleteAllGuests().catch((error) => setErrorMessage(error.message));
          props.delete([]);
        }}
      >
        Delete all guests
      </button>
      <p style={{ color: 'red' }}>{errorMessage}</p>
    </div>
  );
}

export default DeleteAllGuests;
