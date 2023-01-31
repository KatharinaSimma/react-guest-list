import { useEffect, useState } from 'react';
import { baseUrl } from './config';
import CreateGuest from './CreateGuest';
import DeleteAllGuests from './DeleteAllGuests';

function App() {
  const [guestList, setGuestList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [firstNameChange, setFirstNameChange] = useState('');
  const [lastNameChange, setLastNameChange] = useState('');
  const [editId, setEditId] = useState('');

  // the r of crud
  useEffect(() => {
    async function fetchGuestList() {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/guests/`);
      const allGuests = await response.json();

      if (filter === 'attending') {
        setGuestList(allGuests.filter((guest) => guest.attending));
      } else if (filter === 'notAttending') {
        setGuestList(allGuests.filter((guest) => !guest.attending));
      } else {
        setGuestList(allGuests);
      }
      setIsLoading(false);
    }
    fetchGuestList().catch((error) => console.log(error));
  }, [filter]);

  // the d of crud
  async function handleRemove(id) {
    await fetch(`${baseUrl}/guests/${id}/`, {
      method: 'DELETE',
    });
    const filteredGuestList = guestList.filter((guest) => guest.id !== id);
    setGuestList(filteredGuestList);
  }

  // the u of crud
  async function handleGuestUpdate(id, attending) {
    await fetch(`${baseUrl}/guests/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attending }),
    });
    const updatedGuestList = [...guestList];
    const updatedGuest = updatedGuestList.find((guest) => guest.id === id);
    updatedGuest.attending = !updatedGuest.attending;
    setGuestList(updatedGuestList);
    console.log('guestList', guestList);
  }

  async function handleNameUpdate(id, updatedFirstName, updatedLastName) {
    await fetch(`${baseUrl}/guests/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: updatedFirstName,
        lastName: updatedLastName,
      }),
    });
    const updatedGuestList = [...guestList];
    const updatedGuest = updatedGuestList.find((guest) => guest.id === id);
    updatedGuest.firstName = updatedFirstName;
    updatedGuest.lastName = updatedLastName;
    setGuestList(updatedGuestList);
    // clean up
    setFirstNameChange('');
    setLastNameChange('');
    setEditId('');
  }

  return (
    <div>
      <h1>Kathi's Birthday Party</h1>
      <CreateGuest
        isLoading={isLoading}
        setGuestList={setGuestList}
        guestList={guestList}
      />
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div onChange={(event) => setFilter(event.target.value)}>
              <label>
                <input
                  name="filter"
                  type="radio"
                  value="all"
                  checked={filter === 'all'}
                  readOnly
                />
                Show all guests
              </label>
              <label>
                <input
                  name="filter"
                  type="radio"
                  value="attending"
                  checked={filter === 'attending'}
                  readOnly
                />
                Attending
              </label>
              <label>
                <input
                  name="filter"
                  type="radio"
                  value="notAttending"
                  checked={filter === 'notAttending'}
                  readOnly
                />
                Not Attending
              </label>
              <p>{filter.guestFilter}</p>
            </div>
            <h2>Guest List</h2>
            {guestList.length > 0 &&
              guestList.map((guest) => {
                return (
                  <div
                    data-test-id="guest"
                    key={guest.id + '_' + guest.lastName}
                  >
                    {guest.id === editId ? (
                      <input
                        value={firstNameChange}
                        placeholder={guest.firstName}
                        onChange={(event) => {
                          setFirstNameChange(event.currentTarget.value);
                        }}
                      />
                    ) : (
                      <span>{`${guest.firstName} `}</span>
                    )}

                    {guest.id === editId ? (
                      <input
                        value={lastNameChange}
                        placeholder={guest.lastName}
                        onChange={(event) => {
                          setLastNameChange(event.currentTarget.value);
                        }}
                      />
                    ) : (
                      <span>{guest.lastName}</span>
                    )}
                    <input
                      id="attendCheckbox"
                      type="checkbox"
                      checked={guest.attending}
                      aria-label={`${guest.firstName} ${guest.lastName} attending status)`}
                      onChange={() => {
                        handleGuestUpdate(guest.id, !guest.attending).catch(
                          (error) => console.log(error),
                        );
                      }}
                    />
                    <label htmlFor="attendCheckbox">attends</label>
                    {guest.id === editId ? (
                      <button
                        onClick={() => {
                          handleNameUpdate(
                            guest.id,
                            firstNameChange,
                            lastNameChange,
                          ).catch((error) => console.log(error));
                        }}
                      >
                        Save Changes
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditId(guest.id);
                        }}
                      >
                        Edit Names
                      </button>
                    )}
                    <button
                      aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                      onClick={() =>
                        handleRemove(guest.id).catch((error) =>
                          console.log(error),
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
          </>
        )}
        <DeleteAllGuests delete={setGuestList} />
      </div>
    </div>
  );
}

export default App;
