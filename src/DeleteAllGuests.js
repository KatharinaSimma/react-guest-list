import { baseUrl } from './config';

function DeleteAllGuests(props) {
  const deleteAllGuests = async () => {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    await allGuests.forEach((guest) => {
      fetch(`${baseUrl}/guests/${guest.id}`, { method: 'DELETE' }).catch(
        (error) => console.log(error),
      );
    });
  };
  return (
    <div>
      <button
        onClick={() => {
          deleteAllGuests().catch((error) => console.log(error));
          props.delete([]);
        }}
      >
        Delete all guests
      </button>
    </div>
  );
}

export default DeleteAllGuests;
