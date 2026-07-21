const Header = ({ header }) => {
  return <h1>{header}</h1>;
};

const Part = ({ parts }) => {
  return (
    <>
      {parts.map((item) => (
        <p key={item.id}>
          {item.name} {item.exercises}
        </p>
      ))}
    </>
  );
};

const Total = ({ parts }) => {
  return (
    <h4>
      Total of {parts.reduce((total, item) => total + item.exercises, 0)}{" "}
      exercises
    </h4>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <h1>Web Development Curriculum</h1>
      {course.map((item) => (
        <div key={item.id}>
          <Header header={item.name} />
          <Part parts={item.parts} />
          <Total parts={item.parts} />
        </div>
      ))}
    </>
  );
};

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return <Course course={courses} />;
};

export default App;
