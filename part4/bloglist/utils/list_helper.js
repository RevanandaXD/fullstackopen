const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((total, blog) => {
    return blog.likes >= total.likes ? blog : total;
  });
};

const mostBlog = (blog) => {
  const authorCount = blog.reduce((total, blog) => {
    total[blog.author] ? total[blog.author]++ : (total[blog.author] = 1);

    return total;
  }, {});

  const [author, count] = Object.entries(authorCount).reduce((max, currect) => {
    return currect[1] > max[1] ? currect : max;
  });

  return {
    author,
    blogs: count,
  };
};

const mostLikes = (blog) => {
  const likeCount = blog.reduce((total, blog) => {
    total[blog.author]
      ? (total[blog.author] += blog.likes)
      : (total[blog.author] = blog.likes);

    return total;
  }, {});

  const [author, count] = Object.entries(likeCount).reduce((max, currect) => {
    return currect[1] > max[1] ? currect : max;
  });

  return {
    author,
    likes: count,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes,
};
