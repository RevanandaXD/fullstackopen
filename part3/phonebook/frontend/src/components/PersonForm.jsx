const PersonForm = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  handleNewSubmit,
}) => {
  return (
    <form onSubmit={handleNewSubmit}>
      <div>
        <label htmlFor="nameInput">name :</label>
        <input
          type="text"
          id="nameInput"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="numberInput">number :</label>
        <input
          type="text"
          id="numberInput"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
