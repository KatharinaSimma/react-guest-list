import { useEffect, useState } from 'react';
import { baseUrl } from './config';
import CreateGuest from './CreateGuest';
import DeleteAllGuests from './DeleteAllGuests';

function App() {
  const [guestList, setGuestList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isReadOnly, setIsReadOnly] = useState(true);
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
  }, [refetch, filter]);

  // the d of crud
  async function handleRemove(id) {
    await fetch(`${baseUrl}/guests/${id}/`, { method: 'DELETE' });
    setRefetch(!refetch);
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
    setRefetch(!refetch);
  }

  async function handleNameUpdate(id, first_name, last_name) {
    await fetch(`${baseUrl}/guests/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: first_name, lastName: last_name }),
    });
  }

  return (
    <div>
      <h1>Kathi's Birthday Party</h1>
      <CreateGuest
        setRefetch={setRefetch}
        refetch={refetch}
        isLoading={isLoading}
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
            <ul>
              {guestList.map((guest) => {
                return (
                  <li key={guest.id + '_' + guest.lastName}>
                    <div data-test-id="guest">
                      <input
                        readOnly={
                          guest.id === editId ? isReadOnly : !isReadOnly
                        }
                        value={
                          guest.id === editId
                            ? firstNameChange
                            : guest.firstName
                        }
                        placeholder={guest.firstName}
                        onChange={(event) => {
                          if (!isReadOnly) {
                            setFirstNameChange(event.currentTarget.value);
                          }
                        }}
                      />
                      <input
                        readOnly={
                          guest.id === editId ? isReadOnly : !isReadOnly
                        }
                        value={
                          guest.id === editId ? lastNameChange : guest.lastName
                        }
                        placeholder={guest.lastName}
                        onChange={(event) => {
                          if (!isReadOnly) {
                            setLastNameChange(event.currentTarget.value);
                          }
                        }}
                      />

                      <label htmlFor="attendCheckbox">attends</label>
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
                      {guest.id === editId ? (
                        <button
                          onClick={() => {
                            handleNameUpdate(
                              guest.id,
                              firstNameChange,
                              lastNameChange,
                            ).catch((error) => console.log(error));
                            setFirstNameChange('');
                            setLastNameChange('');
                            setEditId('');
                            setIsReadOnly(true);
                            setRefetch(!refetch);
                          }}
                        >
                          Save Changes
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsReadOnly(false);
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
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <DeleteAllGuests delete={setGuestList} />
      </div>
    </div>
  );
}

export default App;
