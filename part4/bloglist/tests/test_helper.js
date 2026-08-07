const User = require("../models/users");
const supertest = require("supertest")
const app = require("../app");
const api = supertest(app);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.example.com/canonical-string-reduction",
    likes: 12,
  },
];

const userInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const loginAndGetToken = async () => {
  const loginUser = await api.post('/api/login').send({
    username: 'mluukkai',
    password: "supersecret"
  })

  return loginUser.body.token
}

module.exports = {
  userInDb,
  initialBlogs,
  loginAndGetToken
};
