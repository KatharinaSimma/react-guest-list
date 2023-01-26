import { useEffect, useRef, useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);

  const baseUrl = 'http://localhost:4000';
  const inputRef = useRef(null);

  // the r of crud
  useEffect(() => {
    async function fetchGuestList() {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuestList(allGuests);
      setIsLoading(false);
    }
    fetchGuestList().catch((error) => console.log(error));
  }, [refetch]);

  // the c of crud
  async function createGuest(first_name, last_name) {
    if (!first_name || !last_name) {
      alert('Please enter a full name!');
    } else {
      // create user
      await fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: first_name, lastName: last_name }),
      });
      setFirstName('');
      setLastName('');
      setRefetch(!refetch);
      inputRef.current.focus();
    }
  }

  // the d of crud
  async function handleRemove(id) {
    await fetch(`${baseUrl}/guests/${id}`, { method: 'DELETE' });
    setRefetch(!refetch);
  }

  async function deleteAllGuests() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    await allGuests.forEach((guest) => {
      fetch(`${baseUrl}/guests/${guest.id}`, { method: 'DELETE' }).catch(
        (error) => console.log(error),
      );
      setRefetch(!refetch);
    });
  }

  // the u of crud
  async function handleGuestUpdate(id, attending) {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attending }),
    });
    setRefetch(!refetch);
  }

  return (
    <div>
      <h1>Guest List</h1>

      <label htmlFor="firstName">First Name</label>
      <input
        value={firstName}
        onChange={(event) => setFirstName(event.currentTarget.value)}
        id="firstName"
        ref={inputRef}
        disabled={isLoading}
      />
      <br />
      <label htmlFor="lastName">Last Name</label>
      <input
        value={lastName}
        onChange={(event) => setLastName(event.currentTarget.value)}
        id="lastName"
        disabled={isLoading}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            createGuest(firstName, lastName).catch((error) =>
              console.log(error),
            );
            setRefetch(!refetch);
          }
        }}
      />
      <br />

      <div>
        {isLoading ? (
          <div>... is Loading ...</div>
        ) : (
          <ul>
            {guestList.map((guest) => {
              return (
                <li key={guest.id + '_' + guest.lastName}>
                  <div data-test-id="guest">
                    <input readOnly value={guest.firstName} />
                    <input readOnly value={guest.lastName} />

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
                    <button
                      aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                      onClick={() =>
                        handleRemove(guest.id).catch((error) =>
                          console.log(error),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <button
          onClick={() => deleteAllGuests().catch((error) => console.log(error))}
        >
          Delete all guests
        </button>
      </div>
    </div>
  );
}

export default App;
