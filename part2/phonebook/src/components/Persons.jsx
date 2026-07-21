const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}{" "}
            <button onClick={() => handleDelete(person)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Persons;
