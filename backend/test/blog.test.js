/*
  Automated tests for Blog API using Jest and Supertest.

  Setup (beforeAll) → Resets users, registers a new test user, logs in, and stores JWT token.
  Setup (beforeEach) → Resets blogs before each test (clears test DB).

  Tests:
    - Requests without auth should return 200 (public blogs)
    - Create blog with auth
    - Fetch blogs
    - Update blog
    - Delete blog
*/

const request = require("supertest");
const app = require("../app"); // Express app
const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const User = require("../models/User");

let token;
let blogId;
let userId;

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect("mongodb://127.0.0.1:27017/blogdb_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Reset users
  await User.deleteMany({});

  const username = "testuser";
  const email = `test${Date.now()}@gmail.com`; // unique email
  const password = "testpass";

  // Register user
  const registerRes = await request(app)
    .post("/auth/register")
    .send({ name: username, email, password });
  console.log("REGISTER RESPONSE:", registerRes.body);

  // Login user
  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email, password });
  console.log("LOGIN RESPONSE:", loginRes.body);

  token = loginRes.body.token;
  userId = loginRes.body.user._id;
  console.log("TOKEN:", token);
});

beforeEach(async () => {
  // Reset blogs
  await Blog.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await mongoose.connection.close();
});

describe("Blog API", () => {
  it("should allow fetching blogs without auth (public)", async () => {
    const res = await request(app).get("/blogs");
    expect(res.statusCode).toBe(200); // ✅ blogs are public
  });

  it("should create a new blog", async () => {
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My First Blog",
        description: "This is a test blog post",
        author: userId,
        tags: "test,blog",
      });
    console.log("CREATE BLOG RESPONSE:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("My First Blog");
    expect(res.body.author._id).toBe(userId); // ✅ fixed
    blogId = res.body._id;
  });

  it("should fetch blogs", async () => {
    // create a blog first
    await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Second Blog",
        description: "Another test blog",
        author: userId,
        tags: "test",
      });

    const res = await request(app).get("/blogs");
    console.log("FETCH BLOG RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Second Blog");
  });

  it("should update a blog", async () => {
    // create blog to update
    const createRes = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Update Blog",
        description: "To be updated",
        author: userId,
        tags: "update",
      });
    blogId = createRes.body._id;

    const res = await request(app)
      .put(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Blog Title" });

    console.log("UPDATE BLOG RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Blog Title");
  });

  it("should delete a blog", async () => {
    // create blog to delete
    const createRes = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Delete Blog",
        description: "To be deleted",
        author: userId,
        tags: "delete",
      });
    blogId = createRes.body._id;

    const res = await request(app)
      .delete(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("DELETE BLOG RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });
});
