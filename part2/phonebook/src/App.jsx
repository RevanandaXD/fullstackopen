import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    message: "", 
    color: ""
  })

  personService.getAll().then((initialPersons) => {
    setPersons(initialPersons);
  });

  const filteredPerson = (value) => {
    setFilter(value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleNewSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = newName.trim();
    const trimmedNumber = newNumber.trim();

    if (!trimmedName || !trimmedNumber) {
      alert("Both name and number are required");
      return;
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (existingPerson) {
      const confirmed = window.confirm(
        `${trimmedName} is already added to the phonebook, replace the old number with the new one?`,
      );

      if (!confirmed) return;

      const updatedPerson = {
        ...existingPerson,
        name: trimmedName,
        number: trimmedNumber,
      };

      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons((prev) =>
            prev.map((person) =>
              person.id === existingPerson.id ? returnedPerson : person,
            ),
          );
          setNewName("");
          setNewNumber("");
          setErrorMessage(``)
        })
        .catch(() => {
          alert(`Information of ${trimmedName} could not be updated`);
        });

      return;
    }

    const newPerson = {
      name: trimmedName,
      number: trimmedNumber,
    };

    personService
      .create(newPerson)
      .then((createdPerson) => {
        setPersons((prev) => [...prev, createdPerson]);
        setNewName("");
        setNewNumber("");
        setErrorMessage({ message: `Added ${newPerson.name}`, color: "green" })
      })
      .catch(() => {
        alert("Failed to add person");
      });
  };

  const handleDelete = async (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return;

    personService
      .remove(person.id)
      .then(() => {
        setPersons((prev) => prev.filter((p) => p.id !== person.id));
        setErrorMessage({ message: `Information of ${person.name} has already been removed from server`, color: "red" })
      })
      .catch(() => {
        alert(`Could not delete ${person.name}`);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} filteredPerson={filteredPerson} />

      <Notification errorMessage={errorMessage} clearMessage={() => setErrorMessage({ message: "", color: "" })} />

      <h3>Add a New</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        handleNewSubmit={handleNewSubmit}
      />

      <h3>Number</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
