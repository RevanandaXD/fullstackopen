const Filter = ({ filter, filteredPerson }) => {
  return (
    <div>
      <label htmlFor="filterInput">Filter show with</label>
      <input
        type="text"
        id="filterInput"
        value={filter}
        onChange={(e) => filteredPerson(e.target.value)}
      />
    </div>
  );
};

export default Filter;
