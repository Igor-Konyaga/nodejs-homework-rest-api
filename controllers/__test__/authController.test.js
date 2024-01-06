const supertest = require("supertest");
const app = require('../../app')

describe("Test POST /auth/login", () => {
  test("return user obj and token", async () => {
    const user = {
      email: "Nastya@gmail.com",
      password: "Nastya_12345",
    };

    const res = await supertest(app).post("/api/users/login").send(user);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      })
    );
  });
});
