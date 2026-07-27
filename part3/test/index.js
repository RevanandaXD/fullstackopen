const express = require("express");
const app = express();

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h2>Hello World From Express</h2>");
});

app.get("/api/notes", (req, res) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;

  const note = req.body;
  note.id = String(maxId + 1);

  notes = notes.concat(note);

  res.json(note)
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);

  res.status('404').end();
});

const port = 3001;
app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
