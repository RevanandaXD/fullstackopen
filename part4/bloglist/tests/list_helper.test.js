const { after, test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper.js");
const mongoose = require('mongoose')

test("dummy returns one", () => {
  const blog = [];

  const result = listHelper.dummy(blog);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const listBlog = [
    {
      _id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      url: "https://example.com/clean-code",
      likes: 15,
      __v: 0,
    },
    {
      _id: "2",
      title: "Clean Architecture",
      author: "Robert C. Martin",
      url: "https://example.com/clean-architecture",
      likes: 20,
      __v: 0,
    },
    {
      _id: "3",
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      url: "https://example.com/pragmatic-programmer",
      likes: 18,
      __v: 0,
    },
    {
      _id: "4",
      title: "Agile Principles",
      author: "Robert C. Martin",
      url: "https://example.com/agile-principles",
      likes: 12,
      __v: 0,
    },
    {
      _id: "5",
      title: "Refactoring",
      author: "Martin Fowler",
      url: "https://example.com/refactoring",
      likes: 25,
      __v: 0,
    },
    {
      _id: "6",
      title: "Patterns of Enterprise Application Architecture",
      author: "Martin Fowler",
      url: "https://example.com/poeaa",
      likes: 30,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the lines of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("returns the author with the most likes", () => {
    const result = listHelper.favoriteBlog(listBlog);
    assert.deepStrictEqual(result, listBlog[5]);
  });

  test("returns the author with the most blogs", () => {
    const result = listHelper.mostBlog(listBlog);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  test("returns the author with the most likes", () => {
    const result = listHelper.mostLikes(listBlog);
    assert.deepStrictEqual(result, {
      author: "Martin Fowler",
      likes: 55
    })
  })
});

after(async () => {
  mongoose.connection.close()
})
