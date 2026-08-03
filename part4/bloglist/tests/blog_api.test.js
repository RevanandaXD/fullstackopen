const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

test("blog are returned as JSON format", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const res = await api.get("/api/blogs");

  assert.strictEqual(res.body.length, helper.initialBlogs.length);
});

test("all blogs are returned with unique id not _id", async () => {
  const res = await api.get("/api/blogs");

  const blog = res.body[0];
  assert.strictEqual(Object.hasOwn(blog, "id"), true);
  assert.strictEqual(Object.hasOwn(blog, "_id"), false);
});

test("a valid blog can be added", async () => {
  const initialBlog = await api.get("/api/blogs");

  const newBlog = {
    title: "Learning Fullstack Developer",
    author: "RevanandaDev",
    url: "https://example.is-a.dev",
    likes: 25,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const res = await api.get("/api/blogs");
  assert.strictEqual(res.body.length, initialBlog.body.length + 1);
});

test("a blog without likes can be added", async () => {
  const newBlog = {
    title: "Learning Node JS as Backend",
    author: "RevanandaDev",
    url: "https://example.is-a.dev",
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const res = await api.get("/api/blogs");
  const specificBlog = res.body.find(
    (blog) => blog.title === "Learning Node JS as Backend",
  );

  assert.strictEqual(specificBlog.likes, 0);
});

test("blog without title returns 400", async () => {
  const testTitle = {
    author: "Revananda",
    url: "https://example.com",
    likes: 20,
  };

  const send = await api.post("/api/blogs").send(testTitle).expect(400);

  assert.strictEqual(send.status, 400);
});

test("blog without url returns 400", async () => {
  const testTitle = {
    author: "Revananda",
    title: "Belajar Node JS Menyenangkan",
    likes: 25,
  };

  const send = await api
    .post("/api/blogs")
    .send(testTitle)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(send.status, 400);
});

test("delete one blog by id", async () => {
  const res = await api.get("/api/blogs");
  const testDeleteId = res.body[0].id;

  await api.delete(`/api/blogs/${testDeleteId}`).expect(204);
  const resUpdate = await api.get("/api/blogs");

  const findDeleteBlog = resUpdate.body.find((blog) => {
    blog.id === testDeleteId;
  });

  assert.strictEqual(resUpdate.body.length, res.body.length - 1);
  assert.strictEqual(findDeleteBlog, undefined);
});

test("update likes for blog", async () => {
  const res = await api.get("/api/blogs");
  const getId = res.body[0].id;

  const updateLike = {
    likes: 25,
  };

  await api.put(`/api/blogs/${getId}`).send(updateLike).expect(200);

  const resUpdate = await api.get("/api/blogs");
  const findId = resUpdate.body.find((blog) => {
    blog.id === getId;
  });

  assert.strictEqual(findId.likes, 25);
});
