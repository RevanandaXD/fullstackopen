const bcryptjs = require("bcryptjs");
const User = require("../models/users");

const { after, test, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const mongoose = require("mongoose");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcryptjs.hash("secret", 10);
    const user = new User({
      username: "root",
      passwordHash,
    });

    await user.save();
  });

  test("creation succeeds with fresh username", async () => {
    const usersAtStart = await helper.userInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "secretpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)

    const usersAtEnd = await helper.userInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const username = usersAtEnd.map((u) => u.username);
    assert(username.includes(newUser.username));
  });
});

test("creation user fails with short password", async () => {
  const userAtStart = await helper.userInDb();

  const newUser = {
    username: "testing",
    name: "test",
    password: "12",
  };

  await api.post("/api/users").send(newUser).expect(400);

  const userAtEnd = await helper.userInDb();
  assert.strictEqual(userAtEnd.length, userAtStart.length);
});

after(async () => {
  await mongoose.connection.close();
});
