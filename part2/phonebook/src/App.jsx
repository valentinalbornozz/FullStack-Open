import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebookService from "./services/phonebookServices";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        phonebookService
          .updatePerson(existingPerson.id, updatedPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== updatedPerson.id ? person : updatedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification(
              `Updated ${updatedPerson.name}'s number`,
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating person:", error);
            showNotification("Failed to update person", "error");
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      phonebookService
        .addPerson(personObject)
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNewName("");
          setNewNumber("");
          showNotification(`Added ${newPerson.name}`, "success");
        })
        .catch((error) => {
          console.error("Error adding person:", error);
          showNotification("Failed to add person", "error");
        });
    }
  };

  const deletePerson = (id, name) => {
    const confirmed = window.confirm(`Delete ${name}?`);
    if (confirmed) {
      phonebookService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification(`Deleted ${name}`, "success");
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          showNotification("Failed to delete person", "error");
        });
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Duración de 5 segundos
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div className="App">
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
      {notification && (
        <div className={notification.type}>
          <p>{notification.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
