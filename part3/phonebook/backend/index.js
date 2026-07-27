const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors')

app.use(cors())
app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

const PORT = process.env.PORT || 3002;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello Api</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const personInfo = persons.find((person) => person.id === id);

  personInfo ? res.json(personInfo) : res.status(404).end();
});

app.post("/api/persons", (req, res) => {
  const id = Math.floor(Math.random() * 1000);
  const { name, number } = req.body;

  const findName = persons.find((person) => person.name === name);

  if (!name)
    return res.status(400).json({
      error: "Missing name",
    });

  if (!number)
    return res.status(400).json({
      error: "Missing number",
    });

  if (findName)
    return res.status(409).json({
      error: "Username already exist",
    });

  const newPerson = {
    id,
    name,
    number,
  };

  persons.push(newPerson);

  res.status(201).json({
    success: true,
    message: "berhasil ditambahkan",
    data: newPerson,
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const newPerson = persons.filter((person) => person.id !== id);

  res.json(newPerson);
});

app.get("/api/info", (req, res) => {
  const totalPersons = persons.length;
  const date = new Date();

  res.send(
    `
      <p>Phonebook has info for ${totalPersons} people</p>
      <p>${date}</p>
    `,
  );
});

morgan(":method :url :status :res[content-length] - :response-time ms");

app.listen(PORT, () => {
  console.log(`your app running on ${PORT}`);
});
